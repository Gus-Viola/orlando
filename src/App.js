import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let map;
let markers, chosenAttractions = [];


class App extends Component {

  state = {
    attracionsArray: [],
    searchQuery: ""
  }//sets the initial state

  componetDidMount() {
    this.returnAttractions();
  }

  renderMap() {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBb8Dd6XE-l5e_eCFrYOa2iy-xVcjnIjVk&v=3&callback=initMap", null);
    window.initMap = this.initMap

  }

  // updateQuery = (query) => {
  //   this.setState({ searchQuery: query });
  //   updateAttractions();
  // }

  //the function below came from Udacity's Google Maps API course, with some minor modifications
  initMap() {
      map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.5427282 , lng:-81.3749294 },
        zoom: 12,
        styles:  [ { "stylers": [ { "saturation": 85 }, { "gamma": 0.6 }  ] }],
        mapTypeControl: false
      });//map

      const locations = [
        {title: "Walt Disney's Magic Kingdom",  location: {lat: 28.417663 , lng: -81.5834007}},
        {title: "Bob Evans",  location: {lat: 28.3332783 , lng: -81.5850286}},
        {title: "Universal Studios Florida",  location: {lat: 28.4731193 , lng: -81.4671166}},
        {title: "Epcot Center",  location: {lat: 28.374694, lng: -81.5515927 }},
        {title: "University of Central Florida",  location: {lat: 28.580463, lng: -81.250721}}
      ]

          let largeInfowindow = new window.google.maps.InfoWindow()

          // Style the markers a bit. This will be our listing marker icon.
          const defaultIcon = makeMarkerIcon('0091ff');

          // Create a "highlighted location" marker color for when the user
          // mouses over the marker.
          const highlightedIcon = makeMarkerIcon('FFFF24');

          // The following group uses the location array to create an array of markers on initialize.
          for (let i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            let position = locations[i].location;
            let title = locations[i].title;
            // Create a marker per location, and put into markers array.
            let marker = new window.google.maps.Marker({
              // map: map,
              position: position,
              title: title,
              animation: window.google.maps.Animation.DROP,
              icon: defaultIcon,
              id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker)
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
              populateInfoWindow(this, largeInfowindow)
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
              this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
              this.setIcon(defaultIcon);
            });

          }
          document.getElementById('show-listings').addEventListener('click', showListings);
          document.getElementById('hide-listings').addEventListener('click', hideListings);
        }//initMap()

  render() {
    this.renderMap();
    return (

      <div className="App">
      <div id="map"></div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}


//function below from https://humanwhocodes.com/blog/2009/07/28/the-best-way-to-load-external-javascript/
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";
    script.async = true; //I added this

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                // callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            // callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}//loadScript

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new window.google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}//showListings()

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}//hideListings()

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new window.google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new window.google.maps.Size(21, 34),
    new window.google.maps.Point(0, 0),
    new window.google.maps.Point(10, 34),
    new window.google.maps.Size(21,34));
  return markerImage;
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker
    // infowindow.setContent('<div>' + marker.title + '</div>')
    // infowindow.open(map, marker)
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
    let streetViewService = new window.google.maps.StreetViewService();
    const radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == window.google.maps.StreetViewStatus.OK) {
        let nearStreetViewLocation = data.location.latLng;
        let heading = window.google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          let panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        let panorama = new window.google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);

  }//if
}//populateInfoWindow()



export default App;
