
class API {

  constructor({ url }) {
    this.url = url;
    this.endpoints = {};
  }
  
  
  /*
  Create and store a single entity's endpoints.
  */
  create_entity(entity) {
    this.endpoints[entity.name] = this.create_basic_CRUD_endpoints(entity);
  }
  
  create_entities(array_of_entities) {
    array_of_entities.forEach(this.create_entities.bind(this));
  }
  
  
  /*
  Create the basic endpoint handlers for CRUD operations.
  */
  create_basic_CRUD_endpoints({ name }) {
      
    var endpoints = {};
    const resource_url = `${this.url}/${name}`;
        
    // Fetch all objects.
    endpoints.get_all = ({query}={}) => fetch(resource_url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
      
    // Fetch a specific object.
    endpoints.get_one = ({ id }) =>  fetch(`${resource_url}/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
  
    return endpoints;

  }
  
}


export default API;