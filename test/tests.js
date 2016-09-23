'use strict';

const NodeRevel = require('../lib/NodeRevel.js');
const chai = require('chai');
const expect = chai.expect;
// const chaiAsPromised = require('chai-as-promised');
// const sinon = require('sinon');
// require('sinon-as-promised');

// chai.use(chaiAsPromised);

describe('Testing the constructor of the Revel Class', () => {

  var endpoint = 'https://xxxxxxx.revelup.com';
  var apiKey = 'XXXXXXXXXXXXXXXXXX';
  var apiSecret = 'xxxxxxxxxxxxxxxxx';
  var enterpriseUserUri = '/enterprise/User/8/';


  it('Should be an instance of NodeRevel', () => {

    const nodeRevel = new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);
    expect(nodeRevel).to.be.an.instanceof(NodeRevel);

  });

});


describe('Instance arguments are error handled correctly', () => {

  var endpoint = 'https://xxxxxxx.revelup.com';
  var apiKey = 'XXXXXXXXXXXXXXXXXX';
  var apiSecret = 'xxxxxxxxxxxxxxxxx';
  var enterpriseUserUri = '/enterprise/User/8/';


  it('Error handling if missing field', () => {

    const NodeRevelInsance = () => new NodeRevel(apiKey, apiSecret, enterpriseUserUri);

    expect(NodeRevelInsance).to.throw(Error);

  });


  it('Should prepare endpoints protocol correctly', () => {

    endpoint = 'http://xxxxxxx.revelup.com'; // http instead of https should break it

    const NodeRevelInsance = () => new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);

    expect(NodeRevelInsance).to.throw(Error);

  });


  it('Should format endpoint to include trailing "/"', () => {

    endpoint = 'https://xxxxxxx.revelup.com'; // missing last /

    const nodeRevel = new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);

    var lastChar = nodeRevel.endpoint.substr(-1); // Selects the last character

    expect(lastChar).to.be.equal('/');

  });

});


describe('Prepared functions for accessing Revel resources are working correctly', () => {

  var endpoint = 'https://xxxxxxx.revelup.com';
  var apiKey = 'XXXXXXXXXXXXXXXXXX';
  var apiSecret = 'xxxxxxxxxxxxxxxxx';
  var enterpriseUserUri = '/enterprise/User/8/';


  it('External Urls are added', () => {

    const nodeRevel = new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);
    expect(nodeRevel.urls).to.be.instanceof(Array);


  });

  it('_prepareUri function working correctly', () => {

    const nodeRevel = new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);

    var testValue = nodeRevel._prepareUri(5);
    expect(testValue.substr(-1)).to.be.equal("/");

  });

});
