const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ModelCanBeConfirm = require("./ModelCanBeConfirm");

const validators = {
	elements: [
		vHelper.params.c,
    vHelper.params.cr,
	],
};

exports.ModelCanBeConfirmController = [
	// auth,
	async (req, res) => {
		console.log("ModelCanBeConfirmController");
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				console.log(errors)
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = Number.parseInt(req.params.c);
				const CR = Number.parseInt(req.params.cr);

				const mcbc = await ModelCanBeConfirm(C, CR);
				if(mcbc) {
					Response.Send(res, mcbc);
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
