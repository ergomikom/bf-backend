const MODELS = require("../../../../../db/dbModels");

const mLib = require("../../../../../controllers/Libs/ModelLibs");
const cLib = require("../../../../../controllers/Libs/ComponentLibs");

const Create = async (tcr, FG, tfr) => {
  let trmPack = [];
  let mainIndex = 0;
  let newRows = [];

  const C = tcr.c;

  const CR = tcr.cc === 1 ? cLib.getSID(C) : tcr.cr;
  // const FG = FG;
  const FGR = cLib.getSID(FG);

  const F = tfr.f;
  const FR = cLib.getSID(F);

  if (tcr.cc === 1) {
    let cModelRows = await mLib.getCRecordsFromCRM(tcr.c, tcr.cr);
    
    let modelData = {};
    cModelRows.forEach((row) => {
      if (!modelData[row.cr]) { modelData[row.cr] = CR; }
      if (!modelData[row.fgr]) { modelData[row.fgr] = cLib.getSID(row.fg); }
      if (!modelData[row.fr]) { modelData[row.fr] = cLib.getSID(row.f); }
    });

    cModelRows.forEach((row) => {
      newRows.push({
        c: row.c, cr: +modelData[row.cr], cc: null, cu: null,
        fg: row.fg, fgr: +modelData[row.fgr], 
        f: row.f, fr: +modelData[row.fr], 
        dt: row.dt
      });
    });
  }

  const record = { c: C, cr: CR, fg: FG, fgr: FGR, f: F, fr: FR, dt: tfr.dt };

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