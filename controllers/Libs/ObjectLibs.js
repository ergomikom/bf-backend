const MODELS = require("../../db/dbModels");

const getModelId = async (CR) => {
  return await MODELS("crmatrix")
    
    .where("cr", CR)
    .select("c")
    .first()
    .then((result) => {
      if (result !== undefined) {
        return result.c;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const getFieldsFromCR = async (CR) => {
  return await MODELS("crmatrix")
    
    .where("cr", CR)
    .select("f", "fr", "dt", "cc")
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const checkObjectTableExists = async (mid) => {
  const modelTableName = "M".concat(mid);
  console.log(modelTableName)
  return await MODELS.schema
    .hasTable(modelTableName)
    .then(async (exists) => {
      if (exists) {
        return true;
      }
      return false;
    });
}

const checkObjectExist = async (MID, OID) => {
  const objectTableName = "M".concat(MID);
  return await MODELS(objectTableName)
    .where("OID", OID)
    .count("OID as COUNT")
    .first()
    .then((result) => {
      return result.COUNT;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const getPrevObjectData = async (MID, OID, CRID) => {
  const objectTableName = "M".concat(MID);
  return await MODELS(objectTableName)
    .where("OID", OID)
    .where("MRID", CRID)
    .select("*")
    .first()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const isTheSameLastObjValue = async (OID, MID, CRID, FID, VALUE) => {
  const fieldColumnName = "F".concat(FID);
  const objectFieldName = "M".concat(MID).concat(fieldColumnName);

  return await MODELS(objectFieldName)
    .where("OID", OID)
    .where("MRID", CRID)
    .select("ROID", "VALUE")
    .orderBy("ROID", "desc")
    .first()
    .then((result) => {
      if (result.VALUE == VALUE) {
        return true;
      }
      else if (result.VALUE !== VALUE) {
        return result;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

module.exports = {
  getModelId,
  getFieldsFromCR,
  checkObjectTableExists,
  checkObjectExist,
  getPrevObjectData,
  isTheSameLastObjValue
};