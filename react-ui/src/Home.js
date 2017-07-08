import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Jumbotron>
          <h1 style={{textAlign: "center"}}>Welcome to Q Ping Pong</h1>
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
        return <ListGroupItem bsStyle={room.occupied ? "danger" : "success"}><Link to={`rooms/${room.roomName}`}>{room.roomName + " - " + room.occupied}</Link></ListGroupItem>
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