const mLib = require("../../../Libs/ModelLibs");

const FieldGroupCanBeLink = async (tcr, tfgr) => {

  let errors = false;

  if (tcr === undefined) {
    errors = { "assoc": { "msg": "Validation Error: container component revision does not exist" } };
  } else if (tfgr === undefined) {
    errors = { "assoc": { "msg": "Validation Error: field group component revision does not exist" } };
  } else if (tcr.c === tfgr.c && tcr.cr === tfgr.cr) {
    errors = { "assoc": { "msg": "Validation Error: these field group are already linked together" } };
  } else if (await mLib.containFGinCR(tcr, tfgr)) {
    errors = { "assoc": { "msg": "Validation Error: a field group of this type is already added to this container" } };
  }

  if (errors) {
    return {  statusCode: 400, data: errors };
  } else {
    return {  statusCode: 200, data: { result: true } };
  }

}

module.exports = FieldGroupCanBeLink;