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
I used the npm yelp package
https://www.npmjs.com/package/yelp-api

Faltam:
2) Lista dos lugares com a opção de filtrar eles por nome
map fitbounds does not work
InvalidValueError: setMap: not an instance of Map; and not an instance of StreetViewPanorama
showWindow broken, no text

*/

// let map;
// let markers =[];


class App extends Component {

  state = {

      locations: [
       // {title: "Walt Disney's Magic Kingdom",  location: {lat: 28.417663 , lng: -81.5834007}, referralId: 1},
       // {title: "Bob Evans",  location: {lat: 28.3332783 , lng: -81.5850286}, referralId: 2},
       // {title: "Universal Studios Florida",  location: {lat: 28.4731193 , lng: -81.4671166}, referralId: 3},
       // {title: "Epcot Center",  location: {lat: 28.374694, lng: -81.5515927 }, referralId: 4},
       // {title: "University of Central Florida",  location: {lat: 28.580463, lng: -81.250721}, referralId: 5}
     ],
     query: '',
     map: '',
     markers: []
     // errorSearching: false
  }

  updateQuery = (queryText) => {
    let { locations, query } = this.state;
    let showingLocations

    this.setState({ query: queryText })

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      // showingLocations = locations.filter((loc) => match.test(loc.title))
      showingLocations = locations.filter((loc) => match.test(loc.venue.name))
      console.log(showingLocations)
    } else {
      showingLocations = locations
    }

    this.setState({ locations: showingLocations })
    console.log(locations)

    this.initMap()

  }


  // updateQuery = (query) => {
  //   this.setState({ query: query })
  //
  //   //refactoring of the shelving and auxliary functions
  //   const locations  = this.state.locations.map(item => {
  //     // const found = this.props.appStateBooks.find(appBook => appBook.id === item.id);
  //     const found = this.state.locations.find(appBook => appBook.id === item.id);
  //       if(found) {
  //           return found;
  //       } else {
  //           return item
  //       }
  //   })
  //
  //   if (query) {
  //   //
  //   //   BooksAPI.search(query.trim()).then(
  //   //       books => {
  //   //         if(query===this.state.query) {
  //   //           if (books.length > 0) {
  //   //             this.setState({books: books, errorSearching: false})
  //   //             // this.shelving(this.state.books)
  //   //             this.setState({ books });
  //   //           } else {
  //   //             this.setState({ books: [], errorSearching: true})
  //   //           }}}).then(this.setState({ books }));
  //   //         }  else {
  //   //           this.setState({ books: [], errorSearching: false });
  //   //         }//else
  //
  //     // this.shelving(this.state.books)
  //
  //      this.initMap()
  //
  // }//updateQuery

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

  }//foursquareSearch

  componentDidMount() {
    this.foursquareSearch(this)
    this.initMap();
  }

  render() {
    //React blue: 00d8ff

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

    // Style the markers a bit. This will be our listing marker icon.
    const defaultIcon = this.makeMarkerIcon('00d8ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    const highlightedIcon = this.makeMarkerIcon('FFFF24');

    let bounds = new window.google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < this.state.locations.length; i++) {
      // Get the position from the location array.
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

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });


      bounds.extend(markers[i].position);
    }//loop
    // Extend the boundaries of the map for each marker
    // console.log(map, bounds)
    map = this.state.map
    if (map) map.fitBounds(bounds);

//     var listener = window.google.maps.event.addListener(map, "idle", function() {
//   if (map.getZoom() > 25) map.setZoom(25);
//   window.google.maps.event.removeListener(listener);
// });

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
    console.log("clickList function called with ", loc)
    for (let i=0; i<this.state.locations.length; i++) {
      // console.log(i)
      if (loc.referralId === this.state.locations[i].referralId) {
        console.log(this.state.locations[i])
        console.log(this.state.markers)
        window.google.maps.event.trigger(this.state.markers[i], 'click');
        console.log(this.state.markers[i])
      }
    }
  }



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
