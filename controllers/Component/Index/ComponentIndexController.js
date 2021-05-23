const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const cLib = require("../../../controllers/Libs/ComponentLibs");

const MAXSIZE = 25;

const validators = {
  elements: [
    vHelper.params.type,
    vHelper.params.from,
    vHelper.params.size,
		vHelper.params.contain,
  ],
};

exports.ComponentIndex = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = req.params.type;
        const FROM = Number.parseInt(req.params.from) - 1;
        const SIZE = Number.parseInt(req.params.size) > MAXSIZE ? MAXSIZE : Number.parseInt(req.params.size);
        const CONTAIN = req.params.contain ? req.params.contain : "%";

        const componentIndex = await cLib.componentIndex(TYPE, FROM, SIZE, CONTAIN);
        if (componentIndex) {
          Response.Send(res, {  statusCode: 200, data: componentIndex });
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