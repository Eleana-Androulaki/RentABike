import moment from 'moment';

const compareDates =  (date_1, date_2) => {
    let d1 = moment(date_1);
    let d2 = moment(date_2);


    if(d1 < d2)
        return -1;
    else if(d1 > d2)
        return 1;
    else
        return 0;

}

export default compareDates;