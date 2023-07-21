import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput } from "src/schemas/user.schema.js";
import { createUser } from "src/services/user:service.js";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}