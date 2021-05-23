const fieldLinkLib = require("./Libs/FieldLinkLibs");
const fieldAddCloneLib = require("./Libs/FieldAddCloneLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");

const FieldCanBeLink = require("./FieldCanBeLink");

const FieldLink = async (tfgr, tfr) => {
  const fcbl = await FieldCanBeLink(tfgr, tfr);
  if (fcbl.statusCode !== 200) {
    return fcbl;
  } else {
    if (+tfgr.cc === 1) {
      const fieldAddClone = await fieldAddCloneLib.fieldAddClone(tfgr, tfr);
      const { c, cr } = await rLib.getDataByMid(fieldAddClone[0]);
      if (fieldAddClone) {
        return { statusCode: 200, data: { "c": c, "cr": cr } };
      } else {
        return {  statusCode: 500 };
      }
    } else {
      const fieldLink = await fieldLinkLib.fieldLink(tfgr, tfr);
      const { c, cr } = await rLib.getDataByMid(fieldLink[0]);
      if (fieldLink) {
        return { statusCode: 200, data: { "c": c, "cr": cr } };
      } else {
        return {  statusCode: 500 };
      }
    }
  }
};

module.exports = FieldLink;