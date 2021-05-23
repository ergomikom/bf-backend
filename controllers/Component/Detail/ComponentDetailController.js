const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const cLib = require("../../../controllers/Libs/ComponentLibs");

const validators = {
	elements: [
		vHelper.params.type,
		vHelper.params.id,
	],
};

exports.ComponentDetail = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const TYPE = req.params.type;
				const ID = Number.parseInt(req.params.id);
				const componentDetail = await cLib.componentDetail(TYPE, ID);
				if (componentDetail) {
					Response.Send(res, {  statusCode: 200, data: componentDetail });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "name": { "msg": "Element not exists." } } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];