import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*
The following code came from Udacity's Google Maps API course:
initMap(), populateInfoWindow()
as well as suggested variables, such as map, markers, etc.
*/

let map;

class App extends Component {

  componentDidMount() {
    this.initMap();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
          <div id="map"></div>
      </div>

    );
  }//render

  initMap() {

    let markers =[];

    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    const locations = [
      {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
      {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
      {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
      {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
      {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
      {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];

    let bounds = new window.google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      const position = locations[i].location;
      const title = locations[i].title;
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      // marker.addListener('click', function() {
      //   pop(this, largeInfowindow);
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
      bounds.extend(markers[i].position);
    }//loop
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

  }//initMap()

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  // populateInfoWindow(marker, infowindow) {
  //   // Check to make sure the infowindow is not already opened on this marker.
  //   if (infowindow.marker !== marker) {
  //     infowindow.marker = marker;
  //     infowindow.setContent('<div>' + marker.title + '</div>');
  //     infowindow.open(map, marker);
  //     // Make sure the marker property is cleared if the infowindow is closed.
  //     infowindow.addListener('closeclick',function(){
  //       infowindow.setMarker = null;
  //     });
  //   }
  // }//populateInfoWindow()



}//App

export default App;


// <p>
//   Edit <code>src/App.js</code> and save to reload.
// </p>
// <a
//   className="App-link"
//   href="https://reactjs.org"
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   Learn React
// </a>
