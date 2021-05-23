const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");

const FieldGroupCanBeUnlink = require("./FieldGroupCanBeUnlink");

const validators = {
	elements: [
		vHelper.params.c,
		vHelper.params.cr,
		vHelper.params.fg,
		vHelper.params.fgr,
	],
};

exports.FieldGroupCanBeUnlinkController = [
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

				const fgcbul = await FieldGroupCanBeUnlink(C, CR, FG, FGR);
				if (fgcbul) {
					Response.Send(res, fgcbul);
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
