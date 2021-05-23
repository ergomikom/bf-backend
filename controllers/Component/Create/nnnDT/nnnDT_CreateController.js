const vLib = require("../../../Libs/ValidatorsLibs");
const vHelper = require("../../../../helpers/validator").vHelper;
const Response = require("../../../../helpers/response");
const cLib = require("../../../../controllers/Libs/ComponentLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");
const dataTypes = require("../../../../db/dbDataType");

const nnndtCreateLib = require("./Libs/nnnDTCreateLib");

const validators = {
	elements: [
		vHelper.body.cn,
		vHelper.body.fgn,
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
				const CN = String(req.body.cn).toLowerCase();
				const FGN = String(req.body.fgn).toLowerCase();
				const FN = String(req.body.fn).toLowerCase();
				const DT = (req.body.dt);

				const componentCExistsByName = await cLib.componentExistsByName("c", CN);
				const componentFGExistsByName = await cLib.componentExistsByName("fg", FGN);
				const componentFExistsByName = await cLib.componentExistsByName("f", FN);
				const GetDTExists = dataTypes.GetDTExists(DT);

				let error = false;
				let validationErrors = {};

				if (!GetDTExists) { error = true; validationErrors.f = { "dt": "DataType not exists" }; }
				if (componentCExistsByName) { error = true; validationErrors.c = { "msg": "Container already exists", "asd": "Test" }; }
				if (componentFGExistsByName) { error = true; validationErrors.fg = { "msg": "Field group already exists" }; }
				if (componentFExistsByName) { error = true; validationErrors.f = { "f": "Field already exists" }; }

				if (error) {
					Response.Send(res, {  statusCode: 400, data: validationErrors });
				} else {
					const cCreate = await cLib.containerCreate(CN);
					const fgCreate = await cLib.fieldGroupCreate(FGN);
					const fCreate = await cLib.fieldCreate(FN);

					if (cCreate && fgCreate && fCreate) {
						const nnndtCreate = await nnndtCreateLib.Create(cCreate, fgCreate, fCreate, DT);
						if (nnndtCreate) {
							const getCCRByMid = await rLib.getCCRByMid(nnndtCreate[0][0]);
							if (getCCRByMid) {
								Response.Send(res, {  statusCode: 200, data: getCCRByMid });
							} else {
								Response.Send(res, {  statusCode: 500, data: { general: { "msg": "Error when getting model after create" } } });
							}
						} else {
							Response.Send(res, {  statusCode: 500, data: { general: { "msg": "Error when creating model components" } } });
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