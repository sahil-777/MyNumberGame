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


async function showAllStores(){
    let listAllStores=[]; 
    let snapshot=await firebase.database().ref('Teqmo/Stores').once('value'); 
        if(snapshot.exists()){
            snapshot.forEach(Store => {
              //console.log(Store.key,Store.val());
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
                        let nameHTML=`<a class="d-flex align-items-center" href="./store-details.html?storeUID=${StoreUID}">
                                        <div class="avatar avatar-circle">
                                          <img class="avatar-img" src="./assets/img/160x160/img10.jpg" alt="Image Description">
                                        </div>
                                        <div class="ml-3">
                                          <span class="h5 text-hover-primary">${Name}<i class="tio-verified text-primary" data-toggle="tooltip" data-placement="top" title="Top endorsed"></i></span>
                                        </div>
                                    </a>`;

                        let tableRow=[nameHTML,Email,phoneNo,Commission];
                        listAllStores.unshift(tableRow);
                    }
                }); 
            });
        }
        else{
            console.log('No store exists');
        }
    document.getElementById('all-stores-count').innerHTML=listAllStores.length;
    updateDataTable(listAllStores);
}

//-----------------------------------------------------------------------------
// INITIALIZATION OF DATATABLES
function updateDataTable(dataSet){
    //console.log(dataSet);
    // Sample Data to be received (Number of items in each row should match the columns)
    // let dataSet = [
    //      ["Name with HTML tags,attributes", "s1@gmail.com", "9847473823", "$ 200"],
    //      ["Name with HTML tags,attributes", "s3@gmail.com", "2334453556", "$ 300"]
    //  ]

    let datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
      data: dataSet,
      columns: [
          { title: "Name" },
          { title: "Email" },
          { title: "Phone" },
          { title: "Commission" }
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

 
     

 