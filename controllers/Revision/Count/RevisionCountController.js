const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.type,
		vHelper.params.id,
	],
};

exports.RevisionCountController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const TYPE = req.params.type;
				const ID = Number.parseInt(req.params.id);
				const componentRevisionCount = await rLib.componentRevisionCount(TYPE, ID);
				if (componentRevisionCount) {
					if (componentRevisionCount.COUNT > 0) {
						Response.Send(res, {  statusCode: 200, data: componentRevisionCount });
					} else {
						Response.Send(res, {  statusCode: 404, data: { "name": { "msg": "Model not exists." }, } });
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
]
