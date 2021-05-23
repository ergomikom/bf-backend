const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const cLib = require("../../../../controllers/Libs/ComponentLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");
const mLib = require("../../../../controllers/Libs/ModelLibs");

const Create = require("./Libs/CFGnDTCreateLib").Create;

const validators = {
	elements: [
		vHelper.body.fg,
		vHelper.body.fgr,
		vHelper.body.fn,
		vHelper.body.dt,
	],
};

exports.Create = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const FG = (req.body.fg);
				const FGR = (req.body.fgr);
				const FN = String(req.body.fn).toLowerCase();
				const DT = (req.body.dt);

				const tfgr = await rLib.checkRevisionExist("fg", FG, FGR);
				const componentExistsByName = await cLib.componentExistsByName("f", FN);
				
				let error = false;
				let validationErrors = {};

				if (+tfgr === undefined) { error = true; validationErrors.fg = { "msg": "Field group not exists" }; }
				if (componentExistsByName) { error = true; validationErrors.f = { "msg": "Field of this name exists" }; }

				if (error) {	
					Response.Send(res, {  statusCode: 400, data: validationErrors });
				} else {
					const fCreate = await cLib.fieldCreate(FN);
					if (await mLib.containFinCR(tfgr.cr, fCreate)) {
						return Response.Send(res, {  statusCode: 302, data: { "field": { "msg": "Validation Error: a field is already added to this container" } } });
					} else {
						if (fCreate) {
							const cfgndtCreate = await Create(tfgr, fCreate, DT);
							if (cfgndtCreate) {
								const getCCRByMid = await rLib.getCCRByMid(cfgndtCreate[0][0]);
								if (getCCRByMid) {
									console.log(getCCRByMid)
									Response.Send(res, {  statusCode: 200, data: getCCRByMid });
								} else {
									Response.Send(res, {  statusCode: 500, data: { general: { "msg": "Error when getting model after create" } } });
								}
							} else {
								Response.Send(res, {  statusCode: 500, data: { general: { "msg": "Error when creating model" } } });
							}
						} else {
							Response.Send(res, {  statusCode: 500 });
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];