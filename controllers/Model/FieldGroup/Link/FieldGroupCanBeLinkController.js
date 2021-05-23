const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const rLib = require("../../../../controllers/Libs/RevisionLibs");

const FieldGroupCanBeLink = require("./FieldGroupCanBeLink");

const validators = {
	elements: [
		vHelper.params.c,
		vHelper.params.cr,
		vHelper.params.fg,
		vHelper.params.fgr,
	],
};

exports.FieldCanBeLinkController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = req.params.c;
				const CR = req.params.cr;
				const FG = req.params.fg;
				const FGR = req.params.fgr;

				const tcr = await rLib.checkRevisionExist("c", C, CR);
				const tfgr = await rLib.checkRevisionExist("fg", FG, FGR);

				const fgcbl = await FieldGroupCanBeLink(tcr, tfgr);
				if (fgcbl) {
					Response.Send(res, fgcbl);
				}

			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];
