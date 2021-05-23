var express = require("express");

const FieldGroupLinkController = require("../controllers/Model/FieldGroup/Link/FieldGroupLinkController");
const FieldLinkController = require("../controllers/Model/Field/Link/FieldLinkController");

const FieldGroupUninkController = require("../controllers/Model/FieldGroup/Unlink/FieldGroupUnlinkController");
const FieldUnlinkController = require("../controllers/Model/Field/Unlink/FieldUnlinkController");

const ModelConfirmController = require("../controllers/Model/Confirm/ModelConfirmController");
const ModelCanBeConfirmController = require("../controllers/Model/Confirm/ModelCanBeConfirmController");

const ModelUnconfirmController = require("../controllers/Model/Unconfirm/ModelUnconfirmController");
const ModelCanBeUnconfirmController = require("../controllers/Model/Unconfirm/ModelCanBeUnconfirmController");

const FieldGroupCanBeLinkController = require("../controllers/Model/FieldGroup/Link/FieldGroupCanBeLinkController");
const FieldCanBeLinkController = require("../controllers/Model/Field/Link/FieldCanBeLinkController");

const FieldGroupCanBeUnlinkController = require("../controllers/Model/FieldGroup/Unlink/FieldGroupCanBeUnlinkController");
const FieldCanBeUnlinkController = require("../controllers/Model/Field/Unlink/FieldCanBeUnlinkController");

var router = express.Router();

// check if fg can be link to c
router.get("/fgcbl/:c/:cr/:fg/:fgr", FieldGroupCanBeLinkController.FieldCanBeLinkController);
// check if f can be link to fg
router.get("/fcbl/:fg/:fgr/:f/:fr", FieldCanBeLinkController.FieldCanBeLinkController);
// check if fg can be unlink from c
router.get("/fgcbul/:c/:cr/:fg/:fgr", FieldGroupCanBeUnlinkController.FieldGroupCanBeUnlinkController);
// check if f can be unlink from fg
router.get("/fcbul/:fg/:fgr/:f/:fr", FieldCanBeUnlinkController.FieldCanBeUnlinkController);

// link fg to c
//USAGE: http POST localhost:3100/api/m/fglink/ c=1 cr=168203 fg=1 fgr=144489
router.post("/fglink/", FieldGroupLinkController.FieldGroupLinkController);
//link f to fg
router.post("/flink/", FieldLinkController.FieldLinkController);
// unlink fg from c
router.post("/fgunlink/", FieldGroupUninkController.FieldGroupUnlink);
// unlink f from fg
router.post("/funlink/", FieldUnlinkController.FieldUnlink);

// confirm model
router.post("/confirm/", ModelConfirmController.ModelConfirmController);
// check if model can be confirm
router.get("/mcbc/:c/:cr", ModelCanBeConfirmController.ModelCanBeConfirmController);
// unconfirm model
router.post("/unconfirm/", ModelUnconfirmController.ModelUnconfirmController);
// check if model can be unconfirm
router.get("/mcbuc/:c/:cr", ModelCanBeUnconfirmController.ModelCanBeUnconfirmController);

module.exports = router;