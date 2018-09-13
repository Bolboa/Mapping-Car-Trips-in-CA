import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import * as turf from '@turf/turf';
import Details from './Details';
import API from './API';

var car = require('../resources/merc.png');


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width:window.innerWidth,
        height:window.innerHeight,
        latitude: 37.36531661007267,
        longitude: -122.40431714930452,
        zoom: 10,
        maxZoom: 15
      },
      map: null,
      all_trips: {},
      status: {},
      alter: 90,
      time_per_step: 1000
    };
  }


  /*
  Calculate the amount of time left for a point to reach its destination.
  */
  duration(delta) {

    // Calculate days.
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // Calculate hours.
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // Calculate minutes.
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // Calculate seconds.
    var seconds = delta % 60; 

    return [days, hours, minutes, seconds];

  }

  /*
  Gets the trip details and performs an animation of a point along a route.
  */
  get_trip(trip) {
    
    // Get map details.
    const map = this.reactMap.getMap();

    // We must keep track of how many times the button to create a trip is pressed.
    // The first time it is pressed, we must create a trip. The second time it is pressed, we
    // must remove the trip if still exits.
    this.remove(trip);

    // Create API reference.
    const api = new API({url: process.env.API_URL});
    
    // Query parameter.
    api.create_entity({ name: 'trip'});

    // GET request for a specific date.
    api.endpoints.trip.get_one({id: trip})
    .then(result => result.json())
    .then(data => {

      // Total distance travelled.
      var total_dist = [];

      // All recorded speeds.
      var total_speed = [];

      // All recorded coordinates.
      var total_coords = [];

      // Get trip details.
      for (var i=0; i<data.coords.length; i++) {
        total_coords.push([data.coords[i].lng, data.coords[i].lat]);
        total_dist.push([data.coords[i].dist]);
        total_speed.push([data.coords[i].speed]);
      }
      
      // Change the viewport to the newest trip added.
      this.update_map(total_coords[0][1], total_coords[0][0]);
      

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

      // Counter used to move along a path.
      var counter = 0;

      // We need unique IDs for every new route and car.
      var route_id = 'route' + trip;
      var point_id = 'point' + trip;

      // If this trip does not currently exist, add the coordinates for the trip.
      if (this.state.status[trip] == false) {

        // Define the route.
        this.create_route(map, route, route_id);

        // Define the initial coordinates of the car.
        this.create_point(map, point, point_id, car);
      
      }

      // Total length of trip.
      var seconds = data.coords.length - 2;
      
      // Get car details.
      var source_pt = map.getSource(point_id);

      // Animation.
      var timer = function() {

        counter += 1;       
        
        // Stop the animation if we reach the end of the route.
        // Also stop the animation if the user requests it to end.
        if (counter >= route.features[0].geometry.coordinates.length || this.state.status[trip] == true || source_pt == undefined) {
          clearInterval(interval);
        } 
        else {

          // Time left.
          var time = this.duration(seconds);

          // Make copy of immutable object.
          let new_trip_details = Object.assign({}, this.state.all_trips);
          let curr_trip = Object.assign({}, new_trip_details[trip]);
          
          // Update speed, coordinates, distance left, and time duration left.
          curr_trip["speed"] = total_speed[counter];
          curr_trip["lat"] = route.features[0].geometry.coordinates[counter][1];
          curr_trip["long"] = route.features[0].geometry.coordinates[counter][0];
          curr_trip["d_l"] = total_dist[total_dist.length-1] - total_dist[counter];
          curr_trip["duration"] = time;

          // Update the trip details every second.
          new_trip_details[trip] = curr_trip;
          this.setState({all_trips: new_trip_details});

          // Decrement time left to destination.
          seconds -= 1;

          // Move from current coordinate to the next coordinate.    
          point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];
          
          // Calculate the bearing so that it moves relative to the route. 
          point.features[0].properties.bearing = turf.bearing(
            turf.point(route.features[0].geometry.coordinates[counter >= route.features[0].geometry.coordinates.length-1 ? counter - 1 : counter]),
            turf.point(route.features[0].geometry.coordinates[counter >= route.features[0].geometry.coordinates.length-1 ? counter : counter + 1])
          );

          // Extract the bearing.
          var bearing = point.features[0].properties.bearing;

          // Some rotation is required as the car is not aligned with the route
          // by default.
          if ((bearing + this.state.alter) > 180) {
            var new_calc = (bearing + this.state.alter) - 360;
            point.features[0].properties.bearing = new_calc;
          }
          else {
            point.features[0].properties.bearing += this.state.alter;
          }

          // Move to the next point.
          source_pt.setData(point);

          }

        }.bind(this);

        // Start the animation.
        var interval = setInterval(timer, this.state.time_per_step);
        
    })
    .catch(e => {

      console.log(e);
      return e;

    });

  }


  /*
  Create new route for the map.
  */
  create_route(map, route, id) {
    
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
  create_point(map, point, id, image) {

    // Define the starting coordinate of the point.
    map.addSource(id, {
      "type": "geojson",
      "data": point
    });

    // Load an image to replace the point.
    map.loadImage(image, function(error, image) {
      if (error) throw error;
      map.addImage('image', image);
      map.addLayer({
          "id": id,
          "type": "symbol",
          "source": id,
          "layout": {
              "icon-image": "image",
              "icon-rotate": ["get", "bearing"],
              "icon-rotation-alignment": "map",
              "icon-size": 0.1,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true
          }
      });
    });
  }


  /*
  Move the map to a specific set of coordinates.
  */
  update_map(lat, long) {
      
      // Change the viewport to the current trip selected.
      let new_viewport = Object.assign({}, this.state.viewport);
      new_viewport.latitude = lat;
      new_viewport.longitude = long;
      this.setState({viewport: new_viewport});

  }


  /*
  Remove an active trip from the map.
  */
  remove(key) {

    // Get map.
    const map = this.reactMap.getMap();

    // Check if trip is active or not. The status of its activation is logged
    // for each trip.
    if (this.state.status[key] == undefined || this.state.status[key] == true) {
      
      let status_details = Object.assign({}, this.state.status);
      // Reverse the status.
      status_details[key] = false;

      this.setState({status: status_details});
    }
    else {
      
      let status_details = Object.assign({}, this.state.status);
      
      // Reverse the status.
      status_details[key] = true;
      
      // Remove the trip from the map.
      this.setState({
        status: status_details
      }, () => {
        map.removeLayer("route"+key);
        map.removeLayer("point"+key);
        map.removeSource("route"+key);
        map.removeSource("point"+key);
      });

    }
  }


  render() {
    const mapping = Object.assign({}, this.state.all_trips);
    return (

      <div>
      <Details 
        status={this.state.status} 
        mapping={this.state.all_trips} 
        mapping_handler={(lat, long) => this.update_map(lat, long)} 
        remove_animation_handler={(key) => this.remove(key)}
      />

      <div className="map">
        <ReactMapGL
          ref={(reactMap) => { this.reactMap = reactMap; }}
          {...this.state.viewport}
          mapStyle={'mapbox://styles/mapbox/basic-v9'}
          mapboxApiAccessToken={"pk.eyJ1IjoiYm9sYm9hIiwiYSI6ImNqbHE0MHQ0dTJiemgzcm4zN3A2NjkyNXYifQ.OYEtZo6vhsw_DLsWPhYYBA"}
          onViewportChange={(viewport) => this.setState({viewport})}
        >
        </ReactMapGL>
        
      
        
      </div></div>
    );
  }
}

export default Map;
