const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const validators = {
	elements: [
		vHelper.params.id,
    vHelper.params.from,
    vHelper.params.size,
    vHelper.params.contain,
	],
};

exports.RevisionFSMController = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FID = Number.parseInt(req.params.id);
				const FROM = Number.parseInt(req.params.from) - 1;
        const SIZE = Number.parseInt(req.params.size);
				const CONTAIN = req.params.contain ? req.params.contain : "%";
				
				const getModelsWithField = await rLib.getModelsWithField(FID, FROM, SIZE, CONTAIN);
				if (getModelsWithField) {
					Response.Send(res, {  statusCode: 200, data: getModelsWithField });
				} else {
					Response.Send(res, {  statusCode: 404, data: { "global": { "msg": "Revision not exists." }, } });
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];