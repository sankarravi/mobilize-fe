import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
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
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = (params = {}) => {
    const nowInSeconds = Math.floor(new Date().getTime() / 1000);
    axios
      .get('https://api.mobilize.us/v1/events', {
        params: {
          ...params,
          timeslot_start: `gte_${nowInSeconds}`, // always filter to events that still active
        },
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

  renderDate = event => {
    if (!event.timeslots && event.timeslots.length === 0) {
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
          <ListItem alignItems="flex-start" button={true} divider={true}>
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
      </List>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Header />
        <div className="App__left">
          <Paper className={classes.root}>{this.renderEventList()}</Paper>
        </div>
        <div className="App__right" />
      </div>
    );
  }
}

export default withStyles(styles)(App);
