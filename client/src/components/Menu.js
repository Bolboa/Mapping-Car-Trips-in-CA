import React, { Component } from "react";
import "../styles/App.css";


class Menu extends Component {

  constructor(props) {
    super(props);
  }


  /*
  References parent function.
  */
  click_handler(e) {

  	// Call parent function.
  	this.props.onClick(e.target.id);

  }


  render() {

    // Menu is not loaded until the data is pulled.
    if (!this.props.menu) {
      return null;
    }
    
    return (
      <div className="App">
      <div className="menu-wrap">
        <p className="menu-title">Trips</p>
        <div className="menu">
          <ul onClick={(e) => this.click_handler(e)} >
            {this.props.menu && this.props.menu.map((date, index) => {
              return <li id={date} key={index}>{this.props.translate[date]}</li>;
            })}
          </ul>
        </div>
      </div>
        
      </div>
    );
  }
}

export default Menu;
