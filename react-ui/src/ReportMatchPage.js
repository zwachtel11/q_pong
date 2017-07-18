import React, { Component } from 'react';
import { Panel, Col, Row, Button, FormGroup, ControlLabel, FormControl, FormControlsSelect, FieldGroup, InputGroup } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export default class ReportMatchPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			p1Name: null,
			p1Score: null,
			p2Name: null,
			p2Score: null,
			roomName: props.match.params.roomName
		}
	}

	handleSubmit = (event) => {
		event.preventDefault();
		console.log("asdf");
		if (this.state.p1Name == null || this.state.p2Name == null || this.state.p1Score == null || this.state.p2Score == null) {
			return;
		}
		const match = {
			p1_name: this.state.p1Name,
			p1_score: this.state.p1Score,
			p2_name: this.state.p2Name,
			p2_score: this.state.p2Score,
			room_name: this.state.roomName
		}

		fetch('/api/matches', {
	      method: 'post',
	      body: JSON.stringify(match),
	      headers: {
	                "Content-Type": "application/json"
	            }
	    }).then(res => {
	      return res.json();
	    }).then(json => {
		    this.setState({
		      	p1Name: null,
				p1Score: null,
				p2Name: null,
				p2Score: null,
		      })
	      console.log(json);
	    })
	}

	onValueChanged = (event) => {
		console.log(event.target.name)
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	onRoomChanged = (event) => {
		console.log(event.target.value);
		this.setState({
			roomName: event.target.value
		});
	}

	render() {
		return (
			<div className="container" style={{paddingTop: "20px", textAlign:"center"}}>
			<Panel header={<h1 style={{textAlign:"center"}}>Report Match in room <Link style={{color:"#e04e41"}} to={`/rooms/${this.props.match.params.roomName}`}>{this.props.match.params.roomName}</Link></h1>} >
				<Row>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="P1 Name" name="p1Name" value={this.state.p1Name} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={2}>
						<FormGroup>
							<FormControl type="number" placeholder="P1 Score" name="p1Score" value={this.state.p1Score} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={2}>
						<FormGroup>
							<FormControl type="number" placeholder="P2 Score" name="p2Score" value={this.state.p2Score} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="P2 Name" name="p2Name" value={this.state.p2Name} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
				</Row>
				<Button onClick={this.handleSubmit}>Submit</Button>
				</Panel>
			</div>
		)
	}
}