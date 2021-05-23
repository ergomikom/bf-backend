var express = require("express");

const ComponentIndexController = require("../controllers/Component/Index/ComponentIndexController");
const FieldsIndexController = require("../controllers/Component/Index/FieldsIndexController");
const FieldgroupsIndexController = require("../controllers/Component/Index/FieldgroupsIndexController");

const ComponentCountController = require("../controllers/Component/Count/ComponentCountController");
const ComponentExistsByNameController = require("../controllers/Component/Exists/ComponentExistsByNameController");
const ComponentDetailController = require("../controllers/Component/Detail/ComponentDetailController");

const nFG_CreateController = require("../controllers/Component/Create/nFG/nFG_CreateController");
const nnF_CreateController = require("../controllers/Component/Create/nnF/nnF_CreateController");
const nnnDT_CreateController = require("../controllers/Component/Create/nnnDT/nnnDT_CreateController");
const CnnDT_CreateController = require("../controllers/Component/Create/CnnDT/CnnDT_CreateController");
const CnF_CreateController = require("../controllers/Component/Create/CnF/CnF_CreateController");
const CFGnDT_CreateController = require("../controllers/Component/Create/CFGnDT/CFGnDT_CreateController");

const ComponentUpdateController = require("../controllers/Component/Update/ComponentUpdateController");
const ComponentCanBeUpdateController = require("../controllers/Component/Update/ComponentCanBeUpdateController");

const ComponentDeleteController = require("../controllers/Component/Delete/ComponentDeleteController");
const ComponentCanBeDeleteController = require("../controllers/Component/Delete/ComponentCanBeDeleteController");

var router = express.Router();

router.post("/create/nfg", nFG_CreateController.Create);
router.post("/create/nnf", nnF_CreateController.Create);
router.post("/create/nnndt", nnnDT_CreateController.Create);
router.post("/create/cnndt", CnnDT_CreateController.Create);
router.post("/create/cnf", CnF_CreateController.Create);
router.post("/create/cfgndt", CFGnDT_CreateController.Create);

// count component by type and name
router.get("/count/:type/:contain?", ComponentCountController.ComponentCount);
// index of type components from size and conain name
router.get("/index/:type/:from/:size/:contain?", ComponentIndexController.ComponentIndex);
router.get("/fields/:from/:size/:contain?", FieldsIndexController.FieldsIndexController);
router.get("/fieldgroups/:from/:size/:contain?", FieldgroupsIndexController.FieldgroupsIndexController);

// check exists componen of type by name
router.get("/exists/:type/:name", ComponentExistsByNameController.ComponentExistsByName);
// check if component can be deleted
router.get("/cbd/:type/:id", ComponentCanBeDeleteController.ComponentCanBeDeleteController);
// check if component can be updated
router.get("/cbu/:type/:id/:name", ComponentCanBeUpdateController.ComponentCanBeUpdateController);
// delete component 
// type id
router.delete("/", ComponentDeleteController.ComponentDeleteController);
// update component 
// type id name
router.patch("/", ComponentUpdateController.ComponentUpdateController);
// get component data 
router.get("/:type/:id", ComponentDetailController.ComponentDetail);


module.exports = router;