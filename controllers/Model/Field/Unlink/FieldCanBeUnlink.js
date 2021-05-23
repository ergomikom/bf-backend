const mLib = require("../../../Libs/ModelLibs");
const rLib = require("../../../Libs/RevisionLibs");

const FieldCanBeUnlink = async (FG, FGR, F, FR) => {
  console.log("FieldCanBeUnlink")
  const CRM = await rLib.stricteRevisionExist("fg", FG, FGR, "f", F, FR);
  const countFG = CRM !== undefined ? await mLib.countAnotherFGinCR(CRM.c, CRM.cr, FG) : false;
  const countF = CRM !== undefined ? await mLib.countAnotherFinFR(FG, FGR, F) : false;

  if (CRM === undefined) {
    const errors = { "assoc": { "msg": "Validation Error: this association does not exist" }, };
    return { statusCode: 400, data: errors };
  } else if ((countFG === 0) && (countF === 0) && (CRM.cc === 1)) {
    const errors = { "assoc": { "msg": "Validation Error: nie można usunąć tego pola bo to ostatnie w grupie, która jest ostatnia w modelu i powstawł by pusty model." }, };
    return { statusCode: 400, data: errors };
  } else {
    return { statusCode: 200, data: { result: true } };
  }
}

module.exports = FieldCanBeUnlink;
