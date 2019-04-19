import React, { Component } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import EventList from './EventList';
import EventMap from './EventMap';
import Header from './Header';
import './App.css';

const styles = (theme) => ({
  inline: {
    display: 'inline',
  },
});

const eventsBaseUrl = 'https://api.mobilize.us/v1/events';

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
      error: false,
      postalCodeFilter: '',
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData = () => {
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    return this.fetchEvents(eventsBaseUrl, {
      timeslot_start: `gte_${nowInSeconds}`, // start by filtering for events that are still active
    });
  };

  fetchEvents = (url, params, additiveData = false) => {
    this.setState({ error: false, loading: true });
    return axios
      .get(url, { params })
      .then(({ data }) => {
        const events = additiveData
          ? [...this.state.events, ...data.data]
          : data.data;
        this.setState({
          events,
          nextUrl: data.next,
          prevUrl: data.previous,
          totalCount: data.count,
          error: false,
          loading: false,
        });
      })
      .catch(({ data }) => {
        if (data) {
          console.error(data.error);
        }
        this.setState({ error: true, loading: false });
      });
  };

  fetchNextPage = (params = {}) => {
    return this.fetchEvents(this.state.nextUrl, params, true);
  };

  fetchForZipCode = () => {
    this.setState({ events: [] });
    const params = {};
    if (this.state.postalCodeFilter === '') {
      return this.fetchInitialData();
    } else {
      params.zipcode = this.state.postalCodeFilter;
      return this.fetchEvents(eventsBaseUrl, params, false);
    }
  };
  debouncedFetchForZipCode = debounce(this.fetchForZipCode, 250);

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

  onPostalCodeChange = (event) => {
    this.setState(
      { postalCodeFilter: event.target.value },
      this.debouncedFetchForZipCode
    );
  };

  genOnEventClick = (event) => () => {
    // TODO: obviously sort of cheating to open the existing mobilize page,
    //  but I didn't get a chance to build a custom event view and still wanted
    //  to have a stub for the UX expected here.
    // The refinement would look like something like a replacement of the Map with event details
    // and a back button for returning to the list view
    window.open(`https://www.mobilize.us/event/${event.id}/`);
  };

  render() {
    return (
      <div className="App">
        <Header
          postalCode={this.state.postalCodeFilter}
          onPostalCodeChange={this.onPostalCodeChange}
        />
        <div className="App__left">
          <EventList
            events={this.state.events}
            genOnEventClick={this.genOnEventClick}
            fetchNextPage={this.fetchNextPage}
            error={this.state.error}
            loading={this.state.loading}
            nextUrl={this.state.nextUrl}
            didAvatarFailToLoad={this.didAvatarFailToLoad}
            onAvatarLoadFailure={this.onAvatarLoadFailure}
          />
        </div>
        <div className="App__right">
          <EventMap
            events={this.state.events}
            genOnEventClick={this.genOnEventClick}
            hasPostalFilter={this.state.postalCodeFilter !== ''}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
