const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ComponentCanBeDelete = require("./ComponentCanBeDelete");

const validators = {
  elements: [
    vHelper.params.type,
		vHelper.params.id,
  ],
};

exports.ComponentCanBeDeleteController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = String(req.params.type).toLowerCase();
        const ID = req.params.id;

        const cd = await ComponentCanBeDelete(TYPE, ID);
        if (cd) {
          Response.Send(res, cd);
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