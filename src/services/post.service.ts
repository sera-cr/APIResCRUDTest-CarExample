import prisma from "../utils/prisma.js";
import { CreatePostInput } from "src/schemas/post.schema.js";

export async function createPost(data: CreatePostInput & {authorId: number}) {
  return prisma.post.create({
    data
  })
}

export function getPosts() {
  return prisma.post.findMany({
    select: {
      content: true,
      title: true,
      published: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        }
      }
    }
  })
}

export async function getPostsByUser(userId: number) {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      published: true,
      title: true,
      updatedAt: true,
      createdAt: true
    },
    where: {
      authorId: userId
    }
  })

  return posts
}