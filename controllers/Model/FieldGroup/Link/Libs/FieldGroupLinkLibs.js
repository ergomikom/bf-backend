const mLib = require("../../../../Libs/ModelLibs");
const cLib = require("../../../../Libs/ComponentLibs");

const MODELS = require("../../../../../db/dbModels");

const fieldGroupLink = async (PARENT, CHILD) => {
  console.log("#FieldGroupLink");
  let newRows = [];
  let trmPack = [];
  let mainIndex = 0;
  const FGR = cLib.getSID(CHILD.fg);

  const connectFrom = await mLib.getFGRecordsfromCRM(CHILD.fg, CHILD.fgr);

  return MODELS.transaction(trm => {
    connectFrom.forEach((row) => {
      const FR = cLib.getSID(row.f);
      const newRow = {
        c: PARENT.c, cr: PARENT.cr, cc: null, cu: null,
        fg: row.fg, fgr: FGR,
        f: row.f, fr: FR,
        dt: row.dt,
      };
      newRows.push(newRow);
      trmPack[mainIndex++] = Promise.resolve(
        trm("crmatrix")
          .insert(newRow)
      );
    });


    Promise.all(trmPack)
      .then(async (args) => {
        await trm.commit(args);
      })
      .catch(error => {
        // trmPack.forEach(promise => promise.cancel());
        console.log(error);
        trm.rollback();
        return false;
      });
  });
};

module.exports = {
  fieldGroupLink,
};