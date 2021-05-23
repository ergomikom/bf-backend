const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.c,
		vHelper.params.cr,
	],
};

exports.RevisionContainerDetailController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = Number.parseInt(req.params.c);
				const CR = Number.parseInt(req.params.cr);
				const getContainer = await rLib.getContainer(C, CR);
				if (getContainer) {
					Response.Send(res, {  statusCode: 200, data: getContainer });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "c": { "msg": "Container revision not exists." }, } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];