'use strict'

var Client = require('node-rest-client').Client;
var client = new Client();

class NodeRevel {

  //lets do this thing
  constructor(endpoint, apiKey, apiSecret, enterpriseUserUri) {


    if (!endpoint || !apiKey || !apiSecret || !enterpriseUserUri) {

      throw new Error('You must create a node-revel object with all 4 fields: endpoint, apiKey, apiSecret, enterpriseUserUri');

    }


    if (!this) return new KristoRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);



    this.endpoint = this._prepareEndpoint(endpoint);
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.enterpriseUserUri = enterpriseUserUri;

  }


  insertCustomer(customerObject) {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var addresses = [];

    if (customerObject.addresses) {
      customerObject.addresses.forEach((address) => {



        addresses.push({
          "active": address.active || true,
          "address_type": address.address_type || null,
          "city": address.city || "",
          "company_name": address.company_name || "",
          "country": address.country || "",
          "created_date": localISOTime,
          "email": address.email || "",
          "name": address.name || "",
          "phone_number": address.phone_number || "",
          "primary_billing": address.primary_billing || false,
          "primary_shipping": address.primary_shipping || false,
          "state": address.state || "",
          "street_1": address.street_1 || "",
          "street_2": address.street_2 || "",
          "updated_date": localISOTime,
          "zipcode": address.zipcode || ""
        })

      })
    }


    var revel_customer = {
      "active": customerObject.active || true,
      "address": customerObject.address || "",
      "addresses": addresses,
      "birth_date": customerObject.birth_date || null,
      "cc_exp": customerObject.cc_exp || null,
      "cc_first_name": customerObject.cc_first_name || null,
      "cc_last_4_digits": customerObject.cc_last_4_digits || null,
      "cc_last_name": customerObject.cc_last_name || null,
      "cc_number": customerObject.cc_number || "",
      "city": customerObject.city || "",
      "company_name": customerObject.company_name || "",
      "contract_expiration": customerObject.contract_expiration || null,
      "created_by": this.enterpriseUserUri,
      "created_date": localISOTime,
      "customer_groups": customerObject.customer_groups || [],
      "deleted": false,
      "email": customerObject.email || "",
      "exp_date": customerObject.exp_date || null,
      "expensify_account": customerObject.expensify_account || null,
      "first_name": customerObject.first_name || "",
      "gift_card_numbers": [],
      "created_by": this.enterpriseUserUri,
      "image": customerObject.image || null,
      "is_visitor": customerObject.is_visitor || false,
      "last_name": customerObject.last_name || "",
      "lic_number": customerObject.lic_number || null,
      "loyalty_number": customerObject.loyalty_number || "",
      "loyalty_ref_id": customerObject.loyalty_ref_id || "",
      "notes": customerObject.notes || "",
      "phone_number": customerObject.phone_number || "",
      "picture": customerObject.picture || "",
      "ref_number": customerObject.ref_number || "",
      "reward_card_numbers": [],
      "source": customerObject.source || 0,
      "state": customerObject.state || "",
      "total_purchases": customerObject.total_purchases || 0,
      "total_visits": customerObject.total_visits || 0,
      "updated_by": this.enterpriseUserUri,
      "zipcode": customerObject.zipcode || "",
    }

    const resourceUrl = 'resources/Customer/';
    return this._insertObject(revel_customer, resourceUrl);

  }

  updateCustomer(customerObject, id) {
    id = this._prepareUri(id);


    return this._updateObject(customerObject, resourceUrl);

  }

  getCustomer(id) {

    if (id) {
      id = this._prepareUri(id);
    } else {
      var id = "";
    }

    const resourceUrl = 'resources/Customer/' + id;
    return this._getObject(resourceUrl);

  }

  getAllCustomers(parameters) {
    const resourceUrl = 'resources/Customer/';
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
