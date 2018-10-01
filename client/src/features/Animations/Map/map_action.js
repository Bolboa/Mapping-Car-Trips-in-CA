/*
Update the map when it is dragged.
*/
export const update_map = update => ({
  type: "UPDATE_MAP",
  payload: update
});


/*
Update the trip details for the active cars.
*/
export const update_trip = details => ({
  type: "UPDATE_TRIP",
  payload: details
});
  