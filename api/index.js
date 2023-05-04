const express = require('express');
const dotenv = require('dotenv');
//require('dotenv').config()

dotenv.config()

const mongoUrl = "";

const app = express();

app.get('/test', (req, res) => {
    res.json('Test ok');
})

app.post('/register', (req, res)=>{

})

app.listen(4000, ()=>{
    console.log("Listening on port 4000");
});