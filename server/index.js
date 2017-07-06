const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser')

//test

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://sam:pass@ds145312.mlab.com:45312/heroku_gbvm74zg');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	  name: String,
	  username: { type: String, required: true, unique: true },
	  password: { type: String, required: true },
	  admin: Boolean,
	  location: String,
	  meta: {
		      age: Number,
		      website: String
		    },
	  created_at: Date,
	  updated_at: Date
});

userSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.create_at) {
		this.created_at = currentDate;
	}
	next();
});

userSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};

const User = mongoose.model('User', userSchema);


const dataPointSchema = new Schema({
  value: Number,
  created_at: Date
});

const DataPoint = mongoose.model('DataPoint', dataPointSchema);


// var chris = new User({
//   name: 'Chris',
//   username: 'suvilayha',
//   password: 'password' 
// });

// chris.dudify(function(err, name) {
//   if (err) throw err;

//   console.log('Your new name is ' + name);
// });

//chris.save(function(err) {
//  if (err) throw err;

  //console.log('User saved successfully!');
//});


// const sam = User({
// 	name: 'Sam Ford',
// 	username: 'samtest',
// 	password: 'password',
// 	admin: true
// });

// sam.save(err => {
// 	if (err) throw err;
// 	console.log('User created');
// })

//newUser.save(err => {
//	if (err) throw err;
//	console.log('User created');
//});


// User.find({}, (err, users) => {
// 	if (err) throw err;
// 	console.log(users);
// });


// User.find({username:"starlord55"}, (err, user) => {
// 	if (err) throw err;
// 	console.log(user);
// });

// User.findById("595832173d9bdc69c713d13c", (err, user) => {
// 	if (err) throw err;
// 	console.log(user);
// });

// var monthAgo = new Date();
// monthAgo.setMonth(monthAgo.getMonth() - 1);

//User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
//	  if (err) throw err;

//	   console.log(users);
//	});


// User.findById("595832173d9bdc69c713d13c", (err, user) => {
// 	if (err) throw err;

// 	user.location = "uk";

// 	user.save((er) => {
// 		if (err) throw err;
// 		console.log('User successfully updated');
// 	});
// });


// User.findOneAndUpdate({username: 'starlord55'}, {username: 'startlord88'}, (err, user) => {
// 	if (err) throw err;

// 	console.log(user);
// });


// User.findOneAndRemove({ username: 'starlord55' }, function(err) {
//   if (err) throw err;

//   // we have deleted the user
//   console.log('User deleted!');
// });

//end test

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Answer API requests.
// app.get('/api', function (req, res) {
//   res.set('Content-Type', 'application/json');
//   res.send('{"message":"Hello from the custom server!"}');
// });

//test API

app.get('/api/users', (req, res) => {
  res.set('Content-Type', 'application/json');
  User.find({}, (err, users) => {
  	if (err) throw err;
  	console.log("users ::: ");
  	console.log(users);
  	res.send(users);
  });
});

app.post('/api/dataPoints', (req, res) => {
  res.set('Content-Type', 'application/json');
  console.log('got da dp');
  console.log(req.body);
  const dp = DataPoint({
    value: req.body.value,
    created_at: new Date()
  });

  dp.save(err => {
    if (err) throw err;
    console.log("saved dat bitch");
  });
});

app.get('/api/currentWeekDataPoints', (req, res) => {
  res.set('Content-Type', 'application/json');
  //User.find({ admin: true }).where('updated_at').gt(monthAgo).exec(function(err, users) {
  DataPoint.find({}).where('value').gt(5).exec((err, dataPoints) => {
    if (err) throw err;
    res.send(dataPoints);
  })
})
  


//End test API

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
