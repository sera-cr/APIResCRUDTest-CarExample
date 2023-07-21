import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// common js import
import pkg from "@fastify/jwt";
const { fastifyJwt } = pkg;
import { listenOptions } from "../config/listenOptions.config.js";
import userRoutes from "./v1/routes/user.route.js";
import postRoutes from "./v1/routes/post.route.js";
import { userSchemas } from "./schemas/user.schema.js";
import { postSchemas } from "./schemas/post.schema.js";
import { jwtConfig } from "../config/jwt.config.js";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";


export const server: FastifyInstance = Fastify({});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
	  user: {
      id: number;
      email: string;
      name: string;
    }
  }
}

server.register(fastifyJwt, {
  secret: jwtConfig.secret
});

server.decorate("authenticate", async(request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch(err) {
    return reply.send(err);
  }
})

let port: number;
let host: string;
const api_version: string = listenOptions.api_version;

switch(listenOptions.status) {
  case 'production':
    port = listenOptions.prod_port;
    host = listenOptions.prod_host;
    break;
  case 'development':
    port = listenOptions.dev_port;
    host = listenOptions.dev_host;
    break;
  default:
    console.error('Status in environment variables not well defined.'
      + 'Does dotenv files exists/well written?');
    process.exit(1);
}

const start = async() => {

  for (const schema of [...postSchemas, ...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      swagger: {
        info: {
          title: 'Fastify API',
          description: 'API for posts',
          version: '1.0.0'
        },
        securityDefinitions: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header'
          }
        },
        host: `${host}:${port}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
      },
      hideUntagged: true
    })
  )
  
  server.register(userRoutes, {prefix: `api/${api_version}/users`})
  server.register(postRoutes, {prefix: `api/${api_version}/posts`})

  try {
    await server.listen({port: port, host: host});

    console.log(`Server running at ${host}:${port}`);
  } catch(err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();