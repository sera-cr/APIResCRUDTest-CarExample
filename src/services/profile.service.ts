import { table } from "console";
import prisma from "../utils/prisma.js";

export async function getProfileUserId(userId: number) {
  return await prisma.profile.findUnique({
    select: {
      bio: true,
      id: true,
      userId: true
    },
    where: {
      userId: userId
    }
  })
}

export async function createProfile(bio: string, userId: number) {
  return await prisma.profile.create({
    data: {
      bio: bio,
      userId: userId
    }
  })
}

export async function updateProfile(bio: string, userId: number) {
  return await prisma.profile.update({
    where: {
      userId: userId
    },
    data: {
      bio: bio
    }
  })
}

export async function deleteProfile(userId: number) {
  return await prisma.profile.delete({
    where: {
      userId: userId
    }
  })
}