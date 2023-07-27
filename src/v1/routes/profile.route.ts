import { FastifyInstance } from "fastify";
import { createProfileHandler, deleteProfileHandler, editProfileHandler, getProfileHandler } from "../../controllers/profile.controller.js";
import { $ref } from "../../schemas/profile.schema.js";


async function profileRoutes(server: FastifyInstance) {
  server
  // get a profile
  .get("/:userId", {
    preHandler: [server.authenticate],
    schema: {
      querystring: {
        userId: { type: 'string' }
      },
      response: {
        200: $ref('profileResponseSchema')
      },
      tags:["Profile"]
    }
  }, getProfileHandler)
  // create a profile
  .post("/:userId", {
    preHandler: [server.authenticate],
    schema: {
      body: $ref('createProfileSchema'),
      querystring: {
        userId: { type: 'string' }
      },
      response: {
        200: $ref('profileResponseSchema')
      },
      tags: ["Profile"]
    }
  }, createProfileHandler)
  // edit a profile
  .put("/:userId", {
    preHandler: [server.authenticate],
    schema: {
      body: $ref('editProfileSchema'),
      querystring: {
        userId: { type: 'string' }
      },
      response: {
        200: $ref('profileResponseSchema')
      },
      tags: ["Profile"]
    }
  }, editProfileHandler)
  // delete a profile
  .delete("/:userId", {
    preHandler: [server.authenticate],
    schema: {
      querystring: {
        userId: { type: 'string' }
      },
      response: {
        200: $ref('profileResponseSchema')
      },
      tags: ["Profile"]
    }
  }, deleteProfileHandler)
}

export default profileRoutes