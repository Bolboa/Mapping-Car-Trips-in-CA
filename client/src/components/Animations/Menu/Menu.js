import React, { Component } from "react";
import API from "../../../utils/API";
import "./Menu.css";
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

      // Set the new states.
      this.setState({date_to_name: titles_mapping});
      this.setState({menu: menu_titles});

      // Pass data to the parent component.
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
      <div className="App">
      <div className="menu-wrap">
        <p className="menu-title">Trips</p>
        <div className="menu">
          <ul onClick={(e) => this.click_handler(e)} >
            {this.state.menu && this.state.menu.map((date, index) => {
              return <li id={date} key={index}>{this.state.date_to_name[date]}</li>;
            })}
          </ul>
        </div>
      </div>
        
      </div>
    );
  }
}

export default Menu;
