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
      tags:["Profile"],
      description: "Get a profile by user id. Params: User id. Output: bio, id, userId."
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
      tags: ["Profile"],
      description: "Create a profile. Params: userId. Input: bio. Output: bio, id, userId."
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
      tags: ["Profile"],
      description: "Edit a profile. Params: userId. Input: bio, id, userId."
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
      tags: ["Profile"],
      description: "Delete a profile. Params: userId. Input: bio, id, userId."
    }
  }, deleteProfileHandler)
}

export default profileRoutes