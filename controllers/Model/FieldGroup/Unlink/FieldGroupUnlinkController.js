const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");

const FieldGroupUnlink = require("./FieldGroupUnlink");

const validators = {
	elements: [
		vHelper.body.c,
		vHelper.body.cr,
		vHelper.body.fg,
		vHelper.body.fgr,
	],
};

exports.FieldGroupUnlink = [
	// auth,	
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = req.body.c;
				const CR = req.body.cr;
				const FG = req.body.fg;
				const FGR = req.body.fgr;

				const fgul = await FieldGroupUnlink(C, CR, FG, FGR);
				if (fgul) {
					Response.Send(res, fgul);
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