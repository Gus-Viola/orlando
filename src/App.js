import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*
The following code came from Udacity's Google Maps API course:
initMap(),
*/



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
    let map;

    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });

    const tribeca = {lat: 40.719526, lng: -74.0089934};
    const marker = new window.google.maps.Marker({
      position: tribeca,
      map: map,
      title: 'First Marker!'
    });


  }//initMap()

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
