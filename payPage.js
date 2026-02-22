/*const session = supabaseClient.auth.getSession(); // ou supabase.auth.session()
const jwt = session.access_token;
*/
document.getElementById("payDiv").innerHTML = `
<h1>Validez votre panier</h1>
    <h2>Votre sélection :</h2>
    <br>
    <div class="panier-container">
        <form id="panierForm"> 
            <div class="form-group">
                <label>Abonnement gratuit à la newsletter mensuelle de MattMarket Digitals ?<br />
                    <input type="checkbox" value="prod_U0KksJ8W2B2w3P" />S'abonner<br />
                </label>
                <label for="product">Autres produits :</label>
                <select id="product">
                    <option value="">-- Sélectionnez un produit --</option>
                    <option value="prod_U0DAsXndZB7iy4">Pack 100 crédits pour les applis MMD – 10€</option>
                </select>
                <input type="number" id="quantity" value="1" min="1"></input>
            </div>
            <br>
            <button type="submit" class="btn-Envoi">Régler votre panier</button>
        </form>
    </div>
    <h2>Status en cours : </h2>
    <pre id="output"></pre>
`;

document.getElementById("panierForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Envoi form facture ...");
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Redirection...";

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error || !session) throw new Error("Vous devez être connecté");

        const jwt = session.access_token;

        const productId = document.getElementById("product").value;
        const quantity = parseInt(document.getElementById("quantity").value) || 1;

        // À terme : récupérer le priceId correspondant au productId via une table ou constante
        // Pour l'instant on suppose que tu as seulement un produit → à adapter
        const priceId = "price_xxxxxxxxxxxxxxxxxxxx";   // ← À REMPLACER par le vrai price_xxx

        const items = [];
        if (priceId) {
            items.push({ priceId, quantity });
        }

        // Exemple newsletter (à adapter selon ta logique)
        const newsletterChecked = document.querySelector('input[type="checkbox"]').checked;
        if (newsletterChecked) {
            items.push({ priceId: "price_yyyyyyyyyyyyyyyyyyyy", quantity: 1 });
        }

        if (items.length === 0) {
            alert("Aucun produit sélectionné");
            return;
        }

        console.log("try...fetch...");
        const response = await fetch(
            /*"https://cpktnkjahurhvhabwnsf.supabase.co/functions/v1/create-checkout"*/"https://cpktnkjahurhvhabwnsf.supabase.co/functions/v1/rapid-function",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({ items })
            }
        );

        console.log("réponse  = ", response);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Erreur serveur");
        }

        const data = await response.json();
        if (!data.url) throw new Error("URL de paiement manquante");

        window.location.href = data.url;

    } catch (err) {
        console.error(err);
        alert("Erreur : " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Régler votre panier";
    }
});


/*import { serve } from "https://deno.land/std/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
   if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { items } = await req.json();

const allowedPrices = [
  "prod_U0DAsXndZB7iy4",
  "prod_U0KksJ8W2B2w3P"
];

if (!allowedPrices.includes(items.priceId)) {
  return new Response("Produit invalide", { status: 400 });
}

  const lineItems = items.map((item: any) => ({
    price: item.priceId,
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: "file:///C:/Users/cador/PROG/payPage/success.html",
    cancel_url: "file:///C:/Users/cador/PROG/payPage/cancel.html",
  });

  return new Response(
    JSON.stringify({ url: session.url }),
    { 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json"
      } 
    }
  );
});
*/