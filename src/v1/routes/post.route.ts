import { FastifyInstance } from "fastify";
import { createPostHandler } from "../../controllers/post.controller.js";
import { $ref } from "../../schemas/post.schema.js";

async function postRoutes(server: FastifyInstance) {
  server.post("/", {
    preHandler: [server.authenticate],
    schema: {
      body: $ref('createPostSchema'),
      response: {
        201: $ref('createPostSchema')
      }
    }
  }, createPostHandler);
}

export default postRoutes