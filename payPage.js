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

    const { data: { session }, error } = await supabaseClient.auth.getSession();
    const jwt = session.access_token;

    const priceId = document.getElementById("product").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    const items = [
        { priceId, quantity }
    ];

    const response = await fetch(
        "https://cpktnkjahurhvhabwnsf.supabase.co/functions/v1/create-checkout",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify({ items })
        }
    );

    const data = await response.json();
    window.location.href = data.url;
});