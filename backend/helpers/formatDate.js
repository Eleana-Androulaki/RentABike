import moment from 'moment';

module.exports = (date) => {
    return moment(date).format("DD/MM/YYYY");
}