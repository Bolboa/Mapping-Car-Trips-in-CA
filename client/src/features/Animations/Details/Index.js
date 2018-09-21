import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import * as turf from "@turf/turf";
import DetailsView from "./DetailsView";


class Details extends Component {

    constructor(props) {
      super(props);
    }
  
  
    /*
    Tells parent (Map Class) to move the map to a specific set of coordinates.
    */
    update_map = (lat, long) => {
      this.props.controller_update_map(lat, long);
    }
  
  
    /*
    Tells parent (Map Class) to remove an active trip from the map.
    */
    toggle_trip = (key) => {
      this.props.controller_toggle_trip(key);
    }
  
  
    render() {
          
      return (
        <DetailsView
            mapping={this.props.mapping}
            active_trips={this.props.active_trips}
            translate={this.props.translate}
            update_map={ (lat, long) => this.update_map(lat, long)}
            toggle_trip={ (key) => this.toggle_trip(key) }
        />
      );
    }
  }

  export default Details;