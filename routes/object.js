var express = require("express");

const ObjectInsertController = require("../controllers/Object/Insert/ObjectInsertController");
const ObjectUpdateController = require("../controllers/Object/Update/ObjectUpdateController");

var router = express.Router();

router.post("/:mrid", ObjectInsertController.insert);
router.patch("/:mrid/:oid", ObjectUpdateController.update);

module.exports = router;