const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const cLib = require("../../../../controllers/Libs/ComponentLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");
const mLib = require("../../../../controllers/Libs/ModelLibs");

const Create = require("./Libs/CnFCreateLib").Create;

const validators = {
	elements: [
		vHelper.body.c,
		vHelper.body.cr,
		vHelper.body.fgn,
		vHelper.body.f,
		vHelper.body.fr,
	],
};
//TODO: grupa tworzona tylko w powiązaniu z containerem
exports.Create = [
	// auth,
	async (req, res) => {
		try {
			const errors = vLib.check(req, validators);
			if (Object.entries(errors).length !== 0) {
				Response.Send(res, {  statusCode: 400, data: errors });
			} else {
				const C = (req.body.c);
				const CR = (req.body.cr);
				const FGN = String(req.body.fgn).toLowerCase();
				const F = (req.body.f);
				const FR = (req.body.fr);

				let tcr = await rLib.checkRevisionExist("c", C, CR);
				const componentExistsByName = await cLib.componentExistsByName("fg", FGN);
				let tfr = await rLib.checkRevisionExist("f", F, FR);

				let error = false;
				let validationErrors = {};

				if (+tcr === undefined) { error = true; validationErrors.c = { "msg": "Container not exists" }; }
				if (componentExistsByName) { error = true; validationErrors.fg = { "msg": "Field group of this name exists" }; }
				if (+tfr === undefined) { error = true; validationErrors.f = { "msg": "Field not exists" }; }

				if (error) {
					Response.Send(res, {  statusCode: 400, data: validationErrors });
				}

				if (await mLib.containFinCR(tcr.cr, tfr.f)) {
					return Response.Send(res, {  statusCode: 302, data: { f: { "msg": "Validation Error: a field is already added to this container" } } });
				} else {
					const fgCreate = await cLib.fieldGroupCreate(FGN);
					if (fgCreate) {
						const cnfCreate = await Create(tcr, fgCreate, tfr);
						if (cnfCreate) {
							const getCCRByMid = await rLib.getCCRByMid(cnfCreate[0][0]);
							if (getCCRByMid) {
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
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];