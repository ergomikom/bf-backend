const vLib = require("../Libs/ValidatorsLibs");
const vHelper = require("../../helpers/validator").vHelper;
const Response = require("../../helpers/response");
const relLib = require("../Libs/RelationLibs");

const validators = {
  elements: [
    vHelper.params.stype,
    vHelper.params.mid,
    vHelper.params.oid,
    vHelper.params.ts,
  ],
};

exports.RelationsController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, { statusCode: 400, data: errors });
      } else {
        const STYPE = String(req.params.stype).toUpperCase();
        const MID = req.params.mid;
        const OID = req.params.oid;
        const TS = req.params.ts;

        const rels = await relLib.rels(STYPE, MID, OID, TS);
        if (rels) {
          Response.Send(res, { statusCode: 200, data: rels });
        } else {
          Response.Send(res, { statusCode: 500 });
        }
      }
    } catch (err) {
      console.log(err);
      Response.Send(res, { statusCode: 500 });
    }
  }
];