const { selectTopics } = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
  const { slug } = req.query;

    selectTopics(slug)
    .then((topics) => {
      if (slug && topics.length === 0) {
        return res.status(400).json({ msg: 'Bad request' });
      }
      res.status(200).send({ topics });
    })
    .catch(next); 
}

