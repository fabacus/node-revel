
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

// set parameters
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




Any feedback is appreciated.

## Contributers: 

Kristo Mikkonen
kristo.mikkonen@fabacus.com

Patrick McKinley
patrick.mckienley@fabacus.com


