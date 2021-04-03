const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();

let MainAdmin='Teqmo';

function logout(){// For Testing
    firebase.auth().signOut().then(() => {
        console.log('Lougout Successfully!');
        window.location="index.html";
    }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage);
    });
}

function changeStatus(screenNumber){
    console.log(screenNumber);

    console.log("StoreAdmin=> ",auth.currentUser.uid);
    let Admin=auth.currentUser.uid;

    if(document.getElementById(screenNumber).innerText=='Login'){
    db.ref(MainAdmin+'/Stores').child(Admin).child(screenNumber).update({
        'loggedinStatus':1
    }, (error) => {
        if (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage);
        } else { 
          console.log("Successfully Logged In =>" ,screenNumber);
        }
      });
    document.getElementById(screenNumber).innerText='Already Logged In';
    }
    else{
        document.getElementById('error-msg').innerHTML="<b>Already Logged in on "+screenNumber+"</b>";
        setTimeout(()=>{
            document.getElementById('error-msg').innerHTML="";
        },2000);
    }
}
 

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('admin-info').innerHTML=auth.currentUser.email;
        console.log("Logged In => ", user.email);
        let Admin=user.uid;
        console.log(Admin);
        db.ref(MainAdmin+'/Stores').child(Admin).get().then(function(snapshot) {
            if (snapshot.exists()) {
            let allTheScreens="";
            snapshot.forEach((child) => {
                if(child.key.substring(0,6)=="screen"){
                    //console.log(child.key, child.val());
                    let loggedIn=child.val().loggedinStatus==0?"Login":"Already Logged In";
                    allTheScreens+=child.key+"</br><button id='"+child.key+"' onclick='changeStatus(this.id)'>"+loggedIn+"</button><br><br><br>";        
                }
            });
            document.getElementById('list-all-screens').innerHTML=allTheScreens;
            }
            else {
            document.getElementById('list-all-screens').innerHTML="No Screen Present!";
            console.log("No data available");
            }
        }).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage);
        });
    }
    else {
        window.location='index.html';
    }
});

 

 
 
