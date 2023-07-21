import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { registerUserHandler } from "../../controllers/user.controller.js";
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
    }, registerUserHandler);
}

export default userRoutes;