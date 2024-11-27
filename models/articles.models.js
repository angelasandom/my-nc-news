const db = require("../db/connection");

exports.selectArticlesById = (article_id) => {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
  });
};

exports.selectArticles = () => {
    const sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`;
    return db.query(sqlQuery).then(({ rows }) => {
      return rows; 
    })
  };
  
