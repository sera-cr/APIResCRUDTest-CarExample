import { CreateUserInput } from "src/schemas/user.schema.js";
import prisma from "../utils/prisma.js";
import { hashPassword } from "src/utils/hash.js";

export async function createUser(input: CreateUserInput) {

  const {password, ...rest} = input;

  const {hash, salt} = hashPassword(password);

  const user = await prisma.user.create({
    data: {...rest, salt, password: hash},
  })

  return user;
}