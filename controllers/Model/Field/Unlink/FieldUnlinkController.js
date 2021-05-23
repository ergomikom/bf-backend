const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const FieldUnlink = require("./FieldUnlink");

const validators = {
	elements: [
		vHelper.body.fg,
		vHelper.body.fgr,
		vHelper.body.f,
		vHelper.body.fr,
	],
};

exports.FieldUnlink = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = req.body.fg;
				const FGR = req.body.fgr;
				const F = req.body.f;
				const FR = req.body.fr;

				const ful = await FieldUnlink(FG, FGR, F, FR);
				if (ful) {
					console.log("ful")
					console.log(ful)
					Response.Send(res, ful);
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


