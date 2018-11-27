import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


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
    // Constructor creates a new map - only center and zoom are required.
    let map;
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });
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
