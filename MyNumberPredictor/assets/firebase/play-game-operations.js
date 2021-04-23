/**
 * To lock the screen, to reinitiate game again
 * @param {Number} storeUID UID of StoreOwner, fetching from session-storage
 * @param {Number} screenNumber Screen Number assigned, fetching from local-storage
 */
function lockScreen(storeUID, screenNumber) {
    firebase.database().ref(`Teqmo/Stores/${storeUID}/screens/${screenNumber}`).update({
        'lockStatus': 1
    }, (error) => {
        if (!error) {
            console.log("Sucessfully Locked! " + screenNumber);
        }
    });
}

/**
 * To update count for current day of current week for that store
 * Initilises new week, if No one has played in that week before
 * @param {Number} storeUID UID of StoreOwner, fetching from session-storage
 */
function updateCount(storeUID) {
    let date = new Date();
    let diffDays = getPassedDays(date);
    let weekNum = Math.floor(diffDays / 7) + 1;
    let Position = date.getDay();

    firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/weeks/${weekNum}`).get().then(function (snapshot) {
        if (snapshot.exists()) {
            increment(storeUID, weekNum, Position);
        } else {
            firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/weeks/${weekNum}`).set({
                billStatus: 0,
                commission: 0,
                sales: 0,
                counter: [0, 0, 0, 0, 0, 0, 0]
            })
            increment(storeUID, weekNum, Position);
        }
    });
}

/**
 * To increment count with transaction property,to maintain automacity
 * @param {Number} storeUID UID of StoreOwner, fetching from session-storage
 * @param {Number} weekNum Current Week Number e.g. 54
 * @param {Number} Position Position of day in week, 0:SUN, 1:MON,..., 6:SAT
 */
function increment(storeUID, weekNum, Position) {
    firebase.database().ref(`Teqmo/Stores/${storeUID}/payment/weeks/${weekNum}/counter/${Position}`).transaction((value) => {
        if (value === null) {
            return 0;
        } else if (typeof value === 'number') {
            return value + 1;
        } else {
            console.log('The count has a non-numeric value: ');
        }
    }, function (error, committed, snapshot) {
        if (error) {
            console.log('Count Increment failed abnormally!', error);
        } else if (!committed) {
            console.log('We aborted the Count Increment');
        } else {
            console.log('Count Incremented Successfully!');
        }
    });
}

/**
 * Inserts generated array according to digit, date, shift, store
 * @param {Number} storeUID UID of StoreOwner, fetching from session-storage
 * @param {Array} numberArray Array of generated numbers
 */
function insertArray(storeUID, numberArray) {
    let date = new Date().toISOString().slice(0, 10).replace('-', '/').replace('-', '/');
    let time = getCurrentTime();
    let shift = calculateShift(time); //Calculate shift
    let digit = location.search.split('=')[1];

    if (shift != -1) {
        let Ref = firebase.database().ref(`Teqmo/Numbers/${digit}/${date}/${shift}/${storeUID}`).push();
        firebase.database().ref(`Teqmo/Numbers/${digit}/${date}/${shift}/${storeUID}`).update({
            [Ref.key]: numberArray.toString()
        }, (error) => {
            if (!error) {
                console.log('numberArray inserted Successfully!')
            }
        });
    } else {
        console.log("Invalid Shift => can't insert number");
    }
}
 


