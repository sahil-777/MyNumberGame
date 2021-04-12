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
//         console.log('Hii');
//         showAllStores();
//     }
// })


    showAllStores();


function showAllStores(){
    firebase.database().ref('Teqmo/Stores').on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach(Store => {
                let Name,Email,Commission,phoneNo;
                Store.forEach(data => {
                    if(data.key=="details"){
                         Name=data.val().Name;
                         Email=data.val().Email;
                         phoneNo=data.val().PhoneNumber;
                    }
                    else if(data.key=="Payment"){
                         Commission=data.val().totalCommission;
                    }
                    if(typeof Name!="undefined" && typeof Email!="undefined" && typeof Commission!="undefined"){
                        let StoreUID=Store.key;
                        let tableRow=`<tr>
    
                        <td class="table-column-pl-0">
                          <a class="d-flex align-items-center" href="./store-details.html?storeUID=${StoreUID}">
                            <div class="avatar avatar-circle">
                              <img class="avatar-img" src="./assets/img/160x160/img10.jpg" alt="Image Description">
                            </div>
                            <div class="ml-3">
                              <span class="h5 text-hover-primary">${Name}<i class="tio-verified text-primary" data-toggle="tooltip" data-placement="top" title="Top endorsed"></i></span>
                            </div>
                          </a>
                        </td>
                        <td>${Email}</td>
                        <td>${phoneNo}</td>
                        <td>$${Commission}</td>
                      </tr>`
                      document.getElementById('datatable').innerHTML += tableRow;
                    }
                }); 
            });
        }
        else{
            console.log('No store exists');
        }
    });
}

 
     

 