import React from "react";
import { connect } from "react-redux";
import { toggle_details, update_map_by_coord } from "../actions/index";
import "./Details.css";


const mapStateToProps = state => {
  return { 
    view_details: state.view_details,
    map_configuration: state.map_configuration,
    map_details: state.map_details
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle_details: (key) => dispatch(toggle_details(key)),
    update_map_by_coord: (lat, long) => dispatch(update_map_by_coord(lat, long))
  };
}


const ConnectedDetails = ({ update_map_by_coord, map_configuration, toggle_details, view_details, map_details }) => (
  <div className="canvas_trip">
    <div className="trip_details">{
      Object.keys(map_configuration.all_trips).map((key, i) => {
        if (view_details.active_trips.has(key) == true) {
          return (
            <div 
              key={i} 
              className="trip_wrap" 
              onClick={ () => update_map_by_coord(map_configuration.all_trips[key].lat, map_configuration.all_trips[key].long) }
            >
              <div className="inner_wrap">
                <div className="wrap_title">
                  <p className="trip_p trip_title">{ map_details.date_to_name[key] }</p>
                  <button className="remove" onClick={ () => toggle_details(key) }>&#10006;</button>
                </div>
                <p className="trip_p">
                  { map_configuration.all_trips[key].speed && Math.round(map_configuration.all_trips[key].speed * 100) / 100 } MPH
                </p>
                <p className="trip_p">{ Math.round(map_configuration.all_trips[key].d_l * 100) / 100 } miles left</p>
                <p className="trip_p">
                  D:{ map_configuration.all_trips[key].duration[0] } 
                  H:{ map_configuration.all_trips[key].duration[1] } 
                  M:{ map_configuration.all_trips[key].duration[2] } 
                  S:{ map_configuration.all_trips[key].duration[3] }
                </p>
              </div>
            </div>
          )} 
      })
    }
    </div>
  </div>
);


const Details = connect(mapStateToProps, mapDispatchToProps)(ConnectedDetails);

export default Details;
