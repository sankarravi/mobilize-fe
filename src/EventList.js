import React from 'react';
import moment from 'moment-timezone';
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from '@material-ui/core';
import './App.css';

const EventDate = ({ event }) => {
  if (!event.timeslots || event.timeslots.length === 0) {
    return null;
  }

  const startTime = moment.unix(event.timeslots[0].start_date);
  if (event.timeslots.length === 1) {
    // For just one date, returns something like "Mon, May 6th 8AM PDT"
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoneString = moment.tz(zone).format('z');
    return startTime.format('ddd, MMM Do hA z') + ' ' + zoneString;
  } else if (event.timeslots.length >= 1) {
    // For multiple dates, returns something like "8 events starting Thu, Apr 25th"
    const formatted = startTime.format('ddd, MMM Do');
    return `${event.timeslots.length} events starting ${formatted}`;
  }
};

const EventLocation = ({ event }) => {
  const { location } = event;
  if (!location) {
    return null;
  }

  let locationStr = location.venue;
  if (location.address_lines && location.address_lines.length) {
    locationStr += `: ${location.address_lines
      .filter((x) => x.length > 0)
      .join(', ')}`;
  }
  if (location.locality) {
    locationStr += `, ${location.locality}`;
  }
  return locationStr || null;
};

const EventList = (props) => {
  const {
    events,
    error,
    loading,
    nextUrl,
    didAvatarFailToLoad,
    onAvatarLoadFailure,
    genOnEventClick,
    fetchNextPage,
  } = props;
  return (
    <List>
      {events.map((event) => (
        <ListItem
          alignItems="flex-start"
          button={true}
          divider={true}
          onClick={genOnEventClick(event)}
          key={event.id}
        >
          {event.featured_image_url && !didAvatarFailToLoad(event.id) ? (
            <ListItemAvatar>
              <Avatar
                alt="Profile Picture"
                src={event.featured_image_url}
                imgProps={{
                  onError: (e) => {
                    onAvatarLoadFailure(event.id);
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
                <Typography component="span" color="textPrimary">
                  <EventDate event={event} />
                </Typography>
                <Typography component="span" color="textSecondary">
                  <EventLocation event={event} />
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
      {error && !loading && events.length === 0 && (
        <ListItem>
          <ListItemText primary="No valid events found!" />
        </ListItem>
      )}
      {nextUrl && !error && (
        <ListItem>
          <div className="List__load-more">
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchNextPage()}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'See More'}
            </Button>
          </div>
        </ListItem>
      )}
    </List>
  );
};

export default EventList;
