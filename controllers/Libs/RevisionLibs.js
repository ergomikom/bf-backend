const MODELS = require("../../db/dbModels");
const dataTypes = require("../../db/dbDataType");

const getDataByMid = async (mid) => {
	console.log("MID = " + mid)
	return await MODELS("crmatrix")
		.where("mid", mid)
		.first()
		.then((result) => { console.log(result); return result; })
		.catch((err) => { console.log(err); return false; });
}

const getCCRByMid = async (mid) => {
	return await MODELS("crmatrix")
		.where("crmatrix.mid", mid)
		.join("tc", "tc.MID", "=", "crmatrix.c")
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.cc")
		.select("crmatrix.cu")
		.select("tc.MNAME as name")
		.first()
		.then((result) => { console.log(result); return result; })
		.catch((err) => { console.log(err); return false; });
}

const checkRevisionExist = async (type, mid, mrid) => {
	return await MODELS("crmatrix")
		
		.where(type, mid)
		.where(type.concat("r"), mrid)
		.select("*").first()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const checkAllRevisionExist = async (type, mid, mrid) => {
	return await MODELS("crmatrix")
		.where(type, mid)
		.where(type.concat("r"), mrid)
		.select("*").first()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const getContainer = async (cid, crid) => {
	return await MODELS("crmatrix")
		.join("tc", "tc.MID", "=", "crmatrix.c")
		.where("crmatrix.c", cid)
		.where("crmatrix.cr", crid)
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.cc")
		.select("crmatrix.cu")
		.select("tc.MNAME as cname")
		.distinct()
		.then((result) => { return result[0]; })
		.catch((err) => { console.log(err); return false; });
};

const getFieldGroup = async (fgid, fgrid) => {
	return await MODELS("crmatrix")
		.join("tfg", "tfg.MID", "=", "crmatrix.fg")
		.where("crmatrix.fg", fgid)
		.where("crmatrix.fgr", fgrid)
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.fg")
		.select("crmatrix.fgr")
		.select("tfg.MNAME as name")
		.distinct()
		.first()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const getField = async (fid, frid) => {
	return await MODELS("crmatrix")
		.join("tf", "tf.MID", "=", "crmatrix.f")
		.where("crmatrix.f", fid)
		.where("crmatrix.fr", frid)
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.fg")
		.select("crmatrix.fgr")
		.select("crmatrix.f")
		.select("crmatrix.fr")
		.select("crmatrix.dt")
		.select("tf.MNAME as name")
		.distinct()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const getFieldGroups = async (mid, mrid) => {
	return await MODELS("crmatrix")
		.join("tfg", "tfg.MID", "=", "crmatrix.fg")
		.where("crmatrix.c", mid)
		.where("crmatrix.cr", mrid)
		.select("crmatrix.fg")
		.select("crmatrix.fgr")
		.select("tfg.MNAME as fgname")
		.distinct()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const getFieldGroupFields = async (fg, fgr) => {
	return await MODELS("crmatrix")
		.join("tf", "tf.MID", "=", "crmatrix.f")
		.join("dt", "dt.dtid", "=", "crmatrix.dt")
		.where("crmatrix.fg", fg)
		.where("crmatrix.fgr", fgr)
		.select("crmatrix.f")
		.select("crmatrix.fr")
		.select("crmatrix.dt")
		.select("tf.MNAME as fname")
		.select("dt.dtdbtype as dtdbtype")
		.select("dt.dtdbname as dtdbname")
		.select("dt.dtengine as dtengine")
		.then((result) => {
			return result;
		})
		.catch((err) => { console.log(err); return false; });
};

const getAllFieldInModel = async (c, cr) => {
	return await MODELS("crmatrix")
		.where("c", c)
		.where("cr", cr)
		.select("f")
		.select("fr")
		.then((result) => {
			console.log(result);
			return result;
		})
		.catch((err) => { console.log(err); return false; });
};

const getAllFieldGroupsInModel = async (c, cr) => {
	return await MODELS("crmatrix")
		.where("c", c)
		.where("cr", cr)
		.select("fg")
		.select("fgr")
		.distinct()
		.then((result) => {
			console.log(result);
			return result;
		})
		.catch((err) => { console.log(err); return false; });
};

const getFieldDataType = (dtid) => {
	const dataType = dataTypes.GetDTIT(dtid);
	dataType.id = dtid;
	return dataType;
};

const checkRevisionStatus = async (type, id, rid) => {
	return await MODELS("crmatrix")
		.where(type, id)
		.where(type.concat("r"), rid)
		
		.select("cc")
		.select("cu")
		.first()
		.then((result) => {
			if (result) {
				return {
					isconfirm: result.cc ? true : false,
					isused: result.cu ? true : false,
				};
			} else {
				return false;
			}
		})
		.catch((err) => { console.log(err); return false; });
};

const stricteRevisionExist = async (pTYPE, pID, pRID, chTYPE, chID, chRID) => {
	return await MODELS("crmatrix")
		
		.where(pTYPE, pID)
		.where(pTYPE.concat("r"), pRID)
		.where(chTYPE, chID)
		.where(chTYPE.concat("r"), chRID)
		.select("*").first()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const stricteRevisionDTExist = async (pTYPE, pID, pRID, dtID) => {
	return await MODELS("crmatrix")
		
		.where(pTYPE, pID)
		.where(pTYPE.concat("r"), pRID)
		.where("dt", dtID)
		.select("*").first()
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const componentRevisionList = async (TYPE, MID, FROM, SIZE) => {
	return MODELS("crmatrix")
		
		.where(TYPE, MID)
		.select(TYPE.concat("r"))
		.distinct()
		.limit(SIZE)
		.offset(FROM)
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const componentRevisionCount = async (TYPE, MID) => {
	const count = `${TYPE.concat("r")} as COUNT`;
	return MODELS("crmatrix").distinct().where(TYPE, MID).select(count)
		.then((result) => {
			return { COUNT: result.length };
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const fieldRevisionsIndex = async (MID, FROM, SIZE, CONTAIN) => {
	return MODELS("crmatrix")
		.join("tc", "tc.mid", "=", "crmatrix.c")
		.join("tfg", "tfg.mid", "=", "crmatrix.fg")
		.where("tc.MNAME", "like", `%${CONTAIN}%`)
		.where("crmatrix.f", MID)
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.fg")
		.select("crmatrix.fgr")
		.select("crmatrix.f")
		.select("crmatrix.fr")
		.select("tc.MNAME as modelname")
		.select("tfg.MNAME as fieldgroupname")
		.distinct()
		.limit(SIZE)
		.offset(FROM)
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const fieldgroupRevisionsIndex = async (MID, FROM, SIZE, CONTAIN) => {
	return MODELS("crmatrix")
		.join("tc", "tc.mid", "=", "crmatrix.c")
		.where("tc.MNAME", "like", `%${CONTAIN}%`)
		.where("crmatrix.fg", MID)
		.select("crmatrix.c")
		.select("crmatrix.cr")
		.select("crmatrix.fg")
		.select("crmatrix.fgr")
		.select("tc.MNAME as modelname")
		.distinct()
		.limit(SIZE)
		.offset(FROM)
		.then((result) => { return result; })
		.catch((err) => { console.log(err); return false; });
};

const getModelsWithField = async (FID, FROM, SIZE, CONTAIN) => {
	return await MODELS("crmatrix")
		.join("tc", "tc.mid", "=", "crmatrix.c")
		.where("tc.MNAME", "like", `%${CONTAIN}%`)
		.where("crmatrix.f", FID)
		.select("crmatrix.c")
		.select("crmatrix.f")
		.select("tc.MNAME as cname")
		.limit(SIZE)
		.offset(FROM)
		.distinct()
		.then((result) => {
			return result;
		})
		.catch((err) => { console.log(err); return false; });
};

module.exports = {
	getDataByMid,
	getCCRByMid,
	checkRevisionExist,
	checkAllRevisionExist,
	getContainer,
	getFieldGroups,
	getFieldGroup,
	getFieldGroupFields,
	getField,
	getFieldDataType,
	stricteRevisionExist,
	stricteRevisionDTExist,
	componentRevisionList,
	componentRevisionCount,
	checkRevisionStatus,
	getAllFieldInModel,
	getAllFieldGroupsInModel,
	fieldRevisionsIndex,
	getModelsWithField,
	fieldgroupRevisionsIndex,
};
