const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const rLib = require("../../../../controllers/Libs/RevisionLibs");

const FieldLink = require("./FieldLink");

const validators = {
	elements: [
		vHelper.body.fg,
		vHelper.body.fgr,
		vHelper.body.f,
		vHelper.body.fr,
	],
};

exports.FieldLinkController = [
	// auth,
	async (req, res) => {
		console.log("FieldLinkController")
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = req.body.fg;
				const FGR = req.body.fgr;
				const F = req.body.f;
				const FR = req.body.fr;

				const tfgr = await rLib.checkRevisionExist("fg", FG, FGR);
				const tfr = await rLib.checkRevisionExist("f", F, FR);

				const fl = await FieldLink(tfgr, tfr);
				if (fl) {
					Response.Send(res, fl);
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
