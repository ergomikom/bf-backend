const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ModelCanBeUnconfirm = require("./ModelCanBeUnconfirm");

const validators = {
	elements: [
		vHelper.params.c,
    vHelper.params.cr,
	],
};

exports.ModelCanBeUnconfirmController = [
	// auth,
	async (req, res) => {
		console.log("ModelCanBeUnconfirmController");
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = Number.parseInt(req.params.c);
				const CR = Number.parseInt(req.params.cr);

				const mcbuc = await ModelCanBeUnconfirm(C, CR);
				if(mcbuc) {
					Response.Send(res, mcbuc);
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
