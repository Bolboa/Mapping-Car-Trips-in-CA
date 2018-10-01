import React, { Component } from "react";
import { connect } from "react-redux";
import MenuView from "./MenuView";
import "../../../styles/App.css";
import { fetch_menu } from "./menu_action";


const mapStateToProps = state => {
  return { map_details: state.map_details };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch_menu: () => dispatch(fetch_menu())
  };
}


class ConnectedMenu extends Component {

  constructor(props) {
    super(props);
  }


  componentDidMount = () => {

    // Request to get the information for 
    // populating the menu.
    this.props.fetch_menu();
   
  }


  render() {

    // Menu is not loaded until the data is pulled.
    if (this.props.map_details.loading) {
      return null;
    }
    return (
      <MenuView />
    );
  }
}


const Menu = connect(mapStateToProps, mapDispatchToProps)(ConnectedMenu);

export default Menu;
