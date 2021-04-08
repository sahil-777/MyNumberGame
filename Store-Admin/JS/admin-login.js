const auth = firebase.auth();
const db = firebase.database();

function adminLogin(){
    let email=document.getElementById('admin-email').value;
    let password=document.getElementById('admin-password').value;   
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        console.log("Logged In: Admin => ",user.uid);
        window.location="admin-dashboard.html";
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage); 
      });
}