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

/**
 * For formatting any date in MM/DD/YYYY
 * @param {string} date any date of any format 
 * @returns {string} formattedDate Date in MM/DD/YYYY format
 */

function getFormattedDate(date) {
    date=new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let formattedDate=month + '/' + day + '/' + year;
    return formattedDate;
}





/**
 * Gives Number of days between a fixed date and current date.
 * It can be used to calculate current week number
 * @param {string} todaysDate current date in any format 
 * @returns {string} diffDays Number of days passed after Initial Fixed Date
 */
function getPassedDays(todaysDate){ 
    const date1 = new Date('4/4/2021'); 
    const date2 = new Date(getFormattedDate(todaysDate));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}




/**
 * Count Per Day of Current Week, from [Sun, Mon,... , Sat]
 * Current WeekNumber is calculated from current date 
 * @returns {Array} countPerDay Count per day of week, 0th pos:Sunday, ..., 6th pos:Saturday
 */
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
    //console.log(countPerDay);
    return countPerDay; //returns Array e.g. [2, 1, 0, 7, 100, 0, 6]
} 

 
 


