import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { DataPointService } from './Services/Services.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true
    };
  }

  componentDidMount() {
    // fetch('/api')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`status ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(json => {
    //     this.setState({
    //       message: json.message,
    //       fetching: false
    //     });
    //   }).catch(e => {
    //     this.setState({
    //       message: `API call failed: ${e}`,
    //       fetching: false
    //     });
    //   })

    fetch('api/currentWeekDataPoints')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      }).then(json => {
        console.log(json);
      }).catch(e => {
        throw e;
      })


    // fetch('/api/users')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`status ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(json => {
    //     console.log(json);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   })
  }

  createDataPoint = () => {
    console.log("boom");

    const dp = {
      value: Math.random() * 10
    };

    console.log(dp);

    fetch('/api/dataPoints', {
      method: 'post',
      body: JSON.stringify(dp),
      headers: {
                "Content-Type": "application/json"
            }
    }).then(res => {
      return res.json();
    }).then(json => {
      console.log(json);
    })

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {'This is '}
          <a href="https://github.com/mars/heroku-cra-node">
            {'create-react-app with a custom Node/Express server'}
          </a><br/>
        </p>
        <p className="App-intro">
          {this.state.fetching
            ? 'Fetching message from API'
            : this.state.message}
        </p>
        <div>
          <input type="submit" className="btn" onClick={this.createDataPoint} value="Create Data Point" />
        </div>
      </div>
    );
  }
}

export default App;
