const db=firebase.database();
let MainAdmin='Teqmo';

function increment(){
    console.log('Hii');
    db.ref(MainAdmin+'/count').transaction( (value) => {
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
            //console.log('Success!');
        }
        //console.log("Counter ", snapshot.val());
    });
}

let id;
function start(){
    id=setInterval(()=>{
        increment();
    },100);
}

function stop(){
    clearInterval(id);
}


function printClick(){
    document.getElementById('click-result').innerHTML=arr.length;
}


/*
let arr=[];
function increment(){
    console.log('Hii');
    arr.push('Hii');
    db.ref(MainAdmin).child('counter').get().then(function(snapshot){
        if(snapshot.exists()){
            //console.log(snapshot.key,snapshot.val()+1);
            let val=snapshot.val();
            db.ref(MainAdmin).update({
                'counter':val+1
            });
        }
    });
}
*/
    // Session storage: Time expire, Hard refresh

// StoreA -> A1
// 100 Tickets -> 100$ - 50% -> 50$ Teqmo - 10% -> 5$ A1


// charts.js

// data: {"a": 10, "b": 20}