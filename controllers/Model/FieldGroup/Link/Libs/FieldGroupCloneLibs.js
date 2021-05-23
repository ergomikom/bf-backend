const mLib = require("../../../../Libs/ModelLibs");
const cLib = require("../../../../Libs/ComponentLibs");
const MODELS = require("../../../../../db/dbModels");

const fieldGroupClone = async (PARENT, CHILD) => {
  console.log("#fieldGroupClone");
  let cModelRows = await mLib.getCRecordsFromCRM(PARENT.c, PARENT.cr);
  const childs = await mLib.getFGRecordsfromCRM(CHILD.fg, CHILD.fgr);
  let trmPack = [];
  let mainIndex = 0;
  let newRows = [];

  let newCr = cLib.getSID(PARENT.c);

  //Obrabianie i przygotowanie danyh z rodzica
  if (cModelRows.length) {
    let modelData = {};
    cModelRows.forEach((row) => {
      if (!modelData[row.cr]) { modelData[row.cr] = newCr; }
      if (!modelData[row.fgr]) { modelData[row.fgr] = cLib.getSID(row.fg); }
      if (!modelData[row.fr]) { modelData[row.fr] = cLib.getSID(row.f); }
    });

    //kopiujemy cały cc model i zmieniamy wartości rewizji

    cModelRows.forEach((row) => {
      newRows.push({
        c: row.c, cr: +modelData[row.cr], cc: null, cu: null,
        fg: row.fg, fgr: +modelData[row.fgr], 
        f: row.f, fr: +modelData[row.fr], 
        dt: row.dt
      });
    });

    childs.forEach((row) => {
      if (!modelData[row.fgr]) { modelData[row.fgr] = cLib.getSID(row.fg); }
      newRows.push({
        c: PARENT.c, cr: +modelData[PARENT.cr], cc: null, cu: null,
        fg: row.fg, fgr: modelData[row.fgr], 
        f: row.f, fr: cLib.getSID(row.f), 
        dt: row.dt
      });
    });
  }

  return MODELS.transaction(trm => {
    if (cModelRows.length) {
      newRows.forEach((row) => {
        trmPack[mainIndex++] = Promise.resolve(
          trm("crmatrix")
            .insert([{
              "c": row.c, "cr": row.cr,
              "fg": row.fg, "fgr": row.fgr,
              "f": row.f, "fr": row.fr,
              "dt": row.dt
            }])
        );
      });
    }

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
  fieldGroupClone,
};