const MODELS = require("../../../../../db/dbModels");

const cLib = require("../../../../../controllers/Libs/ComponentLibs");

const Create = async (C, FG, tfr) => {
	let trmPack = [];
	let mainIndex = 0;

	const CR = cLib.getSID(C);
	const FGR = cLib.getSID(FG);
	const F = tfr.f;
	const FR = cLib.getSID(F);
	const DT = tfr.dt;

	const record = { c: C, cr: CR, fg: FG, fgr: FGR, f: F, fr: FR, dt: DT };
	trmPack[mainIndex++] = Promise.resolve(
		MODELS("crmatrix").insert([record])
	);

	const MxS = "M".concat(C).concat("Schema");
	trmPack[mainIndex++] = Promise.resolve(
		await MODELS.schema.createTable(MxS, (table) => {
			table.increments("ID").unsigned().primary();
			table.integer("MRID");
			table.integer("TYPE");
			table.integer("DSTA");
			table.integer("DEND").nullable().defaultTo(null);
			table.integer("RELMID");
			table.integer("RELMRID");
		})
	);

	return MODELS.transaction(trm => {
		Promise.all(trmPack)
			.then(async (args) => {
				await trm.commit(args);
			})
			.then(async (args) => {
				return record;
			})
			.catch(error => {
				// trmPack.forEach(promise => promise.cancel());
				console.log(error);
				trm.rollback();
				return false;
			});
	})
};

module.exports = {
	Create,
};