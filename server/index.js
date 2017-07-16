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
    weekly_graph: {
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

      //null check for first time a datapoint is added to a room
      if (!room.weekly_graph) {
        room.weekly_graph.data = [.1,.1,.1,.1,.1,.1,.1];
        room.weekly_graph.updated_at = dp.created_at;
        console.log('no weekly graph');
        room.save((err) =>{
          if(err){
            console.log("Error updating week data");
          }
          res.status(200).end();
        })
      }


      if(!room.daily_graph) { 
        room.average_use_time =  0;
        room.average_use_time_count = 1; // one sample in the database
        room.last_open = dp.create_at;
        const currentDate = dp.created_at;
        room.daily_graph.data = [0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.2, 0.5, 0.5, 0.6, 0.75, 0.4, 0.2, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
        room.daily_graph.updated_at = currentDate;
        room.occupied = dp.value;

        // if(req.body.value == 0) { //room currently not in use
        //   if(room.occupied == 1) { //room was in use last datapoint
        //     const time_elapsed = currentDate - room.last_open;
        //     const new_avg = (time_elapsed + room.average_use_time*room.average_use_time_count)/(room.average_use_time_count+1);
        //     room.average_use_time_count += 1;
        //     room.average_use_time = new_avg;
        //     room.occupied = 0;
        //     room.last_open = currentDate;
        //   }
        // }
        room.save((err) =>{
          if(err){
            console.log("Error updating new data");
          }
          res.status(200).end();
        })
      } else {
        var currentDate = new Date();

        //if the weekly graph hasnt't been updated in 1 day
        if(((currentDate.getTime() - room.weekly_graph.updated_at.getTime())/1000.0) > 3600*24) {
          //condense daily graph to a single point average
          const dailyAverage = room.daily_graph.data.reduce((sum, val) => sum + val) / 24;
          console.log(dailyAverage);

          const newWeek = room.weekly_graph.data.slice(1);
          newWeek.push(dailyAverage);
          room.weekly_graph = newWeek;
          room.weekly_graph.updated_at = currentDate;
        }


        // if the daily graph hasn't been updated in 60 minutes (3600 seconds)
        if(((currentDate.getTime() - room.daily_graph.updated_at.getTime())/1000.0) > 3600) {
          var datapoints = room.data_points;
          room.data_points = []; // we can clear out the array once we have downsampled to a single hourly datapoint
          // var count = 0;
          // var total = 0;

          const total = datapoints.reduce((sum, elem) => { return sum + elem.value }, 0);
          const count = datapoints.length;

          // for (var i =0; i < datapoints.length; i++) {
          //   // if(datapoints[i].created_at > room.daily_graph.updated_at){
          //     total+= datapoints[i].value;
          //     count++;
          //   // }
          // }
          var average = total / count;
          var new_data = room.daily_graph.data.slice(1); // [0] | [1,...23] slices off the first value
          new_data.push(average); // [1...23]|[average]
          room.daily_graph.data = new_data;
          room.daily_graph.updated_at = currentDate;

          // if it went from occupied to open - we need to calculate time elapsed

          //open -> open
            //set last_open to now

          //open -> occupied
            //nothing
          //occupied -> open
            //set time elapsed and everything else
          //occupied -> occupied
            //nothing

          if(dp.value == 0) { // if room is currently empty
            if(room.occupied == 1) { // if room was just occupied
              // now we need to update time elapsed
              var time_elapsed = currentDate - room.last_open;
              var new_avg = (time_elapsed + room.average_use_time*room.average_use_time_count)/(room.average_use_time_count+1);
              room.average_use_time_count += 1; //count the number of samples in the average
              room.average_use_time = new_avg;
            }
            room.last_open = currentDate;
          }
          room.save((err) => {
            if (err) throw err;
            console.log("Successfully saved room data!");
          });
        }
      } 
      console.log("Successfully posted point");
      res.status(200).end();
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

app.get('/api/rooms/:room/currentWeekDataPoints', (req, res) => {
  res.set('Content-Type', 'application/json');
  //User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
  Room.findOne({"room_name":req.params.room}, (err, doc) => {
    if (err) throw err;
    res.send(doc.weekly_graph);
  })
});

app.get('/api/rooms/matches/:room', (req, res) => {
  Match.find({room_name:req.params.room}, (err, data) => {
    if (err) throw err;
    console.log("found matches for room");
    console.log(data);
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
