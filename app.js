const express = require("express");
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles } = require("./controllers/articles.controllers")
const { getArticlesById } = require("./controllers/articles.controllers")
const { getCommentsByArticlesId } = require("./controllers/comments.controllers")
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticlesId)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    res.status(500).send({ msg: "Internal Server Error" });
})


module.exports = app;
