const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const Reservation = require('../models/Reservation');
const userRoles = require('../config/user_roles');
const moment = require('moment');
const generateBikeRating = require('../helpers/generateBikeRating');



router.get("/", verifyJWT, async ( req, res ) => {
    if(req.user.role === userRoles.User)
    {
        try{
            const myReservations = await Reservation.find({user:req.user._id}).populate("bike");
            const sanitizedReservations = myReservations.map((reserv)=>{
                return {
                    _id: reserv._id,
                    bike:{
                        _id: reserv.bike._id,
                        model: reserv.bike.model,
                        color: reserv.bike.color,
                        location: reserv.bike.location,
                        rentable: reserv.bike.rentable,
                        rating: generateBikeRating(reserv.bike)
                    },
                    start_date: reserv.start_date,
                    end_date:reserv.end_date
                }
            })
            res.status(200).json({
                reservations: [...sanitizedReservations]
            })
        }catch(fetchReservErr)
        {
            res.status(500).send("Error getting my reservations");
        }
    }
    else if (req.user.role === userRoles.Manager)
    {
        try{
            const allReservations = await Reservation.find({}).populate("bike").populate("user");
            const sanitizedReservations = allReservations.map((reserv)=>{
                return {
                    _id: reserv._id,
                    bike:{
                        _id: reserv.bike._id,
                        model: reserv.bike.model,
                        color: reserv.bike.color,
                        location: reserv.bike.location,
                        rentable: reserv.bike.rentable,
                        rating: generateBikeRating(reserv.bike)
                    },
                    user:{
                        _id: reserv.user._id,
                        name: reserv.user.name,
                        email: reserv.user.email,
                        role: reserv.user.role
                    },
                    start_date: reserv.start_date,
                    end_date:reserv.end_date
                }
            })
            res.status(200).json({
                reservations: [...sanitizedReservations]
            })
        }catch(fetchReservErr)
        {
            res.status(500).send("Error getting all reservations");
        }
    }
    
});

router.get("/:id", verifyJWT, async ( req, res ) => {
    if(req.user.role === userRoles.User)
    {
        try{
            const reservation = await Reservation.findById(req.params.id).populate("bike");
    
            if(reservation)
            {
                res.status(200).json({
                    reservation: {
                        _id: reservation._id,
                        bike:{
                            _id: reservation.bike._id,
                            model: reservation.bike.model,
                            color: reservation.bike.color,
                            location: reservation.bike.location,
                            rentable: reservation.bike.rentable,
                            rating: generateBikeRating(reservation.bike)
                        },
                        start_date: reservation.start_date,
                        end_date:reservation.end_date
                    }
                })
            }
            else
            {
                res.status(404).send("Reservation not found");
                return;
            }
        }catch(findOneReservationErr)
        {
            res.status(500).send("Error getting reservation")
        }
    }
    else if (req.user.role === userRoles.Manager)
    {
        try{
            const reservation = await Reservation.findById(req.params.id).populate("bike").populate("user");
        
            if(reservation)
            {
                res.status(200).json({
                    reservation: {
                        _id: reservation._id,
                        bike:{
                            _id: reservation.bike._id,
                            model: reservation.bike.model,
                            color: reservation.bike.color,
                            location: reservation.bike.location,
                            rentable: reservation.bike.rentable,
                            rating: generateBikeRating(reservation.bike)
                        },
                        user:{
                            _id: reservation.user._id,
                            name: reservation.user.name,
                            email: reservation.user.email,
                            role: reservation.user.role
                        },
                        start_date: reservation.start_date,
                        end_date:reservation.end_date
                    }
                })
            }
            else
            {
                res.status(404).send("Reservation not found");
                return;
            }
        }catch(findOneReservationErr)
        {
            res.status(500).send("Error getting reservation")
        }
    }
});

router.post("/", verifyJWT, async ( req, res ) => {
    const newReservation ={
        bike: req.body.bike,
        user: req.user._id,
        start_date: moment(req.body.start_date),
        end_date: moment(req.body.end_date)
    }

    try{
        await Reservation.create(newReservation);
        const allReservations = await Reservation.find({}).populate("bike").populate("user");
        const sanitizedReservations = allReservations.map((reserv)=>{
            return {
                _id : reserv._id,
                bike:{
                    _id: reserv.bike._id,
                    model: reserv.bike.model,
                    color: reserv.bike.color,
                    location: reserv.bike.location,
                    rentable: reserv.bike.rentable,
                    rating: generateBikeRating(reserv.bike)
                },
                user:{
                    _id: reserv.user._id,
                    name: reserv.user.name,
                    email: reserv.user.email,
                    role: reserv.user.role
                },
                start_date: reserv.start_date,
                end_date: reserv.end_date
            }
        })

        res.status(200).json({
            reservations: [...sanitizedReservations]
        })
    }catch(err)
    {
        res.status(500).send("Internal Server error while creating reservation");
    }

});

router.put("/:id",verifyJWT, async ( req, res ) => {
    const newReservation = {
        start_date: moment(req.body.start_date),
        end_date: moment(req.body.end_date)
    }

    try{
        await Reservation.findOneAndUpdate({_id:req.params.id},{$set:{
            ...newReservation
        }})

        const allReservations = await Reservation.find({}).populate("bike").populate("user");

        res.status(200).json({
            reservations: allReservations.map((reserv)=>{
                return {
                    _id: reserv._id,
                    bike:{
                        _id: reserv.bike._id,
                        model: reserv.bike.model,
                        color: reserv.bike.color,
                        location: reserv.bike.location,
                        rentable: reserv.bike.rentable,
                        rating: generateBikeRating(reserv.bike)
                    },
                    user:{
                        _id: reserv.user._id,
                        name: reserv.user.name,
                        email: reserv.user.email,
                        role: reserv.user.role
                    },
                    start_date: reserv.start_date,
                    end_date:reserv.end_date
                }
            })
        })
    }catch(updateReservErr)
    {
        res.status(500).send("Error updating reservation");
    }
});

router.delete("/:id", verifyJWT, async ( req, res ) => {
    try {
        await Reservation.findOneAndDelete( {_id: req.params.id} );
        res.status(200).send('Reservation successfully deleted');
    }catch(err){
        res.status(500).send('Internal Server Error while deleting reservation');
    }
});

module.exports = router;