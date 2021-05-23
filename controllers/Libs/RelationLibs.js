const MODELS = require("../../db/dbModels");

const schema = async (STYPE, MID, MRID, TS) => {
  const Mxs = "M".concat(MID).concat(STYPE);
  return await MODELS.schema.hasTable(Mxs).then(function async(exists) {
    // const dateNow = Math.round(Date.now() / 1000);
    return MODELS(Mxs)
      .where("MRID", MRID)
      .where(function () { this.where("DSTA", "<=", TS).where("DEND", ">=", TS) })
      .orWhere(function () { this.where("DSTA", "<", TS).where("DEND", null) })
      .select("*")
      .then((result) => { return result; })
      .catch((err) => { console.log(err); return false; });
  });
}

const rels = async (STYPE, MID, OID, TS) => {
  const MxsO = "M".concat(MID).concat(STYPE).concat("O");
  return await MODELS.schema.hasTable(MxsO).then(function async(exists) {
    if (exists) {
      return MODELS(MxsO)
        .where("OID", OID)
        .where(function () { this.where("DSTA", "<=", TS).where("DEND", ">=", TS) })
        .orWhere(function () { this.where("DSTA", "<", TS).where("DEND", null) })
        .select("*")
        .then((result) => { return result; })
        .catch((err) => { console.log(err); return false; });
    } else {
      return false;
    }
  });
}

const esrel = async (STYPE, MID, MRID, RELMID, RELMRID) => {
  const Mxs = "M".concat(MID).concat(STYPE);
  return await MODELS.schema.hasTable(Mxs).then(function async(exists) {
    // const dateNow = Math.round(Date.now() / 1000);
    console.log(Mxs)
    return MODELS(Mxs)
      .where("MRID", MRID)
      .where("DEND", null)
      .where("RELMID", RELMID)
      .where("RELMRID", RELMRID)
      .count("ID as COUNT")
      .first()
      .then((result) => { return result; })
      .catch((err) => { console.log(err); return false; });
  });
}

const eorel = async (STYPE, MID, OID, RELMID, RELMRID) => {
  const MxsO = "M".concat(MID).concat(STYPE).concat("O");
  return await MODELS.schema.hasTable(MxsO).then(function async(exists) {
    if (exists) {
      return MODELS(MxsO)
        .where("OID", OID)
        .where("RELMID", RELMID)
        .where("RELMRID", RELMRID)
        .where("DEND", null)
        .count("ID as COUNT")
        .first()
        .then((result) => { return result; })
        .catch((err) => { console.log(err); return false; });
    } else {
      return false;
    }
  });
}

const csrel = async (STYPE, MID, MRID, RELMID, RELMRID) => {
  let trmPack = [];
  let mainIndex = 0;

  const Mxs = "M".concat(MID).concat(STYPE);
  const Mxs2 = "M".concat(RELMID).concat(STYPE);
  return await MODELS.schema.hasTable(Mxs).then(function async(exists) {
    if (exists) {
      return MODELS.transaction(trm => {
        const actualDatetime = Math.round(Date.now() / 1000);
        const record = { MRID: MRID, DSTA: actualDatetime, DEND: null, RELMID: RELMID, RELMRID: RELMRID };
        trmPack[mainIndex++] = Promise.resolve(
          MODELS(Mxs).insert([record])
        );

        //TODO: add record to relative MRID

        Promise.all(trmPack)
          .then(async (args) => {
            await trm.commit(args);
          })
          .then(async (args) => {
            return record;
          })
          .catch(error => {
            console.log(error);
            trm.rollback();
            return false;
          });
      });
    }
  });

}

module.exports = {
  schema,
  rels,
  esrel,
  eorel,
  csrel,
};