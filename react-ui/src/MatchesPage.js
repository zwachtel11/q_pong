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
        <MatchesList roomName={this.props.match.params.roomName} />
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
  	const roomName = this.props.roomName;

  	const query = '/api/rooms/matches/' + roomName;
  	console.log(query);
    fetch(query)
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
          matches: json
        })
      }).catch(e => {
        throw e;
      });
  }

  render() {
  	if (!this.state.matches) {
  		return <div></div>
  	}

  	const sortedMatches = this.state.matches.sort((a,b) => a.created_at > b.created_at );

  	console.log(sortedMatches)

    const mappedMatches = sortedMatches
      ? this.state.matches.map(match => {
        // return <ListGroupItem>{JSON.stringify(match)}</ListGroupItem>
        	return <ListGroupItem>{match.p1_name} {match.p1_score} - {match.p2_score} {match.p2_name}</ListGroupItem>

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