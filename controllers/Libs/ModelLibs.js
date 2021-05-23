
const MODELS = require("../../db/dbModels");

const containFinFGR = async (FIELDGROUP, FIELD) => {
  return await MODELS("crmatrix")
    
    .where("fg", FIELDGROUP.fg)
    .where("fgr", FIELDGROUP.fgr)
    .where("f", FIELD.f)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      if (result.COUNT > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const containFGinCR = async (CONTAINER, FIELDGROUP) => {
  return await MODELS("crmatrix")
    .where("c", CONTAINER.c)
    .where("cr", CONTAINER.cr)
    .where("fg", FIELDGROUP.fg)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      if (result.COUNT > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const containFinCR = async (CR, F) => {
  return await MODELS("crmatrix")
    
    .where("cr", CR)
    .where("f", F)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      if (result.COUNT > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const countCRrecordsInCrm = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      return result.COUNT;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const countSameCinCRMwithCC = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .whereNot("cr", CR)
    .where("cc", 1)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      return result.COUNT;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const containSameFGinCRM = async (FG, FGR) => {
  return await MODELS("crmatrix")
    
    .where("fg", FG)
    .whereNot("fgr", FGR)
    .first()
    .then((result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};


const containSameFinCRM = async (F, FR) => {
  return await MODELS("crmatrix")
    
    .where("f", F)
    .whereNot("fr", FR)
    .first()
    .then((result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const countConfirmFinCRM = async (F) => {
  return await MODELS("crmatrix")
    
    .where("f", F)
    .where("cc", 1)
    .count("mid as COUNT")
    .first()
    .then((result) => {
      return result.COUNT;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};


const getFGRecordsfromCRM = async (FG, FGR) => {
  return await MODELS("crmatrix")
    .where("fg", FG)
    .where("fgr", FGR)
    .select("*")
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const getCRecordsFromCRM = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .select("*")
    .then(async (result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
};

const getFGRecordsFromCRM = async (FG, FGR) => {
  return await MODELS("crmatrix")
    
    .where("fg", FG)
    .where("fgr", FGR)
    .select("*")
    .then(async (result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
};

const getCRMrowByMID = async (MID) => {
  return await MODELS("crmatrix")
    
    .where("mid", MID)
    .select("*")
    .first()
    .then((row) => {
      if (row) {
        return row;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const getFGwithNullFfromCRM = async (FG, FGR) => {
  return await MODELS("crmatrix")
    .where("fg", FG)
    .where("fgr", FGR)
    .whereNull("fr")
    .select("*")
    .first()
    .then(async (result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
};

const getCwithNullFGfromCRM = async (C, CR) => {
  return await MODELS("crmatrix")
    .where("c", C)
    .where("cr", CR)
    .whereNull("fgr")
    .select("*")
    .first()
    .then(async (result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
};


const containAnotherFGinC = async (C, CR, FG) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .whereNot("fg", FG)
    .first()
    .then(async (result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
}

const containAnotherCRwithC = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .whereNot("cr", CR)
    .count("mid as COUNT")
    .first()
    .then(async (result) => {
      if (result.COUNT) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => { console.log(err); });
}

const countAllCRinCRMbyC_CR = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countAllFGRinCRMbyFG_FGR = async (CRM) => {
  
  return await MODELS("crmatrix")
    
    .where("fg", CRM.fg)
    .where("fgr", CRM.fgr)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countAllCRinCRMbyC_CR_FG_FGR = async (CRM) => {
  return await MODELS("crmatrix")
    
    .where("c", CRM.c)
    .where("cr", CRM.cr)
    .where("fg", CRM.fg)
    .where("fgr", CRM.fgr)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};


const generateCSTRUCT = async (CR) => {
  let chash = "";
  return await MODELS("crmatrix")
    
    .where("cr", CR)
    .select("fg", "f")
    .orderBy("fg", "f")
    .then((fields) => {
      fields.forEach(async (field) => {
        chash += field.fg + ":" + field.f + ",";
      });
      return chash.slice(0, -1);;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const containtCSTRUCT = async (CSTRUCT) => {
  return await MODELS("cstruct")
    .where("struct", CSTRUCT)
    .count("struct as COUNT")
    .first()
    .then((structs) => {
      if (structs.COUNT > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const generateFGSTRUCT = async (FG, FGR) => {
  let fghash = "";
  return await MODELS("crmatrix")
    
    .where("fg", FG)
    .where("fgr", FGR)
    .select("fg", "f", "dt")
    .orderBy("f")
    .then((fields) => {
      fields.forEach(async (field) => {
        fghash += field.f + ":";
      });
      return fghash.slice(0, -1);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const generateDTSTRUCT = async (FG, FGR) => {
  let dthash = "";
  return await MODELS("crmatrix")
    
    .where("fg", FG)
    .where("fgr", FGR)
    .select("dt")
    .orderBy("dt")
    .then((fields) => {
      fields.forEach(async (field) => {
        dthash += field.dt + ":";
      });
      return dthash.slice(0, -1);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

const getFGRecordsfromCR = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .select("fg", "fgr")
    .distinct("fgr")
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

// const getModelCRM = async (id, rid) => {
// 	return await MODELS("crmatrix")
// 		.join("tc", "tc.MID", "=", "crmatrix.c")
// 		.join("tfg", "tfg.MID", "=", "crmatrix.fg")
//     .join("tf", "tf.MID", "=", "crmatrix.f")
//     .join("dt", "dt.dtid", "=", "crmatrix.dt")
// 		.where("crmatrix.c", id)
// 		.where("crmatrix.cr", rid)
// 		.select("crmatrix.c")
// 		.select("crmatrix.cr")
// 		.select("crmatrix.cc")
// 		.select("crmatrix.cu")
// 		.select("crmatrix.fg")
// 		.select("crmatrix.fgr")
// 		.select("crmatrix.f")
// 		.select("crmatrix.fr")
// 		.select("tc.MNAME as cname")
// 		.select("tfg.MNAME as fgname")
//     .select("tf.MNAME as fname")
//     .select("dt.dtdbname as dtname")
//     .select("dt.dtdbtype as dttype")
// 		.then((result) => { return result; })
// 		.catch((err) => { console.log(err); return false; });
// };

const countAnotherCRinCRMinC = async (C, CR) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .whereNot("cr", CR)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countFGinCRMbyFG_FGR = async (FG, FGR) => {
  return await MODELS("crmatrix")
    
    .where("fg", FG)
    .whereNot("fgr", FGR)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countFinCRMbyF_FR = async (F, FR) => {
  return await MODELS("crmatrix")
    
    .where("f", F)
    .whereNot("fr", FR)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countAnotherFGinCR = async (C, CR, FG) => {
  return await MODELS("crmatrix")
    
    .where("c", C)
    .where("cr", CR)
    .whereNot("fg", FG)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

const countAnotherFinFR = async (FG, FGR, F) => {
  return await MODELS("crmatrix")
    .where("fg", FG)
    .where("fgr", FGR)
    .whereNot("f", F)
    .count("mid as COUNT")
    .then(async (result) => {
      return result[0].COUNT;
    })
    .catch((err) => { console.log(err); });
};

module.exports = {
  containFinFGR,
  containFGinCR,
  countCRrecordsInCrm,
  containFinCR,
  countConfirmFinCRM,
  countSameCinCRMwithCC,
  getFGRecordsfromCRM,
  getCRecordsFromCRM,
  getCRMrowByMID,
  countAllCRinCRMbyC_CR,
  countAllCRinCRMbyC_CR_FG_FGR,
  countAllFGRinCRMbyFG_FGR,
  countAnotherCRinCRMinC,
  countFGinCRMbyFG_FGR,
  countFinCRMbyF_FR,
  getFGwithNullFfromCRM,
  getCwithNullFGfromCRM,
  containAnotherFGinC,
  containAnotherCRwithC,
  containSameFGinCRM,
  containSameFinCRM,
  generateCSTRUCT,
  generateFGSTRUCT,
  generateDTSTRUCT,
  containtCSTRUCT,
  getFGRecordsfromCR,
  getFGRecordsFromCRM,
  // getModelCRM,
  countAnotherFGinCR,
  countAnotherFinFR,
};