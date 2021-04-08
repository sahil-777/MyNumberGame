const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';
let screenNumber=localStorage.getItem('screen');
//alert(screenNumber);
//Update count
//Insert Array into Numbers branch
//Update lock/unlock values

function showMessage(){
    document.getElementById('game-msg').innerHTML="<h1>Please, Pay the amount</h1><h2>Screen is locked!<h2>";
    setTimeout(()=>{
        document.getElementById('game-msg').innerHTML="";
    },2000);
}

function timer(){
    document.getElementById('play-game').style.visibility="hidden";
    let i=5;//Seconds, keep it to 30 later
    let countDown=setInterval(function() {
        let seconds=i;
        i--;  
        document.getElementById("timer").innerHTML ="<h1>"+seconds+"s</h1>";
        
        if(seconds<0){
            clearInterval(countDown);
            document.getElementById("timer").innerHTML = "<h1>GAME OVER<h1>";//Lead to Video loop
            setTimeout(()=>{
                document.getElementById("timer").innerHTML = "";
                document.getElementById('play-game').style.visibility="visible";
            },1000);
        }
    }, 1000);
}

function updateLockUnlock(Admin,screenNumber){
    console.log("StoreAdmin=> ",Admin);
    console.log("Screen-Number=> ",screenNumber);
    db.ref(MainAdmin+'/Stores/'+Admin).child(screenNumber).update({
        'lockUnlock':1
    }, (error) => {
        if (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage);
        } 
        else { 
            console.log("Sucessfully Locked! "+screenNumber);
        }
    });
}

function getFormattedDate(date) {
    date=new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}

function getPassedDays(todaysDate){
    const date1 = new Date('4/4/2021');//MM/DD/YYYY
    const date2 = new Date(getFormattedDate(todaysDate));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

function increment(Admin,weekNum,Position){
    console.log('Incrementing =>');
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment/week'+weekNum+'/counter/'+Position).transaction( (value) => {
        if (value === null) {
            return 0;
        } else if (typeof value === 'number') {
            return value + 1;
        } else {
            console.log('The counter has a non-numeric value: '); 
        }
    }, function(error, committed, snapshot) {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the transaction.');
        } else {
            console.log('Incremented Successfully!');
        }
    });
}

function updateCount(Admin){
    console.log('Counter Increment...');
    let date=document.getElementById('game-date').value;
    let diffDays=getPassedDays(date);
    let weekNum=Math.floor(diffDays/7)+1;
    console.log('WeekNum=> ', weekNum);
    date=new Date(date);
    let Position=date.getDay();    
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment/week'+weekNum+'/counter').get().then(function(snapshot){
        if(snapshot.exists())
        increment(Admin,weekNum,Position);
        else{
            console.log('Week does not exists, so creating it!');
            db.ref(MainAdmin+'/Stores/'+Admin+'/Payment/week'+weekNum).set({
                billDetails:0,
                billStatus:"generated/paid/unpaid",
                counter:[0,0,0,0,0,0,0]
            })
            increment(Admin,weekNum,Position);
        }
    });
}

function calculateShift(time){
    let hours=time.substring(0,2);
    let minutes=time.substring(3,5);
    time = parseInt(hours+minutes);
    console.log(time);
    if(time<=1229)
    return "1Morning";
    else if(time<=1859)
    return "2Afternoon";
    else if(time<=2334)
    return "3Evening";
    else
    return "Invalid Shift";
    
}

function insertArray(Admin){
    let date=document.getElementById('game-date').value;
    date=date.replace('-','/').replace('-','/');
    console.log(date);

    let time=document.getElementById('game-time').value;
    time=time.replace(':','-');
    console.log(time);

    let shift=calculateShift(time);//Calculate shift
    console.log(shift);

    let x=document.getElementById('select-digit').value;
    console.log(x);

    if(shift!='Invalid Shift'){
    /*    let Ref=db.ref(MainAdmin+'/Numbers/'+date+'/'+shift+'/'+Admin+'/'+x+'digit').push();
        let key=Ref.key;
        db.ref(MainAdmin+'/Numbers/'+date+'/'+shift+'/'+Admin+'/'+x+'digit').update({
       [key]:"1,2,3,4,5"
      }*/
      let Ref=db.ref().push();
      let key=Ref.key;
      db.ref(MainAdmin+'/Numbers/'+x+'digit/'+date+'/'+shift+'/'+Admin).update({
     [key]:"1,2,3,4,5"
    }
      , (error) => {
        if (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            document.getElementById('error-msg').innerHTML=errorMessage;
            console.log(errorCode, errorMessage); 
        } else {
            console.log('numberArray inserted Successfully!')
        }
      });
    }
    else{
        console.log("Invalid Shift => can't insert number");
    }
      
}


function playGame(){
    let Admin=auth.currentUser.uid;

    db.ref(MainAdmin+"/Stores/"+Admin).child(screenNumber).child('lockUnlock').get().then(function(snapshot) {
        if (snapshot.exists()) {
          //console.log(snapshot.val());
          if(snapshot.val()==0){
              document.getElementById('error-msg').innerHTML='Game Started!';
                timer();
        
                updateLockUnlock(Admin,screenNumber);
        
                updateCount(Admin);
        
                insertArray(Admin);
            
            }
            else{
                console.log('Please, Pay the amount!');
                document.getElementById('error-msg').innerHTML='Please, Pay the amount!';
            }
        }
        else {
          console.log("No data available");
        }
      });
}
 

//Check if date exists
        //If yes, then take count value at that date
        //If no, then set date with count value = 1  
    //Increment count with 1 at that date;


/*
    let date=document.getElementById('game-date').value;
    date = date.split("-").reverse().join("-");
    console.log(date);

    let count=1;
    db.ref(MainAdmin+'/Stores/'+Admin+'/numberCount').get().then(function(snapshot) {
        if (snapshot.exists()) {
        snapshot.forEach((child) => {
            //console.log(child.key, child.val());
            if(child.key==date)
            count=child.val();
        });
        console.log("Date inside function => ",count);
        console.log("Date exists");
        }
        else {
        console.log("Count = 1, New date");
        }
    }).catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage);
    });

    console.log("Date outside function => ",count);
*/