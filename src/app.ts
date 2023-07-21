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
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui"
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

const swaggerOptions = {
  swagger: {
    info: {
      title: "Fastify Posts API",
      description: "Api about the interaction between users and posts",
      version: "1.0.0",
    },
    host: host,
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "User", description: "Endpoints CRUD about Users data." },
           { name: "Post", description: "Endpoints CRUD about Posts data."}],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

server.register(fastifySwagger, swaggerOptions);
server.register(fastifySwaggerUi, swaggerUiOptions);

const start = async() => {

  for (const schema of [...postSchemas, ...userSchemas]) {
    server.addSchema(schema);
  }
  
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