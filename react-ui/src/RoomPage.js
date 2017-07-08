import React, { Component } from 'react';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';


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

class DailyChart extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			updatedAt:null
		}
	}

	componentDidMount() {
		const query = '/api/rooms/' + this.props.roomName + '/currentDayDataPoints'
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

		const ticks = [...Array(24).keys()].map(dp => dp+1);

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

		}
	}

	render() {
		const roomName = this.props.roomName;
		return (
			<Col md={8}>
				<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
					<Col md={4}>
						<svg>
							<circle cx={75} cy={75} r={75} fill="green" />
						</svg>
					</Col>
					<Col md={8}>
						<h1>OPEN</h1>
						<p>Last Used: 10 min ago</p>
						<p>Average Use: 25 min</p>
					</Col>
				</Panel>
			</Col>
		)
	}
}

class ButtonGroup extends Component {
	render() {
		return (
			<Col md={4}>
				<Button block bsSize="large">Alert When Open</Button>
				<Button block bsSize="large">Report Match</Button>
				<Button block bsSize="large">View Match History</Button>
			</Col>
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
					<DailyChart />
				</Panel>
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
				<Panel header={<h1>Weekly Use</h1>} style={{textAlign:"center"}}>
					<DailyChart />
				</Panel>
			</Col>
		)
	}
}

