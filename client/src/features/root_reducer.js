import { combineReducers } from "redux";
import view_details from "./Animations/reducers/index";
import map_details from "./Animations/Menu/menu_reducer";
import map_configuration from "./Animations/Map/map_reducer"


export default combineReducers({
  view_details,
  map_details,
  map_configuration
});
