const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");

const rLib = require("../../../../controllers/Libs/RevisionLibs");
const cLib = require("../../../../controllers/Libs/ComponentLibs");

const Create = require("./Libs/nnFCreateLib").Create;

const validators = {
	elements: [
		vHelper.body.cn,
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
				const CN = String(req.body.cn).toLowerCase();
				const FGN = String(req.body.fgn).toLowerCase();
				const F = (req.body.f);
				const FR = (req.body.fr);

				const componentCExistsByName = await cLib.componentExistsByName("c", CN);
				const componentFGExistsByName = await cLib.componentExistsByName("fg", FGN);
				let tfr = await rLib.checkRevisionExist("f", F, FR);

				let error = false;
				let validationErrors = {};

				if (componentCExistsByName) { error = true; validationErrors.c = { "msg": "Container of this name exists" }; }
				if (componentFGExistsByName) { error = true; validationErrors.fg = { "msg": "Field group of this name exists" }; }
				if (+tfr === undefined) { error = true; validationErrors.fg = { "msg": "Field not exists" }; }

				if (error) {
					Response.Send(res, {  statusCode: 400, data: validationErrors });
				} else {
					const cCreate = await cLib.containerCreate(CN);
					const fgCreate = await cLib.fieldGroupCreate(FGN);
					if (cCreate && fgCreate) {
						const nnFCreate = await Create(cCreate, fgCreate, tfr);
						if (nnFCreate) {
							const getCCRByMid = await rLib.getCCRByMid(nnFCreate[0][0]);
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