const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const cLib = require("../../../../controllers/Libs/ComponentLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");
const dataTypes = require("../../../../db/dbDataType");

const Create = require("./Libs/CnnDTCreateLib").Create;

const validators = {
	elements: [
		vHelper.body.c,
		vHelper.body.cr,
		vHelper.body.fgn,
		vHelper.body.fn,
		vHelper.body.dt,
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
				const FN = String(req.body.fn).toLowerCase();
				const DT = (req.body.dt);

				const tcr = await rLib.checkRevisionExist("c", C, CR);
				const componentFGExistsByName = await cLib.componentExistsByName("fg", FGN);
				const componentFExistsByName = await cLib.componentExistsByName("f", FN);
				const GetDTExists = dataTypes.GetDTExists(DT);

				let error = false;
				let validationErrors = {};

				if (+tcr === undefined) { error = true; validationErrors.c = { "msg": "Container not exists" }; }
				if (!GetDTExists) { error = true; validationErrors.dt = { "msg": "DataType not exists" }; }
				if (componentFGExistsByName) { error = true; validationErrors.fg = { "msg": "Field group already exists" }; }
				if (componentFExistsByName) { error = true; validationErrors.f = { "f": "Field already exists" }; }

				if (error) {	
					Response.Send(res, {  statusCode: 400, data: validationErrors });
				} else {
					const fgCreate = await cLib.fieldGroupCreate(FGN);
					const fCreate = await cLib.fieldCreate(FN);
					if (fgCreate && fCreate) {
						const CnndtCreate = await Create(tcr, fgCreate, fCreate, DT);
						if (CnndtCreate) {
							const getCCRByMid = await rLib.getCCRByMid(CnndtCreate[0][0]);
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
		} catch (err) {
			console.log(err);
			Response.Send(res, {  statusCode: 500 });
		}
	}
];