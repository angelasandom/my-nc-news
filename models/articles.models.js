const db = require("../db/connection");

exports.selectArticlesById = (article_id) => {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return rows[0];
  });
};
