const auth = firebase.auth();
const db = firebase.database();

function logout(){
    firebase.auth().signOut().then(() => {
        console.log('Lougout Successfully!');
        window.location="login.html";
    }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage);
    });
}
 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(auth.currentUser.email);
    } 
    else {
      window.location="login.html";
    }
});
 
 

