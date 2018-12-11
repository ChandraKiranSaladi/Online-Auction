const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Compression = require('compression');
const helmet = require("helmet");
// const expressValidator = require('express-validator');

const userRouter = require('./routers/userRouter');
const itemRouter = require('./routers/itemRouter');
const scheduleRouter = require('./routers/scheduleRouter');
const bidRouter = require('./routers/bidRouter');

const mongooseURI = 'mongodb://localhost:27017/Online-Auction';
const app = express();

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

//Essential for setting http headers
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

// very useful to expose one folder to the world
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(Compression());
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Encoding");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
  next();
})

//automatically creates Online-Auction database in MongoDB, if already presents, it uses
// if not it creates one

mongoose.connect(mongooseURI, {
  useNewUrlParser: true
})
  .then(() => {
    console.log("Connected to database at 27017");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/bid',bidRouter);

module.exports = app;