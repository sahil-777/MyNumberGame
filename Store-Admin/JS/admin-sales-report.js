const db=firebase.database();
const auth=firebase.auth();
let MainAdmin='Teqmo';

/**
 * For formatting any date in MM/DD/YYYY
 * @param {string} date any date of any format 
 * @returns {string} formattedDate Date in MM/DD/YYYY format
 */

function getFormattedDate(date) {
    date=new Date(date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}

/**
 * Gives Number of days between a fixed date and current date.
 * It can be used to calculate current week number
 * @param {string} todaysDate current date in any format 
 * @returns {string} diffDays Number of days passed after Initial Fixed Date
 */

function getPassedDays(todaysDate){//Gives total days passed between 4/4/2021 & date parameter
    const date1 = new Date('4/4/2021');//MM/DD/YYYY //Fixed Date
    const date2 = new Date(getFormattedDate(todaysDate));
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
}


/**
 * Gives week number on which 'date' lies
 * @param {strign} date any date in any format 
 * @returns {Number} week number
 */

function getWeekNum(date){
    let diffDays=getPassedDays(date);
    return (Math.floor(diffDays/7)+1);
}

/**
 * Gives Starting & Ending date of Week in DD/MM/YYYY format   
 * @param {Number} weekNum Week number of which we want to find Starting & Ending Date
 * @param {Number} startOrEnd 0 => StartDate , 1 => End Date
 * @returns {string} if startOrEnd = 0 then Starting date, else Ending date of that week
 */
function getDateFromWeek(weekNum,startOrEnd){
    let daysPassed=(weekNum-1)*7;
    let result = new Date('4/4/2021');
    if(startOrEnd==1)
        daysPassed+=6;
    
    result.setDate(result.getDate() + daysPassed);
    let month = (1 + result.getMonth()).toString().padStart(2, '0');
    let day = result.getDate().toString().padStart(2, '0');
    let year = result.getFullYear();
    return day+'/'+month+'/'+year;
}


/**
 * Gives all the sales related data for All the weeks present in Database
 * @returns {Array of JSON Objects} Each JSON contains data for each week  
 */
function showSalesReport(){
    let Admin=auth.currentUser.uid;
    let salesReportForAllTheWeeks=[];
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment').on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach(weeks => {
                let str=weeks.key;
                let weekNumber=parseInt(str.substring(4,str.length));
                if(str.substring(0,4)=='week'){
                let weeklySale=weeks.val().sales;
                let weeklyCommission=weeks.val().commission;
                let weeklyProfit=weeklySale-weeklyCommission;
                let startDate=getDateFromWeek(weekNumber,0);
                let endDate=getDateFromWeek(weekNumber,1);
                    salesReportForAllTheWeeks.push({
                        "StartDate":startDate,
                        "EndDate":endDate,
                        "Sales":weeklySale,
                        "Commission":weeklyCommission,
                        "Profit":weeklyProfit
                    });
                }
            });
        }
        else{
            console.log('No data found');
        }
    })
    //console.log(salesReportForAllTheWeeks);
    return salesReportForAllTheWeeks;  //Returns JSON
}
/*  return:
    Sample JSON:
    [
        {"StartDate":04/04/2021,"EndDate":10/04/2021,"Sales":500,"Commission":200,"Profit":300},
        {"StartDate":11/04/2021,"EndDate":17/04/2021,"Sales":1000,"Commission":450,"Profit":550}
    ]
*/






//------------------------------------------------------------------------------------------------

/*   Plan Cancelled (No need to show this data on graph)
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
*/

/*
function showSalesReport(){
    let date=document.getElementById('sales-date').value; // Select 12-06-2021 for 10 weeks for testing
    //let date=new Date(); //IMP takes current date
    let Admin=auth.currentUser.uid;
    let weekNum=getWeekNum(date);
    let salesReportForLastTenWeeks=[];
    db.ref(MainAdmin+'/Stores/'+Admin+'/Payment').on('value',(snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach(weeks => {
                let str=weeks.key;
                let weekNumber=parseInt(str.substring(4,str.length));
                if(str.substring(0,4)=='week' && (weekNum-10<weekNumber && weekNumber<=weekNum)){
                let weeklySale=weeks.val().sales;
                let weeklyCommission=weeks.val().commission;
                let weeklyProfit=weeklySale-weeklyCommission;
                let startDate=getDateFromWeek(weekNumber,0);
                let endDate=getDateFromWeek(weekNumber,1);
                    salesReportForLastTenWeeks.push({
                        "StartDate":startDate,
                        "EndDate":endDate,
                        "Sales":weeklySale,
                        "Commission":weeklyCommission,
                        "Profit":weeklyProfit
                    });
                }
            });
        }
        else{
            console.log('No data found');
        }
    })
    console.log(salesReportForLastTenWeeks);
    return salesReportForLastTenWeeks;  //Returns JSON
}
*/