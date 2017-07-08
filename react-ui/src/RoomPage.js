import React, { Component } from 'react';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

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
				<Row>
					<StatusPanel roomName={roomName} />
					<ButtonGroup roomName={roomName} />
				</Row>
				<Row>
					<DailyPanel roomName={roomName} />
					<WeeklyPanel roomName={roomName} />
				</Row>
			</div>
		)
	}
}

class ButtonGroup extends Component {
	render() {
		return (
			<Col md={4}>
				<Link to="/reportmatch"><Button block bsSize="large">Report Match</Button></Link>
				<Link to={`/matches/${this.props.roomName}`}><Button block bsSize="large">View Match History</Button></Link>
			</Col>
		)
	}
}

class WeeklyPanel extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	
	render() {
		const roomName = this.props.roomName;
		return (
			<Col md={6}>
				<Panel header={<h1>Daily Use</h1>} style={{textAlign:"center"}}>
					<WeeklyChart roomName={roomName} />
				</Panel>
			</Col>
		)
	}
}

class WeeklyChart extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			updatedAt:null
		}
	}

	componentDidMount() {
		const query = '/api/rooms/' + this.props.roomName + '/currentWeekDataPoints';
	    console.log(query);
	    fetch(query)
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
	          data: json.data,
	          updatedAt: json.updated_at
	        })
	      }).catch(e => {
	        throw e;
	      });
	  }

	render() {
		if (!this.state.data) {
			return <div></div>
		}

		const updatedAt = this.state.updatedAt;

		// console.log(updatedAt);
		// updatedAt.setDay(updatedAt.getDay() - 1);
		// console.log(updatedAt);

		const formattedData = this.state.data.map((dp, index) => {
			return {
				hour: index,
				value: dp
			}
		});

		// console.log(formattedData);

		const ticks = [...Array(4).keys()].map(dp => (dp+1) * 6);

		return (
			<div>
			    <VictoryChart
			        domainPadding={20} >
			        <VictoryAxis
			          tickValues={ticks}
			          // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
			        />
			        <VictoryAxis
			          dependentAxis

			        />
			        <VictoryBar
			          data={formattedData}
			          x="hour"
			          y="value"
			        />
			      </VictoryChart>
			</div>
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
			<Col md={6}>
				<Panel header={<h1>Daily Use</h1>} style={{textAlign:"center"}}>
					<DailyChart roomName={roomName} />
				</Panel>
			</Col>
		)
	}
}

class DailyChart extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			updatedAt:null
		}
	}

	componentDidMount() {
		const query = '/api/rooms/' + this.props.roomName + '/currentDayDataPoints';
	    console.log(query);
	    fetch(query)
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
	          data: json.data,
	          updatedAt: json.updated_at
	        })
	      }).catch(e => {
	        throw e;
	      });
	  }

	render() {
		if (!this.state.data) {
			return <div></div>
		}

		const updatedAt = this.state.updatedAt;

		// console.log(updatedAt);
		// updatedAt.setDay(updatedAt.getDay() - 1);
		// console.log(updatedAt);

		const formattedData = this.state.data.map((dp, index) => {
			return {
				hour: index,
				value: dp
			}
		});

		// console.log(formattedData);

		const ticks = [...Array(4).keys()].map(dp => (dp+1) * 6);

		return (
			<div>
			    <VictoryChart
			        domainPadding={20} >
			        <VictoryAxis
			          tickValues={ticks}
			          // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
			        />
			        <VictoryAxis
			          dependentAxis

			        />
			        <VictoryBar
			          data={formattedData}
			          x="hour"
			          y="value"
			        />
			      </VictoryChart>
			</div>
		)
	}
}


class StatusPanel extends Component {
	constructor(props) {
		super(props)
		this.state = {
			occupied: null,
			lastOpen: null,
			averageUseTime:null
		}
	}

	componentDidMount() {
		const query = '/api/rooms/' + this.props.roomName;
	    console.log(query);
	    fetch(query)
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
	        	occupied: json.occupied,
	        	lastOpen: json.lastOpen,
	        	averageUseTime: json.averageUseTime
	        });
	      }).catch(e => {
	        throw e;
	      });
	}

	render() {
		const roomName = this.props.roomName;
		console.log("this.state.occupied");
		console.log(this.state.occupied);
		if (this.state.occupied === null) {
			return <div>fuck this shit</div>;
		}

		return (
			<Col md={8}>
				<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
					<Col md={4}>
						<svg>
							<circle cx={75} cy={75} r={75} fill={this.state.occupied ? "red" : "green"} />
						</svg>
					</Col>
					<Col md={8}>
						{this.state.occupied ? 
						<div>
							<h1>OCCUPIED</h1>
							<p>Last Open: {this.state.lastOpen}</p>
							<p>Average Use: {this.state.averageUseTime}</p>
						</div> : 
						<div>
							<h1>OPEN</h1>
							<p>Last Open: {this.state.lastOpen}</p>
							<p>Average Use: {this.state.averageUseTime}</p>
						</div>
					}
					</Col>
				</Panel>
			</Col>
		)
	}
}


