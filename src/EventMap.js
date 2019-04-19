import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import './App.css';

// TODO: this would ideally not be checked into source and would be injected by the server
const MAPS_API_KEY = 'AIzaSyD27mEipBpg0abK0P5raw1OkOWeGZcGqQM';

const extractMarkers = (events) => {
  const markers = [];
  events.forEach((event) => {
    const location =
      event && event.location && event.location.location
        ? event.location.location
        : undefined;
    if (location && location.latitude) {
      markers.push({
        id: event.id,
        lat: location.latitude,
        lng: location.longitude,
      });
    }
  });
  return markers;
};

/**
 * There are a couple layers here required to make this work.
 * We export a component with all the magic done so you can just send in a list of Mobilize events.
 *    1 - InternalEventMap: interacts with Google Maps API
 *    2 - WrappedEventMap: uses some HOCs from the React library to take some magic properties and
 *         turn them into a working map
 *    3 - EventMap: injects those magic properties; this is the thing we finally export
 */
const InternalEventMap = ({ events, genOnEventClick, hasPostalFilter }) => {
  const markers = extractMarkers(events);
  if (markers.length === 0) {
    return null;
  }

  // Room for improvement:
  // 1. Ideally the default center would be [avg lat, avg lng] instead of just the first item –
  //    this would give us a map centered relative to our points
  // 2. Ideally the map would also re-center itself after new points are added
  return (
    <GoogleMap
      defaultZoom={hasPostalFilter ? 11 : 7}
      defaultCenter={markers[0]}
    >
      {markers.map((loc) => (
        <Marker key={loc.id} position={loc} onClick={genOnEventClick(loc)} />
      ))}
    </GoogleMap>
  );
};
const WrappedEventMap = withScriptjs(withGoogleMap(InternalEventMap));

const EventMap = (props) => {
  return (
    <WrappedEventMap
      {...props}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: '100%' }} />}
      containerElement={<div className="Map__container" />}
      mapElement={<div style={{ height: '100%' }} />}
    />
  );
};

export default EventMap;
