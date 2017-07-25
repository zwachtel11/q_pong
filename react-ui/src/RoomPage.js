import React, { Component } from 'react';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';
import './index.css';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const moment = require('moment');
const barColor = "#e04e41";
// const barColor = "rgb(5,76,170)"

export default class RoomPage extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const roomName = this.props.match.params.roomName;
		return (
			<div className="container" style={{paddingTop: "20px"}}>
				<Row className='row-group'>
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
				<Panel header={<h1>Matches</h1>}>
					<Link className="btn btn-lg" style={{display:"block"}} to={`/rooms/${this.props.roomName}/reportmatch`}>Report Match</Link>
					<Link className="btn btn-lg" style={{display:"block"}} to={`/rooms/${this.props.roomName}/matches`}>View Match History</Link>
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
				<Panel className="chart-panel" header={<h1>Weekly Use Histogram</h1>} style={{textAlign:"center"}} >
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
	 //    const data = [...Array(7).keys()].map(dp => .5);
		// this.setState({
		// 	data: data,
		// 	updatedAt: moment()
		// })
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
				day: moment(this.state.updatedAt).subtract(7-index, 'days').format('ddd'),
				value: dp * 24
			}
		});

		return (
			<ResponsiveContainer width='100%' height="100%" aspect={4.0/2.0}>
				<BarChart data={formattedData} margin={{top: 0, right: 0, bottom: 0, left: 0 }}>
					<Bar dataKey={'value'} fill={barColor} />
					<XAxis dataKey='day' />
					<YAxis domain={[0,24]} />
				</BarChart>
			</ResponsiveContainer>
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
				<Panel className='chart-panel' header={<h1>Daily Use Histogram</h1>} style={{textAlign:"center"}}>
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

		// const data = [...Array(24).keys()].map(dp => 10);
		// this.setState({
		// 	data: data,
		// 	updatedAt: moment()
		// })

	  }

	render() {
		if (!this.state.data) {
			return <div></div>
		}

		const formattedData = this.state.data.map((dp, index) => {
			return {
				// hour: index + 1,
				hour: moment(this.state.updatedAt).subtract(23-index, 'hours').format('h a'),
				value: dp * 60
			}
		});

		return (
			<ResponsiveContainer width='100%' height="100%" aspect={4.0/2.0}>
				<BarChart data={formattedData} margin={{top: 0, right: 0, bottom: 0, left: 0 }}>
					<Bar dataKey={'value'} fill={barColor} />
					<XAxis dataKey='hour' />
					<YAxis domain={[0,60]} />
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
			fillColor: 'gray',
			lastOpen: null,
			averageUseTime:null
		}
	}

	componentDidMount() {
		// setInterval(this.poll(), 5000);
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
	      	console.log('/api/rooms/:roomname data')
	        console.log(json);
	        this.setState({
	        	occupied: json.occupied,
	        	lastOpen: json.lastOpen,
	        	averageUseTime: json.averageUseTime,
	        	fillColor: json.occupied ? "#e04e41" : "#4E937A"
	        });
	      }).catch(e => {
	        throw e;
	      });
	}

	render() {
		const roomName = this.props.roomName;
		console.log("this.state.occupied");
		console.log(this.state.occupied);
		// if (this.state.occupied === null) {
		// 	return <div></div>;
		// }

		
						//<svg>
						//	<circle cx={75} cy={75} r={75} fill={this.state.fillColor} />
						//</svg>
		return (
			<Col md={8}>
				<Panel header={<h1>{roomName}</h1>} style={{textAlign:"center"}}>
					<Row>
					<Col md={4}>
						<div>
							<div className="circle" style={{backgroundColor:this.state.fillColor+"!important"}}>
							</div>
						</div>
					</Col>
					<Col md={8}>
						{this.state.occupied ? 
						<div>
							<h1>OCCUPIED</h1>
							<p>Last Open: {moment(this.state.lastOpen).calendar()}</p>
							<p>Average Use: {this.state.averageUseTime} minutes</p>
						</div> : 
						<div>
							<h1>OPEN</h1>
							<p>Average Use: {this.state.averageUseTime} minutes</p>
						</div>
					}
					</Col>
					</Row>
				</Panel>
			</Col>
		)
	}
}


