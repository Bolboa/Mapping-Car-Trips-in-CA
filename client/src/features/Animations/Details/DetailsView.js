import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Details.css";


const DetailsView = ({ mapping, active_trips, translate, update_map, toggle_trip }) => (
  <div className="canvas_trip">
    <div className="trip_details">{
      Object.keys(mapping).map((key, i) => {
        if (active_trips.has(key) == true) {
          return (
            <div 
              key={i} 
              className="trip_wrap" 
              onClick={ () => update_map(mapping[key].lat, mapping[key].long)}
            >
              <div className="inner_wrap">
                <div className="wrap_title">
                  <p className="trip_p trip_title">{translate[key]}</p>
                  <button className="remove" onClick={() => toggle_trip(key)}>&#10006;</button>
                </div>
                <p className="trip_p">
                  {mapping[key].speed && Math.round(mapping[key].speed * 100) / 100 } MPH
                </p>
                <p className="trip_p">{Math.round(mapping[key].d_l * 100) / 100 } miles left</p>
                <p className="trip_p">
                  D: {mapping[key].duration[0]} 
                  H:{mapping[key].duration[1]} 
                  M:{mapping[key].duration[2]} 
                  S:{mapping[key].duration[3]}
                </p>
              </div>
            </div>
            )} 
          })
        }
    </div>
  </div>
);

// Check types of all the props.
DetailsView.propTypes = {
  mapping: PropTypes.objectOf(
    PropTypes.shape({
      speed: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired,
      d_l: PropTypes.number.isRequired,
      duration: PropTypes.arrayOf(PropTypes.number.isRequired)
    })
  ),
  active_trips: PropTypes.objectOf(PropTypes.string.isRequired),
  translate: PropTypes.objectOf(PropTypes.string.isRequired),
  update_map: PropTypes.func.isRequired,
  toggle_trip: PropTypes.func.isRequired
};


export default DetailsView;
