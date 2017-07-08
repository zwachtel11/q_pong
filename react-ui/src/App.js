import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import ReactDOM from 'react-dom';

import Home from './Home.js';
import RoomPage from './RoomPage.js';
import ReportMatchPage from './ReportMatchPage';
import MatchesPage from './MatchesPage';



const About = () => (
  <div>
    <h2>About</h2>
  </div>
)


export default class App extends Component {

  // fetch('/api/dataPoints', {
  //     method: 'post',
  //     body: JSON.stringify(dp),
  //     headers: {
  //               "Content-Type": "application/json"
  //           }
  //   }).then(res => {
  //     return res.json();
  //   }).then(json => {
  //     console.log(json);
  //   })

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path='/reportMatch' component={ReportMatchPage} />
          <Route exact path="/rooms/:roomName" component={RoomPage} />
          <Route exact path='/matches/:roomName' component={MatchesPage} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    )
  }
}