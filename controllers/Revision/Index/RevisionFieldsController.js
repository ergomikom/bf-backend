const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.fg,
		vHelper.params.fgr,
	],
};

exports.RevisionFieldsController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = Number.parseInt(req.params.fg);
				const FGR = Number.parseInt(req.params.fgr);
				const getFieldGroupFields = await rLib.getFieldGroupFields(FG, FGR);
				if (getFieldGroupFields) {
					Response.Send(res, {  statusCode: 200, data: getFieldGroupFields });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "global": { "msg": "Revision not exists." }, } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];