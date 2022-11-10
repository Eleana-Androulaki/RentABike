const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user : {
        type: Schema.ObjectId, 
        ref: 'user'
    },
    bike : {
        type: Schema.ObjectId, 
        ref: 'bike'
    },
    start_date: String,
    end_date: String
});


module.exports = mongoose.model('reservation', ReservationSchema);