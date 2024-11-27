const { selectArticlesById } = require('../models/articles.models')
const { selectArticles } = require('../models/articles.models')

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
    .then((article)=> {
        return res.status(200).send({ article });
    })
    .catch(next);
    };