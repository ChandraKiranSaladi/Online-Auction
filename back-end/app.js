const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongooseURI = 'mongodb://localhost:27017/Online-Auction';

const app = express();

//Essential for setting http headers
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  next();
})

//automatically creates Online-Auction database in MongoDB, if already presents, it uses
// if not it creates one

mongoose.connect(mongoURI, {
  useNewUrlParser: true
})
.then(() => {
  console.log("Connected to database at 27017");
})
.catch(() => {
  console.log("Connection failed");
});



app.post('/api/signup'), (req, res, next) => {

};

app.get('/api/userdetails', (req, res, next) => {

});



module.exports = app;