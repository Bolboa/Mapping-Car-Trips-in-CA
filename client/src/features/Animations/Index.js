import React, { Component } from "react";
import Menu from "./Menu/Index";
import Map from "./Map/Index";
import Details from "./Details/Index";
import "../../styles/App.css";


/*
Controller class for all components in the Animations section.
This is the intermediary that allows data to be passed between sibling
components.
*/
class Animations extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      menu: null,
      date_to_name: {},
      all_trips: {},
      active_trips: new Set()
    };
  }

  
  /*
  Intermediary function to pass data from menu to map.
  */
  handle_dates = (titles, dates) => {
    
    this.setState({ 
      menu: titles,
      date_to_name: dates 
    });

  }


  /*
  Starts an animation on the map.
  */
  click_handler = (id) => {
    this.map.get_trip(id);
  }


  /*
  Allows Details section to update the map.
  */
  update_map = (lat, long) => {
    this.map.update_map(lat, long);
  }


  /*
  Updates the trip details.
  */
  set_trips = (trips) => {
    this.setState({ all_trips: trips });
  }


  /*
  Add an active trip.
  */
  add_active_trip = (trip) => {

    // Add an active trip to the set.
    this.setState(({ active_trips }) => {
      active_trips: new Set(active_trips.add(trip))
    });
  }


  /*
  Remove an active trip.
  */
  remove_active_trip = (trip) => {

    // Remove an active trip from the set.
    this.setState(({ active_trips }) => {
      active_trips.delete(trip)

      return {
        active_trips: new Set(active_trips)
      };
    });
  }


  /*
  Allows the Details section to remove a trip.
  */
  toggle_trip = (trip) => {
    this.map.toggle_trip(trip);
  }


  render() {
    return (
      <div className="App">
        <Menu 
          pass_dates_to_parent={ (titles, dates) => this.handle_dates(titles, dates) }  
          onClick={ (id) => this.click_handler(id) } 
          menu={ this.state.menu }
          date_to_name={ this.state.date_to_name }
        />
        <Details
          translate={ this.state.date_to_name } 
          active_trips={ this.state.active_trips } 
          mapping={ this.state.all_trips } 
          controller_update_map={ (lat, long) => this.update_map(lat, long) } 
          controller_toggle_trip={ (trip) => this.toggle_trip(trip) }
        />
        <Map 
          translate={ this.state.date_to_name }
          all_trips={ this.state.all_trips }
          active_trips={ this.state.active_trips } 
          controller_set_trips={ (trips) => this.set_trips(trips) }
          controller_toggle_trip={ (trip) => this.toggle_trip(trip) }
          controller_add_active_trip={ (trip) => this.add_active_trip(trip) }
          controller_remove_active_trip={ (trip) => this.remove_active_trip(trip) }
          ref={ instance => { this.map = instance; } } 
        />
      </div>
    );
  }
}

export default Animations;
