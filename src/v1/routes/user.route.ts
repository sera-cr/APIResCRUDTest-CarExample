import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { loginHandler, registerUserHandler } from "../../controllers/user.controller.js";
import { $ref } from "../../schemas/user.schema.js";

const opts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
            properties: {
              users: {
                type: 'string'
              }
            }
        }
      }
    }
  }

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
}

export default userRoutes;