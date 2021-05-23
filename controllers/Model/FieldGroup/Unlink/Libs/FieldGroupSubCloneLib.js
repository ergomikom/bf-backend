const mLib = require("../../../../Libs/ModelLibs");
const cLib = require("../../../../Libs/ComponentLibs");

const MODELS = require("../../../../../db/dbModels");

const fieldGroupSubClone = async (PARENT, TYPE, toRemove) => {
  console.log("#fieldGroupSubClone")
  let cModelRows = await mLib.getCRecordsFromCRM(PARENT.c, PARENT.cr);
  let trmPack = [];
  let newRows = [];
  let mainIndex = 0;
  let modelData = {};

  const newCr = cLib.getSID(PARENT.c);

  cModelRows.forEach((row) => {
    if (!modelData[row.cr]) { modelData[row.cr] = newCr }
    if (!modelData[row.fgr]) { modelData[row.fgr] = cLib.getSID(row.fg); }
    if (!modelData[row.fr]) { modelData[row.fr] = cLib.getSID(row.f); }
  });

  if (TYPE === "fg") {
    cModelRows.forEach((row) => {
      if (+row.fgr !== +toRemove) {
        newRows.push({
          c: row.c, cr: +modelData[row.cr], cc: null, cu: null,
          fg: row.fg, fgr: +modelData[row.fgr], 
          f: row.f, fr: +modelData[row.fr], 
          dt: row.dt
        });
      }
    });
  } else if (TYPE === "f") {
    cModelRows.forEach((row) => {
      if (+row.fr !== +toRemove) {
        newRows.push({
          c: row.c, cr: +modelData[row.cr], cc: null, cu: null,
          fg: row.fg, fgr: +modelData[row.fgr], 
          f: row.f, fr: +modelData[row.fr], 
          dt: row.dt
        });
      }
    });
  }

  return MODELS.transaction(trm => {
    newRows.forEach(async (row) => {
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

    Promise.all(trmPack)
      .then(async (args) => {
        await trm.commit(args);
      })
      .then(async () => {
        return { c: PARENT.c, cr: newCr };
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
  fieldGroupSubClone,
};