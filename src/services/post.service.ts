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
      author: {
        select: {
          name: true,
          id: true,
        }
      }
    }
  })
}