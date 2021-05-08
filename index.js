const express = require("express");
const app = express();
const api = require("./api");
const cors = require("cors");
const handleErrors = require("./middleware/errorhandler");
app.use(cors());
app.use(express.json());

app.use("/api", api);

app.use(handleErrors);

app.listen(3000, () => {
	console.log("listening on port 3000");
});
