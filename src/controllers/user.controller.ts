import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "../schemas/user.schema.js";
import { createUser, findUserByEmail, findUsers } from "../services/user.service.js";
import { verifyPassword } from "../utils/hash.js";
import { server } from "../app.js";

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

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password"
    });
  }

  // verify password
  const password = verifyPassword({
    password: body.password,
    salt: user.salt,
    hash: user.password
  });

  if (password) {
    const {password, salt, ...rest} = user
  // generate access token
    return { accessToken: server.jwt.sign(rest)}
  }
  
  // error response
  return reply.code(401).send({
    message: "Invalid email or password"
  });
}

export async function getUsersHandler() {
  const users = await findUsers()

  return users;
}