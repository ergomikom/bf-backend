const MODELS = require("../../../../../db/dbModels");
const mLib = require("../../../../Libs/ModelLibs");

const fieldGroupUnlink = async (CRM) => {
  // console.log(CRM)
  console.log("#FieldGroupUnlinkLibs")
  let trmPack = [];
  let mainIndex = 0;

  const getFGRecordsfromCRM = await mLib.getFGRecordsfromCRM(CRM.fg, CRM.fgr);
  const countAnotherCRinCRMinC = await mLib.countAnotherCRinCRMinC(CRM.c, CRM.cr);
  const countFGinCRMbyFG_FGR = await mLib.countFGinCRMbyFG_FGR(CRM.fg, CRM.fgr);
  const countAnotherFGinCR = await mLib.countAnotherFGinCR(CRM.c, CRM.cr, CRM.fg)

  return MODELS.transaction(trm => {

    getFGRecordsfromCRM.forEach((row) => {
      trmPack[mainIndex++] = Promise.resolve(
        trm("crmatrix")
          .where("mid", row.mid)
          .del()
      );
    });

    getFGRecordsfromCRM.forEach(async (row) => {
      const countFinCRMbyF_FR = await mLib.countFinCRMbyF_FR(row.f, row.fr);
      if (countFinCRMbyF_FR === 0) {
        trmPack[mainIndex++] = Promise.resolve(
          trm("tf")
            .where("mid", row.f)
            .del()
        );
      };
    });

    if (countFGinCRMbyFG_FGR === 0) {
      trmPack[mainIndex++] = Promise.resolve(
        trm("tfg")
          .where("mid", CRM.fg)
          .del()
      );
    }

    if (countAnotherCRinCRMinC === 0 && countAnotherFGinCR === 0) {
      const MxP = "M".concat(CRM.c).concat("P");
      const MxCH = "M".concat(CRM.c).concat("CH");
				console.log(MxCH)
      trmPack[mainIndex++] = Promise.resolve(MODELS.schema.dropTableIfExists(MxP));
      trmPack[mainIndex++] = Promise.resolve(MODELS.schema.dropTableIfExists(MxCH));
      trmPack[mainIndex++] = Promise.resolve(trm("tc").where("mid", CRM.c).del())
    }

    Promise.all(trmPack)
      .then((args) => {
        trm.commit(args);
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
  fieldGroupUnlink,
};
