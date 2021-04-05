const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';

function isMatch(num,allPermutations){
    if(allPermutations.has(parseInt(num))){
        return true;
    }
    return false;
}
 

function isPresent(arr,allPermutations){
    arr=arr.split(',');
    let allWinningNumbers=[];
    for(let i=0;i<arr.length;i++){
        if(isMatch(arr[i],allPermutations)){
            allWinningNumbers.push(arr[i]);
            console.log('found=> ',arr[i]);
        }
    }
    if(allWinningNumbers.length>=1)
    return allWinningNumbers;
    
    return allWinningNumbers;
}

let permArr = [],usedChars = [];
function permute(input) {
	let i, ch;
  	for (i = 0; i < input.length; i++) {
	    ch = input.splice(i, 1)[0];
	    usedChars.push(ch);
	    if (input.length == 0) {
	      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr;
};

function getPermutations(winningNumber){
	let Permutations=new Set();
	let arr=[];
	for(let i=0;i<winningNumber.length;i++)
		arr.push(winningNumber[i]);
	let ans=[];
	permArr=[];usedChars=[];
	ans=permute(arr);
	for(let i=0;i<ans.length;i++){
		let num='';
		for(let j=0;j<ans[i].length;j++){
			num+=ans[i][j];
		}
		Permutations.add(parseInt(num));
	}
	return Permutations;
}

function Operation(date,shift,digit,winningNumber){
    let allPermutations=getPermutations(winningNumber);
    db.ref(MainAdmin+'/Numbers/'+digit+'digit/'+date+'/'+shift).get().then(function(snapshot) {
        if (snapshot.exists()) {
            let allTheWinningNumberResult="";
            snapshot.forEach((storeUid) => {
                let winningArrayTemp=[];
                storeUid.forEach((numArrayKeys)=>{
                    let winningArray=isPresent(numArrayKeys.val(),allPermutations);
                    if(winningArray.length>=1){
                        winningArrayTemp =winningArrayTemp.concat(winningArray);
                        console.log(date,shift,winningNumber,storeUid.key,winningArray);
                        insertWinner(date,shift,winningNumber,storeUid.key,winningArray);
                    }
                });
                if(winningArrayTemp.length>0){
                    let winningArrayTotalSet=new Set(winningArrayTemp);
                    winningArrayTemp=[];
                    winningArrayTotalSet.forEach(num=>{winningArrayTemp.push(num)});
                    allTheWinningNumberResult+="<br>"+storeUid.key+"&nbsp&nbsp<h2>"+winningArrayTemp+" </h2></br>";
                }
               
            });
            if(allTheWinningNumberResult.length>0){
            document.getElementById('result').innerHTML=allTheWinningNumberResult;
            }else{
                console.log("No data available");
                document.getElementById('result').innerHTML='<h2>No data available</h2>';
            }
        }
        else {
          console.log("No data available");
          document.getElementById('error-msg').innerHTML='<h2>No data available</h2>';
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


/*
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
*/
 
 