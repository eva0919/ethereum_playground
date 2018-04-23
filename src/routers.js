var express = require("express");
var Web3 = require("web3");
var axios = require("axios");

var utils = require("./utils.js");
var ResponseModel = require("./ResponseModel.js");

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
    .catch(e =>
      res.status(503).json(ResponseModel.genErrorRes("Some Services gone."))
    );
}

function handleErrorResponse(res, error) {
  res.status(500).json(ResponseModel.genErrorRes(`Fatal Error (${error})`));
}

function handleParameterErrorResponse(res, error) {
  res.status(400).json(ResponseModel.genErrorRes(`${error}`));
}

router.get("/node", checkEthMiddle, function(req, res) {
  web3.admin
    .nodeInfo()
    .then(function(response) {
      var returnResponse = ResponseModel.gen(response.result);
      res.json(returnResponse);
    })
    .catch(e => handleErrorResponse(res, e));
});
router.get("/block/:block_number", checkEthMiddle, function(req, res) {
  var isnum = /^\d+$/.test(req.params.block_number);
  if (!isnum) {
    handleParameterErrorResponse(res, "Block Number in params is no number");
  } else {
    web3.eth
      .getBlock(req.params.block_number)
      .then(result => {
        var resultObject = {};
        if (result) {
          resultObject["isFound"] = true;
          resultObject["data"] = result;
        } else {
          resultObject["isFound"] = false;
          resultObject["data"] = null;
        }
        var returnResponse = ResponseModel.gen(resultObject);
        res.json(returnResponse);
      })
      .catch(e => handleErrorResponse(res, e));
  }
});

router.get("/transaction/:transation_hash", checkEthMiddle, function(req, res) {
  web3.eth
    .getTransaction(req.params.transation_hash)
    .then(result => {
      var resultObject = {};
      if (result) {
        resultObject["isFound"] = true;
        resultObject["data"] = result;
      } else {
        resultObject["isFound"] = false;
        resultObject["data"] = null;
      }
      var returnResponse = ResponseModel.gen(resultObject);
      res.json(returnResponse);
    })
    .catch(e => handleErrorResponse(res, e));
});

router.put("/miner", checkEthMiddle, function(req, res) {
  web3.miner
    .start(1)
    .then(function(result) {
      res.status(201).json(ResponseModel.gen({ successful: true }));
    })
    .catch(e => handleErrorResponse(res, e));
});

router.delete("/miner", checkEthMiddle, function(req, res) {
  web3.miner
    .stop()
    .then(function(result) {
      res.status(202).json(ResponseModel.gen({ successful: true }));
    })
    .catch(e => handleErrorResponse(res, e));
});

router.post("/transaction", checkEthMiddle, function(req, res) {
  var params = req.body;
  if (!web3.utils.isAddress(params.from)) {
    handleParameterErrorResponse(res, "Address of from in params is invalid");
  } else if (!web3.utils.isAddress(params.to)) {
    handleParameterErrorResponse(res, "Address of to in params is invalid");
  } else {
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
        var returnObject = {
          transation_hash: transactionResult
        };
        res.status(202).json(ResponseModel.gen(returnObject));
      })
      .catch(e => handleErrorResponse(res, e));
  }
});

module.exports = router;
