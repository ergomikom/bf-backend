const rLib = require("../../../controllers/Libs/RevisionLibs");

const ModelCanBeUnconfirm = async (M, MR) => {
  console.log("ModelCanBeUnconfirm");
  const MODEL = await rLib.checkRevisionExist("c", M, MR);
  if (!MODEL) {
    const errors = { "assoc": { "msg": "Validation Error: there is no model then this identifier" }, };
    return {  statusCode: 400, data: errors };
  } else {
    if (MODEL.cu) {
      const errors = { "assoc": { "msg": "Validation Error: model is already in use" }, };
      return {  statusCode: 400, data: errors };
    } else if (!MODEL.cc) {
      const errors = { "assoc": { "msg": "Validation Error: the model has not yet been confirmed" }, };
      return {  statusCode: 400, data: errors };
    } else if (MODEL.cu) {
      const errors = { "assoc": { "msg": "Validation Error: the model cannot be deleted because it is already in use" }, };
      return {  statusCode: 400, data: errors };
    } else {
      return {  statusCode: 200, data: { result: true } }
    }
  }

}

module.exports = ModelCanBeUnconfirm;
