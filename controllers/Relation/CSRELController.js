const vLib = require("../Libs/ValidatorsLibs");
const vHelper = require("../../helpers/validator").vHelper;
const Response = require("../../helpers/response");
const relLib = require("../Libs/RelationLibs");
const rLib = require("../../controllers/Libs/RevisionLibs");

const validators = {
  elements: [
    vHelper.body.stype,
    vHelper.body.mid,
    vHelper.body.mrid,
    vHelper.body.relmid,
    vHelper.body.relmrid,
  ],
};

exports.CreateSchemaRelationController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, { statusCode: 400, data: errors });
      } else {
        const STYPE = String(req.body.stype).toUpperCase();
        const MID = req.body.mid;
        const MRID = req.body.mrid;
        const RELMID = req.body.relmid;
        const RELMRID = req.body.relmrid;

        let errors = false;
        const rev = await rLib.checkRevisionExist("c", MID, MRID);
        const revrel = await rLib.checkRevisionExist("c", RELMID, RELMRID);

        if (rev === undefined) {
          errors = { "revision": { "msg": "Revision Error: master relator not exists " }, };
        } else if (revrel === undefined) {
          errors = { "revision": { "msg": "Revision Error: slave relator not exists" }, };
        }

        if (errors) {
          Response.Send(res, { statusCode: 400, data: errors });
        } else {
          const esrel = await relLib.esrel(STYPE, MID, MRID, RELMID, RELMRID);
          if (esrel) {
            if (esrel.COUNT) {
              const errors = { "schema": { "msg": "Schema Error: schema relation already exists" }, };
              Response.Send(res, { statusCode: 400, data: errors });
            } else {
              const csrel = await relLib.csrel(STYPE, MID, MRID, RELMID, RELMRID);
              console.log(csrel)
              if (csrel) {
                Response.Send(res, { statusCode: 200, data: { result: csrel } });
              } else {
                Response.Send(res, { statusCode: 500 });
              }
            }
          } else {
            Response.Send(res, { statusCode: 500 });
          }
        }

      }
    } catch (err) {
      console.log(err);
      Response.Send(res, { statusCode: 500 });
    }
  }
];

