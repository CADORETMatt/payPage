const redirUrl = "www.google.com"; //editor.html
//const tableSupa = "loginGate";
//const SUPABASE_URL = 'https://cpktnkjahurhvhabwnsf.supabase.co';
//const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Rua2phaHVyaHZoYWJ3bnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTAxMjIsImV4cCI6MjA2MTAyNjEyMn0.YRYNYYTa4OGSG2a1tnNPGtp4KPf-tp9ooY4l0ZV3CDU";

document.getElementById("loginDiv").innerHTML = `    <h1>Ouvrez votre compte</h1>
    <h2>Info</h2>
    <br>
    <!--<input type="text" id="keyApi" placeholder="Clé Supabase" required>-->
    <pre id="output"></pre>
       <br>
    <div class="login-container">
        <form id="loginForm"> 
            <h2>Connexion</h2>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <br>
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="extra-links">
                <p><a href="#">Mot de passe oublié ?</a></p>
            </div>

            <h2>Pour créer un compte :</h2>
            <div class="form-group">
                <label for="passwordConfirm">Confirmer votre mot de passe</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm">
            </div>
            <br>
            <button type="submit" class="btn-login">Se connecter</button>
        </form>
    </div>`;
const idForm = "loginForm";
const inputKey = "keyApi";
let email = "email";
const createA = "password";
const createB = "passwordConfirm";
const buttOk = "submit";
const zoneAff = 'output';
const connectPage = "./editor.html"

/*  -----Attention à data Global ! ------------------
const { data } = await supabaseClient.auth.getSession()
if (data.session) {
  window.location.replace("/editor.html")
}*/
const form = document.getElementById(idForm);
form.addEventListener(buttOk, async function (event) {
    event.preventDefault(); // 🚀 bloque le rechargement
    console.log("submit ok.");
    await fetchData(); // appelle ta fonction
});
const { createClient } = supabase;

async function fetchData() {
    console.log("Démarre fetchData...");
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY/*document.getElementById(inputKey).value*/);
    let mailClient = document.getElementById(email).value;
    let mdpA = document.getElementById(createA).value;
    let mdpB = document.getElementById(createB).value;
    const output = document.getElementById(zoneAff);

    if (mdpB) {
        if (mdpA !== mdpB) { output.innerText = 'Error : Les 2 mots de passe ne sont pas identiques.'; return; }
        const { data, error } = await client.auth.signUp({
            email: mailClient,
            password: mdpB,
            options: {
                emailRedirectTo: redirUrl,
            },
        });

        if (error) {
            output.innerText = error.message;
            return;
        }

        output.innerText = "🎉 Pour finaliser l'inscription, confirmer le mail reçu.";
        console.log("data = ", data);
    }
    else {
        console.log("client =", client);
        console.log("Auth =", client.auth);
        console.log("Ouverture du compte...");
        const { data, error } = await client.auth.signInWithPassword({
            email: mailClient,
            password: mdpA
        });
        if (error) {
            console.log("Error...= ", error);
            output.innerText = error.messsage;
            return;
        } else { console.log("No Error !"); }
        output.innerText = "Compte ouvert !";
        console.log("data = ", data);
        document.getElementById("payDiv").style.display = "block";
        //window.location.replace(connectPage);
    }
}
