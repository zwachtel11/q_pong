![Logo](images/logo.png)

# QPong

QPong is a timesaving IoT platform that allows Qualcomm employees to check the availability of recreational spaces on campus.  A Raspberry Pi in the room processes real-time motion sensor data with a Python script and sends it to a central Node.js API, which stores it in a Mongo database.  Users can access QPong on the desktop with a React-developed web app or on mobile through the QPong iOS app.

![Demo](/images/qpongdemo.gif)

## Getting Started

These instructions will get you a copy of the project up and running. Note: You will need to make modifications in several spots to match your setup. (A few spots are the database address, room name, and GPIO pins on the Python script)

### Prerequisites

**Raspberry Pi running Raspbian**

Install Python on the Pi

```
sudo apt-get install python3
```
#### Python Packages to Install

* [Requests](http://docs.python-requests.org/en/master) 
```
sudo pip install requests
```
* [RPi.GPIO](https://pypi.python.org/pypi/RPi.GPIO)
```
sudo pip install RPi.GPIO
```
#### Set up a server on your favorite cloud hosting service - we'll show how to set up on Heroku ####
* [Follow Heroku's guide to set up a Node.js application](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
* [Connect your Heroku application to a MongoDB service, we're using MLab](https://elements.heroku.com/addons/mongolab)

#### Node.JS packages to Install
* [Express.js](https://expressjs.com/)
```
npm install --save express
```
* [Body-Parser](https://github.com/expressjs/body-parser)
```
npm install --save body-parser
```


## Deployment

First set up the Heroku application. Then test out the motion sensor on the Raspberry Pi. Then see how they work together!

## Built With

* [Heroku](http://www.heroku.com) - Used for hosting our application
* [Node.js](https://nodejs.org/) - Runs our backend
* [Express.js](expressjs.com) - Middleware for backend
* [React.js](https://facebook.github.io/react/) - Used for front-end of application
* [Python](python.org) - Used to run code on the Raspberry Pi
* [Request](http://docs.python-requests.org/en/master/) - Used to generate HTTP requests from Python


## Authors

* **Sam Ford** - [Github](https://github.com/samford100)
* **Tony Oliverio** - [Github](https://github.com/toliv)
* **Zach Wachtel** - [Github](https://github.com/zwachtel)
* **Brian Worek** - [Email](briandw@vt.edu)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Qualcomm 
* Big Baller Brand
