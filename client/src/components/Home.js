import React, { Component } from "react";
import Menu from "./Menu";
import Map from "./Map";
import API from "../utils/API.js";
import "../styles/App.css";


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: null,
      date_to_name: {}
    }
  }


  componentDidMount() {

    // Create API reference.
    const api = new API({url: process.env.API_URL});
    
    // Query parameter.
    api.create_entity({ name: 'dates'});

    // GET request for all dates.
    api.endpoints.dates.get_all()
    .then(result => result.json())
    .then(data => {

      // Stores all the menu options.
      let menu_titles = []; 

      // Map each date to a menu option.
      let titles_mapping = Object.assign({}, this.state.date_to_name);
      
      for (let i=0; i<data.names.length; i++) {
        titles_mapping[data.names[i]] = "Car Trip " + (i+1);
        menu_titles.push(data.names[i]);
      }

      // Set the new states.
      this.setState({date_to_name: titles_mapping});
      this.setState({menu: menu_titles});
      
    })
    .catch(e => {
      console.log(e);
      return e;
    });
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
        <Menu menu={this.state.menu} translate={this.state.date_to_name} onClick={(id) => this.click_handler(id)} />
        <Map translate={this.state.date_to_name} ref={instance => { this.map = instance; }} />
      </div>
    );
  }
}

export default Home;
