const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const ws = require('ws');
//require('dotenv').config()

dotenv.config()

mongoose.connect(process.env.MONGO_URI);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.get('/test', (req, res) => {
    res.json('Test ok');
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData)
        });
    } else {
        res.status(401).json('no token');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });

    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                    id: foundUser._id,
                });
            });
        }
    }

})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {

        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username,
            password: hashedPassword,
        }); //Using await with promises
        //jwt payloads are userid, username
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw (err)
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            });
        }) //Second approach to deal with promise
    }
    catch (error) {
        if (error) throw error
        res.status(500).json("error");
    }

});

const server = app.listen(4040, () => {
    console.log("Listening on port 4040");
});

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, req) => {
    
    //Read username and id from the cookie for this connection
    const cookies = req.headers.cookie;

    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));

        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];

            if (token){
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    const {userId, username} = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }

    connection.on('message', (message)=>{
        const messageData = JSON.parse(message.toString());
        
        const {recepient, text} = messageData;

        if (recepient && text){
            [...wss.client]
                .filter(c => c.userId === recepient)
                .forEach(c=> c.send(JSON.stringify({text})))
        }
    });

    //Notify everyone about online people (when someone connects)
    //[...wss.clients].map(c => ({userId:c.userId, username: c.username}))
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({userId:c.userId, username: c.username})),
        }))
    })
});