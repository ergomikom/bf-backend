const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
  elements: [
		vHelper.params.type,
    vHelper.params.id,
    vHelper.params.from,
		vHelper.params.size,
	],
};

exports.RevisionIndexController = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const TYPE = req.params.type;
        const ID = Number.parseInt(req.params.id);
        const FROM = Number.parseInt(req.params.from) - 1;
        const SIZE = Number.parseInt(req.params.size);
        const componentRevisionList = await rLib.componentRevisionList(TYPE, ID, FROM, SIZE);
        if (componentRevisionList) {
          if (componentRevisionList.length) {
            Response.Send(res, {  statusCode: 200, data: componentRevisionList });
          } else {
            Response.Send(res, {  statusCode: 404, data: { "mrid": { "msg": "Model not exists." }, } });
          }
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