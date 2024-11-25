const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);


module.exports = app;
