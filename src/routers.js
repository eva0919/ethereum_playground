var express = require("express");
var Web3 = require("web3");
var axios = require("axios");

var utils = require("./utils.js");

var web3 = new Web3();
web3 = utils.wrapper(web3);
web3.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3.eth.net
  .isListening()
  .then(() => console.log("web3 is connected"))
  .catch(e => console.log("web3 can't connect to eth, please check it."));

var router = express.Router();

function checkEthMiddle(req, res, next) {
  web3.eth.net
    .isListening()
    .then(() => next())
    .catch(e => res.status(503).json({ errorMsg: "Some Services gone." }));
}

router.get("/node", checkEthMiddle, function(req, res) {
  web3.admin
    .nodeInfo()
    .then(function(response) {
      res.json(response.result);
    })
    .catch(function(error) {
      console.log(error);
    });
});
router.get("/block/:block_number", checkEthMiddle, function(req, res) {
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

router.get("/transaction/:transation_hash", checkEthMiddle, function(req, res) {
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

router.put("/miner", checkEthMiddle, function(req, res) {
  web3.miner.start(1).then(function(result) {
    res.status(201).json(result);
  });
});

router.delete("/miner", checkEthMiddle, function(req, res) {
  web3.miner.stop().then(function(result) {
    res.status(202).json(result);
  });
});

router.post("/transaction", checkEthMiddle, function(req, res) {
  console.log(req.body);
  var params = req.body;
  web3.eth.personal
    .unlockAccount(params.from, "mypassword", 1000)
    .then(function(result) {
      var tx = {
        from: params.from,
        to: params.to,
        value: web3.utils.toWei(params.value, "ether")
      };
      return web3.eth.personal.sendTransaction(tx, "mypassword");
    })
    .then(function(transactionResult) {
      console.log(transactionResult);
    })
    .catch(function(error) {
      console.log(error);
    });
  res.status(202).json(req.body);
});

module.exports = router;
