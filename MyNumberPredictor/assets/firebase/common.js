const START_DATE = new Date('4/4/2021')
const SCREEN_UNLOCK = 0

/**
 * For formatting any date in MM/DD/YYYY
 * @param {string} date any date of any format 
 * @returns {string} formattedDate Date in MM/DD/YYYY format
 */
function getFormattedDate(dateReceived) {
    const date = new Date(dateReceived);
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = month + '/' + day + '/' + year;
    return formattedDate;
}

/**
 * Gives Number of days between a fixed date and current date.
 * It can be used to calculate current week number
 * @param {string} date current date in any format 
 * @returns {number} diffDays Number of days passed after Initial Fixed Date
 */
function getPassedDays(date) {
    const newDate = new Date(getFormattedDate(date));
    const diffTime = Math.abs(newDate - START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Calculates Week Number of date received
 * @param {Date} date formated date
 * @returns {number} week number of the date
 */
function getWeekNumber(date) {
    const diffTime = Math.abs(date - START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7) + 1;
    return weekNum
}

/**
 * Gives Starting & Ending date of Week in DD/MM/YYYY format   
 * @param {Number} weekNum Week number of which we want to find Starting & Ending Date
 * @param {Number} startOrEnd 0 => StartDate , 1 => End Date
 * @returns {string} if startOrEnd = 0 then Starting date, else Ending date of that week
 */
function getDateFromWeek(weekNum, startOrEnd) {
    let daysPassed = (weekNum - 1) * 7;
    let result = new Date('4/4/2021');
    if (startOrEnd == 1)
        daysPassed += 6;
    result.setDate(result.getDate() + daysPassed);
    return result.toString().substring(4, 15)
}

/**
 * Calculates shift name according to given time
 * @param {string} time in HHMMSS & 24 hours format e.g. 180510  
 * @returns {Number} Shift name 1:Morning, 2:Afternoon, 3:Evening
 */
function calculateShift(time) {
    let hours = time.substring(0, 2);
    let minutes = time.substring(2, 4);
    let seconds = time.substring(4, 6);
    time = parseInt(hours + minutes + seconds);
    if (time <= 122959) return 0;
    else if (time <= 185959) return 1;
    else if (time <= 233459) return 2;
    else return -1;
}

/**
 * Gives current time  
 * @returns {string} time ,current time in HHMMSS & 24 hours format e.g. 180254
 */
function getCurrentTime() {
    let d = new Date(); // Current 
    let hourString = ((d.getHours() <= 9) ? '0' : '') + d.getHours().toString();
    let minuteString = ((d.getMinutes() <= 9) ? '0' : '') + d.getMinutes().toString();
    let secondString = ((d.getSeconds() <= 9) ? '0' : '') + d.getSeconds().toString();
    let time = hourString + minuteString + secondString;
    return time;
}

/**
 * Error alert using sweetalert.js library 
 * @param {string} msg Message to display 
 */
 function showFailError(msg) {
    let err = msg ? msg : 'Please try again later! If the problem persist contact Store Owner.'
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${err}`,
        allowOutsideClick: false
    })
}

