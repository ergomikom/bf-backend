const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ComponentCanBeUpdate = require("./ComponentCanBeUpdate");

const validators = {
  elements: [
    vHelper.params.type,
    vHelper.params.id,
    vHelper.params.name,
  ],
};

exports.ComponentCanBeUpdateController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = String(req.params.type).toLowerCase();
        const ID = req.params.id;
        const NAME = String(req.params.name).toLowerCase();

        const ccbu = await ComponentCanBeUpdate(TYPE, ID, NAME);
        if (ccbu) {
          Response.Send(res, ccbu);
        } else {
          Response.Send(res, {  statusCode: 500 });
        }
      }
    } catch (err) {
      console.log(err);
      Response.Send(res, {  statusCode: 500 });
    }
  }
];