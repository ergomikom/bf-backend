const cLib = require("../../../controllers/Libs/ComponentLibs");

const ComponentCanBeUpdate = require("./ComponentCanBeUpdate");

const ComponentUpdate = async (TYPE, ID, NAME) => {
  const ccbd = await ComponentCanBeUpdate(TYPE, ID, NAME);
  if (ccbd.statusCode !== 200) {
    return ccbd;
  } else {
    const componentUpdate = cLib.componentUpdate(TYPE, ID, NAME);
    if (componentUpdate) {
      return {  statusCode: 200, data: { update: true } };
    } else {
      return {  statusCode: 500 };
    }
  }
}

module.exports = ComponentUpdate;