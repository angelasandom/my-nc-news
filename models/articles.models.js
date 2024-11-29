const db = require("../db/connection");
const format = require('pg-format');

exports.selectArticlesById = (article_id) => {
  const queryStr = `
    SELECT articles.*, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
  });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = ["article_id", "title", "author", "topic", "created_at", "votes", "article_img_url"];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let sqlQuery = `
    SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  const queryParams = [];

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(sqlQuery, queryParams)
    .then(({ rows }) => {
      if (rows.length === 0 && topic) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
      return rows;
    });
};

exports.updateArticlesVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

