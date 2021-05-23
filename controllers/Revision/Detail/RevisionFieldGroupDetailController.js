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

exports.RevisionFieldGroupDetailController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = Number.parseInt(req.params.fg);
				const FGR = Number.parseInt(req.params.fgr);
				const getFieldGroup = await rLib.getFieldGroup(FG, FGR);
				if (getFieldGroup) {
					Response.Send(res, {  statusCode: 200, data: getFieldGroup });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "fg": { "msg": "Fieldgroup revision not exists." }, } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];