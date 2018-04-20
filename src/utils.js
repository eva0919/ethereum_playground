var axios = require("axios");

var method = (function() {
  var provider = "http://localhost:8545";
  var basicParams = { jsonrpc: "2.0", id: 1 };
  var rpcRequest = function(params) {
    var promise = new Promise(function(resolve, reject) {
      axios.post(provider, params).then(function(response) {
        resolve(response.data);
      });
    });
    return promise;
  };
  var getNodeInfo = function() {
    var params = Object.assign(basicParams, { method: "admin_nodeInfo" });
    var promise = new Promise(function(resolve, reject) {
      rpcRequest(params).then(function(response) {
        resolve(response);
      });
    });
    return promise;
  };
  var startMinner = function(threadNumber) {
    var params = Object.assign(basicParams, {
      method: "miner_start",
      params: [threadNumber]
    });
    var promise = new Promise(function(resolve, reject) {
      rpcRequest(params).then(function(response) {
        console.log(response);
        resolve(response);
      });
    });
    return promise;
  };
  var stopMinner = function() {
    var params = Object.assign(basicParams, {
      method: "miner_stop"
    });
    var promise = new Promise(function(resolve, reject) {
      rpcRequest(params).then(function(response) {
        console.log(response);
        resolve(response);
      });
    });
    return promise;
  };
  var wrapper = function(inputModule) {
    var web3 = inputModule || {};
    web3.admin = web3.admin || {};
    web3.admin.nodeInfo = web3.admin.nodeInfo || getNodeInfo.bind(this);

    web3.miner = web3.miner || {};
    web3.miner.start = web3.miner.start || startMinner.bind(this);
    web3.miner.stop = web3.miner.stop || stopMinner.bind(this);

    return web3;
  };
  return {
    wrapper: wrapper
  };
})();

module.exports = method;
