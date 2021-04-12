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
        showWinners()
    }
})

/**
 * Gives all the sales related data for All the weeks present in Database
 * @returns {Array of JSON Objects} Each JSON contains data for each week  
 */
function showWinners(){
    const UID = firebase.auth().currentUser.uid;
    // const UID = 'OHatm0qKa2Rf3DFnAj1Vq64Fcn62'
    firebase.database().ref(`Teqmo/Winners/${UID}`).on('value',(snapshot)=>{
        if(snapshot.exists()){
            document.getElementById('tableBody').innerHTML = ''
            snapshot.forEach(digit => {
                digit.forEach(date=>{
                    date.forEach(shift=>{
                        let windate = date.key.split("-").reverse().join("-")
                        let Shift = shift.key.substring(1,shift.key.length)
                        let digits = digit.key[0]
                        let actualNumber = shift.val().ActualNumber
                        let permutations = shift.val().Permutations
                        let count = permutations.split(',').length
                    
                        var row = `<tr>
                        <td>${windate}</td>
                        <td>${Shift}</td>
                        <td>${digits}</td>
                        <td>${actualNumber}</td>
                        <td>${permutations}</td>
                        <td>${count}</td>
                        </tr>`
                        document.getElementById('tableBody').innerHTML += row
                    });
                });
            });
        }
    })
}
