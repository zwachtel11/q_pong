import React, { Component } from 'react';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const moment = require('moment');

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
				<Panel header={<h1>Weekly Use</h1>} style={{textAlign:"center"}}>
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
	          data: json,
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
				hour: index+1,
				value: dp
			}
		});

		// console.log(formattedData);

		const ticks = [...Array(7).keys()].map(dp => dp+1);

		return (
			<div>
			    <VictoryChart
			        domainPadding={20} >
			        <VictoryAxis
			          tickValues={ticks}
			          label="Days"
			          // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
			        />
			        <VictoryAxis
			          dependentAxis
			          label="% Utilization"
			        />
			        <VictoryBar
			          data={formattedData}
			          style={{ data: { fill: "#005cb3" } }}
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

		const data = [...Array(24).keys()].map(dp => .1);
		this.setState({
			data: data,
			updatedAt: moment()
		})

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
				// hour: index + 1,
				hour: moment(this.state.updatedAt).subtract(23-index, 'hours').fromNow(),
				value: dp
			}
		});

		const AxisLabel = ({ axisType, x, y, width, height, stroke, children }) => {
		  const isVert = axisType === 'yAxis';
		  const cx = isVert ? x : x + (width / 2);
		  const cy = isVert ? (height / 2) + y : y + height + 10;
		  const rot = isVert ? `270 ${cx} ${cy}` : 0;
		  return (
		    <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
		      {children}
		    </text>
		  );
		};

		return (
			<ResponsiveContainer width='100%' height="100%" aspect={4.0/2.0}>
				<BarChart data={formattedData}>
					<Bar dataKey={'value'} fill="#005cb3" />
					<XAxis dataKey='hour' />
					<YAxis domain={[0,1]} />
				</BarChart>
			</ResponsiveContainer>
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
			return <div></div>;
		}

		return (
			<Col md={8}>
				<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
					<Col md={4}>
						<div style={{textAlign: "center"}}>
						<svg>
							<circle cx={75} cy={75} r={75} fill={this.state.occupied ? "red" : "green"} />
						</svg>
						</div>
					</Col>
					<Col md={8}>
						{this.state.occupied ? 
						<div>
							<h1>OCCUPIED</h1>
							<p>Last Open: {moment(this.state.lastOpen).calendar()}</p>
							<p>Average Use: {this.state.averageUseTime}</p>
						</div> : 
						<div>
							<h1>OPEN</h1>
							<p>Last Open: {moment(this.state.lastOpen).calendar()}</p>
							<p>Average Use: {this.state.averageUseTime}</p>
						</div>
					}
					</Col>
				</Panel>
			</Col>
		)
	}
}


