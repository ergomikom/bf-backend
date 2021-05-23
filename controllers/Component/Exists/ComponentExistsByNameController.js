const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const cLib = require("../../../controllers/Libs/ComponentLibs");

const validators = {
	elements: [
		vHelper.params.type,
		vHelper.params.name,
	],
};

exports.ComponentExistsByName = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const TYPE = req.params.type;
				const NAME = req.params.name;
				const componentExistsByName = await cLib.componentExistsByName(TYPE, NAME);
				if (componentExistsByName) {
					Response.Send(res, {  statusCode: 400, data: { "msg": "Component of this name exists" }});
				} else {
					Response.Send(res, {  statusCode: 200, data: { componentExistsByName } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];