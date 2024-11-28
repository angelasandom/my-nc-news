const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticles, getArticlesById, patchArticlesVotes } = require("./controllers/articles.controllers")
const { getCommentsByArticlesId, postComment } = require("./controllers/comments.controllers")


app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticlesId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticlesVotes)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
    } else {
        console.error(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});


module.exports = app;
