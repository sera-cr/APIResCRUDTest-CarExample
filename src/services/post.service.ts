import prisma from "../utils/prisma.js";
import { CreatePostInput, EditPostSchema } from "src/schemas/post.schema.js";

export async function createPost(data: CreatePostInput & {authorId: number}) {
  return await prisma.post.create({
    data
  })
}

export async function getPosts() {
  return await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      published: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      authorId: true
    },
    where: {
      published: true
    }
  })
}

export async function getPostsUsers() {
  return await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      published: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    where: {
      published: true
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
      createdAt: true,
      authorId: true
    },
    where: {
      authorId: userId
    }
  })

  return posts
}

export async function getPostById(postId: number) {
  const post = await prisma.post.findUnique({
    select: {
      id: true,
      content: true,
      published: true,
      title: true,
      updatedAt: true,
      createdAt: true,
      authorId: true
    },
    where: {
      id: postId
    }
  })

  return post
}

export async function updateTitle(postId: number, title: string) {
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      title: title
    }
  })

  return post
}

export async function updateContent(postId: number, content: string) {
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      content: content
    }
  })

  return post
}

export async function updatePublished(postId: number, published: boolean) {
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      published: published
    }
  })

  return post
}

export async function deletePost(postId: number) {
  const post = await prisma.post.delete({
    where: {
      id: postId
    }
  })

  return post
}

export async function updatePost(data: EditPostSchema, postId: number)  {
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: data
  })

  return post;
}