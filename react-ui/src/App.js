import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import ReactDOM from 'react-dom';
import {VictoryBar, VictoryChart, VictoryAxis} from 'victory';
// import { DataPointService } from './Services/Services.js'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

class Apppp extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About</Link></li>

          </ul>
          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />

          <Chart />

          </div>
      </Router>
    )
  }
}

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

const Chart = () => (
  <div>
    <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
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
          data={data}
          x="quarter"
          y="earnings"
        />
      </VictoryChart>
  </div>
)

/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Appppp extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  render() {
    const standardActions = (
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
          <h1>Material-UI</h1>
          <h2>example project</h2>
          <RaisedButton
            label="Super Secret Password"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null
    }
  }

  // fetch('/api/dataPoints', {
  //     method: 'post',
  //     body: JSON.stringify(dp),
  //     headers: {
  //               "Content-Type": "application/json"
  //           }
  //   }).then(res => {
  //     return res.json();
  //   }).then(json => {
  //     console.log(json);
  //   })

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

  // <li><Link to='/'>Home</Link></li>
  // <li><Link to='/about'>About</Link></li>

  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <div>
          {this.state.rooms ?
            <h1>chill bitch im loading</h1>
            : <
          }


          <Chart />
        </div>
      </Router>
    )
  }
}