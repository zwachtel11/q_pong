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
	    fetch('/api/rooms/ccc/currentDayDataPoints')
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

		// const data = [
		//   {quarter: 1, earnings: 13000},
		//   {quarter: 2, earnings: 16500},
		//   {quarter: 3, earnings: 14250},
		//   {quarter: 4, earnings: 19000}
		// ];
		const updatedAt = this.state.updatedAt;

		console.log(updatedAt);
		updatedAt.setDay(updatedAt.getDay() - 1);
		console.log(updatedAt);


		// const formattedData = this.state.data.map((dp, index) => {
		// 	return {
		// 		hour: ,
		// 		value: 
		// 	}
		// });

		return (
			<div>
			    <VictoryChart
			        // domainPadding will add space to each side of VictoryBar to
			        // prevent it from overlapping the axis
			        domainPadding={20}>
			        <VictoryAxis
			          // tickValues specifies both the number of ticks and where
			          // they are placed on the axis
			          tickValues={[1, 2, 3, 4]}
			          tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
			        />
			        <VictoryAxis
			          dependentAxis
			          // tickFormat specifies how ticks should be displayed
			          tickFormat={(x) => (`$${x / 1000}k`)}
			        />
			        <VictoryBar
			          data={this.state.data}
			          x="quarter"
			          y="earnings"
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

