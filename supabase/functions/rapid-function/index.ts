const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};
console.log("Démarre la fonction create-checkout !");
import { serve } from "https://deno.land/std/http/server.ts";
import Stripe from "https://esm.sh/stripe@13?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
});

// Liste des PRICE IDS autorisés (pas les product IDs !)
const allowedPriceIds = [
    "price_1T2CjoF5dRUutdmbV7vCCSA8",   // pack 100 crédits
    "price_1T2K54F5dRUutdmbj4OYm3n4" // newsletter (si c'est un achat unique)
    // etc.
];
console.log("Liste priceID ok");

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response("Méthode non autorisée", { status: 405, headers: corsHeaders });
    }
    console.log("if to try...");
    try {
        const { items } = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return new Response(JSON.stringify({ error: "Aucun article" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
        console.log("null to item...");
        // Vérification stricte
        for (const item of items) {
            console.log("item = ", item, " items = ", items);
            if (!item.priceId?.startsWith("price_")) {
                return new Response(
                    JSON.stringify({ error: "priceId invalide" }),
                    {
                        status: 400,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            console.log("null et priceID ok");
            if (!allowedPriceIds.includes(item.priceId)) {
                return new Response(
                    JSON.stringify({ error: "Produit non autorisé" }),
                    {
                        status: 403,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                return new Response(
                    JSON.stringify({ error: "Quantité invalide" }),
                    {
                        status: 400,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

        }
        console.log("Vérif ok");
        const lineItems = items.map(item => ({
            price: item.priceId,      // ← ici c'est bien price_xxx
            quantity: item.quantity,
        }));
        console.log("lineItems = ", lineItems);
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:5500/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5500/cancel.html?session_id={CHECKOUT_SESSION_ID}",
            // Ou mieux si tu as HTTPS local :
            // success_url: "https://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        });
        return new Response(
            JSON.stringify({ url: session.url }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: err.message || "Erreur interne" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
