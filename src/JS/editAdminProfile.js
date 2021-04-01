const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();
let MainAdmin='Teqmo';

//Has a bug

function editProfile(){ 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.email);
            let Name=document.getElementById('name').value;
            let phoneNumber=document.getElementById('phone-number').value;
            let Address=document.getElementById('address').value;
            console.log(Name,phoneNumber,Address);
            //console.log("Before Details=> ",Name,phoneNumber,Address);

            //console.log("StoreAdmin=> ",auth.currentUser.uid);
            let storeOwner=auth.currentUser.uid;

            //Reading data from database 
            rootRef.child(MainAdmin).child('Stores').child(storeOwner).child('details').get().then(function(snapshot) {
                if (snapshot.exists()) {
                snapshot.forEach((child) => {
                        //console.log(child.key, child.val())
                        //console.log("For loop=> ",Name,phoneNumber,Address);
                        if(Name.length==0 && child.key=='Name') Name=child.val();
                        if(phoneNumber.length==0 && child.key=='PhoneNumber') phoneNumber=child.val();
                        if(Address.length==0 && child.key=='Address') Address=child.val();
                });
                }
                else {
                console.log("No data available");
                }
            }).catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                document.getElementById('error-msg').innerHTML=errorMessage;
                console.log(errorCode, errorMessage);
            });
            //console.log("After Details=> ",Name,phoneNumber,Address);
            //Writing data in database
            rootRef.child(MainAdmin).child('Stores').child(storeOwner).child('details').set({
                Name:Name,
                PhoneNumber:phoneNumber,
                Address:Address
              }, (error) => {
                if (error) {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    document.getElementById('error-msg').innerHTML=errorMessage;
                    console.log(errorCode, errorMessage);
                } else {
                  document.getElementById('error-msg').innerHTML="Sucessfully Saved!";
                  console.log("Sucessfully Saved!");
                }
              });

        } else {
            window.location="login.html";
        }
    });
}