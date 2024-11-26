const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");
const jestSorted = require('jest-sorted');

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics }}) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          })
        })
      });
  });
  
  test("200: Accepts a slug query wich responds with only topics with that slug ", () => {
      const slugExample = 'mitch';
  
      return request(app)
        .get(`/api/topics?slug=${slugExample}`)
        .expect(200)
        .then(({ body: { topics }}) => {
          expect(topics).toHaveLength(1); 
          topics.forEach(({ slug }) => {
            expect(slug).toBe(slugExample);
          });
        });
    });
  
  test("400: responds with an error message for an invalid slug", () => {
      return request(app)
      .get('/api/topics?slug=weather')
      .expect(400)
      .then(({ body }) => {
         const { msg } = body;
         expect(msg).toBe('bad request')
      });  
  })
});


describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object when given a valid article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        });
      });
  });
  test("404: responds with an error message if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/200")
      .expect(404)
      .then(({ body}) => {
        const { msg } = body;
        expect(msg).toBe('article not found')
        });
      });
  test("400: responds with an error message for invalid article_id", () => {
    return request(app)
    .get("/api/articles/abc") 
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  })  

  describe("GET /api/articles", () => {
    test("200: responds with an array of articles objects with the correct properties ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles }}) => {
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count:expect.any(String),
            article_img_url: expect.any(String)
          });
        });
      });
    });
  });

  test("200: articles are sorted by date of created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
});

});