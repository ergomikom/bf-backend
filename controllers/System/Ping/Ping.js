const Response = require("../../../helpers/response");

exports.Ping = [
	// auth,
	async (req, res) => {
		try {
			Response.Send(res, { statusCode: 200 });
		} catch (err) {
			console.log(err);
			Response.Send(res, { statusCode: 500 });
		}
	}
];