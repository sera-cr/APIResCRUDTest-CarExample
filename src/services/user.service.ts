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

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    }
  })
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true
    }
  });
}

export async function deleteUser(email: string) {
  return prisma.user.delete({
    where: {
      email,
    }
  })
}

export async function updatePassword(email:string, password: string) {
  const {hash, salt} = hashPassword(password);

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      salt: salt,
      password: hash
    }
  })

  return user;
}

export async function updateName(email: string, name: string) {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      name: name
    }
  })
}