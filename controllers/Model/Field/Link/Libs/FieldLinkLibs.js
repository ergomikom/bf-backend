const cLib = require("../../../../Libs/ComponentLibs");

const MODELS = require("../../../../../db/dbModels");

const fieldLink = async (PARENT, CHILD) => {
	console.log("#FieldLinkLibs");
	let trmPack = [];
	let mainIndex = 0;
	
	const fr = parseInt(cLib.getSID(CHILD.f));

	const insertData = {
		c: PARENT.c, cr: PARENT.cr, cc: null, cu: null,
		fg: PARENT.fg, fgr: PARENT.fgr, 
		f: CHILD.f, fr: fr, 
		dt: CHILD.dt
	};

	return MODELS.transaction(trm => {

		trmPack[mainIndex++] = Promise.resolve(
			trm("crmatrix")
				.insert(insertData)
		);

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
	fieldLink,
};