const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();
let MainAdmin='techmoAdmin';
//let StoreOwner = "OHatm0qKa2Rf3DFnAj1Vq64Fcn62";

function signup(role){
    let email=document.getElementById('person-email').value;
    let password=document.getElementById('person-password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        let user = userCredential.user;
        if(role==1){
            //ref.child("yourvalue").setValue("");
            db.ref(MainAdmin).child(user.uid).set({
                "FireBase Not Allowing to set null values":0  
              }, (error) => {
                if (error) {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    document.getElementById('error-msg').innerHTML=errorMessage;
                    console.log(errorCode, errorMessage); 
                } else {
                    document.getElementById('error-msg').innerHTML="New Admin Added Successfully!";
                    console.log("New Admin Added Successfully!");
                }
              });
        }
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage); 
    });
}