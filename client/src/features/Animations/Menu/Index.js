import React, { Component } from "react";
import API from "../../../utils/API";
import MenuView from "./MenuView";
import "../../../styles/App.css";


class Menu extends Component {

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

      // Set states for the menu component.
      this.setState({menu: menu_titles});
      this.setState({date_to_name: titles_mapping});

      // Pass data to the parent component to be used by other components.
      this.props.pass_dates_to_parent(menu_titles, titles_mapping);
      
    })
    .catch(e => {
      console.log(e);
      return e;
    });
  }


  /*
  References parent function.
  */
  click_handler = (e) => {

  	// Call parent function.
  	this.props.onClick(e.target.id);

  }


  render() {

    // Menu is not loaded until the data is pulled.
    if (!this.state.menu) {
      return null;
    }
    return (
        <MenuView
            click_handler={(e) => this.click_handler(e)}
            menu={this.state.menu}
            date_to_name={this.state.date_to_name}
        />
    );
  }
}

export default Menu;
