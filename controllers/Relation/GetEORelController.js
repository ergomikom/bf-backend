const vLib = require("../Libs/ValidatorsLibs");
const vHelper = require("../../helpers/validator").vHelper;
const Response = require("../../helpers/response");
const relLib = require("../Libs/RelationLibs");

const oLib = require("../../controllers/Libs/ObjectLibs");
const rLib = require("../../controllers/Libs/RevisionLibs");

const validators = {
  elements: [
    vHelper.params.stype,
    vHelper.params.mid,
    vHelper.params.oid,
    vHelper.params.relmid,
    vHelper.params.relmrid,
  ],
};

exports.ExistsObjectRelationController = [
  // auth,
  async (req, res) => {
    console.log(req.params)
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, { statusCode: 400, data: errors });
      } else {
        const STYPE = String(req.params.stype).toUpperCase();
        const MID = req.params.mid;
        const OID = req.params.oid;
        const RELMID = req.params.relmid;
        const RELMRID = req.params.relmrid;

        let errors = false;
        const objectTableExists = await oLib.checkObjectTableExists(MID);

        if (objectTableExists) {
          const oexists = await oLib.checkObjectExist(MID, OID);
          const result = oexists.COUNT ? true : false;
          const revrel = await rLib.checkRevisionExist("c", RELMID, RELMRID);
          if (!result) {
            errors = { "object": { "msg": "Object Error: object not exists" }, };
          } else if (!revrel) {
            errors = { "revision": { "msg": "Revision Error: slave relator not exists" }, };
          }

          if (errors) {
            Response.Send(res, { statusCode: 400, data: errors });
          } else {
            console.log(STYPE, MID, OID, RELMID, RELMRID);
            const eorel = await relLib.eorel(STYPE, MID, OID, RELMID, RELMRID);
            if (eorel) {
              const result = eorel.COUNT ? true : false;
              Response.Send(res, { statusCode: 200, data: { exists: result } });
            } else {
              Response.Send(res, { statusCode: 500 });
            }
          }
        } else {
          errors = { "object": { "msg": "Model Error: model of object not exists" }, };
          Response.Send(res, { statusCode: 400, data: errors });
        }


      }
    } catch (err) {
      console.log(err);
      Response.Send(res, { statusCode: 500 });
    }
  }
];