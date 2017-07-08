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
    room_name: String,
    daily_graph: {
      data:[Number],
      updated_at: Date
    }
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


  Room.findOneAndUpdate({room_name: roomName}, {$push:{data_points: dp}}, {safe: true, upsert: true}, (err, model) => {
    if (err) {
      console.log("err");
      res.send({message:"error"});
    }
    Room.findOne({'room_name':roomName}, (err, room) => {
      console.log(room.daily_graph.data.length);
      if(room.daily_graph.data.length == 0){
        const graph = [0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2];
        room.daily_graph.data = graph;
        room.daily_graph.last_update = new Date();
        room.save((err) =>{
          if(err){
            console.log("Error updating new data");
          }
        })
      }
      else{
        const current_date = new Date()
        if(((current_date.getTime() - room.daily_graph.last_update.getTime())/1000.0)>3600){

          const datapoints = room.datapoints;
          const count = 0;
          const total = 0;
          for (var i =0; i < datapoints.length; i++){
            if(datapoints[i].created_at > room.daily_graph.last_update){
              total+= datapoints[i].value;
              count++;
            }
          }
          const average = count / float(total);
          var new_data = room.daily_graph.slice(1);
          new_data.add(average);
          room.daily_graph.data = new_data;
          room.daily_graph.last_update = current_date;
          room.save((err)=>{
            console.log("Error updating new data");
          });
        }
      } 
      console.log("Success");
      res.send({message: "Success"});
    });
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

app.get('/api/roomdata/:room_name', (req, res) => {
  res.set('Content-Type', 'application/json');
  const roomName = req.params.room_name;
  Room.find({room_name: roomName}, (err, room) => {
    if (err) throw err;
    res.send(room);
  });
});

app.get('/api/rooms', (req, res) => {
  res.set('Content-Type', 'application/json');
  Room.find({}, (err, rooms) => {
    if (err) throw err;
    console.log(rooms);
    const roomData = rooms.map(room => {
      return {
        roomName: room.room_name,
        status: Math.random() > .5 ? 1 : 0
      }
    });
    console.log(roomData)
    res.send(roomData);
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

// app.get('api/:room_name/dailygraph', (req, res)=>{
//   res.set('Content-Type', 'application/json');
//   const roomName = req.params.room_name;
//   const query = {
//     'room_name':roomName,
//   }
//   Room.findOne({'room_name':roomName}, (err, room) =>{
//     if(!room.daily_graph){
//       const graph = [0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2];
//       room.daily_graph.data = graph;
//       room.daily_graph.last_update = new Date();
//       room.save((err) =>{
//         if(err){
//           console.log("Error updating new data");
//         }
//       })
//     }
//     else{
//       current_date = new Date()
//       if(((current_date.getTime() - last_update.getTime())/1000.0)>3600){
//         genNewDailyGraph()
//       }
//     }
//     const last_update = room.daily_graph.last_update;
//     const current_date = new Date()
//     if(!last_update){

//     } else if (((current_date.getTime() - last_update.getTime())/1000.0)>3600){ //3600 seconds in a hour

//     }
//   })
// });



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
