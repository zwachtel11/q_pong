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
    <p>Created by Sam Ford, Tony Oliverio, Zach Wachtel, and hardware guy at the 2017 Qualcomm Hack Mobile</p>
  </div>
)

class Routerr extends Component {
  render() {
    return (
      <Router>    
        <div>
          <Naver />
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
          <NavItem><Link to="/about"><h3>Github</h3></Link></NavItem>
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