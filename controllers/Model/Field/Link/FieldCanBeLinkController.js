const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const rLib = require("../../../../controllers/Libs/RevisionLibs");

const FieldCanBeLink = require("./FieldCanBeLink");

const validators = {
	elements: [
		vHelper.params.fg,
		vHelper.params.fgr,
		vHelper.params.f,
		vHelper.params.fr,
	],
};

exports.FieldCanBeLinkController = [
	// auth,
	async (req, res) => {
		console.log("FieldCanBeLinkController")
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = req.params.fg;
				const FGR = req.params.fgr;
				const F = req.params.f;
				const FR = req.params.fr;

				const tfgr = await rLib.checkRevisionExist("fg", FG, FGR);
				const tfr = await rLib.checkRevisionExist("f", F, FR);

				const fcbl = await FieldCanBeLink(tfgr, tfr);
				if (fcbl) {
					Response.Send(res, fcbl);
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
