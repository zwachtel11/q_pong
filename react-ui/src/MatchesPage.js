import React, { Component } from 'react';

import { ListGroup, ListGroupItem, Jumbotron, Table } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const moment = require('moment');
import './index.css';


export default class MatchesPage extends Component {
  render() {
    return (
      <div className="container">
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

    const mappedMatchRows = sortedMatches.map(match => {
      const p1Winner = match.p1_score > match.p2_score;
      return (
        <tr>
          <td>{moment(match.time).calendar()}</td>
          <td className={p1Winner ? "winner" : "loser"}>{match.p1_name}</td>
          <td className={p1Winner ? "winner" : "loser"}>{match.p1_score}</td>
          <td className={p1Winner ? "winner" : "loser"}>{match.p2_score}</td>
          <td className={p1Winner ? "winner" : "loser"}>{match.p2_name}</td>
        </tr>
        )
      }
    )

    return (
      <Table hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Player 1</th>
            <th>P1 Score</th>
            <th>P2 Score</th>
            <th>Player 2</th>
          </tr>
        </thead>
        <tbody>
          {mappedMatchRows}
        </tbody>
      </Table>
    )
  }

}