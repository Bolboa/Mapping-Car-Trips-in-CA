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
  remove(key) {
    this.props.remove_animation_handler(key);
  }


  render() {
    
    // Copy of animation details.
    const mapping = Object.assign({}, this.props.mapping);
    
    return (
      <div className="canvas_trip">
      <div className="trip_details">{
        Object.keys(mapping).map((key, i) => {
          if (this.props.status[key] == false) {
            return (
            <div className="trip_wrap" onClick={ () => this.update_map(mapping[key].lat, mapping[key].long)}>
              <div className="inner_wrap">
                <p className="trip_p">{key}</p>
                <p className="trip_p">
                  {mapping[key].speed && Math.round(mapping[key].speed[0] * 100) / 100 } MPH
                </p>
                <p className="trip_p">{Math.round(mapping[key].d_l * 100) / 100 } miles left</p>

                <p className="trip_p">D: {mapping[key].duration[0]} H:{mapping[key].duration[1]} M:{mapping[key].duration[2]} S:{mapping[key].duration[3]}</p>
                <button onClick={() => this.remove(key)}>X</button>
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
