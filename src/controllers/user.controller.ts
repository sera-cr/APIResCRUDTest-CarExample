import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, DeleteInput, EmailParams, LoginInput, RoleParams, UpdateInput } from "../schemas/user.schema.js";
import { createUser, deleteUser, findUserByEmail, findUsers, updateName, updatePassword, updateRole } from "../services/user.service.js";
import { verifyPassword } from "../utils/hash.js";
import { server } from "../app.js";
import pkg from "@prisma/client";
const { Role } = pkg;
import { getPostsByUser } from "../services/post.service.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { relative } from "path";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    console.log(user);

    if (typeof user === 'string') {
      return reply.code(409).send({message: user});
    } else {
      return reply.code(200).send(user);
    }
  } catch(err) {
    console.log(err);

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
    const accessToken = server.jwt.sign(rest);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: accessToken,
      role: user.role
    }
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

export async function getUserHandler(
  request: FastifyRequest<{
    Params: EmailParams
  }>,
  reply: FastifyReply
) {
  const { email } = request.params;

  const user = await findUserByEmail(email);

  return reply.code(200).send(user);
}

export async function deleteUserHandler(
  request: FastifyRequest<{
    Body: DeleteInput
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

  // deleting user
  try {
    if (request.user.email === body.email || request.user.role === Role.Admin) {
      const deleted = await deleteUser(user.email);

      return reply.code(200).send(deleted);
    } else {
      return reply.code(401).send({
        message: "Unauthorized"
      })
    }
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Params: EmailParams
    Body: UpdateInput
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  const { email } = request.params;

  // find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email"
    });
  }

  try {
    if (request.user.email === email || request.user.role === Role.Admin) {
      if (body.name) {
        updateName(email, body.name);
      }
  
      if (body.password) {
        updatePassword(email, body.password);
      }
  
      return reply.code(200).send({
        message: "Success"
      })
    } else {
      return reply.code(401).send({
        message: "Unauthorized"
      })
    }
    
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function updateUserRoleHandler(
  request: FastifyRequest<{
    Params: RoleParams
  }>,
  reply: FastifyReply
) {
  const { email, role } = request.params;

  // find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email"
    });
  }

  try {
    if (request.user.role === Role.Admin) {
      updateRole(email, role === "User" ? Role.User : Role.Admin)

      return reply.code(200).send({
        message: "Success"
      })
    } else {
      return reply.code(401).send({
        message: "Unauthorized"
      })
    }
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function getPostsUserHandler(
  request: FastifyRequest<{
    Params: EmailParams
  }>,
  reply: FastifyReply
) {
  const { email } = request.params;

  // find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email"
    })
  }

  try {
    const posts = await getPostsByUser(user.id);

    return reply.code(200).send({
      posts: posts
    });
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}