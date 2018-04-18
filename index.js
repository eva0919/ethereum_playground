var express = require("express");
var Web3 = require("web3");
var axios = require("axios");

var app = express();
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"));

app.set("port", process.env.PORT || 3000);

app.get("/node", function(req, res) {
  var params = { jsonrpc: "2.0", method: "admin_nodeInfo", id: 67 };
  axios.post("http://localhost:8545", params).then(function(response) {
    console.log(response);
    res.json(response.data.result);
  });
});

app.get("/block/:block_number", function(req, res) {
  var block_info = web3.eth.getBlock(req.params.block_number, function(
    error,
    result
  ) {
    if (!error) {
      console.log(result);
      res.json(result);
    }
  });
});

app.get("/transaction/:transation_hash", function(req, res) {
  var transation_info = web3.eth.getTransaction(
    req.params.transation_hash,
    function(error, result) {
      if (!error) {
        console.log(result);
        res.json(result);
      }
    }
  );
});

app.listen(app.get("port"), function() {
  console.log("Example app listening on port 3000!");
});
