var express = require("express");

const SCHEMA = require("../controllers/Relation/GetSchemaController").SchemaController;
const RELS = require("../controllers/Relation/GetRelsController").RelationsController;
const ESRELS = require("../controllers/Relation/GetESRelController").ExistsSchemaRelationController;
const EORELS = require("../controllers/Relation/GetEORelController").ExistsObjectRelationController;
const CSREL = require("../controllers/Relation/CSRELController").CreateSchemaRelationController;
const RSREL = require("../controllers/Relation/RSRELController").RemoveSchemaRelationController;

var router = express.Router();

//schema
router.get("/schema/:stype/:mid/:mrid/:ts", SCHEMA);
//rels
router.get("/rels/:stype/:mid/:oid/:ts", RELS);
//schema exists
router.get("/esrel/:stype/:mid/:mrid/:relmid/:relmrid", ESRELS);
// object rel exists
router.get("/eorel/:stype/:mid/:oid/:relmid/:relmrid", EORELS); //TODO: dodać kontroler
// createrelation
router.post("/csrel", CSREL);
// removerelation
router.get("/rsrel/:stype/:mid/:mrid/:relmid/:relmrid", RSREL);

module.exports = router;

// if unconfirm nie ostatniej rewizji to usun wpisy z tą rewizją w MxP i MxCH. 

//TODO: przenieść tworzenie tabeli MxP i MxCH do kreatora komponentu

// https://github.com/knex/knex/issues/732