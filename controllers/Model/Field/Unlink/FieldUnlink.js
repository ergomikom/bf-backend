const fieldSubCloneLib = require("./Libs/FieldSubCloneLib");
const fieldUnlinkLib = require("./Libs/FieldUnlinkLibs");
const rLib = require("../../../Libs/RevisionLibs");

const FieldCanBeUnlink = require("./FieldCanBeUnlink");

const FieldUnlink = async (FG, FGR, F, FR) => {
  const CRM = await rLib.stricteRevisionExist("fg", FG, FGR, "f", F, FR);

  const fcbul = await FieldCanBeUnlink(FG, FGR, F, FR);
  if (fcbul.statusCode !== 200) {
    return fcbul;
  } else {
    if (CRM.cc) {
      const fieldSubClone = await fieldSubCloneLib.fieldSubClone(CRM, "f", FR);
      console.log(fieldSubClone)
      if (fieldSubClone) {
        if (fieldSubClone[0]) {
          const { c, cr } = await rLib.getDataByMid(fieldSubClone[0]);
          if (fieldSubClone) {
            return { statusCode: 200, data: { c, cr } };
          } else {
            return { statusCode: 200, data: { result: false } };
          }
        } else {
          return { statusCode: 500 };
        }
      }

    } else {
      const fieldUnlink = await fieldUnlinkLib.fieldUnlink(CRM);
      console.log("fieldUnlink")
      if (fieldUnlink) {
        return { statusCode: 200, data: { "c": CRM.c, "cr": CRM.cr } };
      } else {
        return { statusCode: 500 };
      }
    }
  }
}

module.exports = FieldUnlink;



