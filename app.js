const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticlesById } = require("./controllers/articles.controllers")
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.all("*", (req, res) => {
    res.status(404).send({ msg: 'not found'});
});

module.exports = app;
