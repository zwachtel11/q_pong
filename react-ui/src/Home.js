import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Jumbotron, Row, Col, Panel } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import logo3 from './logo3.png';
import background from '../public/pingPong2.jpg';

export default class Home extends Component {
  // <a href="https://github.com/you"><img style={{position: "absolute", top: 0, right: 0, border: 0, width: "149px", height: "149px"}} src="http://aral.github.com/fork-me-on-github-retina-ribbons/right-orange@2x.png" alt="Fork me on GitHub" /></a>
 // style={{background:"#005cb3"}}
  // <div style={{textAlign:"center"}}><img src={logo3} width={400} height={430} style={{textAlign:"center"}} /></div>

  render() {
    return (
      <div>
        <Jumbotron>
            <div style={{height:"500px"}}></div>
            <h1 style={{textAlign: "center", color:"white"}}>Welcome to QPong</h1>
        </Jumbotron>
        <RoomList />
      </div>
    )
  }
}
          // <img src="./logo.png"></img>



class RoomList extends Component {
  constructor() {
    super() 
    this.state = {
      rooms: null
    }
  }

  componentDidMount() {
    fetch('/api/rooms')
      .then(response => {
        if (!response.ok) {
          console.log('response')
          console.log(response.status)
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      }).then(json => {
        console.log(json);
        this.setState({
          rooms: json
        })
      }).catch(e => {
        throw e;
      });
  }

  render() {
    const mappedRooms = this.state.rooms
      ? this.state.rooms.map(room => {
        return <ListGroupItem bsStyle={room.occupied ? "danger" : "success"}><Link to={`/rooms/${room.roomName}`}>{room.roomName} - {room.occupied ? "Occupied" : "Open"}</Link></ListGroupItem>
      })
      : <ListGroupItem><Link to="/"></Link></ListGroupItem>

    return (
      <div className="container" style={{paddingTop: "20px"}}>
        <Panel header={<h1>Rooms</h1>}>
          <ListGroup>
            {mappedRooms}
          </ListGroup>
        </Panel>
      </div>
    )
  }

}