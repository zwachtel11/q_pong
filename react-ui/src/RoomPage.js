import React, { Component } from 'react';
import { Panel, Col, Row } from 'react-bootstrap';

export default class RoomPage extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const roomName = this.props.match.params.roomName;
		return (
			<div className="container-fluid" style={{paddingTop: "20px"}}>
				<StatusPanel roomName={roomName}/>
			</div>
		)
	}
}


class StatusPanel extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const roomName = this.props.roomName;
		return (
			<Row>
				<Col md={8}>
					<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
						<p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
					</Panel>
				</Col>
			</Row>
		)
	}
}

class DailyPanel extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	
	render() {
		const roomName = this.props.roomName;
		return (
			<Row>
				<Col md={8}>
					<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
						<p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
					</Panel>
				</Col>
			</Row>
		)
	}
}

