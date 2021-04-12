$(document).on('ready', function () {
    // INITIALIZATION OF NAVBAR VERTICAL NAVIGATION
    var sidebar = $('.js-navbar-vertical-aside').hsSideNav();
    // INITIALIZATION OF UNFOLD
    $('.js-hs-unfold-invoker').each(function () {
        var unfold = new HSUnfold($(this)).init();
    });
    // =======================================================
})

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        updateChart()
        screens()
    }
})

/**
 * Count Per Day of Current Week, from [Sun, Mon,... , Sat]
 * Current WeekNumber is calculated from current date 
 * @returns {Array} countPerDay Count per day of week, 0th pos:Sunday, ..., 6th pos:Saturday
 */
async function getCountPerDayOfWeek(weekNum = 0){
    const date = new Date() //Current Date
    const currentWeek = getWeekNumber(date)
    const targetWeek = currentWeek - weekNum

    // const UID = 'OHatm0qKa2Rf3DFnAj1Vq64Fcn62'
    const UID = firebase.auth().currentUser.uid;
    var snapshot = await firebase.database().ref(`Teqmo/Stores/${UID}/Payment/Weeks/${targetWeek}/counter`).once('value')
    return snapshot.val()
}

async function updateChart(){
    var countThisWeek = await getCountPerDayOfWeek()
    var countLastWeek = await getCountPerDayOfWeek(1)
    
    var updatingChart = $.HSCore.components.HSChartJS.init($('#updatingData'));
    updatingChart.data.datasets[0].data = countThisWeek
    updatingChart.data.datasets[1].data = countLastWeek
    updatingChart.update();

    const totalThisWeek = countThisWeek.reduce((a, b) => a + b, 0)
    const totalLastWeek = countLastWeek.reduce((a, b) => a + b, 0)
    const increasePercentage = Math.ceil((totalThisWeek - totalLastWeek)*100/totalLastWeek)

    const countTrend = document.getElementById("countTrend")
    if(increasePercentage > 0){
        countTrend.classList.add("text-success");
        countTrend.classList.remove("text-danger");
        countTrend.innerHTML = `<i class="tio-trending-up"></i> ${increasePercentage}%`
    } else {
        countTrend.classList.remove("text-success");
        countTrend.classList.add("text-danger");
        countTrend.innerHTML = `<i class="tio-trending-down"></i> ${increasePercentage}%`
    }
}


function screens(){
    const screenAvailable = 'onclick="unlockScreen(this.id)" class="btn btn-primary btn-pill mx-auto">Unlock Screen</button>'
    const screenBusy = `
    class="btn btn-soft-danger btn-pill" disabled>
        <span class="spinner-grow spinner-grow-sm mr-2" role="status" aria-hidden="true"></span>
        Screen in Use
    </button>`
    const screenDisabled = 'class="btn btn-soft-secondary btn-pill mx-auto" disabled>Screen Disabled</button>'
    const UID = firebase.auth().currentUser.uid;

    firebase.database().ref(`Teqmo/Stores/${UID}/Screens`).on('value',(snapshot)=>{
        if(snapshot.exists()){
            document.getElementById('screenContainer').innerHTML = ''
            const data = snapshot.val()
            console.log(data)
            jQuery.each(data, function(screenID, settings) {
                console.log(screenID, settings)
                if (!settings.loggedinStatus) {
                    var activityStatus = screenDisabled
                } else if(settings.lockUnlock){
                    var activityStatus = screenAvailable
                } else {
                    var activityStatus = screenBusy
                }

                if(settings.loggedinStatus){
                    var logInStatus = '<span class="badge badge-soft-success">Active</span>'
                } else {
                    var logInStatus = '<span class="badge badge-soft-danger">Inctive</span>'
                }

                var card = `
                <div class="col-sm-6 col-lg-3 mb-3 mb-lg-5">
                    <div class="card card-hover-shadow h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle">Screen ID</h6>
                        <div class="row align-items-center gx-2 mb-1">
                            <div class="col-6">
                                <span class="card-title h2"> TEQMO${screenID}</span>
                            </div>
                            <div class="col-6 text-center">
                                <button type="button" id="${screenID}" ${activityStatus}
                            </div>
                        </div>
                        <h4>
                            <span class="text-body mr-1">Status</span>
                            ${logInStatus}
                        </h4>
                    </div>
                    </div>
                </div>`

                document.getElementById('screenContainer').innerHTML += card
            });
        }
    });
}

function unlockScreen(screenID){
    console.log(screenID);
    const UID = firebase.auth().currentUser.uid;
    firebase.database().ref(`Teqmo/Stores/${UID}/Screens/${screenID}`).update({
        'lockUnlock': SCREEN_UNLOCK
    });
}
