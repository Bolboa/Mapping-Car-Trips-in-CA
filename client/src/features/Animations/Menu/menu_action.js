import API from "../../../utils/API";


/*
Call to API to get menu details.
*/
export const fetch_menu = () => {

  // Create API reference.
  const api = new API({ url: process.env.API_URL });

  // Define the headers.
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  
  // Query parameter.
  api.create_entity({ name: "dates" }, headers);

  return dispatch => {
      
    // Request is in process.
    dispatch(fetch_products_begin());
    
    // Get all the menu values.
    return api.endpoints.dates.get_all()
      .then(result => result.json())
      .then(data => {
          
        // Request is successful.
        dispatch(fetch_products_success(data));

      })
      .catch(err => dispatch(fetch_products_failure(err)));
      
  }
}

/*
Request is in process.
*/
export const fetch_products_begin = () => ({
  type: "FETCH_PRODUCTS_BEGIN"
});

/*
Request is successful.
*/
export const fetch_products_success = data => ({
  type: "FETCH_PRODUCTS_SUCCESS",
  payload: data
});

/*
Request failed.
*/
export const fetch_products_failure = err => ({
  type: "FETCH_PRODUCTS_FAILURE",
  payload: err
});