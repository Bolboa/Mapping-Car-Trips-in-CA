import React, { Component } from 'react';
import Menu from './Menu';
import Map from './Map';
import '../styles/App.css';


class App extends Component {

  constructor(props) {
    super(props);
  }


  /*
  Starts an animation on the map.
  */
  click_handler(id) {
    this.map.get_trip(id)
  }


  render() {
    return (
      <div className="App">
        <Menu onClick={(id) => this.click_handler(id)} />
        <Map ref={instance => { this.map = instance; }} />
      </div>
    );
  }
}

export default App;
