const rLib = require("../../../controllers/Libs/RevisionLibs");

const mcLib = require("./Libs/ModelConfirmLibs");

const ModelCanBeConfirm = require("./ModelCanBeConfirm");

const ModelConfirm = async (C, CR) => {
  const mcbc = await ModelCanBeConfirm(C, CR);
  if (mcbc.statusCode !== 200) {
    return mcbc;
  } else {
    const MODEL = await rLib.checkRevisionExist("c", C, CR);
    if (MODEL) {
      const confirmResult = await mcLib.confirmModel(MODEL);
      if (confirmResult) {
        const result = { "c": MODEL.c, "cr": MODEL.cr };
        return {  statusCode: 200, data: result };
      } else {
        return {  statusCode: 500 };
      }
    } else {
      return {  statusCode: 500 };
    }
  }
}

module.exports = ModelConfirm;