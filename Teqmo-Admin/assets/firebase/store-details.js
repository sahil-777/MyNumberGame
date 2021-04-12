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
//         showStoresDetails();
//     }
// })

showStoresDetails();

function showStoresDetails(){
    storeOwnerInfo();
    storeBillDetails();
}

function storeOwnerInfo(){
    let storeUID = location.search.split('=')[1];
    firebase.database().ref(`Teqmo/Stores/${storeUID}/details`).on('value',(snapshot)=>{
        if(snapshot.exists()){
            let data=snapshot.val();
            let Address=data.Address;
            let Email=data.Email;
            let Name=data.Name;
            let PhoneNumber=data.PhoneNumber;
            //console.log(Address,Email,Name,PhoneNumber);
            let contactInfo=` <li><i class="tio-online mr-2"></i>${Email}</li>
                    <li><i class="tio-android-phone-vs mr-2"></i>${PhoneNumber}</li>`;
            document.getElementById('contact-info').innerHTML=contactInfo;

            document.getElementById('store-owner-name').innerHTML=Name;
        }
        else{
            console.log('Store Owner data not available');
        }
    });
}

async function storeBillDetails(){
    let storeUID = location.search.split('=')[1];
    console.log(storeUID);
    let billDetailsData=[];
    let snapshot=await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/Weeks`).once('value');
        if(snapshot.exists()){
            snapshot.forEach(week=>{
                let billStatusArray=["Not generated","Pending","Paid"];
                let billStatusClasses=["fail","warning","success"];//For Icon & Colour
                let startDate=getDateFromWeek(week.key,0);//From Common function's File
                let endDate=getDateFromWeek(week.key,1);
                let billStatus=billStatusArray[week.val().billStatus];
                let billIconClass=billStatusClasses[week.val().billStatus];
                let Commission=week.val().commission;
                let Sales=week.val().sales;

                
                let billStatusHTML=`<span class="badge badge-soft-${billIconClass}">
                                    <span class="legend-indicator bg-${billIconClass}"></span>${billStatus}
                                    </span>`;
                let invoiceIcon= `<a class="btn btn-sm btn-white" href="javascript:;" data-toggle="modal" data-target="#invoiceReceiptModal">
                                  <i class="tio-receipt-outlined mr-1"></i> Invoice
                                  </a>`;
                //console.log(startDate,endDate,billStatusHTML,billIconClass,Commission,Sales);
                
                let row=[startDate,endDate,billStatusHTML,Commission,Sales,invoiceIcon];
                billDetailsData.unshift(row);   //Adding JSON at beginning
            });
        }
        else{
            console.log('No week exists');
        }
    updateDataTable(billDetailsData);
}

//-----------------------------------------------------------------------------
// INITIALIZATION OF DATATABLES
function updateDataTable(dataSet){
    //console.log(dataSet);
    // Sample Data to be received (Number of items in each row should match the columns)
    // let dataSet = [
    //      ["Sun Apr 11, 2021", "Sat Apr 17, 2021", "200", "$ 200", "$ 100","y" ],
    //      ["Sun Apr 18, 2021", "Sat Apr 24, 2021", "100", "$ 100", "$ 50","n" ]
    //  ]
 
    let datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
      data: dataSet,
      columns: [
          { title: "Start Date" },
          { title: "End Date" },
          { title: "Payment" },
          { title: "Commission" },
          { title: "Sales" },
          { title: "Invoice" }
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