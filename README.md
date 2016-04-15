
Currently in alpha. Expect a lot of changes each week. 

## Overview

Currently supports:

- Authentication (logging in etc)
- Customer Objects: Creating, Updating, Getting
- Uses Promises


## Example: 

var NodeRevel = require('node-revel');

var endpoint = 'https://xxxxxxxx.revelup.com';
var apiKey = 'xxxxxxxxx';
var apiSecret = 'xxxxxxxxxxxxxx';
var enterpriseUserUri = '/enterprise/User/1/';

nodeRevel = new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);


// get customers where email =  bob@bobson.com 
var parameters = {
  format: "json",
  email__iexact: "bob@bobson.com"
}

nodeRevel.getAllCustomers(parameters)
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });


// update customer email,first_name,last_name where revel id = 5

var customer = {
  email:"user@email.com",
  first_name: "joe",
  last_name: "bloggs"
}

nodeRevel.updateCustomer(customer, '5')
  .then((result) => {

    console.log(result);

  }).catch((err) => {

    console.log(err);
  });


Any feedback is appreciated.

## Contributers: 

Kristo Mikkonen
kristo.mikkonen@fabacus.com

Patrick McKinley
patrick.mckienley@fabacus.com


