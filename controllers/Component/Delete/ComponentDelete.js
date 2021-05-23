const cLib = require("../../../controllers/Libs/ComponentLibs");

const ComponentCanBeDelete = require("./ComponentCanBeDelete");

const ComponentDelete = async (TYPE, MID) => {

  const ccbd = await ComponentCanBeDelete(TYPE, MID);
  if (ccbd.statusCode !== 200) {
    return ccbd;
  } else {
    const componentDelete = await cLib.componentDelete(TYPE, MID);
    if (componentDelete) {
      return {  statusCode: 200, data: componentDelete };
    } else {
      return {  statusCode: 500 };
    }
  }
}

module.exports = ComponentDelete;