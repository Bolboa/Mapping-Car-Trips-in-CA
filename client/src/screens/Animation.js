import React, { Component } from "react";
import Menu from "../features/Animations/Menu/Index";
import Map from "../features/Animations/Map/Index";
import Details from "../features/Animations/Details/Index";
import "../styles/App.css";


const Animation = () => (
  <div className="App">
    <Menu />
    <Details />
    <Map />
  </div>
);

export default Animation;
