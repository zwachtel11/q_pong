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

  const matchSchema = new Schema({
    p1_name:String,
    p1_email:String,
    p1_score:Number,
    p2_name:String,
    p2_email:String,
    p2_score:Number,
    room_name:String
  });

  const Match = mongoose.model('Match', matchSchema);



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
    },
    occupied:Number,
    last_open:Date,
    average_use_time:Number,
    average_use_time_count:Number
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


  Room.findOneAndUpdate({room_name: roomName}, {$push:{data_points: dp}, $set:{occupied:req.body.value}}, {safe: true, upsert: true}, (err, model) => {
    if (err) {
      console.log("err");
      res.send({message:"error"});
    }
    Room.findOne({'room_name':roomName}, (err, room) => {
      // console.log(room.daily_graph.data.length);

      if(!room.average_use_time){
        room.average_use_time =  0;
        room.average_use_time_count =0;
        room.last_open = new Date()
      }


      if(room.daily_graph.data.length == 0){
        const graph = [0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2];
        const currentDate = new Date();
        room.daily_graph.data = graph;
        room.daily_graph.updated_at = currentDate;
        if(req.body.value == 0){
          if(room.occupied == 1){
            const time_elapsed = currentDate - room.last_open;
            const new_avg = (time_elapsed + room.average_use_time*room.average_use_time_count)/(room.average_use_time_count+1);
            room.average_use_time_count+=1;
            room.average_use_time = new_avg;
          }
          room.last_open = currentDate;
        }
        room.save((err) =>{
          if(err){
            console.log("Error updating new data");
          }
        })
      }
      else{
        var current_date = new Date()
        if(((current_date.getTime() - room.daily_graph.updated_at.getTime())/1000.0)>3600){
          var datapoints = room.data_points;
          var count = 0;
          var total = 0;
          for (var i =0; i < datapoints.length; i++){
            if(datapoints[i].created_at > room.daily_graph.updated_at){
              total+= datapoints[i].value;
              count++;
            }
          }
          var average = total / count;
          var new_data = room.daily_graph.data.slice(1);
          new_data.push(average);
          room.daily_graph.data = new_data;
          room.daily_graph.updated_at = current_date;
          if(req.body.value == 0){
            if(room.occupied == 1){
              var time_elapsed = currentDate - room.last_open;
              var new_avg = (time_elapsed + room.average_use_time*room.average_use_time_count)/(room.average_use_time_count+1);
              room.average_use_time_count+=1;
              room.average_use_time = new_avg;
            }
            room.last_open = currentDate;
          }
          room.save((err)=>{
            if (err) throw err;
            console.log("Success go team!");
          });
        }
      } 
      console.log("Success");
      res.send({message: "Success"});
    });
  });
});






app.post('/api/matches', (req, res) => {
  var match = new Match({
    'p1_name':req.body.p1_name,
    'p1_email':req.body.p1_email,
    'p1_score':req.body.p1_score,
    'p2_name':req.body.p2_name,
    'p2_email':req.body.p2_email,
    'p2_score':req.body.p2_score,
    'room_name':req.body.room_name
  });
  match.save((err)=>{
    if(err){
      console.log("Error reporting match.")
    }
    res.send({message:"Success"});
  })
})


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
        occupied: room.occupied,
        averageUseTime: room.average_use_time,
        lastOpen: room.lastOpen
      }
    });
    console.log(roomData)
    res.send(roomData);
  })
});

app.get('/api/rooms/:roomname', (req, res) => {
  res.set('Content-Type', 'application/json');
  Room.findOne({room_name: req.params.roomname}, (err, room) => {
    if (err) throw err;
    res.send({
        roomName: room.room_name,
        occupied: room.occupied,
        averageUseTime: room.average_use_time,
        lastOpen: room.last_open
    });
  })
});


app.get('/api/rooms/:room/currentDayDataPoints', (req, res) => {
  res.set('Content-Type', 'application/json');
  //User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
  Room.findOne({"room_name":req.params.room}, (err, doc) => {
    if (err) throw err;
    res.send(doc.daily_graph);
  })
});

app.get('/api/rooms/:room/currentWeekDataPoints', (req,res) => {
  res.set('Content-Type', 'application/json');
  res.send([0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2]);
});


app.get('api/rooms/matches/:room', (req, res) => {
  Match.find({'room_name':req.params.room}, (err, data) => {
    if (err) throw err;

    console.log("found matches for room");
    console.log(data);
    data = data.toArray();
    res.send(data);
    
  });
});






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
