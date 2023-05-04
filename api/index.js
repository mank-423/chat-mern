const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userModel = require('./models/User');
const jwt = require('jsonwebtoken');
//require('dotenv').config()


dotenv.config()
//console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);
const jwtSecret = process.env.JWT_SECRET;

const app = express();

app.get('/test', (req, res) => {
    res.json('Test ok');
})

app.post('/register', async(req, res)=>{
    const {username, password} = req.body;
    const createdUser = await User.create({username, password}); //Using await with promises
    jwt.sign({userId:createdUser, _id}, jwtSecret, (err, token) => {
        if (err) throw(err)
        res.cookie('token', token).status(201).json('ok');
    }) //Second approach to deal with promise
})

app.listen(4000, ()=>{
    console.log("Listening on port 4000");
});