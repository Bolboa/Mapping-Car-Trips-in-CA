import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import * as turf from '@turf/turf';

var car = require('../resources/merc.png');


class Details extends Component {

  constructor(props) {
    super(props);
  }


  /*
  Tells parent (Map Class) to move the map to a specific set of coordinates.
  */
  update_map(lat, long) {
    this.props.mapping_handler(lat, long);
  }


  /*
  Tells parent (Map Class) to remove an active trip from the map.
  */
  toggle_trip(key) {
    this.props.remove_animation_handler(key);
  }


  render() {
        
    return (
      <div className="canvas_trip">
      <div className="trip_details">{
        Object.keys(this.props.mapping).map((key, i) => {
          if (this.props.status.has(key) == true) {
            return (
            <div key={i} className="trip_wrap" onClick={ () => this.update_map(this.props.mapping[key].lat, this.props.mapping[key].long)}>
              <div className="inner_wrap">
                <div className="wrap_title">
                  <p className="trip_p trip_title">{this.props.translate[key]}</p>
                  <button className="remove" onClick={() => this.toggle_trip(key)}>&#10006;</button>
                </div>
                <p className="trip_p">
                  {this.props.mapping[key].speed && Math.round(this.props.mapping[key].speed[0] * 100) / 100 } MPH
                </p>
                <p className="trip_p">{Math.round(this.props.mapping[key].d_l * 100) / 100 } miles left</p>

                <p className="trip_p">D: {this.props.mapping[key].duration[0]} H:{this.props.mapping[key].duration[1]} M:{this.props.mapping[key].duration[2]} S:{this.props.mapping[key].duration[3]}</p>
              </div>
            </div>
            )} 
          })
        }
        </div>
      </div>
    );
  }
}

export default Details;
