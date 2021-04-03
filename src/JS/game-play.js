const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';
let screenNumber='screen1';
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
    let i=2;//Seconds, keep it to 30 later
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

function updateCount(Admin){
    console.log('Counter Increment => Under Construction!');
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
}

function calculateShift(time){
    let hours=time.substring(0,2);
    let minutes=time.substring(3,5);
    time = parseInt(hours+minutes);
    console.log(time);
    if(time<=1229)
    return "1Morning";
    else if(time<=1829)
    return "2Afternoon";
    else if(time<=2129)
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
    db.ref(MainAdmin+'/Numbers/'+date+'/'+shift+'/'+Admin).push({
       numberArray:"1,2,3,4,5",
       time:time+"-32" //Adding seconds for testing
      }, (error) => {
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

function playGame(){
    let isAllowedToPlay=1;//Add function to check
    let Admin=auth.currentUser.uid;
    
    if(isAllowedToPlay==1){
        timer();

        updateLockUnlock(Admin,screenNumber);

        updateCount(Admin);

        insertArray(Admin);

    }
}

/*
db.ref(MainAdmin+"/Stores/"+Admin).child(screenNumber).child('lockUnlock').get().then(function(snapshot) {
    if (snapshot.exists()) {
      //console.log(snapshot.val());
      if(snapshot.val()==1){
          isAllowedToPlay=1;
          showMessage();
      }
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
  */