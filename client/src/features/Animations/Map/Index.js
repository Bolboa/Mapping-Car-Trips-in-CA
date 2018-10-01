import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import { connect } from "react-redux";
import { toggle_details } from "../actions/index";
import { update_map, update_trip } from "./map_action";
import { update_map_by_key, update_map_by_coord } from "../actions/index"; 
import * as turf from "@turf/turf";
import API from "../../../utils/API";
import "./Map.css";


// Car design used for the animations.
const car = require("./resources/merc.png");


const mapStateToProps = state => {
  return { 
    view_details: state.view_details,
    map_configuration: state.map_configuration
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle_details: (key) => dispatch(toggle_details(key)),
    update_map: (details) => dispatch(update_map(details)),
    update_trip: (all_trips) => dispatch(update_trip(all_trips)),
    update_map_by_key: (key) => dispatch(update_map_by_key(key)),
    update_map_by_coord: (lat, long) => dispatch(update_map_by_coord(lat, long))
  };
}


class ConnectedMap extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      alter: 90,
      time_per_step: 1000,
      doubling_limit: 6,
    };
  }


  /*
  Check if the redux states have updated.
  */
  componentWillReceiveProps = (nextprops) => {
    
    // Check if trip is active or not.
    if (nextprops.view_details.active_trips.has(nextprops.view_details.curr)) {

      // If there is a change in state, 
      // then we need to activate the trip because
      // this means it changed from not active to active.
      if (this.props.view_details.active_trips !== nextprops.view_details.active_trips) {
        this.get_trip(nextprops.view_details.curr);
      }
    }
    else {

      // If there is a change in state,
      // we remove the trip because this means the trip
      // changed states from active to not active.
      if (this.props.view_details.active_trips !== nextprops.view_details.active_trips) {
        this.remove_trip(nextprops.view_details.curr);
      }
      
    }
  }


  /*
  Remove a trip.
  */
  remove_trip = (trip) => {

    // Move to the location where the car was
    // last seen.
    this.props.update_map_by_key(trip);

    // Get map.
    const map = this.reactMap.getMap();

    // Remove the animation from the map.
    map.removeLayer("route"+trip);
    map.removeLayer("point"+trip);
    map.removeSource("route"+trip);
    map.removeSource("point"+trip);

  }


  /*
  Calculate the midpoint between two sets of coordinates.
  */
  middle_point = (coord1, coord2) => {

    let long1 = coord1[0];
    let lat1 = coord1[1];

    let long2 = coord2[0];
    let lat2 = coord2[1];

    // Longitude difference.
    let d_long = (long2 - long1) * Math.PI / 180;

    // Convert to radians.
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    long1 = long1 * Math.PI / 180;

    // The math is hard to comprehend, but essentially we must take into account that
    // the coordinates represent points on a spherical surface.
    let b_x = Math.cos(lat2) * Math.cos(d_long);
    let b_y = Math.cos(lat2) * Math.sin(d_long);
    
    let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + b_x) * (Math.cos(lat1) + b_x) + b_y * b_y)); 
    let long3 = long1 + Math.atan2(b_y, Math.cos(lat1) + b_x);

    // Return result.
    return [long3 * 180/Math.PI, lat3 * 180/Math.PI];

  }


    /*
  Create new route for the map.
  */
  create_route = (map, route, id) => {
    
    // Define the route.
    map.addSource(id, { 
      "type": "geojson",
      "data": route 
    });
    
    // Draw the route.
    map.addLayer({
      "id": id,
      "source": id,
      "type": "line",
      "paint": { 
        "line-width": 2,
        "line-color": "#007cbf" 
      }
    });

  }


  /*
  Define a point.
  */
  create_point = (map, point, id, image) => {

    // Define the starting coordinate of the point.
    map.addSource(id, { 
      "type": "geojson",
      "data": point 
    });

    // Load an image to replace the point.
    map.loadImage(image, function(error, image) {
      if (error) throw error;
      map.addImage("image", image);
      map.addLayer({ 
        "id": id,
        "type": "symbol",
        "source": id,
        "layout": { 
          "icon-image": "image",
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-size": 0.05,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true 
        }
      });
    });
  }


  /*
  Calculate the amount of time left for a point to reach its destination.
  */
  duration = (delta) => {

    // Calculate days.
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // Calculate hours.
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // Calculate minutes.
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // Calculate seconds.
    let seconds = delta % 60; 

    return [days, hours, minutes, seconds];

  }


  /*
  Rotate the car so that it is aligned with its route.
  */
  rotate_bearing = (bearing) => {
    
    // When we alter it, we must ensure that it remains within
    // the range of [-180, 180].
    if ((bearing + this.state.alter) > 180) {
      let new_calc = (bearing + this.state.alter) - 360;
      return new_calc;
    }

    return bearing + this.state.alter;

  }


  /*
  Gets the trip details and performs an animation of a point along a route.
  */
  get_trip = (trip) => {

    // Get map details.
    const map = this.reactMap.getMap();


    // Create API reference.
    const api = new API({ url: process.env.API_URL });

    // Define the headers.
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    
    // Query parameter.
    api.create_entity({ name: "trip"}, headers);

    // GET request for a specific date.
    api.endpoints.trip.get_one({ id: trip })
    .then(result => result.json())
    .then(data => {

      // Total distance travelled.
      let total_dist = [];

      // All recorded speeds.
      let total_speed = [];

      // All recorded coordinates.
      let total_coords = [];

      // Get trip details.
      for (let i=0; i<data.coords.length; i++) {
        total_coords.push([data.coords[i].lng, data.coords[i].lat]);
        total_dist.push([data.coords[i].dist]);
        total_speed.push([data.coords[i].speed]);
      }
   
      // Calculate midoints for a smoother animation.
      for (let i=0; i<this.state.doubling_limit; i++) {
        let extended_coords = [];
        for (let j=0; j<total_coords.length; j++) {
          if (j > 0) {
            extended_coords.push(this.middle_point(total_coords[j-1], total_coords[j]));
          }
          extended_coords.push(total_coords[j]);
        }
        total_coords = extended_coords;
      }
      
      
      // Change the viewport to the newest trip added.
      this.props.update_map_by_coord(total_coords[0][1], total_coords[0][0]);

      
      // Define the coordinates of the route being added.
      var route = { 
        "type": "FeatureCollection",
        "features": [{ 
          "type": "Feature",
          "geometry": { 
            "type": "LineString",
            "coordinates": total_coords 
          }
        }]
      };

      // Define the coordinates of the car.
      var point = { 
        "type": "FeatureCollection",
        "features": [{ 
          "type": "Feature",
          "properties": { 
            "description": "<strong>Speed</strong><p>0</p>" 
          },
          "geometry": { 
            "type": "Point",
            "coordinates": total_coords[0] 
          }
        }]
      };


      // Counter used to move the point along a path.
      let counter = 0;

      // Counter used to update the details of every route.
      let details_counter = 0;

      // We need unique IDs for every new route and car.
      const route_id = "route" + trip;
      const point_id = "point" + trip;

      
      // Define the route.
      this.create_route(map, route, route_id);

      // Define the initial coordinates of the car.
      this.create_point(map, point, point_id, car);


      // Total length of trip.
      let seconds = data.coords.length - 2;
      
      // Get car details.
      let source_pt = map.getSource(point_id);

      // Helper to keep track of frame rate.
      let last = 0;

      let details_timer = 0;

      // Animation.
      const animate = (current) => {  

        // Stop the animation if we reach the end of the route.
        // Also stop the animation if the user requests it to end.
        if (counter < total_dist.length && 
          this.props.view_details.active_trips.has(trip) == true) {
          requestAnimationFrame(animate);
        } 

        // Update the details of each route every second.
        if (current >= (details_timer + 1000)) {
          
          counter += 1;

          // Time left.
          let time = this.duration(seconds);
          seconds -= 1;

          // Make copy of immutable object.
          let new_trip_details = Object.assign({}, this.props.map_configuration.all_trips);
          let curr_trip = Object.assign({}, new_trip_details[trip]);
          
          // Update speed, coordinates, distance left, and time duration left.
          curr_trip["speed"] = total_speed[counter][0];
          curr_trip["lat"] = route.features[0].geometry.coordinates[counter][1];
          curr_trip["long"] = route.features[0].geometry.coordinates[counter][0];
          curr_trip["d_l"] = total_dist[total_dist.length-1] - total_dist[counter];
          curr_trip["duration"] = time;

          // Update the trip details every second.
          new_trip_details[trip] = curr_trip;

          // Update the trip details.
          this.props.update_trip(new_trip_details);

          details_timer = current;

        }
        
        // The frame rate is 1/5 seconds.
        if (current >= (last + 62)) {

          details_counter += 1;          

          // Move from current coordinate to the next coordinate.    
          point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[details_counter];
          
          // Calculate the bearing so that it moves relative to the route. 
          point.features[0].properties.bearing = turf.bearing(
            turf.point(route.features[0].geometry.coordinates[details_counter >= route.features[0].geometry.coordinates.length-1 ? details_counter - 1 : details_counter]),
            turf.point(route.features[0].geometry.coordinates[details_counter >= route.features[0].geometry.coordinates.length-1 ? details_counter : details_counter + 1])
          );

          // Extract the bearing.
          let bearing = point.features[0].properties.bearing;

          // Rotate the car so that it is aligned with its route.
          point.features[0].properties.bearing = this.rotate_bearing(bearing);

          // Move to the next point.
          source_pt.setData(point);

          // Update the current frame rate.
          last = current;
        }

      };

      // Start the animation.
      animate();
        
    })
    .catch(err => {
      throw err;
    });

  }


  render() {

    return (
      <ReactMapGL
        className="map"
        ref={ (reactMap) => { this.reactMap = reactMap; } }
        { ...this.props.map_configuration.viewport }
        mapStyle={"mapbox://styles/mapbox/basic-v9"}
        mapboxApiAccessToken={ process.env.ACCESS_TOKEN }
        onViewportChange={ (viewport) => this.props.update_map(viewport) }
      /> 
    );
  }
}


const Map = connect(mapStateToProps, mapDispatchToProps)(ConnectedMap);

export default Map;
