const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';
//let Admin='OHatm0qKa2Rf3DFnAj1Vq64Fcn62';

function isMatch(num, winningNumber,allPermutations){
    // if num presents in allPermutations
    if(allPermutations.has(parseInt(num))){
        return true;
    }
    return false;
}
 

function isPresent(arr,winningNumber,allPermutations){
    arr=arr.split(',');
    //console.log(arr);
    let allWinningNumbers=[];
    for(let i=0;i<arr.length;i++){
        //console.log(arr[i]);
        if(isMatch(arr[i],winningNumber,allPermutations)){
            allWinningNumbers.push(arr[i]);
            console.log('found=> ',arr[i]);
            //return true;
        }
    }
    //console.log(winningNumber);
    if(allWinningNumbers.length>=1)
    return allWinningNumbers;
    
    return allWinningNumbers;
}

function getPermutations(winningNumber){
    let Permutations=new Set();
    
    
    Permutations.add(254);
    Permutations.add(245);
    Permutations.add(452);
    Permutations.add(425);
    Permutations.add(524);
    Permutations.add(542);
    
   //Permutations.add(111);
    return Permutations;
}

function Operation(date,shift,digit,winningNumber){
    let allPermutations=getPermutations(winningNumber);
    db.ref(MainAdmin+'/Numbers/'+date+'/'+shift).get().then(function(snapshot) {
        if (snapshot.exists()) {
            let allTheWinningNumberResult="";
            snapshot.forEach((storeUid) => {
 
                storeUid.forEach((digitBranch)=>{
                    if(digitBranch.key==digit+'digit'){
                        let winningArrayTemp=[];
                        digitBranch.forEach((arr)=>{
                            //console.log(arr.key,arr.val());
                            let winningArray=isPresent(arr.val(),winningNumber,allPermutations);
                            if(winningArray.length>=1){
                                winningArrayTemp =winningArrayTemp.concat(winningArray);
                                //console.log(winningArray);
                                console.log(date,shift,winningNumber,storeUid.key,winningArray);
                                insertWinner(date,shift,winningNumber,storeUid.key,winningArray);
                                //allTheWinningNumberResult+="<br>"+storeUid.key+"&nbsp&nbsp<h2>"+winningArray+"</h2></br>";
                            }
                            //console.log('x => ',x);
                            //console.log(digitBranch.key,digitBranch.val());
                        });
                        if(winningArrayTemp.length>=1){
                            allTheWinningNumberResult+="<br>"+storeUid.key+"&nbsp&nbsp<h2>"+winningArrayTemp+" </h2></br>";
                        }
                    }
                });
            });

            document.getElementById('result').innerHTML=allTheWinningNumberResult;
        }
        else {
          console.log("No data available");
          document.getElementById('error-msg').innerHTML='No data available';
        }
      })
      .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        document.getElementById('error-msg').innerHTML=errorMessage;
        console.log(errorCode, errorMessage); 
      });
}

function insertWinner(date,shift,winningNumber,storeUid,winningArray){
    date=date.replace('/','-').replace('/','-');
    db.ref(MainAdmin+'/Winners/'+date+'/'+shift+'/'+storeUid).set({'ActualNumber':winningNumber});
    let Ref=db.ref(MainAdmin+'/Winners/'+date+'/'+shift+'/'+storeUid).push();
    let winningString=winningArray.toString();
    db.ref(MainAdmin+'/Winners/'+date+'/'+shift+'/'+storeUid).child(Ref.key).set(winningString);
}

function getResult(){
    let date=document.getElementById('select-date').value;
    let shift=document.getElementById('select-shift').value;
    let digit=document.getElementById('select-digit').value;

    let winningNumber=document.getElementById('winning-number').value;
    
    document.getElementById('result').innerHTML='';


    if((digit==3 && 100<=winningNumber && winningNumber<=999) || (digit==4 && 1000<=winningNumber && winningNumber<=9999)){
        console.log('Valid Input!');
        document.getElementById('error-msg').innerHTML='';

        date=date.replace('-','/').replace('-','/');
        Operation(date,shift,digit,winningNumber);


    }
    else{
        console.log('Invalid Input!');
        document.getElementById('error-msg').innerHTML='Invalid Input!';
    }
}

 
 