const { selectArticlesById, selectArticles, updateArticlesVotes } = require('../models/articles.models')

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err); 
    });
}

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticlesById(article_id)
    .then((article) => {
        return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticlesVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (!inc_votes) {
        return res.status(400).send({ msg: "Missing required field" });
    }
    updateArticlesVotes(article_id, inc_votes)
    .then((article) => {
        return res.status(200).send({  article })
    })
    .catch(next);
}

