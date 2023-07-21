import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
// common js import
import pkg from "@fastify/jwt";
const { fastifyJwt } = pkg;
import { listenOptions } from "../config/listenOptions.config.js";
import userRoutes from "./v1/routes/user.route.js";
import { userSchemas } from "./schemas/user.schema.js";
import { jwtConfig } from "../config/jwt.config.js";


export const server: FastifyInstance = Fastify({});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
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

  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, {prefix: `api/${api_version}/users`})

  try {
    await server.listen({port: port, host: host});

    console.log(`Server running at ${host}:${port}`);
  } catch(err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();