require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const Response = require("./helpers/response");

const cors = require("cors");

// create express app
const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, "public")));

//Allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);


// throw 404 if URL not found
app.all("*", function (req, res) {
	Response.Send(res, {  statusCode: 404, data: { "url": { "msg": "Page not found." }, } });
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		Response.Send(res, {  statusCode: 401, data: { "access": { "msg": err.message }, } });
	}
});

module.exports = app;

