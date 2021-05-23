const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");

const FieldCanBeUnlink = require("./FieldCanBeUnlink");

const validators = {
	elements: [
		vHelper.params.fg,
		vHelper.params.fgr,
		vHelper.params.f,
		vHelper.params.fr,
	],
};

exports.FieldCanBeUnlinkController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = req.params.fg;
				const FGR = req.params.fgr;
				const F = req.params.f;
				const FR = req.params.fr;
				const fcbul = await FieldCanBeUnlink(FG, FGR, F, FR);
				if (fcbul) {
					Response.Send(res, fcbul);
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
