import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      nextUrl: undefined,
      prevUrl: undefined,
      totalCount: undefined,
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = (params = {}) => {
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    axios
      .get('https://api.mobilize.us/v1/events', {
        ...params,
        timeslot_start: `gte_${nowInSeconds}`, // always filter to events that still active
      })
      .then(({ data }) => {
        this.setState({
          events: data.data,
          nextUrl: data.next,
          prevUrl: data.previous,
          totalCount: data.count,
        });
      })
      .catch(({ error }) => {
        // todo
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.events.map(event => {
            return <p>{event.title}</p>;
          })}
        </header>
      </div>
    );
  }
}

export default App;
