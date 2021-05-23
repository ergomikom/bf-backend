const MODELS = require("../../../../../db/dbModels");

const mLib = require("../../../../../controllers/Libs/ModelLibs");
const cLib = require("../../../../../controllers/Libs/ComponentLibs");

const Create = async (tfgr, F, DT) => {
  let trmPack = [];
  let mainIndex = 0;
  let newRows = [];
  let modelData = {};

  const C = tfgr.c;
  const CR = tfgr.cc === 1 ? cLib.getSID(C) : tfgr.cr;

  const FG = tfgr.fg;
  const FGR = tfgr.cc === 1 ? cLib.getSID(FG) : tfgr.fgr;
  //F  = F
  const FR = cLib.getSID(F);

  if (tfgr.cc === 1) {
    let cModelRows = await mLib.getCRecordsFromCRM(tfgr.c, tfgr.cr);
    
    cModelRows.forEach((row) => {
      if (!modelData[row.cr]) { modelData[row.cr] = CR; }
      if (!modelData[row.fgr]) { modelData[row.fgr] = row.fg !== FG ? cLib.getSID(row.fg) : FGR; }
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
  }

  return MODELS.transaction(trm => {
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

    const record = { c: C, cr: CR, fg: FG, fgr: FGR, f: F, fr: FR, dt: DT };
    trmPack[mainIndex++] = Promise.resolve(
      MODELS("crmatrix").insert([record])
    );

    Promise.all(trmPack)
      .then(async (args) => {
        await trm.commit(args);
      })
      .then(async (args) => {
        return record;
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
  Create,
};