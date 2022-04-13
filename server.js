const express = require("express");
const mongoose = require('mongoose');
require('dotenv/config');

// const routes = require('./routes');

const app = express();

// To handle form and json requrests
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

// app.use(routes);
mongoose
.connect(process.env.MONGO_URL,  { useNewUrlParser: true ,})
.then(() =>   console.log('DataBase Connected Successfully!'))
.catch(err => console.error(err));


const User = require("./models/user.js")
async function run() {
    try{
        const user = await User.create({
            name : 'adel',
            email : 'adel',
            password: 'a'
    
        })
        console.log(user)
    }catch(e) {
        console.log(e.message)
    }
}
run()

const port = process.env.port || 7000
const server = app.listen(port , () => {
    console.log(`Listening on port ${port}`);
});