const mLib = require("../../../Libs/ModelLibs");

const MODELS = require("../../../../db/dbModels");

const dataTypes = require("../../../../db/dbDataType");

const confirmModel = async (MODEL) => {
	console.log("#confirmModel");

	let cModelRows = await mLib.getCRecordsFromCRM(MODEL.c, MODEL.cr);
	// console.log(cModelRows)
	let trmPack = [];
	let mainIndex = 0;

	const cstruct = await mLib.generateCSTRUCT(MODEL.cr);
	const fgrs = await mLib.getFGRecordsfromCR(MODEL.c, MODEL.cr);
	let fgrstructs = fgrs.map(async (row) => {
		const fgstruct = await mLib.generateFGSTRUCT(row.fg, row.fgr);
		const dtstruct = await mLib.generateDTSTRUCT(row.fg, row.fgr);
		const data = { fg: row.fg, fgr: row.fgr, fgstruct: fgstruct, dtstruct: dtstruct };
		return data;
	});

	const dataTArray = await dataTypes.GetDT_toConfirm();

	return MODELS.transaction(trm => {

		const modelTableName = "M".concat(MODEL.c);

		MODELS.schema.hasTable(modelTableName)
			.then(async (result) => {
				return result;
			})
			.then(async (result) => {

				if (!result) {
					console.log("IF1")
					trmPack[mainIndex++] = Promise.resolve(
						await MODELS.schema.createTable(modelTableName, (table) => {
							table.increments("OID").unsigned().primary();
							table.integer("MRID");
							table.integer("DCRE");
							table.integer("DUPD");
							cModelRows.forEach((row) => {
								// console.log(dataTArray[row.dt])
								getColumn(dataTArray[row.dt], row.f, table, "F".concat(row.f));
							});
						})
					);

					const MxRELS = modelTableName.concat("Rels");
					trmPack[mainIndex++] = Promise.resolve(
						await MODELS.schema.createTable(MxRELS, (table) => {
							table.increments("ID").unsigned().primary();
							table.integer("OID");
							table.integer("TYPE");
							table.integer("DSTA");
							table.integer("DEND").nullable().defaultTo(null);
							table.integer("RELOID");
							table.integer("RELMID");
							table.integer("RELMRID");
						})
					);
				} else {
					console.log("ELSE1")
					trmPack[mainIndex++] = Promise.resolve(
						cModelRows.forEach(async (row) => {
							const columnName = "F".concat(row.f);
							await MODELS.schema.hasColumn(modelTableName, columnName)
								.then(async (exists) => {
									if (!exists) {
										await MODELS.schema
											.alterTable(modelTableName, (table) => {
												// console.log(dataTArray[row.dt])
												getColumn(dataTArray[row.dt], row.f, table, "F".concat(row.f));
											});
									}
								});
						})
					);
				}
			});

		trmPack[mainIndex++] = Promise.resolve(
			cModelRows.forEach(async (row) => {
				const fieldTableName = "M".concat(MODEL.c).concat("F").concat(row.f);
				MODELS.schema
					.hasTable(fieldTableName)
					.then(async (exists) => {
						if (!exists) {
							await MODELS.schema
								.createTable(fieldTableName, (table) => {
									table.increments("ROID").unsigned().primary();
									table.integer("OID");
									// table.integer("MRID");
									table.integer("DSTA");
									table.integer("DEND").nullable().defaultTo(null);
									getColumn(dataTArray[row.dt], row.f, table, "VALUE");
								});
						}
					});
			})
		);

		trmPack[mainIndex++] = Promise.resolve(
			MODELS("crmatrix")
				.where("c", MODEL.c)
				.where("cr", MODEL.cr)
				.update({ "cc": 1, })
		);

		trmPack[mainIndex++] = Promise.resolve(
			trm("cstruct")
				.insert([{ c: MODEL.c, cr: MODEL.cr, struct: cstruct }])
		);

		trmPack[mainIndex++] = Promise.resolve(
			fgrstructs.forEach(async (row) => {
				const data = await row;
				await trm("fgstruct")
					.insert({ fg: data.fg, fgr: data.fgr, fgstruct: data.fgstruct, dtstruct: data.dtstruct })
			})
		);

		Promise.all(trmPack)
			.then((args) => {
				trm.commit(args);
			})
			.then(async () => {
				return true;
			})
			.catch(error => {
				// trmPack.forEach(promise => promise.cancel());
				console.log(error);
				trm.rollback();
				return false;
			});
	});
};

module.exports = {
	confirmModel,
};

const getColumn = async (DT, f, table, name) => {

	const { dtid, dtdbtype, dtdbname, isBigInt, mBeNeg, isDate, isTime, maxVal } = DT;
	console.log(dtid, dtdbtype, isBigInt, mBeNeg, isDate, isTime, maxVal);
	switch (dtdbtype) {
		case "logical":
			return table.boolean(name);

		case "integer":
			if (isBigInt) {
				if (mBeNeg) {
					return table.bigInteger(name);
				} else {
					return table.bigInteger(name).unsigned();
				}
			} else {
				if (mBeNeg) {
					return table.specificType(name, String(dtdbname).toLowerCase()).index("Index_".concat(f));
				} else {
					return table.specificType(name, String(dtdbname).toLowerCase()).unsigned().index("Index_".concat(f));
				}
			}

		case "decimal":
			return table.decimal(name, 10, 4).index("Index_".concat(row.f));

		case "float":
			return table.specificType(name, String(dtdbname).toLowerCase());

		case "date":
			if (isDate && isTime) {
				return table.datetime(name).index("Index_".concat(f));
			} else if (isDate && !isTime) {
				return table.date(name).index("Index_".concat(f));
			} else if (isTime && !isDate) {
				return table.time(name).index("Index_".concat(f));
			}
			break;

		case "text":
			if (maxVal <= 1024) {
				return table.string(name).index("Index_".concat(f));
			} else {
				return table.text(name, String(dtdbname).toLowerCase());
			}

		case "binary":
			return table.specificType(name, String(dtdbname).toLowerCase());
	}
}
