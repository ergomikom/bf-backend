const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ComponentDelete = require("./ComponentDelete");

const validators = {
  elements: [
    vHelper.body.type,
		vHelper.body.id,
  ],
};

exports.ComponentDeleteController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = String(req.body.type).toLowerCase();
        const ID = req.body.id;

        const cd = await ComponentDelete(TYPE, ID);
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