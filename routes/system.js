var express = require("express");

const  Ping = require("../controllers/System/Ping/Ping");

var router = express.Router();

router.get("/", Ping.Ping);

module.exports = router;