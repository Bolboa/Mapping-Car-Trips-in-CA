const initial_state = {
  viewport: {
    width:window.innerWidth,
    height:window.innerHeight,
    latitude: 37.36531661007267,
    longitude: -122.40431714930452,
    zoom: 10,
    maxZoom: 15
  },
  all_trips: {}
};
    
const map_configuration = (state = initial_state, action) => {
    
  switch (action.type) {
    
    case "UPDATE_MAP":
      
      return {
        ...state,
        viewport: {
          ...action.payload
        }
      };
    
    
    case "UPDATE_TRIP":
      return {
        ...state,
        all_trips: { ...action.payload }
      }

    
    case "UPDATE_MAP_BY_KEY":
      
      // Get latitude and logitude from the car's current location.
      let lat = state.all_trips[action.payload]["lat"];
      let long = state.all_trips[action.payload]["long"];

      return {
        ...state,
        viewport: {
          ...state.viewport,
          latitude: lat,
          longitude: long
        }
      }

    
    case "UPDATE_MAP_BY_COORD":
      
      return {
        ...state,
        viewport: {
          ...state.viewport,
          latitude: action.payload.lat,
          longitude: action.payload.long
        }
      }
    
        
    default:
      return state;
    
  }
};


export default map_configuration;