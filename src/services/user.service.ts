import { CreateUserInput } from "../schemas/user.schema.js";
import prisma from "../utils/prisma.js";
import { hashPassword } from "../utils/hash.js";

export async function createUser(input: CreateUserInput) {

  const {password, ...rest} = input;

  const {hash, salt} = hashPassword(password);

  const user = await prisma.user.create({
    data: {...rest, salt, password: hash},
  })

  return user;
}