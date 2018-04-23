var express = require("express");
var RateLimit = require("express-rate-limit");
var bodyParser = require("body-parser");

var routers = require("./src/routers.js");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var limiter = new RateLimit({
  windowMs: 10 * 1000,
  max: 10,
  delayMs: 0,
  message: "Too many requests from this IP, please try again after an hour"
});
app.use(limiter);
app.use("/", routers);
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
  console.log(`Server listening on port ${app.get("port")}!`);
});
