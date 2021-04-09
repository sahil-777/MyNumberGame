const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';


//------------------------------------------------------------
// StoreAdmin=> Winners Page =>  Winners at that paticular Store


/**
 * Gives All the winners found only on that particular store with thier info like
 * Number of Digits, Date on which winner array generated, Shift, Actual Winning Number, Winning Permutations of that number
 * @returns {Array of JSON objects} Each JSON contains info about that winning number
 */
function showWinners(){ //All The winners at that Particular Store
    let Admin=auth.currentUser.uid;
    let allTheWinners=[];
    db.ref(MainAdmin+'/Winners1/'+Admin).on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach(digit => {
                digit.forEach(date=>{
                    date.forEach(shift=>{
                            let obj={
                                "Digits":digit.key[0],
                                "Date": date.key.split("-").reverse().join("-"),
                                "Shift":shift.key.substring(1,shift.key.length),
                                "ActualNumber":shift.val().ActualNumber,
                                "Permutations":shift.val().Permutations
                            }
                            allTheWinners.push(obj);
                    });
                });
            });
        }
        else{
            console.log('No winner found');
        }
    });
    console.log(allTheWinners);
    return allTheWinners;   //Returns JSON
}

/*
    Sample JSON:
    [
        {Digits: "3", Date: "07-04-2021", Shift: "Afternoon", ActualNumber: "254", Permutations: "254,542,542"},
        {Digits: "3", Date: "08-04-2021", Shift: "Evening", ActualNumber: "548", Permutations: "845,584"},
        {Digits: "4", Date: "07-04-2021", Shift: "Afternoon", ActualNumber: "2154", Permutations: "2154,1542,4521"},
        {Digits: "4", Date: "08-04-2021", Shift: "Morning", ActualNumber: "5481", Permutations: "1845,5184"}  
    ]
*/