const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.f,
		vHelper.params.fr,
	],
};

exports.RevisionFieldDetailController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const F = Number.parseInt(req.params.f);
				const FR = Number.parseInt(req.params.fr);
				const getField = await rLib.getField(F, FR);
				if (getField.length) {
					Response.Send(res, {  statusCode: 200, data: getField });
				} else {
					Response.Send(res, {  statusCode: 404, data: {"mrid": { "msg": "Field revision not exists." },} });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];