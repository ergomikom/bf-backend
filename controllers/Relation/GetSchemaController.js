const vLib = require("../Libs/ValidatorsLibs");
const vHelper = require("../../helpers/validator").vHelper;
const Response = require("../../helpers/response");
const relLib = require("../Libs/RelationLibs");

const validators = {
  elements: [
    vHelper.params.stype,
    vHelper.params.mid,
    vHelper.params.mrid,
    vHelper.params.ts,
  ],
};

exports.SchemaController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, { statusCode: 400, data: errors });
      } else {
        const STYPE = String(req.params.stype).toUpperCase();
        const MID = req.params.mid;
        const MRID = req.params.mrid;
        const TS = req.params.ts;

        const schema = await relLib.schema(STYPE, MID, MRID, TS);
        if (schema) {
          Response.Send(res, { statusCode: 200, data: schema });
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