const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
let db = require("./db");
const { NotFound, BadRequest } = require("./utils/errors");
const { sendResponse, gentoken } = require("./utils/utils");

router.get("/foo", (req, res) => {
	res.send("boo");
});

const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

//get users
//data delay
router.get("/users", (req, res) => {
	const delay = req.query.delay;
	if (delay) {
		setTimeout(() => {
			sendResponse(req, res, 200, db.sort());
		}, delay * 1000);
	} else sendResponse(req, res, 200, db.sort());
});

//single User
router.get(
	"/users/:uid",
	asyncHandler((req, res) => {
		const userData = db.map((item) => item.id).indexOf(req.params["uid"]);
		if (userData == -1) {
			throw new NotFound("user not found");
		}
		sendResponse(req, res, 200, db[userData]);
	})
);
//Create New User
router.post(
	"/users",
	asyncHandler((req, res) => {
		let id = uuidv4();
		const date = new Date();
		const createdAt = date.toISOString();
		const item = { id, ...req.body, createdAt };
		db = [...db, item];
		sendResponse(req, res, 201, item);
	})
);

//update existing user /create new user
router.put(
	"/users/:uid",
	asyncHandler((req, res) => {
		if (!Object.keys(req.body).length) {
			throw new BadRequest("Update details cant be empty");
		}
		const uid = req.params.uid;
		const userIndex = db.map((item) => item.id).indexOf(uid);
		const date = new Date();
		const updatedAt = date.toISOString();
		if (userIndex == -1) {
			console.log("creating new user");
			const newUserData = { ...req.body, id: uuidv4() };
			db = [...db, newUserData];
			sendResponse(req, res, 200, { newUserData, updatedAt });
		} else {
			const updatedUserData = { ...db[userIndex], ...req.body };
			db = db.filter((item) => item.id !== uid);
			db = [...db, updatedUserData];
			sendResponse(req, res, 200, { updatedUserData, updatedAt });
		}
	})
);
//modify user
router.patch(
	"/users/:uid",
	asyncHandler((req, res) => {
		if (!Object.keys(req.body).length) {
			throw new BadRequest("Update details cant be empty");
		}
		const { id } = req.body;
		if (id) {
			throw new BadRequest("id cant be changed");
		}
		const uid = req.params.uid;
		const userIndex = db.map((item) => item.id).indexOf(uid);
		if (userIndex == -1) {
			throw new NotFound("user not found");
		}
		const date = new Date();
		const updatedAt = date.toISOString();
		const updatedUserData = { ...db[userIndex], ...req.body };
		db = db.filter((item) => item.id !== uid);
		db = [...db, updatedUserData];
		sendResponse(req, res, 200, { updatedUserData, updatedAt });
	})
);

//delete single user
router.delete(
	"/users/:uid",
	asyncHandler((req, res) => {
		const uid = req.params.uid;
		const userIndex = db.map((item) => item.id).indexOf(uid);
		if (userIndex == -1) {
			throw new NotFound("user not found");
		}
		db = db.filter((item) => item.id !== uid);
		sendResponse(req, res, 204);
	})
);
//email , password register --> returns token
router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			console.log("yus");
			throw new BadRequest("provide valid email and password ");
		}
		const newUid = uuidv4();
		const newUserData = { id: newUid, email, password };
		db = [...db, newUserData];
		const authToken = await gentoken();
		sendResponse(req, res, 200, { id: newUid, token: authToken });
	})
);

//login with email, password -> return token
router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new BadRequest("Provide Valid Inputs");
		}
		let foundEmailAt;
		db.forEach((item, index) => {
			if (item.email === email) {
				foundEmailAt = index;
			}
		});
		if (!foundEmailAt) {
			throw new NotFound("no email found");
		} else if (db[foundEmailAt].password !== password) {
			throw new BadRequest("Auth Failed");
		} else {
			const authToken = await gentoken();
			sendResponse(req, res, 200, { authToken });
		}
	})
);

module.exports = router;
