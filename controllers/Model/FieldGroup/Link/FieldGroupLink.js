const fgLinkLib = require("./Libs/FieldGroupLinkLibs");
const fgCloneLib = require("./Libs/FieldGroupCloneLibs");
const rLib = require("../../../../controllers/Libs/RevisionLibs");

const FieldGroupCanBeLink = require("./FieldGroupCanBeLink");

const FieldGroupLink = async (tcr, tfgr) => {
  const fgcbl = await FieldGroupCanBeLink(tcr, tfgr);
  if (fgcbl.statusCode !== 200) {
    return fgcbl;
  } else {
    if (+tcr.cc === 1) {
      const fgClone = await fgCloneLib.fieldGroupClone(tcr, tfgr);
      const { c, cr } = await rLib.getDataByMid(fgClone[0]);
      if (fgClone) {
        return { statusCode: 200, data: { "c": c, "cr": cr } };
      } else {
        return { statusCode: 500 };
      }
    } else {
      const fieldGroupLink = await fgLinkLib.fieldGroupLink(tcr, tfgr);
      const { c, cr } = await rLib.getDataByMid(fieldGroupLink[0]);
      if (fieldGroupLink) {
        return { statusCode: 200, data: { "c": c, "cr": cr } };
      } else {
        return { statusCode: 500 };
      }
    }
  }

};

module.exports = FieldGroupLink; 