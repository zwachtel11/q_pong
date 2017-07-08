import React, { Component } from 'react';
import { Panel, Col, Row, Button, FormGroup, ControlLabel, FormControl, FormControlsSelect, FieldGroup, InputGroup } from 'react-bootstrap';


export default class ReportMatchPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			p1Name: null,
			p1Email: null,
			p1Score: null,
			p2Name: null,
			p2Email: null,
			p2Score: null,
			rooms: null,
			roomName: null
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

	handleSubmit = (event) => {
		event.preventDefault();
		console.log("asdf");

		//post match

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

		const mappedRoomOptions = this.state.rooms ? this.state.rooms.map(room => {
			return <option value={this.state.room.roomName}></option>
		}) : null;


		return (
			<div className="container" style={{paddingTop: "20px"}}>
				<h1 style={{textAlign:"center"}}>Report Match</h1>
				<Row>
					<Col md={2}></Col>
					<Col md={8}>
						<FormGroup controlId="formControlsSelect">
							<FormControl componentClass="select" value={this.state.roomName} placeholder="Select Room" onChange={this.onRoomChanged}>
								{mappedRoomOptions}
							</FormControl>
						</FormGroup>
					</Col>
					<Col md={2}></Col>

				</Row>

				<Row>
					<Col md={4}>
						<h4 style={{textAlign:"center"}}>Player 1</h4>

					</Col>
					<Col md={4}>
					</Col>
					<Col md={4}>
						<h4 style={{textAlign:"center"}}>Player 2</h4>

					</Col>
				</Row>
				<Row>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="Name" name="p1Name" value={this.state.p1Name} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={4}>
					</Col>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="Name" name="p2Name" value={this.state.p2Name} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
				</Row>

				<Row>
				<Col md={4}>
					</Col>
					<Col md={2}>
						<FormGroup>
							<FormControl type="text" placeholder="Score" name="p1Score" value={this.state.p1Score} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={2}>
						<FormGroup>
							<FormControl type="text" placeholder="Score" name="p2Score" value={this.state.p2Score} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={4}>
					</Col>
				</Row>

				<Row>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="Email" name="p1Email" value={this.state.p1Email} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
					<Col md={4}>
					</Col>
					<Col md={4}>
						<FormGroup>
							<FormControl type="text" placeholder="Email" name="p2Email" value={this.state.p2Email} onChange={this.onValueChanged} />
						</FormGroup>
					</Col>
				</Row>
				<Button onClick={this.handleSubmit}>Submit</Button>
			</div>
		)
	}
}