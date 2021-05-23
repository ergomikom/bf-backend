const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const cLib = require("../../../controllers/Libs/ComponentLibs");

const validators = {
  elements: [
    vHelper.params.type,
    vHelper.params.contain,
  ],
};

exports.ComponentCount = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = req.params.type;
        const CONTAIN = req.params.contain ? req.params.contain : "%";

        const componentCount = await cLib.componentCount(TYPE, CONTAIN);
        if (componentCount) {
          Response.Send(res, {  statusCode: 200, data: componentCount });
        } else {
          Response.Send(res, {  statusCode: 404 });
        }
      }
    } catch (err) {
      console.log(err);
      Response.Send(res, {  statusCode: 500 });
    }
  }
];