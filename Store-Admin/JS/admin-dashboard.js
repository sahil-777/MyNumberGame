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
            //document.getElementById(screenNumber).innerText=(document.getElementById(screenNumber).innerText=='Lock')?'Unlock':'Lock';
            console.log("Sucessfully "+(flag==1?"Locked! ":"Unlocked! ")+screenNumber);
        }
      });
}
 

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('admin-info').innerHTML=auth.currentUser.email;
        console.log("Logged In => ", user.email);
        let Admin=user.uid;
        console.log(Admin);
        db.ref(MainAdmin+'/Stores').child(Admin).on('value',(snapshot)=> {
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
        });


 
    }
    else {
        window.location='index.html';
    }
});

//--------------------------------------------------------------------------------
//Count Per Day of Week Which we want to show in graph , StoreAdmin => Dashboard Page

function getFormattedDate(date) {//Gives date in MM/DD/YYYY format
    date=new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}

function getPassedDays(todaysDate){//Gives total days passed between 4/4/2021 & date parameter
    const date1 = new Date('4/4/2021');//MM/DD/YYYY //Fixed Date
    const date2 = new Date(getFormattedDate(todaysDate));
    //console.log(date1,date2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

function getCountPerDayOfWeek(){
    //let date=document.getElementById('date').value;
    let date=new Date(); //Current Date
    let Admin=auth.currentUser.uid;
    let diffDays=getPassedDays(date);
    let weekNum=Math.floor(diffDays/7)+1;
    let countPerDay=[];
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment/week'+weekNum+'/counter').on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach((Day)=>{
                countPerDay.push(Day.val());
            });
        }
        else{
            console.log('Week does not exist');
        }
    });
    console.log(countPerDay);
    return countPerDay; //returns Array e.g. [2, 1, 0, 7, 100, 0, 6]
} 

 
 


