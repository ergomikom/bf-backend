const vLib = require("../../Libs/ValidatorsLibs");
const vHelper = require("../../../helpers/validator").vHelper;
const Response = require("../../../helpers/response");
const oLib = require("../../Libs/ObjectLibs");
const ObjectInsertLibs = require("./Libs/ObjectInsertLibs");
const dataTypes = require("../../../db/dbDataType");

const validators = {
  elements: [
		vHelper.params.mrid,
	],
};

exports.insert = [
  // auth,
  async (req, res) => {
    try {
      const errors = vLib.check(req, validators);
      if (Object.entries(errors).length !== 0) {
        Response.Send(res, {  statusCode: 400, data: errors });
      } else {
        const MRID = req.params.mrid;
        const FIELDS = await oLib.getFieldsFromCR(MRID);

        const notcc = FIELDS.filter(row => { return (parseInt(row.cc) !== 1); });
        if (notcc.count > 0) {
          const errors = { "assoc": { "msg": "Validation Error: the model is not approved" }, };
          Response.Send(res, {  statusCode: 400, data: errors });
        }

        FIELDS.forEach((field, index) => {
          const fname = "f".concat(field.f);
          if (req.body[fname]) {
            const dataType = dataTypes.GetDTIT(field.dt);
            const result = dataType.validator(req.body[fname]);
            //TODO: walidator
            FIELDS[index].valid = result;
            FIELDS[index].value = req.body[fname];
          } else {
            FIELDS[index].valid = null;
            FIELDS[index].value = null;
          }
        });

        let noValidData = FIELDS.filter(row => {
          return (row.valid !== true && row.valid !== null);
        });
        noValidData.length == 0;

        const correctFields = FIELDS.filter(row => {
          if (row.valid === true || row.valid === null) {
            return row;
          }
        });

        if (noValidData.length === 0) {
          //F Validator
          //FG Validator
          //preActions
          const insertObject = await ObjectInsertLibs.insertObject(MRID, correctFields);
          if (insertObject) {
            //postActions
            Response.Send(res, {  statusCode: 200, data: insertObject });
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

