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
         expect(msg).toBe('Bad request')
      });
    });

  test("404: responds with an error message for an endpoint that doesn't exist", () => {
       return request(app)
        .get('/api/abc')
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
           expect(msg).toBe('Endpoint not found');
        });
    }); 
  })



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
        expect(msg).toBe('Article not found')
        });
      });

  test("400: responds with an error message for invalid article_id", () => {
    return request(app)
    .get("/api/articles/abc") 
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
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
  test("400: responds with an error for an invalid sort_by input", () => {
    return request(app)
    .get("/api/articles?sort_by=abc")
    .expect(400)
    .then(({ body }) => {
       const { msg } = body;
       expect(msg).toBe('Bad request')
  });
}); 
  test("400: responds with an error for an invalid order input", () => {
    return request(app)
    .get("/api/articles?order=abc")
    .expect(400)
    .then(({ body }) => {
       const { msg } = body;
       expect(msg).toBe('Bad request')
  });
}); 

test("200: filters articles by a valid topic", () => {
  return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toHaveLength(12); 
      body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });
});

test("404: responds with an error if topic does not exist", () => {
  return request(app)
    .get("/api/articles?topic=food")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Topic not found");
    });
});

test("200: responds with all articles if no topic is provided", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toHaveLength(13);
    });
});

test("400: responds with an error if sort_by is invalid", () => {
  return request(app)
    .get("/api/articles?sort_by=abc")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});

test("400: responds with an error if order query is invalid", () => {
  return request(app)
    .get("/api/articles?order=disorder")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});  
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an comment object when given a valid article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments }}) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 9, 
        });
      });
      });
    })

  test("200: comments are sorted by date of created_at in descending order", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
    });

  test("200: responds with an empty array if there is no comment in the article", () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
    });
  
  });

  test("404: responds with an error message if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/200/comments")
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('Article not found')
    });
  });

  test("400: responds with an error message for invalid article_id", () => {
    return request(app)
    .get("/api/articles/abc/comments") 
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a newly created user object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting article.",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: 2,
            author: "butter_bridge",
            body: "Interesting article.",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });

  test("400: responds with an error if required fields are missing", () => {
    const incompleteRequirements = { username: "butter_bridge" }; 
    return request(app)
      .post("/api/articles/2/comments")
      .send(incompleteRequirements)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required field");
      });
  }); 
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates an article's votes and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 2,
            votes: expect.any(Number), 
          })
        );
      });
  });

  test("400: responds with an error if required fields are missing", () => { 
    return request(app)
    .patch("/api/articles/2")
    .send({})  
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing required field"); 
    });
     });

  test("404: responds with an error message if the article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/200")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Article not found')
      });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes a comment by its id", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
    });
  
    test("400: attempting to delete a comment referenced by an invalid comment_id", () => { 
       return request(app)
          .delete("/api/comments/abc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
            
        });
       });
  
    test("404: attempting to delete a comment that does not exist", () => {
        return request(app)
          .delete("/api/comments/88")
          .expect(404)
          .then(({ body: { msg }}) => {
            expect(msg).toBe('Comment not found')
        });
      });
    });
    
describe("GET /api/users", () => {
  test("200: responds with an array of user objects with the correct properties ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users }}) => {
        expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
            });
          });
        });
      });
    });
  



