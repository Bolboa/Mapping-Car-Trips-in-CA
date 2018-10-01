const initial_state = {
  loading: false,
  error: null,
  menu: null,
  date_to_name: {}
};


/*
Reqeust to get all the map details from the API.
*/
const map_details = (state = initial_state, action) => {
  
  switch (action.type) {
    
    case "FETCH_PRODUCTS_BEGIN":
      
      return {
        ...state, 
        loading: true
      };
    

    case "FETCH_PRODUCTS_SUCCESS":
      
      // Menu titles.
      let populated_menu = [];

      // Each title is mapped to a user-friendly title.
      let titles_mapping = Object.assign({}, state.date_to_name);  

      // Populate the menu.
      for (let i=0; i<action.payload.names.length; i++) {
        populated_menu.push(action.payload.names[i]);
        titles_mapping[action.payload.names[i]] = "Car Trip " + (i+1);
      }

      return {
        ...state,
        loading: false,
        menu: populated_menu,
        date_to_name: titles_mapping
      }
    

    case "FETCH_PRODUCTS_FAILURE":

      return {
        ...state,
        loading: false,
        error: action.payload,
        menu: null,
        date_to_name: {}
      }
      
      
    default:
      return state;

  }
};
  

export default map_details;