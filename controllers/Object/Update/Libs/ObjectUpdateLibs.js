const oLib = require("../../../Libs/ObjectLibs");
const MODELS = require("../../../../db/dbModels");

const updateObject = async (MID, CRID, OID, FIELDS) => {
  const checkObjectTableExists = await oLib.checkObjectTableExists(MID);

  let trmPack = [];
  let mainIndex = 0;

  if (checkObjectTableExists) {
    const objectTableName = "M".concat(MID);
    const preparedData = FIELDS.map(field => {
      const fieldColumnName = "F".concat(field.f);
      return { [fieldColumnName]: field.value };
    });

    const updateData = preparedData.reduce(function (result, item) {
      var key = Object.keys(item)[0];
      result[key] = item[key];
      return result;
    }, {});

    const actualDatetime = MODELS.fn.now();

    return MODELS.transaction(trm => {
      trmPack[mainIndex++] = Promise.resolve(
        MODELS(objectTableName)
          .where("OID", OID)
          .update(updateData)
          .update("DUPD", actualDatetime)
      );
      trmPack[mainIndex++] = Promise.resolve(
        FIELDS.forEach(async (field) => {
          const fname = objectTableName.concat("F").concat(field.f);
          const isTheSameLastObjValue = await oLib.isTheSameLastObjValue(OID, MID, CRID, field.f, field.value);
          if (isTheSameLastObjValue !== true) {
            await MODELS(fname).insert({ "OID": OID, "MRID": CRID, "DSTA": actualDatetime, "VALUE": field.value });
            await MODELS(fname).where("ROID", isTheSameLastObjValue.ROID).update({ "DEND": actualDatetime });
          }
          else {
            // console.log("Ta sama wartość!");
          }
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
          trmPack.forEach(promise => promise.cancel());
          console.log(error);
          trm.rollback();
          return false;
        });
    });
  } else {
    // nie ma takiej tabeli, coś nie tak
    return false;
  }


};

module.exports = {
  updateObject
};