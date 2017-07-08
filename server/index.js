const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
  Set up mongo
*/

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://sam:pass@ds145312.mlab.com:45312/heroku_gbvm74zg');

var Schema = mongoose.Schema;

/**
  Datapoints
*/

const dataPointSchema = new Schema({
  value: Number,
  created_at: Date,
  room_name: String
});

const DataPoint = mongoose.model('DataPoint', dataPointSchema);

app.post('/api/roomdata', (req, res) => {
  res.set('Content-Type', 'application/json');
  console.log('got da dp');
  console.log(req.body);
  const dp = DataPoint({
    value: req.body.value,
    room_name: req.body.room_name,
    created_at: new Date()
  });

  dp.save(err => {
    if (err) {
      throw err;
      res.send("Error");
    }
    console.log("saved dat bitch");
    res.send("Posted dat bitch");
  });
});

app.get('/api/roomdata', (req, res) => {
  res.set('Content-Type', 'application/json');
  DataPoint.find({}, (err, dataPoints) => {
    if (err) throw err;
    res.send(dataPoints);
  })
});

app.get('/api/roomdata/:room_name', (req, res) => {
  res.set('Content-Type', 'application/json');
  DataPoint.find({room_name: req.params.room_name}, (err, dataPoints) => {
    if (err) throw err;
    res.send(dataPoints);
  })
});


// app.get('/api/currentWeekDataPoints', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   //User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
//   DataPoint.find({}).where('value').gt(5).exec((err, dataPoints) => {
//     if (err) throw err;
//     res.send(dataPoints);
//   })
// })

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


/**
 End Datapoints
*/


// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
