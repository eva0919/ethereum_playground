module.exports = (function() {
  var responseTemplate = {
    result: null,
    errorMsg: ""
  };
  var gen = function(response) {
    var renewResponse = Object.assign({}, responseTemplate);
    renewResponse.result = response;
    return renewResponse;
  };
  var genErrorRes = function(message) {
    var renewResponse = Object.assign({}, responseTemplate);
    renewResponse.errorMsg = message;
    return renewResponse;
  };
  return {
    gen: gen,
    genErrorRes: genErrorRes
  };
})();
