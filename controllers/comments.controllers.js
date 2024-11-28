const { selectCommentsByArticlesId, addComment, removeComment } = require("../models/comments.models");

exports.getCommentsByArticlesId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticlesId(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    });
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const comment = req.body;

    addComment(comment, article_id)
        .then((newComment) => {
            res.status(201).send({ comment: newComment });
        })
        .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next); 
};

  