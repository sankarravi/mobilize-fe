import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './App.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const apiKey = 'AIzaSyD27mEipBpg0abK0P5raw1OkOWeGZcGqQM';

const Header = () => (
  <AppBar position="absolute" color="default">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MobilizeAmerica: Find a way to change politics
      </Typography>
    </Toolbar>
  </AppBar>
);

const MapComponent = withScriptjs(
  withGoogleMap(props => {
    const events = props.events;
    const locations = [];
    events.forEach(event => {
      const location =
        event && event.location && event.location.location
          ? event.location.location
          : undefined;
      if (location && location.latitude) {
        locations.push({
          id: event.id,
          lat: location.latitude,
          lng: location.longitude,
        });
      }
    });
    if (locations.length === 0) {
      return null;
    }
    // TODO: ideally the default center would be the average of the lats & lngs,
    // instead of just the first one
    return (
      <GoogleMap defaultZoom={7} defaultCenter={locations[0]}>
        {locations.map(loc => (
          <Marker key={loc.id} position={loc} />
        ))}
      </GoogleMap>
    );
  })
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
    };
  }

  componentDidMount() {
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    this.fetchEvents('https://api.mobilize.us/v1/events', {
      timeslot_start: `gte_${nowInSeconds}`, // start by filtering for events that are still active
    });
  }

  fetchEvents = (url, params) => {
    return axios
      .get(url, { params })
      .then(({ data }) => {
        this.setState({
          events: [...this.state.events, ...data.data],
          nextUrl: data.next,
          prevUrl: data.previous,
          totalCount: data.count,
        });
      })
      .catch(({ error }) => {
        // todo
      });
  };

  fetchNextPage = (params = {}) => {
    return this.fetchEvents(this.state.nextUrl, params);
  };

  renderDate = event => {
    if (!event.timeslots || event.timeslots.length === 0) {
      return null;
    }

    const startTime = moment.unix(event.timeslots[0].start_date);
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoneString = moment.tz(zone).format('z');
    const formatted =
      startTime.format('ddd, MMM Do YYYY hA z') + ' ' + zoneString;
    if (event.timeslots.length === 1) {
      return formatted;
    } else if (event.timeslots.length >= 1) {
      return `${event.timeslots.length} events starting ${formatted}`;
    }
  };

  renderEventList = () => {
    const { classes } = this.props;
    return (
      <List className={classes.list}>
        {this.state.events.map(event => (
          <ListItem
            alignItems="flex-start"
            button={true}
            divider={true}
            key={event.id}
          >
            {event.featured_image_url &&
            !this.state.avatarsWithErrors[event.id] ? (
              <ListItemAvatar>
                <Avatar
                  alt="Profile Picture"
                  src={event.featured_image_url}
                  imgProps={{
                    onError: e => {
                      this.setState({
                        avatarsWithErrors: {
                          ...this.state.avatarsWithErrors,
                          [event.id]: true,
                        },
                      });
                    },
                  }}
                />
              </ListItemAvatar>
            ) : (
              <div className="List__empty-avatar" />
            )}
            <ListItemText
              primary={event.title}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {this.renderDate(event)}
                  </Typography>
                  <br />
                  {event.description && event.description.length > 200
                    ? event.description.substring(0, 200) + '...'
                    : event.description}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
        {this.state.nextUrl && (
          <ListItem>
            <div className="List__load-more">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.fetchNextPage()}
              >
                Load More
              </Button>
            </div>
          </ListItem>
        )}
      </List>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Header />
        <div className="App__left">{this.renderEventList()}</div>
        <div className="App__right">
          <MapComponent
            events={this.state.events}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div className="Map__container" />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
