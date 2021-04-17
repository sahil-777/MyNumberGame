$(document).on('ready', function () {
    // INITIALIZATION OF NAVBAR VERTICAL NAVIGATION
    var sidebar = $('.js-navbar-vertical-aside').hsSideNav();
    // INITIALIZATION OF UNFOLD
    $('.js-hs-unfold-invoker').each(function () {
        var unfold = new HSUnfold($(this)).init();
    });
    // =======================================================

    
})

// Checks for Looged-In Teqmo Admin

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        showAllStoresAllWinner()
        // updateBasicInfo()
    }
})


/**
 * Fetches all the Winners from All the Stores present in Database
 * 
 * Table Format - [winDate, shiftName, game+gameType, storeName, actualNumber, predictions, count]
 */
async function showAllStoresAllWinner() {

    const snapshot = await firebase.database().ref(`Teqmo/Winners`).once('value')
    const data = snapshot.val()

    var dataSet = []

    var game = "TEQMO"
    // GameType --> TEQMO3 / TEQMO4
    var gameType

    const stores = await firebase.database().ref(`Teqmo/Stores`).once('value')
    var store_Details = {}

    jQuery.each(stores.val(), function(UID,uidDetails) {
        store_Details[UID] = uidDetails.details.StoreName
    })


    jQuery.each(data, function(UID,uidDetails) {

        if (uidDetails) {

            jQuery.each(uidDetails, function(date, dateDetails) {

            jQuery.each(dateDetails, function(shift, shiftDetails) {

                var checkGame = 0
                var checkGameThree = 1
                if(shiftDetails){
                    // Obtain the dete from key and convert full date 
                    // `Wed Apr 07 2021 05:30:00 GMT+0530 (India Standard Time)`
                    // to `Wed Apr 07 2021`
                    let winDate = new Date(date)
                    winDate = winDate.toString().substring(0,15).replace(' ', ', ')

                    let shifts=['Morning','Afternoon','Evening']
                    let shiftName = shifts[shift];

                    var noOfgameType = Object.keys(shiftDetails).length

                    let storeName = store_Details[UID]

                    for (var i = Object.keys(shiftDetails).length; i >0; i--) {
                        if (i==1) {
                            gameType = '3'
                        }
                        else {
                            gameType = '4'

                        }
                        let actualNumber = shiftDetails[gameType].winNum;
                        let predictions = shiftDetails[gameType].predictions.replace(/,/g, ', ');
                        let count = predictions.split(',').length
                        
                        let row = [winDate, shiftName, game+gameType, storeName, actualNumber, predictions, count]
                        
                        dataSet.unshift(row)
                    }
                }
            })
        })
        }
    })
    updateDataTable(dataSet)
}

// async function showNamePerUID(UID) {
//     const storeData = await firebase.database().ref(`Teqmo/Stores/${UID}/details/StoreName`).once('value')
//     // console.log(storeData)
//     var storeDetails = storeData.val()
//     // console.log(storeDetails)
//     return storeDetails

// }

        
function updateDataTable(dataSet) {
    var datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
        data : dataSet,
        columns:[
            { title: "Date" },
            { title: "Shift"},
            { title: "Game"},
            { title: "Store Name"},
            { title: "Actual Number"},
            { title: "Winning Numbers"},
            { title: "Count"}
        ],
        language: {
            zeroRecords: '<div class="text-center p-4">' +
                '<img class="mb-3" src="./assets/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">' +
                '<p class="mb-0">No data to show</p>' +
                '</div>'
        }
    });
    // Initialise search on table
    $('#datatableSearch').on('mouseup', function (e) {
      var $input = $(this),
        oldValue = $input.val();

      if (oldValue == "") return;

      setTimeout(function(){
        var newValue = $input.val();

        if (newValue == ""){
          // Gotcha
          datatable.search('').draw();
        }
      }, 1);
    });
}
