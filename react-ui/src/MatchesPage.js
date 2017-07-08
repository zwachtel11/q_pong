import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Jumbotron } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export default class MatchesPage extends Component {
  render() {
    return (
      <div className="container-fluid">
      	<h1 style={{textAlign: "center"}}>Matches for room {this.props.match.params.roomName}</h1>
        <MatchesList />
      </div>
    )
  }
}


class MatchesList extends Component {
  constructor() {
    super() 
    this.state = {
      matches: null
    }
  }

  componentDidMount() {
  	const roomName = this.props.match.params.roomName;

  	const query = '/api/rooms/' + roomName;
  	console.log(query);
    fetch('/api/rooms/')
      .then(response => {
        if (!response.ok) {
          console.log('response');
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
    const mappedMatches = this.state.matches
      ? this.state.matches.map(match => {
        return <ListGroupItem>{JSON.stringify(match)}</ListGroupItem>
      })
      : <ListGroupItem></ListGroupItem>

    return (
      <div className="container">
        <ListGroup>
          {mappedMatches}
        </ListGroup>
      </div>
    )
  }

}