import React from "react";
import PropTypes from "prop-types";
import "./Menu.css";


const MenuView = ({ click_handler, menu, date_to_name }) => (
  <div className="App">
    <div className="menu-wrap">
      <p className="menu-title">Trips</p>
      <div className="menu">
        <ul onClick={(e) => click_handler(e)} >
          {menu && menu.map((date, index) => {
            return <li id={date} key={index}>{date_to_name[date]}</li>;
          })}
        </ul>
      </div>
    </div>    
  </div>
);


// Check types of all the props.
MenuView.propTypes = {
  click_handler: PropTypes.func,
  menu: PropTypes.arrayOf(PropTypes.string.isRequired),
  date_to_name: PropTypes.objectOf(PropTypes.string.isRequired),
};


export default MenuView;
