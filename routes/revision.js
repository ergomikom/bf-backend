var express = require("express");

const RevisionFieldGroupDetail = require("../controllers/Revision/Detail/RevisionFieldGroupDetailController");
const RevisionFieldDetail = require("../controllers/Revision/Detail/RevisionFieldDetailController");
const RevisionContainerDetail = require("../controllers/Revision/Detail/RevisionContainerDetailController");

const RevisionIndex = require("../controllers/Revision/Index/RevisionIndexController");
const RevisionFieldGroups = require("../controllers/Revision/Index/RevisionFieldGroupsController");
const RevisionFields = require("../controllers/Revision/Index/RevisionFieldsController");
const RevisionFSMController = require("../controllers/Revision/Index/RevisionFSMController");

const FieldRevisionsIndex= require("../controllers/Revision/Index/FieldRevisionsIndexController");
const FieldgroupRevisionsIndex= require("../controllers/Revision/Index/FieldgroupRevisionsIndexController");

const RevisionCount = require("../controllers/Revision/Count/RevisionCountController");
const RevisionStatus = require("../controllers/Revision/Status/RevisionStatusController");

var router = express.Router();

// Zlicza ilość rewizji w komponencie
router.get("/count/:type/:id", RevisionCount.RevisionCountController);

// Zwraca listę rewizji w komponencie w zakresie od/do
router.get("/index/:type/:from/:size/:id?", RevisionIndex.RevisionIndexController);

router.get("/fields/:id/:from/:size/:contain?", FieldRevisionsIndex.FieldRevisionsIndexController);
router.get("/fieldgroups/:id/:from/:size/:contain?", FieldgroupRevisionsIndex.FieldgroupRevisionsIndexController);

// Zwraca stan rewizji
router.get("/status/:type/:id/:rid", RevisionStatus.RevisionStatusController);

// Zwraca rewizje
router.get("/c/:c/:cr", RevisionContainerDetail.RevisionContainerDetailController);

// Pobiera pojedyncza rewizje
router.get("/fg/:fg/:fgr", RevisionFieldGroupDetail.RevisionFieldGroupDetailController);
router.get("/fgs/:c/:cr", RevisionFieldGroups.RevisionFieldGroupsController);

router.get("/f/:f/:fr", RevisionFieldDetail.RevisionFieldDetailController);
router.get("/fs/:fg/:fgr", RevisionFields.RevisionFieldsController);
router.get("/fsm/:id/:from/:size/:contain?", RevisionFSMController.RevisionFSMController);


//getfieldvaluebydate
//getfieldsvaluesbydaterange

module.exports = router;
