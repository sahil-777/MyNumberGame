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
    let storeUID = location.search.split('=')[1];
    storeOwnerInfo(storeUID);
    storeReportCard(storeUID);
    storeBillDetails(storeUID);
}

/**
 * Gives Total Count/players of that store of all time 
 * @param {Number} storeUID UID of that Store
 * @returns {Number} countSum ,sum of all the counts of that store
 */
async function getTotalCountOfStore(storeUID){
    const snapshot = await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment`).once('value')
    const data = snapshot.val()
    let countSum=0;
    jQuery.each(data.Weeks, function(weekNum, details) {
         if(details){
             if(details.counter){ 
                countSum += details.counter.reduce((a, b) => a + b, 0) //Sum of array elements
             }
         }
    })
    return countSum;
}

/**
 * To update all the information about that store like,
 * Email, Owner-name, Phone, City, State, Store-name, Company-name
 * @param {Number} storeUID UID of that Store
 */
async function storeOwnerInfo(storeUID){
    firebase.database().ref(`Teqmo/Stores/${storeUID}/details`).on('value',(snapshot)=>{
        if(snapshot.exists()){
            let data=snapshot.val();
            let Email=(typeof data.Email=='undefined')?'Email':data.Email;
            let OwnerName=(typeof data.OwnerName=='undefined')?'Owner-name':data.OwnerName;
            let Phone=(typeof data.Phone=='undefined')?'Phone':data.Phone;
            let contactInfo=` <li><i class="tio-online mr-2"></i>${Email}</li>
                    <li><i class="tio-android-phone-vs mr-2"></i>${Phone}</li>`;
            
            let City=(typeof data.City=='undefined')?'City':data.City;
            let State=(typeof data.State=='undefined')?'State':data.State;
            let CompanyName=(typeof data.CompanyName=='undefined')?'Company-name':data.CompanyName;
            let StoreName=(typeof data.StoreName=='undefined')?'Store-name':data.StoreName;

            let StoreInfo=` <li>
                            <i class="tio-user-outlined nav-icon"></i>
                            ${StoreName}
                            </li>
                            <li>
                            <i class="tio-briefcase-outlined nav-icon"></i>
                            ${CompanyName}
                            </li>
                            <li>
                            <i class="tio-city nav-icon"></i>
                            ${City},${State}
                            </li>`;
            
            document.getElementById('store-info').innerHTML=StoreInfo;
            document.getElementById('contact-info').innerHTML=contactInfo;
            document.getElementById('store-owner-name').innerHTML=OwnerName;
        }
        else{
            console.log('Store Owner data not available');
        }
    });
}


/**
 * To update all the statistical,sales related data of that store like,
 * Total : Commission, Sales, Count/Players, Profit
 * @param {Number} storeUID 
 */
async function storeReportCard(storeUID){
    let snapshot = await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/totalSales`).once('value'); 
    let totalSales=snapshot.val();
    snapshot = await firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/totalCommission`).once('value'); 
    let totalCommission=snapshot.val();
    let totalProfit=totalSales-totalCommission;
    let totalCount=await getTotalCountOfStore(storeUID);
    document.getElementById('total-count').innerHTML=totalCount;
    document.getElementById('total-sales').innerHTML='$ '+totalSales;
    document.getElementById('total-commission').innerHTML='$ '+totalCommission;
    document.getElementById('total-profit').innerHTML='$ '+totalProfit;
}

/**
 * All the bills for all the weeks of that store from beginning
 * @param {Number} storeUID 
 */
async function storeBillDetails(storeUID){
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
/**
 * Initialization of datatables, Updates data to table
 * @param {2D Array} dataSet Each row represents row of actual html table
 */
function updateDataTable(dataSet){
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