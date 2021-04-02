const auth = firebase.auth();
const db = firebase.database();
const rootRef=db.ref();

let MainAdmin='Teqmo';

function logout(){
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

function lockUnlock(screenNumber){
    console.log(screenNumber);
    let flag=0;
    if(document.getElementById(screenNumber).innerText=='Lock')
    flag=1;
    console.log("StoreAdmin=> ",auth.currentUser.uid);
    let Admin=auth.currentUser.uid;
    db.ref(MainAdmin+'/Stores').child(Admin).child(screenNumber).update({
        'lockUnlock':flag
    }, (error) => {
        if (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage);
        } else { 
          console.log("Sucessfully "+(flag==1?"Locked! ":"Unlocked! ")+screenNumber);
        }
      });
    document.getElementById(screenNumber).innerText=(document.getElementById(screenNumber).innerText=='Lock')?'Unlock':'Lock';
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
                    //console.log(child.key.substring(0,6)=="screen");
                    //console.log(child.val().status.flag);
                    let lockUnlock=child.val().lockUnlock==0?"Lock":"Unlock";
                    //console.log(lockUnlock);
                    let isLoggedin=child.val().loggedinStatus==0?"Not Logged In":"Logged In";
                    allTheScreens+=child.key+"</br><h3>Status: "+isLoggedin+"</h3><button id='"+child.key+"' onclick='lockUnlock(this.id)'>"+lockUnlock+"</button><br><br><br>";        
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

 

 
 
