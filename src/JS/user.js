const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();
let MainAdmin='techmoAdmin';

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

/*
auth.onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.email);
        rootRef.child(MainAdmin).once("value")
        .then(function(snapshot) {
            let isStoreOwner = snapshot.child(user.uid).exists(); // true/false
            console.log(isStoreOwner);
            if(isStoreOwner==false)
            window.location="notAllowed.html";
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage); 
        });
    } 
    else {
      window.location="login.html";
    }
});
*/


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('current-user-info').innerHTML=auth.currentUser.email;
        console.log(user.email);
    } else {
        window.location="login.html";
    }
});