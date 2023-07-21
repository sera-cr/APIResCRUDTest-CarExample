import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { registerUserHandler } from "../../controllers/user.controller.js";

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
    // get all users
    .get('/', opts, async (request, reply) => {
      return { users: 'prueba' }
    })
    // create an user
    .post("/", registerUserHandler);
}

export default userRoutes;