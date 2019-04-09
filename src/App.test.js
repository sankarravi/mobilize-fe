import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import EventList from './EventList';
import EventMap from './EventMap';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

const sampleEvent = {
  id: 1635,
  description:
    'Monthly meeting open to any registered Democrats interested in becoming involved with the Democratic Party in Charlotte County.',
  timezone: 'America/New_York',
  title: 'DEC Monthly Meeting',
  summary: '',
  sponsor: {
    id: 290,
    name: 'Charlotte County DEC',
    slug: 'charlottecountydec',
    is_coordinated: true,
    is_independent: false,
    is_primary_campaign: false,
    state: 'FL',
    district: '',
    candidate_name: '',
    race_type: null,
    event_feed_url: 'https://www.mobilize.us/charlottecountydec/',
    created_date: 1526326416,
    modified_date: 1551902080,
  },
  featured_image_url:
    'https://mobilizeamerica.imgix.net/uploads/event/gavel%20generic%20event_20180607164850470293.jpg',
  timeslots: [
    { id: 14016, start_date: 1557183600, end_date: 1557190800 },
    { id: 14017, start_date: 1559602800, end_date: 1559610000 },
    { id: 14018, start_date: 1562022000, end_date: 1562029200 },
    { id: 14019, start_date: 1565046000, end_date: 1565053200 },
    { id: 14020, start_date: 1567465200, end_date: 1567472400 },
    { id: 14021, start_date: 1569970800, end_date: 1569978000 },
    { id: 14022, start_date: 1572912000, end_date: 1572919200 },
    { id: 14023, start_date: 1575331200, end_date: 1575338400 },
    { id: 14024, start_date: 1578355200, end_date: 1578362400 },
    { id: 14025, start_date: 1580774400, end_date: 1580781600 },
    { id: 14026, start_date: 1583193600, end_date: 1583200800 },
    { id: 14027, start_date: 1586214000, end_date: 1586221200 },
    { id: 14028, start_date: 1588633200, end_date: 1588640400 },
    { id: 14029, start_date: 1591052400, end_date: 1591059600 },
    { id: 14030, start_date: 1594076400, end_date: 1594083600 },
  ],
  location: {
    venue: 'DEC Headquarters',
    address_lines: ['3596 Tamiami Trail', 'Unit #202'],
    locality: 'Port Charlotte',
    region: 'FL',
    postal_code: '33952',
    location: { latitude: 26.9780755, longitude: -82.0918196 },
    congressional_district: '17',
    state_leg_district: '75',
    state_senate_district: null,
  },
  event_type: 'MEETING',
  created_date: 1526916251,
  modified_date: 1554755054,
  browser_url: 'https://www.mobilize.us/charlottecountydec/event/1635/',
  high_priority: null,
  contact: null,
  visibility: 'PUBLIC',
  created_by_volunteer_host: false,
};
it('renders EventList without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <EventList
      events={[sampleEvent]}
      genOnEventClick={() => {}}
      fetchNextPage={() => {}}
      loading={false}
      didAvatarFailToLoad={() => {}}
      onAvatarLoadFailure={() => {}}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('renders EventMap without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <EventMap events={[sampleEvent]} genOnEventClick={() => {}} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
