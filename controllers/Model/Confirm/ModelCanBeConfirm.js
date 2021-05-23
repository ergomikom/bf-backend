const mLib = require("../../../controllers/Libs/ModelLibs");
const rLib = require("../../../controllers/Libs/RevisionLibs");

const ModelCanBeConfirm = async (M, MR) => {
  console.log("ModelCanBeConfirm");
  const MODEL = await rLib.checkRevisionExist("c", M, MR);
  if (!MODEL) {
    const errors = { "assoc": { "msg": "Not found: there is no model with this ID" }, };
    return {  statusCode: 400, data: errors };
  } else if (MODEL.cu) {
    const errors = { "assoc": { "msg": "Validation Error: model is already in use" }, };
    return {  statusCode: 400, data: errors };
  } else if (MODEL.cc) {
    const errors = { "assoc": { "msg": "Validation Error: model is already confirm" }, };
    return {  statusCode: 400, data: errors };
  } else if (await mLib.containtCSTRUCT(await mLib.generateCSTRUCT(MR))) {
    const errors = { "assoc": { "msg": "Validation Error: model with this structure already exists" }, };
    return {  statusCode: 400, data: errors };
  } else {
    return {  statusCode: 200, data: { result: true } };
  }

}

module.exports = ModelCanBeConfirm;