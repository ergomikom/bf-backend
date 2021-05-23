const express = require("express");
// var authRouter = require("./auth");
const componentRouter = require("./component");
const revisionRouter = require("./revision");
const modelRouter = require("./model");
const objectRouter = require("./object");
const systemRouter = require("./system");
const relationRouter = require("./relation");

const app = express();

// app.use("/auth/", authRouter);
app.use("/c/", componentRouter);  // component
app.use("/r/", revisionRouter);   // revision
app.use("/m/", modelRouter);      // model
app.use("/o/", objectRouter);     // object
app.use("/rel/", relationRouter);     // object
app.use("/sys/", systemRouter);   // system

module.exports = app;