const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const cLib = require("../../../controllers/Libs/ComponentLibs");

const MAXSIZE = 25;

const validators = {
  elements: [
    vHelper.params.from,
    vHelper.params.size,
		vHelper.params.contain,
  ],
};

exports.FieldsIndexController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const FROM = Number.parseInt(req.params.from) - 1;
        const SIZE = Number.parseInt(req.params.size) > MAXSIZE ? MAXSIZE : Number.parseInt(req.params.size);
        const CONTAIN = req.params.contain ? req.params.contain : "%";

        const fieldsIndex = await cLib.fieldsIndex(FROM, SIZE, CONTAIN);
        if (fieldsIndex) {
          Response.Send(res, {  statusCode: 200, data: fieldsIndex });
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