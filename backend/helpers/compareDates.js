const moment = require('moment');

const compareDates =  (date_1, date_2) => {
    let d1 = moment(date_1).format("DD/MM/YYYY");
    let d2 = moment(date_2).format("DD/MM/YYYY");
    
    if(d1 < d2)
        return -1;
    else if(d1 > d2)
        return 1;
    else
        return 0;

}

module.exports = compareDates;