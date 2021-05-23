const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const rLib = require("../../../../controllers/Libs/RevisionLibs");
const cLib = require("../../../../controllers/Libs/ComponentLibs");

const Create = require("./Libs/nFGCreateLib").Create;

const validators = {
	elements: [
		vHelper.body.cn,
		vHelper.body.fg,
		vHelper.body.fgr,
	],
};

exports.Create = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, { statusCode: 400, data: errors });
			} else {
				const CN = String(req.body.cn).toLowerCase();
				const FG = (req.body.fg);
				const FGR = (req.body.fgr);

				const componentCExistsByName = await cLib.componentExistsByName("c", CN);
				let tfgr = await rLib.checkRevisionExist("fg", FG, FGR);

				let error = false;
				let validationErrors = {};

				if (componentCExistsByName) { error = true; validationErrors.c = { "msg": "Container of this name exists" }; }
				if (+tfgr === undefined) { error = true; validationErrors.fg = { "msg": "Field group not exists" }; }

				if (error) {
					Response.Send(res, { statusCode: 400, data: validationErrors });
				} else {
					const cCreate = await cLib.containerCreate(CN);
					if (cCreate) {
						const nFGCreate = await Create(cCreate, tfgr);
						if (nFGCreate) {
							const getCCRByMid = await rLib.getCCRByMid(nFGCreate[0][0]);
							if (getCCRByMid) {
								Response.Send(res, { statusCode: 200, data: getCCRByMid });
							} else {
								Response.Send(res, { statusCode: 500, data: { general: { "msg": "Error when getting model after create" } } });
							}
						} else {
							Response.Send(res, { statusCode: 500, data: { general: { "msg": "Error when creating model" } } });
						}
					} else {
						Response.Send(res, { statusCode: 500 });
					}
				}
			}
		} catch (err) {
			console.log(err);
			Response.Send(res, { statusCode: 500 });
		}
	}
];