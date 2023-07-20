/*
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'

const server: FastifyInstance = Fastify({})

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' }
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
*/
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { listenOptions } from "../config/listenOptions.config.js"


const server: FastifyInstance = Fastify({});

/*const port: number = parseInt(process.env.DEV_PORT || '');

const host = process.env.DEV_HOST || '0.0.0.0';*/

let port: number;
let host: string;

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


const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', opts, async (request, reply) => {
  console.log("PONG");
  return { pong: 'it worked!' }
})

const start = async() => {
  try {
    await server.listen({port: port, host: host});

    console.log(`Server running at ${host}:${port}`);
  } catch(err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();