import React from "react";
import { connect } from "react-redux";
import { toggle_details } from "../actions/index";
import PropTypes from "prop-types";
import "./Menu.css";
import map_details from "./menu_reducer";


const mapStateToProps = state => {
  return { 
    view_details: state.view_details,
    map_details: state.map_details 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle_details: (key) => dispatch(toggle_details(key))
  };
}


const ConnectedMenuView = ({ toggle_details, map_details }) => (
  <div className="App">
    <div className="menu-wrap">
      <p className="menu-title">Trips</p>
      <div className="menu">
        <ul onClick={ (e) => toggle_details(e.target.id) } >
          { map_details.menu && map_details.menu.map((date, index) => {
            return <li id={ date } key={ index }>{ map_details.date_to_name[date] }</li>;
          })}
        </ul>
      </div>
    </div>    
  </div>
);


const MenuView = connect(mapStateToProps, mapDispatchToProps)(ConnectedMenuView);

export default MenuView;
