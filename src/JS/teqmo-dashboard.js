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

function generateBill(){
    let date=document.getElementById('bill-date').value;
    console.log('Date =>', date);
    let diffDays=getPassedDays(date);
    let weekNum=Math.floor(diffDays/7)+1;
    console.log('WeekNum=> ', weekNum);
    
    //Take sum all the counts in that week.
    //Add this counter * commision to bill details.
    //Add bill details amount to totalRevenue
    //Change Bill Status to 'generated i.e. 0 '




}

if(sessionStorage.getItem('allStoreBlob')===null){
    db.ref(MainAdmin+'/Stores').get().then(function(snapshot){
        if(snapshot.exists()){
            var allStoresBlob = snapshot.val();
            sessionStorage.setItem('allStoresBlob', JSON.stringify(allStoresBlob));
            var allStoresBlob = sessionStorage.getItem('allStoresBlob');
            console.log('All the Stores data => ', JSON.parse(allStoresBlob));
        }
    });
}
 