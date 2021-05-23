const MODELS = require("../../../../../db/dbModels");
const mLib = require("../../../../Libs/ModelLibs");

const fieldUnlink = async (CRM) => {

	const countFGinCRMbyFG_FGR = await mLib.countFGinCRMbyFG_FGR(CRM.fg, CRM.fgr);
	const countAnotherCRinCRMinC = await mLib.countAnotherCRinCRMinC(CRM.c, CRM.cr);
	const countFinCRMbyF_FR = await mLib.countFinCRMbyF_FR(CRM.f, CRM.fr);
	const countAnotherFinFR = await mLib.countAnotherFinFR(CRM.fg, CRM.fgr, CRM.f);

	console.log("#fieldUnlink");
	let trmPack = [];
	let mainIndex = 0;

	return MODELS.transaction(trm => {
		trmPack[mainIndex++] = Promise.resolve(
			trm("crmatrix")
				.where("mid", CRM.mid)
				.del()
		);

		if (countFinCRMbyF_FR === 0) {
			trmPack[mainIndex++] = Promise.resolve(
				trm("tf")
					.where("mid", CRM.f)
					.del()
			);
		}

		if (countAnotherFinFR === 0 && countFGinCRMbyFG_FGR === 0) {
			trmPack[mainIndex++] = Promise.resolve(
				trm("tfg")
					.where("mid", CRM.fg)
					.del()
			);
			if (countAnotherCRinCRMinC === 0) {
				const MxP = "M".concat(CRM.c).concat("P");
				const MxCH = "M".concat(CRM.c).concat("CH");
				console.log(MxP)
				console.log(MxCH)
				trmPack[mainIndex++] = Promise.resolve(MODELS.schema.dropTableIfExists(MxP));
				trmPack[mainIndex++] = Promise.resolve(MODELS.schema.dropTableIfExists(MxCH));
				trmPack[mainIndex++] = Promise.resolve(trm("tc").where("mid", CRM.c).del())
			}
		}

		

		Promise.all(trmPack)
			.then((args) => {
				trm.commit(args);
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
	fieldUnlink,
};
