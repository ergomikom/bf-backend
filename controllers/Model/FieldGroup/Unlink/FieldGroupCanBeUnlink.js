const mLib = require("../../../Libs/ModelLibs");
const rLib = require("../../../Libs/RevisionLibs");

const FieldGroupCanBeUnlink = async (C, CR, FG, FGR) => {

  const CRM = await rLib.stricteRevisionExist("c", C, CR, "fg", FG, FGR);
  const cc = CRM.cc;
  const countFG = await mLib.countAnotherFGinCR(C, CR, FG);

  if (CRM === undefined) {
    const errors = { "assoc": { "msg": "Validation Error: this association does not exist" }, };
    return { statusCode: 400, data: errors };
  } else if ((countFG === 0) && (CRM.cc === 1)) {
    const errors = { "assoc": { "msg": "Validation Error: nie  można usunąć tej grupy bo to ostatnia grupa i powstał by pusty model." }, };
    return { statusCode: 400, data: errors };
  } else {
    return { statusCode: 200, data: { result: true } };
  }
}

module.exports = FieldGroupCanBeUnlink;
