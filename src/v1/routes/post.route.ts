import { FastifyInstance } from "fastify";
import { createPostHandler, deletePostHandler, getPostHandler, getPostsHandler, updatePostHandler } from "../../controllers/post.controller.js";
import { $ref } from "../../schemas/post.schema.js";

async function postRoutes(server: FastifyInstance) {
  server
    // create a new post
    .post("/", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createPostSchema'),
        response: {
          201: $ref('createPostResponseSchema')
        },
        tags:["Post"],
        description: "Creates a post. Input: title, content and published. Output: title, content and published."
      }
    }, createPostHandler)
    // get the list of posts
    .get("/", {
      schema: {
        response: {
          200: $ref("postsResponseSchema"),
        },
        tags:["Post"],
        description: "Get the full list of posts that are published. Output: List of Posts (title, content, published, id, createdAt, updatedAt, authorId)."
      }
    }, getPostsHandler)
    // get post by id
    .get("/:id", {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: $ref("postResponseSchema")
        },
        tags: ["Post"],
        description: "Get a post. Params: Id of the post. Output: title, content, published, id, createdAt, updatedAt, authorId."
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
        tags: ["Post"],
        description: "Edit a post. Params: Id of the post." +
        " Input: title, content, published. All optional. Output: title, content, published, id, createdAt, updatedAt, authorId."
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
        tags: ["Post"],
        description: "Delete a post. Params: Id of the post. Output: title, content, published, id, createdAt, updatedAt, authorId."
      }
    }, deletePostHandler)
}

export default postRoutes