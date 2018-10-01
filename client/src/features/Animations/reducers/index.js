const initial_state = {
  curr: "",
  active_trips: new Set(),
};
  
const view_details = (state = initial_state, action) => {
  
  switch (action.type) {
    
    case "TOGGLE_DETAILS":
      
      let new_trip;

      // Logic for adding and removing active trips.
      if (state.active_trips.has(action.payload)) {

        // Remove active trip.
        state.active_trips.delete(action.payload);
        new_trip = new Set(state.active_trips);

      }
      else {

        // Add active trip.
        new_trip = new Set(state.active_trips.add(action.payload));

      }
        
      return {
        ...state,
        curr: action.payload, 
        active_trips: new_trip 
      };

    default:
      return state;
  
  }
};
  

export default view_details;