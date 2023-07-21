import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { deleteUserHandler, getUsersHandler, loginHandler, registerUserHandler } from "../../controllers/user.controller.js";
import { $ref } from "../../schemas/user.schema.js";

async function userRoutes(server: FastifyInstance) {
  server
    // create an user
    .post("/", {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref("createUserResponseSchema"),
        }
      }
    }, registerUserHandler)
    // login user
    .post("/login", {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        }
      }
    }, loginHandler)
    // list of users
    .get("/", {
      preHandler: [server.authenticate],
    }, getUsersHandler)
    // delete user
    .delete("/", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('deleteSchema'),
        response: {
          200: $ref('deleteResponseSchema')
        }
      }
    }, deleteUserHandler)
}

export default userRoutes;