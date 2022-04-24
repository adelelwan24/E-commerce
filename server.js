const express = require("express");
const mongoose = require('mongoose');
require('dotenv/config');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./routes/verifyToken')

const routes = require('./routes');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));       // for parsing application/x-www-form-urlencoded 
app.use(express.json());                                // for parsing application/json
app.use(cookieParser())                                 // for parsing cookies
app.use(routes);                                        // the routes
app.use(expressLayouts)

// view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views")
app.set('layout', 'layouts/layout')

mongoose
.connect(process.env.MONGO_URL,  { useNewUrlParser: true ,})
.then(() =>   console.log('DataBase Connected Successfully!'))
.catch(err => console.error(err));

const port = process.env.port || 7000
app.listen(port , () => {
    console.log(`Listening on port ${port}`);
});

// rendering pages
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',verifyToken, (req, res) => res.render('smoothies'));
app.get("/login", (req,res) => {res.render('login')})
app.get("/register", (req,res) => {res.render('signup')})
