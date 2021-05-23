const rLib = require("../../../controllers/Libs/RevisionLibs");

const muLib = require("./Libs/ModelUnconfirmLibs");

const ModelCanBeUnconfirm = require("./ModelCanBeUnconfirm");

const ModelUnconfirm = async (C, CR) => {
  const mcbuc = await ModelCanBeUnconfirm(C, CR);
  if (mcbuc.statusCode !== 200) {
    return mcbuc;
  } else {
    const MODEL = await rLib.checkRevisionExist("c", C, CR);
    if (MODEL) {
      const unconfirmResult = await muLib.unconfirmModel(MODEL);
      if (unconfirmResult) {
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

module.exports = ModelUnconfirm;
