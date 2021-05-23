const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.type,
    vHelper.params.id,
    vHelper.params.rid,
	],
};

exports.RevisionStatusController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const TYPE = req.params.type;
				const ID = Number.parseInt(req.params.id);
				const RID = Number.parseInt(req.params.rid);
				const checkRevisionStatus = await rLib.checkRevisionStatus(TYPE, ID, RID);
				if (checkRevisionStatus) {
					Response.Send(res, {  statusCode: 200, data: checkRevisionStatus });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "mrid": { "msg": "Revision not exists." }, } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];