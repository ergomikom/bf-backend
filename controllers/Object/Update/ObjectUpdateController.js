const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const oLib = require("../../Libs/ObjectLibs");
const ObjectUpdateLibs = require("./Libs/ObjectUpdateLibs");
const dataTypes = require("../../../db/dbDataType");

const validators = {
  elements: [
    vHelper.params.oid,
		vHelper.params.mrid,
  ],
};

exports.update = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const MRID = req.params.mrid;
        const OID = req.params.oid;

        const fields = await oLib.getFieldsFromCR(MRID);
        const MID = await oLib.getModelId(MRID);

        if (MID === false) {
          const errors = { "assoc": { "msg": "Validation Error: the model not exists" }, };
          Response.Send(res, {  statusCode: 400, data: errors });
        }

        const checkObjectExist = await oLib.checkObjectExist(MID, OID);
        if (!checkObjectExist) {
          const errors = { "assoc": { "msg": "Validation Error: the object not exists" }, };
          Response.Send(res, {  statusCode: 400, data: errors });
        }

        //validate cc
        const notcc = fields.filter(row => { return (parseInt(row.cc) !== 1); });
        if (notcc.count > 0) {
          const errors = { "assoc": { "msg": "Validation Error: the model is not approved" }, };
          Response.Send(res, {  statusCode: 400, data: errors });
        }

        //validate data
        fields.forEach((field, index) => {
          const fname = "f".concat(field.f);
          if (req.body[fname]) {
            const dataType = dataTypes.GetDTIT(field.dt);
            const result = dataType.validator(req.body[fname]);
            fields[index].valid = result;
            fields[index].value = req.body[fname];
          } else {
            fields[index].valid = null;
          }
        });
        let noValidData = fields.filter(row => {
          return (row.valid !== true && row.valid !== null);
        });

        const correctFields = fields.filter(row => {
          if (row.valid === true) {
            return row;
          }
        });

        if (noValidData.length === 0) {
          const updateObject = await ObjectUpdateLibs.updateObject(MID, MRID, OID, correctFields);
          if (updateObject) {
            Response.Send(res, {  statusCode: 200, data: updateObject });
          } else {
            Response.Send(res, {  statusCode: 500 });
          }
        } else {
          //TODO: co to jest noValidData
          Response.Send(res, {  statusCode: 400, data: noValidData });
        }
      }
    } catch (err) {
      console.log(err);
			Response.Send(res, {  statusCode: 500 });
    }
  }
];
