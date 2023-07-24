import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { deleteUserHandler, getUsersHandler, loginHandler, registerUserHandler, updateUserHandler } from "../../controllers/user.controller.js";
import { $ref } from "../../schemas/user.schema.js";

async function userRoutes(server: FastifyInstance) {
  server
    // create an user
    .post("/", {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref("createUserResponseSchema"),
        },
        tags: ["User"]
      }
    }, registerUserHandler)
    // login user
    .post("/login", {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        },
        tags: ["User"]
      }
    }, loginHandler)
    // list of users
    .get("/", {
      preHandler: [server.authenticate],
      schema: {
        tags:["User"]
      }
    }, getUsersHandler)
    // delete user
    .delete("/", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('deleteSchema'),
        response: {
          200: $ref('deleteResponseSchema')
        },
        tags: ["User"]
      }
    }, deleteUserHandler)
    // update name user
    .put("/edit/:email", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('updateSchema'),
        querystring: {
          email: { type: 'string' }
        },
        response: {
          200: $ref('updateResponseSchema')
        },
        tags: ["User"]
      }
    }, updateUserHandler)
}

export default userRoutes;