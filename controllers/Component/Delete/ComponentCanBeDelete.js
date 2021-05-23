const cLib = require("../../../controllers/Libs/ComponentLibs");

const ComponentCanBeDelete = async (TYPE, MID) => {

  const componentExists = await cLib.componentExistsByMID(TYPE, MID);
  if (componentExists) {
    const componentCanBeDelete = await cLib.componentCanBeDelete(TYPE, MID);
    if (componentCanBeDelete) {
      return {  statusCode: 200, data: { canbedelete: true } };
    } else {
      return {  statusCode: 409, data: { canbedelete: false } };
    }
  } else {
    return {  statusCode: 404, data: { "name": { "msg": "Component not exists." } } };
  }
}

module.exports = ComponentCanBeDelete;