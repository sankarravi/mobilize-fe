import React, { Component } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import EventList from './EventList';
import EventMap from './EventMap';
import './App.css';

const styles = (theme) => ({
  inline: {
    display: 'inline',
  },
});

const Header = () => (
  <AppBar position="absolute" color="default">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MobilizeAmerica: Find a way to change politics
      </Typography>
    </Toolbar>
  </AppBar>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarsWithErrors: {},
      events: [],
      nextUrl: undefined,
      prevUrl: undefined,
      totalCount: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    this.fetchEvents('https://api.mobilize.us/v1/events', {
      timeslot_start: `gte_${nowInSeconds}`, // start by filtering for events that are still active
    });
  }

  fetchEvents = (url, params) => {
    this.setState({ loading: true });
    return axios
      .get(url, { params })
      .then(({ data }) => {
        this.setState({
          events: [...this.state.events, ...data.data],
          nextUrl: data.next,
          prevUrl: data.previous,
          totalCount: data.count,
          loading: false,
        });
      })
      .catch(({ data }) => {
        if (data) {
          console.error(data.error);
        }
        this.setState({ loading: false });
      });
  };

  fetchNextPage = (params = {}) => {
    return this.fetchEvents(this.state.nextUrl, params);
  };

  didAvatarFailToLoad = (eventId) => {
    return Boolean(this.state.avatarsWithErrors[eventId]);
  };

  onAvatarLoadFailure = (eventId) => {
    this.setState({
      avatarsWithErrors: {
        ...this.state.avatarsWithErrors,
        [eventId]: true,
      },
    });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="App__left">
          <EventList
            events={this.state.events}
            loading={this.state.loading}
            nextUrl={this.state.nextUrl}
            didAvatarFailToLoad={this.didAvatarFailToLoad}
            onAvatarLoadFailure={this.onAvatarLoadFailure}
          />
        </div>
        <div className="App__right">
          <EventMap events={this.state.events} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
