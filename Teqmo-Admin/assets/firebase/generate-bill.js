$(document).on('ready', function () {
    // INITIALIZATION OF NAVBAR VERTICAL NAVIGATION
    var sidebar = $('.js-navbar-vertical-aside').hsSideNav();
    // INITIALIZATION OF UNFOLD
    $('.js-hs-unfold-invoker').each(function () {
        var unfold = new HSUnfold($(this)).init();
    });
    // =======================================================
})


// firebase.auth().onAuthStateChanged((user) => {
//     if(user){
//         console.log("HELLO")
//         showGeneratedBill()
//     }
// })

showGeneratedBill();

async function showGeneratedBill() {
    const snapshot = await firebase.database().ref(`Teqmo/Stores`).once('value')
    const data = snapshot.val()
    document.getElementById("select-week").innerHTML = ""
    jQuery.each(data, function(UID,uidDetails) {
        if (uidDetails) {
            let check = uidDetails.Payment.Weeks
            jQuery.each(check, function(weekNum, weekDetails) {
                if (weekDetails) {
                    let billStatus = weekDetails.billStatus;
                    if (billStatus==0){
                        let startDate = getDateFromWeek(weekNum,0);
                        let endDate = getDateFromWeek(weekNum,1);
                        var row = `<option value="${startDate}">${startDate} - ${endDate}</option>`
                        document.getElementById('select-week').innerHTML += row;
                        row = ''
                    }
                }
            })
        }
    })
}

function generateBillForAllStores(){
    let weekNum=getWeekNumber(new Date(document.getElementById('select-week').value));
    let commissionRate=parseInt(document.getElementById('commission-rate').value);
    
    if(!weekNum){Swal.fire({icon: 'error',text: 'Please, select a week',})}
    else if(!commissionRate){Swal.fire({icon: 'error',text: 'Please, Enter commission rate',})}

    saveCommissionRate(weekNum,commissionRate);

    let fees=1; //Money required to play game one time

    firebase.database().ref(`Teqmo/Stores`).get().then(function(snapshot){
        const data = snapshot.val()
        jQuery.each(data, function(UID,uidDetails) {
            if (uidDetails) {
                let check = uidDetails.Payment.Weeks
                jQuery.each(check, function(weekNumber, weekDetails) {
                    if(weekNumber==weekNum){
                        if (weekDetails) {
                            //let billStatus = weekDetails.billStatus;
                            let countSum=(weekDetails.counter)?weekDetails.counter.reduce((a, b) => a + b, 0):0;
                            let Sales=countSum*fees;
                            let Commission=(Sales*commissionRate)/100;
                            updateBillValues(UID,Sales,Commission,weekNum);
                        }
                    }
                })
            }
        })
    });
}


function saveCommissionRate(weekNum,commissionRate){
    firebase.database().ref(`Teqmo/Details/CommissionRate/${commissionRate}`).get().then(function(snapshot){
        let data=(snapshot.exists())?`${snapshot.val()},${weekNum.toString()}`:weekNum.toString();
        firebase.database().ref(`Teqmo/Details/CommissionRate`).child(commissionRate).set(data);
    });
}


async function updateBillValues(storeUID,Sales,Commission,weekNum){
    firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/Weeks/${weekNum}`).update({
        'billStatus':1,
        'commission':Commission,
        'sales':Sales
    });

    let totalCommission=await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/totalCommission`).once('value');
    let totalSales=await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/totalSales`).once('value');
    totalCommission=totalCommission.val()+Commission;
    totalSales=totalSales.val()+Sales;

    
    firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment`).update({
        'totalCommission':totalCommission,
        'totalSales':totalSales
    });

    Swal.fire({
        icon: 'success',
        text: 'Bills generated Successfully!',
    })

}
 