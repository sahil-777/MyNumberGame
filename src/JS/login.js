const auth = firebase.auth();
const db = firebase.database();

function login(){ 
    let email=document.getElementById('person-email').value;
    let password=document.getElementById('person-password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        console.log(user);
        window.location="index.html"; //After loggedIn successfully
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage);
    });
}