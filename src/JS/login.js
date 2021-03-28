const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();
let MainAdmin='techmoAdmin';
function login(){ 
    let email=document.getElementById('person-email').value;
    let password=document.getElementById('person-password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        console.log(user.uid);
        rootRef.child(MainAdmin).once("value")
            .then(function(snapshot) {
                let isStoreOwner = snapshot.child(user.uid).exists(); // true/false
                //True: If uid exists in admin level i.e. person is admin/storeowner
                if(isStoreOwner==true)
                    window.location="admin.html";
                else
                    window.location="user.html";
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                document.getElementById('error-msg').innerHTML=errorMessage;
                console.log(errorCode, errorMessage); 
            })
        //window.location="index.html"; //After loggedIn successfully
    })
    .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage);
    });
}