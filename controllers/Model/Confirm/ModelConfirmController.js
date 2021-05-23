const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ModelConfirm = require("./ModelConfirm");

const validators = {
	elements: [
		vHelper.body.c,
    vHelper.body.cr,
	],
};

exports.ModelConfirmController = [
	// auth,
	async (req, res) => {
		console.log("ModelConfirmController");
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = Number.parseInt(req.body.c);
				const CR = Number.parseInt(req.body.cr);
				
				const mc = await ModelConfirm(C, CR);
				if(mc) {
					Response.Send(res, mc);
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
