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

const port = process.env.port || 7000
const server = app.listen(port , () => {
    console.log(`Listening on port ${port}`);
});