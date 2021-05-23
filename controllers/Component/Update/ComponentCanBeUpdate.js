const cLib = require("../../../controllers/Libs/ComponentLibs");

const ComponentCanBeUpdate = async (TYPE, ID, NAME) => {
  const componentExistsByMID = await cLib.componentExistsByMID(TYPE, ID);
  const componentExistsByName = await cLib.componentExistsByName(TYPE, NAME);

  if (!componentExistsByName) {
    if (componentExistsByMID) {
      return {  statusCode: 200, data: { canbeupdate: true } };
    } else {
      return {  statusCode: 404, data: { "name": { "msg": "Component not exists." } } };
    }
  } else {
    return {  statusCode: 409, data: { "name": { "msg": "Component exists with this name." } } };
  }

}

module.exports = ComponentCanBeUpdate;