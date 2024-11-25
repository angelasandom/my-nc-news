const db = require('../db/connection');

exports.selectTopics = (slug) => {
  let sqlQuery = 'SELECT * FROM topics';
  const queryValues = [];

  if (slug) {
    sqlQuery += ' WHERE slug =$1';
    queryValues.push(slug);
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
  return rows;
 });
};
