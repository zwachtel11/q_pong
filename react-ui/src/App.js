import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
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
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import qpong from './qpong3.png';


const About = () => (
  <div className="container">
    <h1>About</h1>
    <p>Created by Sam Ford, Tony Oliverio, Zach Wachtel, and Brian Worek at the 2017 Qualcomm Hack Mobile Hackathon.</p>
    <p>We will be presenting this application in the N Lecture Hall on July 27th. Come check it out and vote for QPong if you've found this useful!</p>
  </div>
)

const Github = () => (
  <div className="container">
    <h1>Github</h1>
  </div>
)

class Routerr extends Component {
  render() {
    return (
      <Router>    
        <div>
          <Naver />
          <Route exact path="/" component={Home} />
          <Route path='/rooms/:roomName/reportMatch' component={ReportMatchPage} />
          <Route exact path="/rooms/:roomName" component={RoomPage} />
          <Route exact path='/rooms/:roomName/matches' component={MatchesPage} />
          <Route path="/about" component={About} />
          <Route path="/github" component={Github} />
          <Route path="/roomsetup" component={RoomSetup} />
        </div>
      </Router>
    )
  }
}

const RoomSetup = () => (
  <div className="container">
    <h1>Room Setup</h1>
    <p>Have a room you want setup? Have a spare dragonboard or raspberry pi?</p>
    <p>Send us an email at sford@qti.qualcomm.com</p>
  </div>
)



class Naver extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/"><span style={{fontSize: "40px"}}><img src={qpong} height={70} width={146} /></span></Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav >
          <NavItem><Link to="/about"><h3>About</h3></Link></NavItem>
          <NavItem><Link to="/roomsetup"><h3>Request Room Setup</h3></Link></NavItem>
          <NavItem><Link to="/github"><h3>Github</h3></Link></NavItem>
        </Nav>
      </Navbar>
    )
  }
}



export default class App extends Component {
  render() {
    return (
      <Routerr />
    )
  }
}