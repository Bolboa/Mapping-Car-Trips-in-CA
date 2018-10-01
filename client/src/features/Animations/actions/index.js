export const toggle_details = view => ({
  type: "TOGGLE_DETAILS",
  payload: view
});

export const update_map_by_key = key => ({
  type: "UPDATE_MAP_BY_KEY",
  payload: key
});

export const update_map_by_coord = (latitude, longitude) => ({
  type: "UPDATE_MAP_BY_COORD",
  payload: {
    lat: latitude,
    long: longitude
  }
});