import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

import Home from './Home.js';
import RoomPage from './RoomPage.js';

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

const Chart = () => (
  <div>
    <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => (`$${x / 1000}k`)}
        />
        <VictoryBar
          data={data}
          x="quarter"
          y="earnings"
        />
      </VictoryChart>
  </div>
)

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

  

  // <li><Link to='/'>Home</Link></li>
  // <li><Link to='/about'>About</Link></li>

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/:roomName" component={RoomPage} />


          <Route path="/about" component={About} />
        </div>
      </Router>
    )
  }
}