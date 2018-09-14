import React, { Component } from 'react';
import API from '../utils/API.js';
import '../styles/App.css';


class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: null,
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

  		// Save all dates in state.
  		// This is used to populate the menu.
  		this.setState({menu: data.names});
      
  	})
  	.catch(e => {
  		console.log(e);
    	return e;
    });
  }


  /*
  References parent function.
  */
  click_handler(e) {

  	// Call parent function.
  	this.props.onClick(e.target.id);

  }


  render() {
    return (
      <div className="App">
      <div className="menu-wrap">
        <p className="menu-title">Trips</p>
        <div className="menu">
          <ul onClick={(e) => this.click_handler(e)} >
            {this.state.menu && this.state.menu.map((date, index) => {
              return <li id={date} key={index}>{date}</li>;
            })}
          </ul>
        </div>
      </div>
        
      </div>
    );
  }
}

export default Menu;
