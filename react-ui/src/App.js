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



const About = () => (
  <div>
    <h2>About</h2>
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
            <Link to="/"><span>Home</span></Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem><Link to="/"><span>Report Match</span></Link></NavItem>
          <NavItem style={{float: "right"}}><Link to="/"><span>About</span></Link></NavItem>
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