const fieldGroupUnlinkLib = require("./Libs/FieldGroupUnlinkLibs");
const fieldGroupSubCloneLib = require("./Libs/FieldGroupSubCloneLib");

const rLib = require("../../../Libs/RevisionLibs");

const FieldGroupCanBeUnlink = require("./FieldGroupCanBeUnlink");

const FieldUnlink = async (C, CR, FG, FGR) => {
  const CRM = await rLib.stricteRevisionExist("c", C, CR, "fg", FG, FGR);

  const fgcbul = await FieldGroupCanBeUnlink(C, CR, FG, FGR);
  if (fgcbul.statusCode !== 200) {
    return fgcbul;
  } else {
    if (CRM.cc) {
      const fieldGroupSubClone = await fieldGroupSubCloneLib.fieldGroupSubClone(CRM, "fg", FGR);
      console.log(fieldGroupSubClone)
      if (fieldGroupSubClone) {
        if (fieldGroupSubClone[0]) {
          const { c, cr } = await rLib.getDataByMid(fieldGroupSubClone[0]);
          return { statusCode: 200, data: { c, cr } };
        } else {
          return { statusCode: 200, data: { result: false } };
        }
      } else {
        return { statusCode: 500 };
      }
    } else {
      const fieldGroupUnlink = await fieldGroupUnlinkLib.fieldGroupUnlink(CRM);
      console.log("fieldGroupUnlink")
      if (fieldGroupUnlink) {
        return { statusCode: 200, data: { "c": C, "cr": CR } };
      } else {
        return { statusCode: 500 };
      }
    }
  }
}

module.exports = FieldUnlink;