import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*
The following code came from Udacity's Google Maps API course:
initMap(), populateInfoWindow(), marker functions
as well as suggested variables, such as map, markers, etc.
The following code came from my Udacity's myreads project
query state, updateQuery, etc
I used the npm yelp package
https://www.npmjs.com/package/yelp-api

2) E colocar uma lista dos lugares com a opção de filtrar eles por nome
3) Aria Roles
4) Yelp API

*/

let map;
let markers =[];


class App extends Component {

  state = {

      locations: [
       {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, marker: 6},
       {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, marker: 1},
       {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}, marker: 2},
       {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, marker: 3},
       {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, marker: 4},
       {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, marker: 5}
     ],
     query: '',
     errorSearching: false
  }


  updateQuery = (query) => {
    // this.setState({ query: query })

    //refactoring of the shelving and auxliary functions
    // const books  = this.state.books.map(book => {
    //     const found = this.props.appStateBooks.find(appBook => appBook.id === book.id);
    //     if(found) {
    //         return found;
    //     } else {
    //         return book
    //     }
    // })

    // if (query) {
    //
    //   BooksAPI.search(query.trim()).then(
    //       books => {
    //         if(query===this.state.query) {
    //           if (books.length > 0) {
    //             this.setState({books: books, errorSearching: false})
    //             // this.shelving(this.state.books)
    //             this.setState({ books });
    //           } else {
    //             this.setState({ books: [], errorSearching: true})
    //           }}}).then(this.setState({ books }));
    //         }  else {
    //           this.setState({ books: [], errorSearching: false });
    //         }//else

      // this.shelving(this.state.books)

fetch('https://api.foursquare.com/v2/venues/explore?client_id=SJV1ISHPCCXJPD51FD0YFB5424GZZ0Q1E1THCOM12G21UPKO&client_secret=QJQBOLAC1SPUD0KZR2TJ5R1QGE3TEJGFWPPUB4HUHX1OLXBF&v=20180323&ll=40.7413549,-73.9980244&radius=1000&query=attraction')
  .then(response => response.json()).then(result => {
    // console.log(result.response.groups[0].items)})
    console.log(result.response.groups[0].items);
    this.setState({ locations : result.response.groups[0].items});
    console.log(this.state.locations);
    this.initMap();
  })
  .catch(err => console.log("I received the following error: "+err))
      // this.setState({ books });

  }//updateQuery



  componentDidMount() {
    this.initMap();
  }

  render() {
    //React blue: 00d8ff
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <input
            type="text"
            placeholder="Search by title or author"
            value = {this.state.query}
            onChange={(event)=> this.updateQuery(event.target.value) }
          />

        </header>
          <div id="map"></div>
      </div>

    );
  }//render

  initMap() {


    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
      mapTypeControl: false
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    // const locations = [
    //   {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    //   {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    //   {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    //   {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    //   {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    //   {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    // ];

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = this.makeMarkerIcon('00d8ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = this.makeMarkerIcon('FFFF24');


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
    map.fitBounds(bounds);



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
