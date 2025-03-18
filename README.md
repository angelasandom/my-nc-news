My NC News API

Welcome!
This project is an API that provides access to news articles, comments and topics. You can filter, sort, and interact with the data dynamically.

Features:
Retrieve articles, topics and comments.
Sort and order articles using query parameters.
Add comments to articles.
Update article votes.

Installation & Setup:
To run this project locally, ensure you have Node.js and PostgreSQL installed.

1. Clone the Repository
git clone <repository_url>
cd <repository_folder>

2. Install Dependencies
npm install

3. Set Up Environment Variables
Create two environment files in the root directory:
.env.development
PGDATABASE=<your_database_name>

.env.test
PGDATABASE=<your_test_database_name>

You can find the database names in the setup.sql file.

4. Seed the Database
npm run seed

5. Run the App
npm start

To run tests:
npm test

Minimum Requirements
Node.js: v22.9.0
PostgreSQL: 14.13

This project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders.

