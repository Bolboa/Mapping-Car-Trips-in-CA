import React, { Component } from "react";
import Menu from "../components/Animations/Menu/Menu";
import Map from "../components/Animations/Map/Map";
import "../styles/App.css";


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: null,
      date_to_name: {}
    }
  }


  /*
  Intermediary function to pass data from menu to map.
  */
  handle_dates = (titles, dates) => {
    this.setState({menu: titles});
    this.setState({date_to_name: dates});
  }


  /*
  Starts an animation on the map.
  */
  click_handler = (id) => {
    this.map.get_trip(id)
  }


  render() {
    return (
      <div className="App">
        <Menu 
          pass_dates_to_parent={(titles, dates) => this.handle_dates(titles, dates)}  
          onClick={(id) => this.click_handler(id)} 
        />
        <Map 
          translate={this.state.date_to_name} 
          ref={instance => { this.map = instance; }} 
        />
      </div>
    );
  }
}

export default Home;
