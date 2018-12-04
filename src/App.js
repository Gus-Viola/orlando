import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import escapeRegExp from 'escape-string-regexp';

/*
The following code came from Udacity's Google Maps API course:
initMap(), populateInfoWindow(), marker functions
as well as suggested variables, such as map, markers, etc.
The following code came from my Udacity's myreads project
query state, updateQuery, etc

Faltam:
Fix: filter list
Fix: fitBounds
*/


class App extends Component {

  state = {

      locations: [],
     query: '',
     map: '',
     markers: []
  }

  updateQuery = (queryText) => {
    let { locations, query, markers } = this.state;
    let showingLocations;

    this.setState({ query: queryText });

    //I must first hide all markers
    markers.map(marker => marker.setMap(null));

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      // showingLocations = locations.filter((loc) => match.test(loc.title))
      showingLocations = locations.filter((loc) => match.test(loc.venue.name))
      // console.log(showingLocations)
    } else {
      showingLocations = locations
    }

    this.setState({ locations: showingLocations })
    // console.log(locations)

    this.initMap()
  }//updateQuery


  foursquareSearch(object) {
    const query = document.getElementById('query-input').value
    console.log(query)
    fetch('https://api.foursquare.com/v2/venues/explore?client_id=SJV1ISHPCCXJPD51FD0YFB5424GZZ0Q1E1THCOM12G21UPKO&client_secret=QJQBOLAC1SPUD0KZR2TJ5R1QGE3TEJGFWPPUB4HUHX1OLXBF&v=20180323&ll=28.5427282,-81.3749294&radius=5000&query='+query)
      .then(response => response.json()).then(result => {
        // console.log(result.response.groups[0].items)})
        // console.log(result.response.groups[0].items);
        // console.log("such")
        object.setState({ locations : result.response.groups[0].items});
        // console.log(this.state.locations);
        object.initMap()
      })
      .catch(err => console.log("I received the following error: "+err))

      // let {map} = this.state
      // let bounds = new window.google.maps.LatLngBounds();
      // debugger
      // if (map) map.fitBounds(bounds)

  }//foursquareSearch

  componentDidMount() {
    this.foursquareSearch(this)
    this.initMap();
  }

  render() {

    return (
      <div className="App">
        <div className="App-list">
          <img src={logo} className="App-logo" alt="logo" />
          <input
            type="text"
            placeholder="Search for your Orlando attraction!"
            // value = {this.state.query}
            onChange={(event)=> this.updateQuery(event.target.value) }
            id = "query-input"
          />
          <button
              type="button"
              id="button"
              onClick={() => this.foursquareSearch(this)}
              role="search"
            >
            Foursquare Search
            </button>
            <ul>
              {this.state.locations.map(loc => (
                <li key={loc.venue.name} onClick={(event) => this.clickList(loc)}>{loc.venue.name}</li>
              ))}
            </ul>

            </div>
          <div id="map"></div>
      </div>

    );
  }//render

  initMap() {

    this.setState({
      map: new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.5427282 , lng:-81.3749294 },
        zoom: 13,
        mapTypeControl: false
      })
    })

    let map = this.state.map
    let markers = this.state.markers;

    const defaultIcon = this.makeMarkerIcon('00d8ff');
    const highlightedIcon = this.makeMarkerIcon('FFFF24');

    let bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < this.state.locations.length; i++) {
      let position;
      if (this.state.locations[i].location) {
         position = this.state.locations[i].location;
      } else {
        position = { lat: this.state.locations[i].venue.location.lat, lng: this.state.locations[i].venue.location.lng }
      }
      //venue.location.lat , venue.location.lng
      let title;
      if (this.state.locations[i].title) {
        title = this.state.locations[i].title;
      } else {
        title = this.state.locations[i].venue.name;
      }
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      this.setState({  markers: markers })
      // console.log(markers)
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        const largeInfowindow = new window.google.maps.InfoWindow();

          if (largeInfowindow.marker !== marker) {
            largeInfowindow.marker = marker;
            largeInfowindow.setContent('<div>' + marker.title + '</div>');
            largeInfowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            largeInfowindow.addListener('closeclick',function(){
              largeInfowindow.setMarker = null;
            });
          }//if
      });//addListener

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

      bounds.extend(markers[i].position);
    }//loop
    // Extend the boundaries of the map for each marker
    map = this.state.map
    if (map) map.fitBounds(bounds);

  }//initMap()

   makeMarkerIcon(markerColor) {
    var markerImage = new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(21, 34),
      new window.google.maps.Point(0, 0),
      new window.google.maps.Point(10, 34),
      new window.google.maps.Size(21,34));
    return markerImage;

  }//makeMarkerIcon()

  clickList(loc) {
    for (let i=0; i<this.state.locations.length; i++) {
      // console.log(i)
      if (loc.referralId === this.state.locations[i].referralId) {
        window.google.maps.event.trigger(this.state.markers[i], 'click');
      }
    }
  }//clickList

}//App

export default App;




// locations: [
 // {title: "Walt Disney's Magic Kingdom",  location: {lat: 28.417663 , lng: -81.5834007}, referralId: 1},
 // {title: "Bob Evans",  location: {lat: 28.3332783 , lng: -81.5850286}, referralId: 2},
 // {title: "Universal Studios Florida",  location: {lat: 28.4731193 , lng: -81.4671166}, referralId: 3},
 // {title: "Epcot Center",  location: {lat: 28.374694, lng: -81.5515927 }, referralId: 4},
 // {title: "University of Central Florida",  location: {lat: 28.580463, lng: -81.250721}, referralId: 5}
// ],
//React blue: 00d8ff
