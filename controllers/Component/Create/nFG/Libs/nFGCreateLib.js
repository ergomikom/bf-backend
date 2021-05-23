const MODELS = require("../../../../../db/dbModels");

const mLib = require("../../../../../controllers/Libs/ModelLibs");
const cLib = require("../../../../../controllers/Libs/ComponentLibs");

const Create = async (C, tfgr) => {
	let trmPack = [];
	let mainIndex = 0;
	let newRows = [];
	let modelData = {};

	// C = C
	const CR = cLib.getSID(C);
	const FG = tfgr.fg;
	const FGR = cLib.getSID(FG);

	let cModelRows = await mLib.getFGRecordsFromCRM(tfgr.fg, tfgr.fgr);

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

	cModelRows.forEach((row) => {
		if (!modelData[row.fgr]) { modelData[row.fgr] = row.fg !== FG ? cLib.getSID(row.fg) : FGR; }
		if (!modelData[row.fr]) { modelData[row.fr] = cLib.getSID(row.f); }
	});

	cModelRows.forEach((row) => {
		newRows.push({
			c: C, cr: CR, cc: null, cu: null,
			fg: row.fg, fgr: +modelData[row.fgr],
			f: row.f, fr: +modelData[row.fr],
			dt: row.dt
		});
	});

	newRows.forEach((row) => {
		trmPack[mainIndex++] = Promise.resolve(
			trm("crmatrix")
				.insert([{
					"c": row.c, "cr": row.cr,
					"fg": row.fg, "fgr": row.fgr,
					"f": row.f, "fr": row.fr,
					"dt": row.dt
				}])
		);
	});

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