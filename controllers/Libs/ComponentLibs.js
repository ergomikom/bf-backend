/* eslint-disable require-atomic-updates */
const MODELS = require("../../db/dbModels");

const componentCanBeDelete = async (TYPE, MID) => {
	switch (TYPE) {
		case "c":
			return Promise.resolve(
				MODELS("crmatrix")
					
					.where(TYPE, MID).whereNotNull("fg").count("mid as COUNT").first()
					.then((result) => result.COUNT > 0 ? false : true)
					.catch((err) => { console.log(err); return false; })
			);
		case "fg":
			return Promise.resolve(
				MODELS("crmatrix")
					
					.where(TYPE, MID).whereNotNull("c").whereNotNull("f").count("mid as COUNT").first()
					.then((result) => result.COUNT > 0 ? false : true)
					.catch((err) => { console.log(err); return false; })
			);
		case "f":
			return Promise.resolve(
				MODELS("crmatrix")
					
					.where(TYPE, MID).whereNotNull("fg").whereNotNull("dt").count("mid as COUNT").first()
					.then((result) => result.COUNT > 0 ? false : true)
					.catch((err) => { console.log(err); return false; })
			);
	}
	return false;
};
const componentExistsByName = async (TYPE, NAME) => {
	const tableName = "t".concat(TYPE);
	return await MODELS(tableName)
		.where({ MNAME: NAME.trim() })
		.count("MID as COUNT")
		.first()
		.then((tx) => {
			if (tx.COUNT !== 0) {
				return true;
			} else {
				return false;
			}
		})
		.catch((err) => { console.log(err); return false; });
};

const componentExistsByMID = async (TYPE, MID) => {
	const tableName = "t".concat(TYPE);
	return await MODELS(tableName)
		.where({ MID: MID })
		.count("MID as COUNT")
		.first()
		.then((tx) => {
			if (tx.COUNT !== 0) {
				return true;
			} else {
				return false;
			}
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const containerCreate = async (NAME) => {
	return await MODELS("tc")
		.insert({ MNAME: NAME })
		.then((result) => {
			return result[0];
		})
		.catch((err) => { console.log(err); return false; });
};

const fieldGroupCreate = async (NAME) => {
	return await MODELS("tfg")
		.insert({ MNAME: NAME })
		.then((result) => {
			return result[0];
		})
		.catch((err) => { console.log(err); return false; });
};

const fieldCreate = async (NAME) => {
	return await MODELS("tf")
		.insert({ MNAME: NAME })
		.then((result) => {
			return result[0];
		})
		.catch((err) => { console.log(err); return false; });
};

const componentUpdate = async (TYPE, MID, NAME) => {
	const tableName = "t".concat(TYPE);
	MODELS(tableName)
		.where("MID", MID).update({ "MNAME": NAME }).then((updateData) => { return updateData; })
		.catch((err) => { console.log(err); return false; });
};

const componentDelete = async (TYPE, MID) => {
	const tableName = "t".concat(TYPE);
	return await MODELS.transaction((trm) => {
		return MODELS(tableName).where({ MID: MID }).del().transacting(trm)
			.then(async () => {
				return await MODELS("crmatrix").where(TYPE, MID).del().transacting(trm);
			})
			.then(trm.commit)
			.catch(trm.rollback);
	})
		.then((result) => {
			return result;
		})
		.catch((err) => { console.log(err); return false; });
};

const componentOnlyInNameTableDelete = async (TYPE, MID) => {
	const tableName = "t".concat(TYPE);
	return await MODELS.transaction((trm) => {
		return MODELS(tableName)
			.where({ MID: MID })
			.del()
			.then(trm.commit)
			.catch(trm.rollback);
	})
		.then(() => {
			return true;
		})
		.catch((err) => { console.log(err); return false; });
};

const componentIndex = async (TYPE, FROM, SIZE, CONTAIN) => {
	const tabbleName = "t".concat(TYPE);
	return MODELS(tabbleName)
		.where("MNAME", "like", `%${CONTAIN}%`)
		.limit(SIZE)
		.offset(FROM)
		.select("MID as mid")
		.select("MNAME as name")
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const componentCount = async (TYPE, CONTAIN) => {
	const tabbleName = "t".concat(TYPE);
	return MODELS(tabbleName)
		.where("MNAME", "like", `%${CONTAIN}%`)
		.count("MID as COUNT")
		.first()
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const componentDetail = async (TYPE, MID) => {
	const tabbleName = "t".concat(TYPE);
	return MODELS(tabbleName)
		.where("MID", MID)
		.first()
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const getSID = (PRE) => {
	const low = 10000;
	const high = 99999;
	return String(PRE) + Math.floor(Math.random() * (high - low + 1) + low);
}

const fieldsIndex = async (FROM, SIZE, CONTAIN) => {
	return MODELS("tf")
		.join("crmatrix", "crmatrix.f", "=", "tf.MID")
		.join("dt", "dt.dtid", "=", "crmatrix.dt")
		.where("tf.MNAME", "like", `%${CONTAIN}%`)
		.select("tf.MID as f")
		.select("tf.MNAME as fname")
		.select("crmatrix.dt as dt")
		.select("dt.dtid")
		.select("dt.dtdbtype as dtdbtype")
		.select("dt.dtdbname as dtdbname")
		.select("dt.dtengine as dtengine")
		.limit(SIZE)
		.offset(FROM)
		.distinct()
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

const fieldgroupsIndex = async (FROM, SIZE, CONTAIN) => {
	return MODELS("tfg")
		.where("tfg.MNAME", "like", `%${CONTAIN}%`)
		.select("tfg.MID as fg")
		.select("tfg.MNAME as fgname")
		.limit(SIZE)
		.offset(FROM)
		.distinct()
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

module.exports = {
	componentCanBeDelete,
	componentExistsByName,
	componentExistsByMID,
	containerCreate,
	fieldGroupCreate,
	fieldCreate,
	componentUpdate,
	componentCount,
	componentIndex,
	componentDetail,
	componentDelete,
	componentOnlyInNameTableDelete,
	getSID,
	fieldsIndex,
	fieldgroupsIndex,
};