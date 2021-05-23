const mLib = require("../../../Libs/ModelLibs");

const FieldCanBeLink = async (tfgr, tfr) => {
  console.log("FieldCanBeLink")

  let errors = false;
  
  if (tfr === undefined) {
    errors = { "assoc": { "msg": "Validation Error: field component revision does not exist" }, };
  } else if (tfgr === undefined) {
    errors = { "assoc": { "msg": "Validation Error: field group component revision does not exist" }, };
  } else if (tfgr.mid === tfr.mid) {
    errors = { "assoc": { "msg": "Validation Error: these field are already linked together" }, };
  } else if (await mLib.containFinFGR(tfgr, tfr)) {
    errors = { "assoc": { "msg": "Validation Error: this field is already added to this group of fields" }, };
  } else if (await mLib.containFinCR(tfgr.cr, tfr.f)) {
    errors = { "assoc": { "msg": "Validation Error: a field is already added to this container" }, };
  }

  if (errors) {
    return {  statusCode: 400, data: errors };
  } else {
    return {  statusCode: 200, data: { result: true } };
  }


}

module.exports = FieldCanBeLink;