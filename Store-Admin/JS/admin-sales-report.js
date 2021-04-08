const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';

function getFormattedDate(date) {
    date=new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}

function getPassedDays(todaysDate){//Gives total days passed between 4/4/2021 & date parameter
    const date1 = new Date('4/4/2021');//MM/DD/YYYY //Fixed Date
    const date2 = new Date(getFormattedDate(todaysDate));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}

function getWeekNum(date){
    let diffDays=getPassedDays(date);
    return (Math.floor(diffDays/7)+1);
}

function showSalesReport(){
    let date=document.getElementById('sales-date').value; // Select 12-06-2021 for testing
    let Admin=auth.currentUser.uid;
    let weekNum=getWeekNum(date);
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment').on('value',(snapshot)=>{
        if(snapshot.exists()){
            let salesReportForLastTenWeeks="<table><h2><tr><th>weekNumber</th><th>Sales</th><th>Commission</th></tr><h2>"
            snapshot.forEach(weeks => {
                let str=weeks.key;
                //console.log(parseInt(str.substring(4,str.length)));
                let weekNumber=parseInt(str.substring(4,str.length));
                if(str.substring(0,4)=='week' && (weekNum-10<weekNumber && weekNumber<=weekNum)){
                //console.log(weeks.key,weeks.val());
                let weeklySale=weeks.val().sales;
                let weeklyCommission=weeks.val().commission;
                //console.log(weeks.key,weeklySale,weeklyCommission);
                salesReportForLastTenWeeks+="<tr><td>"+weekNumber+"</td><td>"+weeklySale+"</td><td>"+weeklyCommission+"</td></tr>";
                }
            });
            salesReportForLastTenWeeks+="</table>";
            document.getElementById('sales-report-for-last-ten-weeks').innerHTML=salesReportForLastTenWeeks;
        }
        else{
            console.log('No data found');
        }
    })
}

function  showCountReport(){
    let date=document.getElementById('count-date').value; // Select 12-06-2021 for testing
    let Admin=auth.currentUser.uid;
    let weekNum=getWeekNum(date);
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment').on('value',(snapshot)=>{
        if(snapshot.exists()){
            let countReportForLastTenWeeks="<table><h2><tr><th>weekNumber</th><th>Count</th></tr><h2>"
            snapshot.forEach(weeks => {
                let str=weeks.key;
                let weekNumber=parseInt(str.substring(4,str.length));
                if(str.substring(0,4)=='week' && (weekNum-10<weekNumber && weekNumber<=weekNum)){
                    //console.log(weeks.val().counter);
                    let sum=0;
                    weeks.val().counter.forEach(cnt=>{
                        //console.log(cnt);
                        sum+=cnt;
                    });
                    //console.log(weekNumber,sum);
                    countReportForLastTenWeeks+="<tr><td>"+weekNumber+"</td><td>"+sum+"</td></tr>"
                }
            });
            countReportForLastTenWeeks+="</table>";
            document.getElementById('count-report-for-last-ten-weeks').innerHTML=countReportForLastTenWeeks;
        }
        else{
            console.log('No data found');
        }
    })   
}
