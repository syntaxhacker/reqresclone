const crypto = require("crypto");
const Util = require("util");

async function gentoken() {
	const randomBytes = Util.promisify(crypto.randomBytes);
	const token = (await randomBytes(24)).toString("base64").replace(/\W/g, "");
	return token;
}

const sendResponse = (req, res, statusCode, data) => {
	return res.status(statusCode).json({
		status: "Success",
		data,
	});
};

module.exports = { sendResponse, gentoken };
