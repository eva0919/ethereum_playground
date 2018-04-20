var express = require("express");
var Web3 = require("web3");
var axios = require("axios");

var utils = require("./utils.js");

var web3 = new Web3();
web3 = utils.wrapper(web3);
web3.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"));

var router = express.Router();

router.get("/node", function(req, res) {
  web3.admin.nodeInfo().then(function(response) {
    res.json(response.result);
  });
});
router.get("/block/:block_number", function(req, res) {
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

router.get("/transaction/:transation_hash", function(req, res) {
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

router.put("/miner", function(req, res) {
  web3.miner.start(1).then(function(result) {
    res.json(result);
  });
});

router.delete("/miner", function(req, res) {
  web3.miner.stop().then(function(result) {
    res.json(result);
  });
});

router.post("/transaction", function(req, res) {
  var unlockInfo = web3.eth.personal
    .unlockAccount(
      "0x755859a2174c06b0f26131c520f261b5d34b9724",
      "mypassword",
      1000
    )
    .then(function(result) {
      var tx = {
        from: "0x755859a2174c06b0f26131c520f261b5d34b9724",
        to: "0x000feb4215d2f6f987eb95e4034965ab25d700c3",
        value: web3.utils.toWei("1.23", "ether")
      };
      return web3.eth.personal.sendTransaction(tx, "mypassword");
    })
    .then(function(transactionResult) {
      console.log("transaction");
      console.log(transactionResult);
    })
    .catch(function(error) {
      console.log(error);
    });
  res.json(unlockInfo);
});

module.exports = router;
