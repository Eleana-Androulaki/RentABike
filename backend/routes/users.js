const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const verifyJWT = require('../middleware/verifyJWT');
const userRoles = require('../config/user_roles');
const isManager = require('../middleware/isManager');
const generateBikeRating = require('../helpers/generateBikeRating');
const dotenv = require("dotenv");
dotenv.config()




router.get("/", verifyJWT, isManager, async ( req, res ) => {
    try{
        const foundUsers = await User.find({});
        var sanitizedUsers = foundUsers.map((user)=>{
            return {
                _id : user._id,
                name: user.name,
                email: user.email,
                role : user.role
            }
        })
        res.status(200).json(sanitizedUsers);
    }catch(err)
    {
        res.status(500).send("Internal server error while getting users");
    }

});

router.get("/loggedInUser",verifyJWT, async(req,res)=>{
    
    if(req.user)
    {
        res.status(200).json({
            user: {...req.user}
        });
    }
    else
    {
        res.status(500).send("Error while fetching user")
    }
});

router.get("/:id",verifyJWT, async ( req, res ) => {
    //if I'm looking at my profile or if I am a manager
    if((req.params.id === req.user._id) || (req.user.role === userRoles.Manager) )
    {

        try{
            const foundUser = await User.findById(req.params.id);
            const userReservations = await Reservation.find({user:req.params.id}).populate("bike").populate("user");
            if(foundUser)
            {
                res.status(200).json({
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                    _id: foundUser._id,
                    reservations: userReservations.map((reserv)=>{
                        return {
                            _id: reserv._id,
                            bike:{
                                _id: reserv.bike._id,
                                model: reserv.bike.model,
                                color: reserv.bike.color,
                                location: reserv.bike.location,
                                rentable: reserv.bike.rentable,
                                userRating: reserv.bike.ratings.find((rate)=> rate.user.equals( foundUser._id)),
                                rating: generateBikeRating(reserv.bike)
                            },
                            start_date : reserv.start_date,
                            end_date : reserv.end_date
                        }
                    })
                })
            }
            else
            {
                res.status(404).send("Could not find user");
            }
            
        }
        catch(findUserErr)
        {
            res.status(500).send("Internal server error while fetching user");
        }
    }
    else
    {
        res.status(401).send("You are not authorized to perform this action");
        return;
    }
    
});



router.post("/register", async ( req, res ) => {

    let newUser = {
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        role : userRoles.User
    }

    if(!newUser.email)
    {
        res.status(400).send("Email is required");
        return;
    }

    if(!newUser.password)
    {
        res.status(400).send("Password is required");
        return;
    }

    try{
        const foundUser = await User.findOne({email: newUser.email});
        if(foundUser)
        {
            res.status(409).send("User with this email already exists");
            return;
        }
    }catch(foundUserErr){
        res.status(500).send("Internal Server error while looking for user");
    }

    try{
        const createdUser = await User.create(newUser);
        res.status(200).json({
            name : createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
            _id : createdUser._id
        });
    }catch(createUserErr){
        res.status(500).send("Internal Server error while creating user");
    }
});


router.post("/", verifyJWT, isManager, async ( req, res ) => {
    let newUser = {
        name: req.body.name || '',
        email: req.body.email,
        password:req.body.password,
        role : req.body.role
    }

    if(!newUser.email)
    {
        res.status(400).send("Email is required");
        return;
    }

    if(!newUser.password)
    {
        res.status(400).send("Password is required");
        return;
    }

    if(!Object.values(userRoles).includes(newUser.role))
    {
        res.status(400).send("Role isn't one of the available");
        return;
    }

    try{
        const foundUser = await User.findOne({email: newUser.email});
        if(foundUser)
        {
            res.status(409).send("User with this email already exists");
            return;
        }
    }catch(foundUserErr){
        res.status(500).send("Internal Server error while looking for user");
    }

    try{
        const createdUser = await User.create(newUser);
        const allUsers = await User.find({});
        const usersToBeSent = allUsers.map((user)=>{
            return {
                name : user.name,
                email: user.email,
                role: user.role,
                _id : user._id
            }
        })
        res.status(200).json({
            users : [...usersToBeSent]
        });
    }catch(createUserErr){
        res.status(500).send("Internal Server error while creating user");
    }
    
});

router.post("/login", async (req, res) =>{
    const userToLogIn = {
        email: req.body.email,
        password : req.body.password
    }

    if(!userToLogIn.email || !userToLogIn.password)
    {
        res.status(400).send("Email and password are required");
        return;
    }

    try{
        const foundUser = await User.findOne({email:userToLogIn.email});
        if(!foundUser)
        {
            res.status(401).send("Invalid user credentials");
            return;
        }
        foundUser.comparePassword(userToLogIn.password, (err, matches)=>{
            if(err)
            {
                res.status(500).send("Internal Server error while signing user in");
                return;
            }
            if(!matches)
            {
                res.status(401).send("Invalid user credentials");
                return;
            }
            else
            {
                const payload = {
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role
                };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token)=>{
                        if(err)
                        {
                            return res.status(500).send("Internal Server error while signing user in");
                            
                        }
                        return res.status(200).json({
                            user: {
                                ...payload
                            },
                            token: `Bearer ${token}`
                        })
                    }
                )
            }
        })
    }catch(findUserErr){
        res.status(500).send("Internal Server error while signing user in");
    }
});

router.put("/:id", verifyJWT, async ( req, res ) => {
    
    const newUser = {
        name: req.body.name,
        role: req.body.role
    }
    
    if(req.body.email)
    {
        try{
            const foundUser = await User.findOne({email:req.body.email});
            if(foundUser && !foundUser._id.equals(req.params.id))
            {
                res.status(400).send("Email already exists");
                return;
            }
            else
            {
                newUser['email'] = req.body.email;
            }
        }catch(findByEmailErr){
            res.status(500).send("Internal Server Error while updating user")
        }
    }

    if(newUser.role!==userRoles.User && newUser.role!==userRoles.Manager)
    {
        res.status(400).send("Role should be either User or Manager");
        return;
    }

    if(req.params.id === req.user._id) //I am editing myself
    {

        try{
            await User.findOneAndUpdate({_id:req.params.id},{$set: {...newUser}});
            const updatedUser = await User.findById(req.params.id);
            res.status(200).json({
                updatedUser:{
                    name: updatedUser.name,
                    email: updatedUser.email,
                    _id: updatedUser._id,
                    role: updatedUser.role
                }
            })
        }catch(updatedUserErr)
        {
            res.status(500).send("Internal server error while updating user")
        }
    }
    else
    { // I am a manager editing another user
        
        if(req.user.role === userRoles.Manager)
        {

            try{
                await User.findOneAndUpdate({_id:req.params.id},{$set: {...newUser}});
                
                const allUsers = await User.find({});
                const usersToBeSent = allUsers.map((user)=>{
                    return {
                        name: user.name,
                        email: user.email,
                        _id: user._id,
                        role: user.role
                    }
                })
    
    
                res.status(200).json({users: [...usersToBeSent]})
            }catch(updatedUserErr)
            {
                res.status(500).send("Internal server error while updating user");
            }
        }
        else
        {
            res.status(401).send("You are not authorized to perform this action");
        }
    }

});

router.delete("/:id", verifyJWT, isManager, async ( req, res ) => {
    try {
        await Reservation.deleteMany({user: req.params.id})
        await User.findOneAndDelete( {_id: req.params.id} );
        const allUsers = await User.find({});
        const sanitizedUsers = allUsers.map((user)=>{
            return {
                _id : user._id,
                name: user.name,
                email: user.email,
                role : user.role
            }
        })
        
        res.status(200).json({
            users: [...sanitizedUsers]
        });
    }catch(err){
        res.status(500).send('Internal Server Error while deleting user');
    }
});

module.exports = router;