const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");

const ModelUnconfirm = require("./ModelUnconfirm");

const validators = {
	elements: [
		vHelper.body.c,
    vHelper.body.cr,
	],
};

exports.ModelUnconfirmController = [
	// auth,
	async (req, res) => {
		console.log("ModelUnconfirmController");
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = Number.parseInt(req.body.c);
				const CR = Number.parseInt(req.body.cr);

				const muc = await ModelUnconfirm(C, CR);
				if (muc) {
					Response.Send(res, muc);
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
