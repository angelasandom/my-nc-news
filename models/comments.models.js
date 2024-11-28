const db = require("../db/connection");

exports.selectCommentsByArticlesId = (article_id) => {
    const checkArticle = `SELECT * FROM articles WHERE article_id = $1`;
    const queryStr = 
        `SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC`;

    return db.query(checkArticle, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return db.query(queryStr, [article_id]);
        })
        .then(({ rows }) => {
            return rows; 
        });
};

exports.addComment = (comment, article_id) => {
    const { username, body } = comment;
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Missing required field" });
    }
    return db.query(`INSERT INTO comments(author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, body, article_id]
    )
    .then(({ rows }) => rows[0]);
};

