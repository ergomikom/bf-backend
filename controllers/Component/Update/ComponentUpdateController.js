const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ComponentUpdate = require("./ComponentUpdate");

const validators = {
	elements: [
		vHelper.body.type,
    vHelper.body.id,
    vHelper.body.name,
	],
};

exports.ComponentUpdateController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const TYPE = String(req.body.type).toLowerCase();
				const ID = req.body.id;
				const NAME = String(req.body.name).toLowerCase();

				const cu = await ComponentUpdate(TYPE, ID, NAME);
        if (cu) {
          Response.Send(res, cu);
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