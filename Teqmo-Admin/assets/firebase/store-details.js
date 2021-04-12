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

function storeBillDetails(){
    let storeUID = location.search.split('=')[1];
    console.log(storeUID);
    firebase.database().ref(`Teqmo/Stores/${storeUID}/Payment/Weeks`).on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach(week=>{
                let billStatusArray=["Not generated","Pending","Paid"];
                let billStatusClasses=["fail","warning","success"];
                let startDate=getDateFromWeek(week.key,0);//From Common function's File
                let endDate=getDateFromWeek(week.key,1);
                let billStatus=billStatusArray[week.val().billStatus];
                let billIconClass=billStatusClasses[week.val().billStatus];
                let Commission=week.val().commission;
                let Sales=week.val().sales;
                //console.log(startDate,endDate,billStatus,billIconClass,Commission,Sales);
                let tableRow=`<tr>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>
                  <span class="badge badge-soft-${billIconClass}">
                    <span class="legend-indicator bg-${billIconClass}"></span>${billStatus}
                  </span>
                </td>
                <td>${Commission}</td>
                <td>${Sales}</td>
                <td>
                  <a class="btn btn-sm btn-white" href="javascript:;" data-toggle="modal" data-target="#invoiceReceiptModal">
                    <i class="tio-receipt-outlined mr-1"></i> Invoice
                  </a>
                </td>
              </tr>`;

              document.getElementById('datatable').innerHTML += tableRow;

            });
        }
        else{
            console.log('No week exists');
        }
    });
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
 