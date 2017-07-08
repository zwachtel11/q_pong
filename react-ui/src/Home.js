import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import logo2 from './logo2.png';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Jumbotron style={{background:"#005cb3"}}>
          <div style={{textAlign:"center"}}><img src={logo2} width={200} height={200} style={{textAlign:"center"}} /></div>
          <h1 style={{textAlign: "center", color:"white"}}>Welcome to Q Ping Pong</h1>
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
        return <ListGroupItem bsStyle={room.occupied ? "danger" : "success"}><Link to={`rooms/${room.roomName}`}>{room.roomName + " - " + room.occupied ? "Occupied" : "Open"}</Link></ListGroupItem>
      })
      : <ListGroupItem><Link to="asdf"></Link></ListGroupItem>

    return (
      <div className="container">
        <ListGroup>
          {mappedRooms}
        </ListGroup>
      </div>
    )
  }

}