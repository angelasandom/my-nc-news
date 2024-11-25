const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");


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
        console.log(endpoints, "Response body")
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test.only("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics }}) => {
        console.log(topics, "response body")
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          })
        })
      });
  });
  
  test.only("200: Accepts a slug query wich responds with only topics with that slug ", () => {
      const slugExample = 'mitch';
  
      return request(app)
        .get(`/api/topics?slug=${slugExample}`)
        .expect(200)
        .then(({ body: { topics }}) => {
          console.log(topics, "response body");
          expect(topics).toHaveLength(1); 
          topics.forEach(({ slug }) => {
            expect(slug).toBe(slugExample);
          });
        });
    });
  
  test.only("400: responds with an error message for an invalid slug", () => {
      return request(app)
      .get('/api/topics?slug=weather')
      .expect(400)
      .then(({ body }) => {
         const { msg } = body;
         expect(msg).toBe('bad request')
      });
      
  })
  
});
     