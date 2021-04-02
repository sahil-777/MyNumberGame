const auth = firebase.auth();
const db = firebase.database();
 
function gameLogin(){
    let email=document.getElementById('game-email').value;
    let password=document.getElementById('game-password').value;   
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        let user = userCredential.user;
        console.log("Logged In: Game => ",user.uid);
        window.location="game-screen-selector.html";
    })
    .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage); 
    });
}