var con = require("../connection/connection");
var models = require("../models/models");

function allsync() {
  con.connection
    .sync({
      logging: console.log,
      force: true,
    })
    .then(() => {
      console.log("connection established.......");
    })
    .catch((err) => {
      console.log("unable to connect:", err);
    });
}

function syncc() {}
syncc();

module.exports.allsync = allsync;
