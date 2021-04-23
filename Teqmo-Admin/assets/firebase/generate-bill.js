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
//         listUnbilledweeks();
//     }
// })

listUnbilledweeks();

/**
 * Gives all the weeks, For which bill is not generated
 */
async function listUnbilledweeks() {
    const snapshot = await firebase.database().ref(`Teqmo/Details/commissionRate`).once('value')
    let set = new Set();
    if (snapshot.exists()) {
        snapshot.forEach(array => {
            let arr = array.val().split(',');
            for (let i = 0; i < arr.length; i++) {
                set.add(parseInt(arr[i]));
            }
        })
    }
    let currentWeek = getWeekNumber(new Date(getFormattedDate(new Date()))); //Current Week Number

    for (let i = 1; i < currentWeek; i++) {
        if (!set.has(i)) {
            let startDate = getDateFromWeek(i, 0);
            let endDate = getDateFromWeek(i, 1);
            let row = `<option value="${startDate}">${startDate} - ${endDate}</option>`
            document.getElementById('select-week').innerHTML += row;
            row = ''
        }
    }
}

/**
 * Generates Bills for all the stores for selected week 
 * Commission Rate will be same for all the stores for that week
 */

function generateBillForAllStores() {
    let weekNum = getWeekNumber(new Date(document.getElementById('select-week').value));
    let commissionRate = document.getElementById('commission-rate').value;
    let ticketValue = document.getElementById('ticket-value').value;
    if (!weekNum) {
        Swal.fire({
            icon: 'error',
            text: 'Please, select a week',
        })
    } else if (!commissionRate) {
        Swal.fire({
            icon: 'error',
            text: 'Please, Enter commission rate',
        })
    } else if (!ticketValue) {
        Swal.fire({
            icon: 'error',
            text: 'Please, Enter Ticket Value',
        })
    }
    else if(commissionRate.includes('.') || parseInt(commissionRate)<0 || parseInt(commissionRate)>100){
        Swal.fire({
            icon: 'error',
            text: 'Please, Enter value between 0 to 100 without decimal point',
        })
    }

    commissionRate = parseInt(commissionRate);
    ticketValue = parseFloat(ticketValue);


    savecommissionRate(weekNum, commissionRate);

    firebase.database().ref(`Teqmo/Stores`).get().then(function (snapshot) {
        const data = snapshot.val()

        jQuery.each(data, function (UID, uidDetails) {
            if (uidDetails) {
                let check = uidDetails.payment.weeks
                jQuery.each(check, function (weekNumber, weekDetails) {
                    if (weekNumber == weekNum) {
                        if (weekDetails) {
                            //let billStatus = weekDetails.billStatus;
                            let countSum = (weekDetails.counter) ? weekDetails.counter.reduce((a, b) => a + b, 0) : 0;
                            let sales = countSum * ticketValue;
                            let commission = ((sales * commissionRate) / 100).toFixed(2); //Upto two decimal places
                            commission = parseFloat(commission);
                            updateBillValues(UID, sales, commission, weekNum);
                        }
                    }
                })
            }
        })

    });
}

/**
 * Saves Commission rate for selected week 
 * This can be useful to check, if bill is already generated or not for that week
 * @param {Number} weekNum week number of selected week 
 * @param {Number} commissionRate commission rate in %
 */

function savecommissionRate(weekNum, commissionRate) {
    firebase.database().ref(`Teqmo/Details/commissionRate/${commissionRate}`).get().then(function (snapshot) {
        let data = (snapshot.exists()) ? `${snapshot.val()},${weekNum.toString()}` : weekNum.toString();
        firebase.database().ref(`Teqmo/Details/commissionRate`).child(commissionRate).set(data);
    });
}

/**
 * Updates sales,commission values for that store for selected week
 * Same values are used to increment total values
 * @param {Number} storeUID UID of a store 
 * @param {Number} sales Sales for selected week
 * @param {Number} commission Commission for selected week
 * @param {Number} weekNum Week number of selected week
 */
async function updateBillValues(storeUID, sales, commission, weekNum) {
    firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/weeks/${weekNum}`).update({
        'billStatus': 1, //1 : Generated & Unpaid
        'commission': commission,
        'sales': sales
    });

    console.log(typeof commission, typeof sales);

    //Updating total 
    let totalCommission = await firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/totalCommission`).once('value');
    let totalSales = await firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/totalSales`).once('value');
    totalCommission = totalCommission.val() + commission;
    totalSales = totalSales.val() + sales;

    firebase.database().ref(`Teqmo/Stores/${storeUID}/payment`).update({
        'totalCommission': totalCommission,
        'totalSales': totalSales
    });

    Swal.fire({
        icon: 'success',
        text: 'Bills generated Successfully!'
    }).then(() => {
        location.reload();
    })
}
