const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BikeSchema = new Schema({
    model : String,
    color : String,
    location : String,
    rentable : Boolean,
    ratings : [{
        user: {
            type: Schema.ObjectId, 
            ref: 'User'
        },
        value: Number
    }]
});


module.exports = mongoose.model('bike', BikeSchema);