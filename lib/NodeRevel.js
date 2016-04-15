'use strict'

var Client = require('node-rest-client').Client;
var client = new Client();

class NodeRevel {

  //lets do this thing
  constructor(endpoint, apiKey, apiSecret, enterpriseUserUri) {

    if (!this) return new KristoRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);

    this.endpoint = this._prepareEndpoint(endpoint);
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.enterpriseUserUri = enterpriseUserUri;

  }


  insertCustomer(customerObject) {

    const resourceUrl = 'resources/Customer/';
    console.log(resourceUrl);
    return this._insertObject(customerObject, resourceUrl);

  }

  updateCustomer(customerObject, id) {
    id = this._prepareUri(id);
    const resourceUrl = 'resources/Customer/' + id;
    console.log(resourceUrl);
    return this._updateObject(customerObject, resourceUrl);

  }

  getCustomer(id) {
    id = this._prepareUri(id);
    const resourceUrl = 'resources/Customer/' + id;
    console.log(resourceUrl);
    return this._getObject(resourceUrl);

  }

  getAllCustomers(parameters) {
    const resourceUrl = 'resources/Customer/';
    console.log(resourceUrl);
    return this._getObject(resourceUrl, parameters);

  }


  /*  
      first check is customer exists with a get request,
      by using the customer based resource_uri
    patch if exists else post. 

    if the customer object has an address array we will check if it exists and upsert in a similar fashion as the customer object
    */


  _insertObject(object, resourceUrl) {

    object.created_by = object.created_by || this.enterpriseUserUri;

    var callUrl = this.endpoint + resourceUrl;

    var args = {
      data: object,
      parameters: {
        format: "json",
      },
      headers: {
        "Content-Type": "application/json",
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret
      }
    };

    return new Promise((resolve, reject) => {
      client.post(callUrl, args, function(data, response) {

        if (Buffer.isBuffer(data)) {
          reject(
            new Error('something went wrong with the API call \n Request method: POST \n URL: ' + callUrl + '\n data: \n ' + data.toString())
          );
        }

        resolve(data);

      })

      // console.log(data);
      // reject(
      //   new Error('something went wrong with the API call \n URL: ' + callUrl + ' \n API Key: ' + this.apiKey + '\n API Secret: ' + this.apiSecret + '\n')
      // );


    });

  }

  _getObject(resource_uri, parameters) {

    parameters = parameters || { format: "json" };

    resource_uri = resource_uri || object.resource_uri;

    var callUrl = this.endpoint + resource_uri;

    //callUrl = "https://huntsman.revelup.com/resources/Customer/";
    console.log(callUrl);

    var args = {

      parameters: parameters,
      headers: {
        "Content-Type": "application/json",
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret
      }
    };

    return new Promise((resolve, reject) => {
      client.get(callUrl, args, function(data, response) {

        data = JSON.stringify(data);
        data = JSON.parse(data);
        resolve(data);

      });
    })
  }

  _updateObject(object, resource_uri) {

    object.resource_uri = resource_uri || object.resource_uri;

    var callUrl = this.endpoint + object.resource_uri;

    //callUrl = "https://huntsman.revelup.com/resources/Customer/";
    console.log(callUrl);

    var args = {
      data: object,
      parameters: {
        format: "json",
      },
      headers: {
        "Content-Type": "application/json",
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret
      }
    };


    return new Promise((resolve, reject) => {
      client.patch(callUrl, args, function(data, response) {

        data = JSON.stringify(data);
        data = JSON.parse(data);
        resolve(data);

      });
    })
  }

  upsertObject(object, key, resource_uri) {


    object.resource_uri = resource_uri || object.resource_uri;
    key = key || false;
    // use iexact key

    console.log('todo');
  }


  // Upsert customer  exists in our own DB and get a symphony id
  // then check if that customer has a revel_id 
  // if it does then patch the information in the customer object and take the address array
  // take their address array and check if they have a billing and a shipping address update one accordingly

  upsertCustomer(object, key, resource_uri) {

    object.resource_uri = resource_uri || object.resource_uri;
    key = key || false;

  }

  _prepareEndpoint(endpoint) {
    // make sure it has a trailing "/" and begins with https://

    //if (new RegExp(endpoint).test('https://')) {
    if (endpoint.indexOf('https://') >= 0) {

      var lastChar = endpoint.substr(-1); // Selects the last character
      if (lastChar != '/') { // If the last character is not a slash
        endpoint = endpoint + '/'; // Append a slash to it.
      }

      return endpoint;

    } else {
      throw new Error('Endpoint: ' + endpoint + ' must begin with "https://"');
    }

  }

  _prepareUri(uri) {

    //get the int id and add a "/" to it
    uri = parseInt(uri);

    uri = uri + '/';
    return uri;

  }

}

module.exports = NodeRevel;
