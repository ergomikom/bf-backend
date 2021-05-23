const mLib = require("../../../Libs/ModelLibs");

const MODELS = require("../../../../db/dbModels");

const unconfirmModel = async (MODEL) => {
	console.log("#unconfirmModel")

	let cModelRows = await mLib.getCRecordsFromCRM(MODEL.c, MODEL.cr);
	let trmPack = [];
	let mainIndex = 0;

	const fgrs = await mLib.getFGRecordsfromCR(MODEL.c, MODEL.cr);

	const countSameCinCRMwithCC = await mLib.countSameCinCRMwithCC(MODEL.c, MODEL.cr);

	return MODELS.transaction((trm) => {
		const modelTableName = "M".concat(MODEL.c);

		if (countSameCinCRMwithCC < 1) {
			trmPack[mainIndex++] = Promise.resolve(
				MODELS.schema.dropTableIfExists(modelTableName)
			);
			const MxRELS = modelTableName.concat("Rels");
			trmPack[mainIndex++] = Promise.resolve(
				MODELS.schema.dropTableIfExists(MxRELS)
			);
		}

		trmPack[mainIndex++] = Promise.resolve(
			cModelRows.forEach(async (row) => {
				const countConfirmFinCRM = await mLib.countConfirmFinCRM(row.f);

				if (countConfirmFinCRM === 1) {
					const fieldTableName = "M".concat(MODEL.c).concat("F").concat(row.f);
					await MODELS.schema.dropTableIfExists(fieldTableName);
				}

				if (countSameCinCRMwithCC > 1) {
					const columnName = "F".concat(row.f);
					const indexName = "Index_".concat(row.f);
					MODELS.schema.hasColumn(modelTableName, columnName)
						.then(async (exists) => {
							if (exists && countConfirmFinCRM === 1) {
								await MODELS.schema
									.alterTable(modelTableName, (table) => {
										table.dropColumn(columnName);
										table.dropIndex(indexName);
									})
							}
						});
				}

			})
		);

		trmPack[mainIndex++] = Promise.resolve(
			MODELS("crmatrix")
				.where("c", MODEL.c)
				.where("cr", MODEL.cr)
				.update({ "cc": null, })
		);

		trmPack[mainIndex++] = Promise.resolve(
			trm("cstruct")
				.where("c", MODEL.c)
				.where("cr", MODEL.cr)
				.del()
		);

		trmPack[mainIndex++] = Promise.resolve(
			fgrs.forEach(async (row) => {
				await trm("fgstruct")
					.where("fg", row.fg)
					.where("fgr", row.fgr)
					.del();
			})
		);

		Promise.all(trmPack)
			.then((args) => {
				trm.commit(args);
			})
			.then(() => {
				return true;
			})
			.catch(error => {
				trmPack.forEach(promise => promise.cancel());
				console.log(error);
				trm.rollback();
				return false;
			});
	});
};

module.exports = {
	unconfirmModel,
};