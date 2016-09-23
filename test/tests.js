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
