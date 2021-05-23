const oLib = require("../../../Libs/ObjectLibs");
const MODELS = require("../../../../db/dbModels");

const insertObject = async (CRID, FIELDS) => {
  let trmPack = [];
  let mainIndex = 0;
  const mid = await oLib.getModelId(CRID);

  const dateNow = Math.round(Date.now() / 1000);

  if(mid === false) {
    return false;
  }

  const checkObjectTableExists = await oLib.checkObjectTableExists(mid);

  if (checkObjectTableExists) {
    // aktualizacja danych
    const objectTableName = "M".concat(mid);
    let preparedData = FIELDS.map(field => {
      const fieldColumnName = "F".concat(field.f);
      return { [fieldColumnName]: field.value };
    });
    preparedData.push({ MRID: CRID })

    const insertData = preparedData.reduce(function (result, item) {
      var key = Object.keys(item)[0];
      result[key] = item[key];
      return result;
    }, {});

    return MODELS.transaction(trm => {
      trmPack[mainIndex++] = Promise.resolve(
        MODELS(objectTableName)
          .insert(insertData)
          .then((OID) => {
            FIELDS.forEach(async (field) => {
              const fname = objectTableName.concat("F").concat(field.f);
              await MODELS(fname).insert({ "OID": OID, "DCRE": dateNow, "DUPD": dateNow, "VALUE": field.value });
            })
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
  }
};

module.exports = {
  insertObject
};