const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();
let MainAdmin='Teqmo';
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
//in RTDB: if Flag==1 => User is Unlocked

function lockUnlock(uid){
    console.log(uid);
    let flag=1;
    if(document.getElementById(uid).innerText=='Lock')
    flag=0;
    console.log("StoreAdmin=> ",auth.currentUser.uid);
    let storeOwner=auth.currentUser.uid;
    rootRef.child(MainAdmin).child('Stores').child(storeOwner).child(uid).child('status').set({
        flag:flag
      }, (error) => {
        if (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage);
        } else { 
          console.log("Sucessfully "+(flag==0?"Locked! ":"Unlocked! "+uid));
        }
      });
    document.getElementById(uid).innerText=(document.getElementById(uid).innerText=='Lock')?'Unlock':'Lock';
}

/*
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    } else {
        window.location='login.html';
    }
});*/
//"OHatm0qKa2Rf3DFnAj1Vq64Fcn62";
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let StoreOwner=user.uid;
        console.log(StoreOwner);
        rootRef.child(MainAdmin).child('Stores').child(StoreOwner).get().then(function(snapshot) {
            if (snapshot.exists()) {
            let allTheUsers="";
            snapshot.forEach((child) => {
                if(child.key.length==28){
                    //console.log(child.key, child.val());
                    //console.log(child.val().status.flag);
                    let lockUnlock=child.val().status.flag==1?"Lock":"Unlock";
                    allTheUsers+=child.key+"</br><button id='"+child.key+"' onclick='lockUnlock(this.id)'>"+lockUnlock+"</button><br><br>";        
                }
            });
            document.getElementById('list-all-users').innerHTML=allTheUsers;
            }
            else {
            document.getElementById('list-all-users').innerHTML="No Screen Present!";
            console.log("No data available");
            }
        }).catch(function(error) {
            console.error(error);
        });
    }
    else {
        window.location='login.html';
    }
});


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('current-user-info').innerHTML=auth.currentUser.email;
        console.log(user.email);
    } else {
        window.location="login.html";
    }
});
  

