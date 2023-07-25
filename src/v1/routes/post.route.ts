import { FastifyInstance } from "fastify";
import { createPostHandler, deletePostHandler, getPostHandler, getPostsHandler, updatePostHandler } from "../../controllers/post.controller.js";
import { $ref } from "../../schemas/post.schema.js";
import { number } from "zod";

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
    // get post by id
    .get("/:id", {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: $ref("postResponseSchema")
        },
        tags: ["Post"]
      }
    }, getPostHandler)
    // edit post
    .put("/:id", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('editPostSchema'),
        querystring: {
          id: { type: 'string' }
        },
        response: {
          200: $ref('editPostResponseSchema')
        },
        tags: ["Post"]
      }
    }, updatePostHandler)
    // delete post
    .delete("/:id", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          id: { type: 'string' }
        },
        response: {
          200: $ref('getPostResponseSchema')
        },
        tags: ["Post"]
      }
    }, deletePostHandler)
}

export default postRoutes