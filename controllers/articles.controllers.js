const { selectArticlesById } = require('../models/articles.models')

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'bad request' });
      }
    selectArticlesById(article_id)
    .then((article)=> {
        return res.status(200).send({ article });
    })
    .catch((err) => {
        if (err.status === 404) {
        return res.status(404).send({ msg: 'article not found' });
        }
        next(err);  
        });    
    };