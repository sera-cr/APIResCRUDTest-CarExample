import { FastifyInstance } from "fastify";
import { createPostHandler, getPostsHandler } from "../../controllers/post.controller.js";
import { $ref } from "../../schemas/post.schema.js";

async function postRoutes(server: FastifyInstance) {
  server
    // create a new post
    .post("/", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createPostSchema'),
        response: {
          201: $ref('createPostSchema')
        },
        tags:["Post"]
      }
    }, createPostHandler)
    // get the list of posts
    .get("/", {
      schema: {
        response: {
          200: $ref("postsResponseSchema"),
        },
        tags:["Post"]
      }
    }, getPostsHandler)
    // edit post

    // delete post


}

export default postRoutes