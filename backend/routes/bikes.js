const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const isManager = require('../middleware/isManager');
const generateBikeRating = require('../helpers/generateBikeRating');
const Bike = require('../models/Bike');
const Reservation = require("../models/Reservation");
const userRoles = require('../config/user_roles');




router.get("/", verifyJWT, async ( req, res ) => {

    try{
        var foundBikes = await Bike.find({});
        const bikeReservations = await Reservation.find({}).populate("user").populate("bike");
        

        foundBikes = foundBikes.map((bike)=>{
            return {
                _id: bike._id,
                model: bike.model,
                color: bike.color,
                location: bike.location,
                rentable: bike.rentable,
                rating: generateBikeRating(bike),
                reservations : bikeReservations.filter(reserv=> 
                    bike._id.equals(reserv.bike._id)
                ).map((reserv)=>{
                    return {
                        _id : reserv._id,
                        bike: reserv.bike._id,
                        user: {
                            _id:reserv.user._id,
                            name: reserv.user.name,
                            email:reserv.user.email,
                            role:reserv.user.role
                        },
                        start_date: reserv.start_date,
                        end_date: reserv.end_date
                    }
                })
            }
        });
        res.status(200).json(foundBikes);
    }catch(err)
    {
        res.status(500).send("Internal server error while getting bikes");
    }
});

router.get("/:id", verifyJWT, async ( req, res ) => {
    try{
        const foundBike = await Bike.findById(req.params.id);
        const bikeReservations = await Reservation.find({bike:req.params.id}).populate("bike").populate("user");

        if(foundBike)
        {  

            res.status(200).json({
                bike:{
                    _id  : foundBike._id,
                    model: foundBike.model,
                    color: foundBike.color,
                    location: foundBike.location,
                    rentable: foundBike.rentable,
                    rating: generateBikeRating(foundBike),
                    reservations: bikeReservations.map((reserv)=>{
                        return {
                            _id: reserv._id,
                            bike: reserv.bike._id,
                            user: {
                                _id:reserv.user._id,
                                name: reserv.user.name,
                                email:reserv.user.email,
                                role:reserv.user.role
                            },
                            start_date: reserv.start_date,
                            end_date: reserv.end_date
                        }
                    })
                }
            })
        }
        else
        {
            res.status(404).send("Bike not found");
            return;
        }
    }catch(findBikeErr)
    {
        res.status(500).send("Internal server error while getting bike");
    }
});

router.post("/", verifyJWT, isManager, async ( req, res ) => {
    const newBike = {
        model: req.body.model,
        color: req.body.color,
        location: req.body.location,
        rentable: req.body.rentable,
        ratings : []
    }

    if(!newBike.model)
    {
        res.status(400).send("Model is required");
        return;
    }
    if(!newBike.color)
    {
        res.status(400).send("Color is required");
        return;
    }
    if(!newBike.location)
    {
        res.status(400).send("Location is required");
        return;
    }
    if(newBike.rentable === null || newBike.rentable === "undefined")
    {
        res.status(400).send("Rentable parameter is required");
        return;
    }

    try{

        const createdBike = await Bike.create(newBike);
        const allBikes = await Bike.find({});
        const sanitizedBikes = allBikes.map((bike)=>{
            return {
                model: bike.model,
                _id : bike._id,
                color: bike.color,
                location: bike.location,
                rentable: bike.rentable,
                rating : generateBikeRating(bike)
            }
        })

        res.status(200).json({
            bikes: [...sanitizedBikes]
        })
    }catch(newBikeErr)
    {
        res.status(500).send("Internal Server error while creating bike")
    }

});

router.put("/:id",verifyJWT, async ( req, res ) => {
    var newBike={};
    if(req.user.role === userRoles.User)
    {
        newBike = {
            rating:{
                user: req.user._id,
                value:req.body.rating
            }
        }
        if(newBike.rating.value === null || newBike.rating.value === "undefined")
        {
            res.status(400).send("Rating is required");
            return;
        }
        try{
            const userHasProvidedRating = await Bike.find({
                $and:[
                    {_id : req.params.id},
                    { ratings: {$elemMatch : { user: req.user._id }}}
                ]
            });
            if(userHasProvidedRating.length>0)
            {
                await Bike.updateOne(
                    {
                        _id: req.params.id,
                        ratings : {
                            $elemMatch:{
                                user: req.user._id
                            }
                        }
                    }, 
                    {
                        $set:{
                            "ratings.$.value":newBike.rating.value
                        }
                    }
                )
            }
            else
            {
                await Bike.updateOne({_id: req.params.id}, 
                    {$push: {"ratings": {...newBike.rating}}}
                )
            }
            const allBikes = await Bike.find({});
            const bikeReservations = await Reservation.find({}).populate("user").populate("bike");

            
            const sanitizedBikes = allBikes.map((bike)=>{
                return {
                    _id  : bike._id,
                    model: bike.model,
                    color: bike.color,
                    location: bike.location,
                    rentable : bike.rentable,
                    userRating : bike.ratings.find(rate => rate.user.equals(req.user._id)),
                    rating: generateBikeRating(bike),
                    reservations : bikeReservations.filter(reserv=> 
                        bike._id.equals(reserv.bike._id)
                    ).map((reserv)=>{
                        return {
                            _id : reserv._id,
                            bike: reserv.bike._id,
                            user: {
                                _id:reserv.user._id,
                                name: reserv.user.name,
                                email:reserv.user.email,
                                role:reserv.user.role
                            },
                            start_date: reserv.start_date,
                            end_date: reserv.end_date
                        }
                    })
                }
            })
            res.status(200).json({
                bikes:[...sanitizedBikes]
            })
        }catch(updatedRatingErr)
        {
            res.status(500).send("Internal Server error while adding rate");
        }
    }
    else if (req.user.role === userRoles.Manager)
    {
        newBike = {
            model: req.body.model,
            color: req.body.color,
            location: req.body.location,
            rentable: req.body.rentable
        }
        if(!newBike.model)
        {
            res.status(400).send("Model is required");
            return;
        }
        if(!newBike.color)
        {
            res.status(400).send("Color is required");
            return;
        }
        if(!newBike.location)
        {
            res.status(400).send("Location is required");
            return;
        }
        if(newBike.rentable === null || newBike.rentable === "undefined")
        {
            res.status(400).send("Rentable parameter is required");
            return;
        }

        try{
            await Bike.findOneAndUpdate({_id:req.params.id}, {$set:{
                ...newBike
            }})
            const allBikes = await Bike.find({});
            const sanitizedBikes = allBikes.map((bike)=>{
                return {
                    _id  : bike._id,
                    model: bike.model,
                    color: bike.color,
                    location: bike.location,
                    rentable : bike.rentable,
                    rating: generateBikeRating(bike),
                }
            });
            res.status(200).json({
                bikes:[...sanitizedBikes]
            })

        }catch(updatedBikeErr)
        {
            res.status(500).send("Internal Server error while editing bike");
        }
    }
    else
    {
        res.status(401).send("You are not authorized to perform this action");
        return;
    }
});

router.delete("/:id", verifyJWT, isManager, async ( req, res ) => {
    try {
        await Reservation.deleteMany({bike: req.params.id});
        await Bike.findOneAndDelete( {_id: req.params.id} );
        const allBikes = await Bike.find({});
        const sanitizedBikes = allBikes.map((bike)=>{
            return {
                _id  : bike._id,
                model: bike.model,
                color: bike.color,
                location: bike.location,
                rentable : bike.rentable,
                rating: generateBikeRating(bike)
            }
        })
        res.status(200).json({
            bikes: [...sanitizedBikes]
        });
    }catch(err){
        res.status(500).send('Internal Server Error while deleting bike');
    }
});

module.exports = router;