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
});

const DataPoint = mongoose.model('DataPoint', dataPointSchema);


const roomSchema = new Schema({
  data_points: [{
    value: Number,
    created_at: Date
  }],
  room_name: String
});

const Room = mongoose.model('Room', roomSchema);

app.post('/api/roomdata', (req, res) => {
  res.set('Content-Type', 'application/json');

  const roomName = req.body.room_name;

  // const dp = DataPoint({
  //   value: req.body.value,
  //   created_at: new Date()
  // });

  const dp = {
    value: req.body.value,
    created_at: new Date()
  };

  Room.findAndUpdate({room_name: roomName}, {$push:{data_points: dp}}, {safe: true, upsert: true}, (err, model) => {
    if (err) {
      console.log("err");
      res.send({message:"error"});
    }
    console.log("Success");
    res.send({message: "Success"});
  });
});





// app.post('/api/roomdata', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   console.log('got da dp');
//   console.log(req.body);
//   const dp = DataPoint({
//     value: req.body.value,
//     created_at: new Date()
//   });

//   dp.save(err => {
//     if (err) {
//       throw err;
//       res.send({message: "Error"});
//     }
//     console.log("saved dat bitch");
//     res.send({message: "Success"});
//   });
// });

// app.get('/api/roomdata', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   DataPoint.find({}, (err, dataPoints) => {
//     if (err) throw err;
//     res.send(dataPoints);
//   })
// });

app.get('/api/roomdata/:room_name', (req, res) => {
  res.set('Content-Type', 'application/json');
  DataPoint.find({room_name: req.params.room_name}, (err, dataPoints) => {
    if (err) throw err;
    res.send(dataPoints);
  })
});

app.get('/api/rooms', (req, res) => {
  res.set('Content-Type', 'application/json');
  // DataPoint.aggregate({})
});


// app.get('/api/currentWeekDataPoints', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   //User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
//   DataPoint.find({}).where('value').gt(5).exec((err, dataPoints) => {
//     if (err) throw err;
//     res.send(dataPoints);
//   })
// })


/**
 End Datapoints
*/

/**

*/

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
