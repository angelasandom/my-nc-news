const db = require("../db/connection");

exports.selectUsers = () => {
    const sqlQuery = `SELECT * FROM users;`;
    return db.query(sqlQuery).then(({ rows }) => {
      return rows; 
    })
  };
 