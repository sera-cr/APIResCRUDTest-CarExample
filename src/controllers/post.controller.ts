import { FastifyReply, FastifyRequest } from "fastify";
import { CreatePostInput, EditPostSchema, IdParams } from "../schemas/post.schema.js";
import { createPost, deletePost, getPostById, getPosts, updateContent, updatePublished, updateTitle } from "../services/post.service.js";
import pkg from "@prisma/client";
const { Role } = pkg;

export async function createPostHandler(
  request: FastifyRequest<{
    Body: CreatePostInput;
  }>,
) {
  const post = await createPost({
    ...request.body,
    authorId: request.user.id,
  });

  return post;
}

export async function getPostsHandler() {
  const posts = await getPosts();

  return posts;
}

export async function updatePostHandler(
  request: FastifyRequest<{
    Params: IdParams
    Body: EditPostSchema
  }>,
  reply: FastifyReply
) {
  const id: number = parseInt(request.params.id);
  const body = request.body;

  // find post by id
  const post = await getPostById(id);

  if (!post) {
    return reply.code(401).send({
      message: "Invalid post id"
    });
  }

  try {
    if (request.user.id === post.authorId || request.user.role === Role.Admin) {
      if (body.title) {
        const post = await updateTitle(id, body.title);

        return reply.code(200).send(post)
      }

      if (body.content) {
        const post = await updateContent(id, body.content);

        return reply.code(200).send(post)
      }

      if (body.published) {
        const post = await updatePublished(id, body.published);

        return reply.code(200).send(post)
      }
    }
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function getPostHandler(
  request: FastifyRequest<{
    Params: IdParams
  }>,
  reply: FastifyReply
) {
  const id: number = parseInt(request.params.id);

  try {
    // find post by id
    const post = await getPostById(id);

    if (!post) {
      return reply.code(401).send({
        message: "Invalid post id"
      });
    }

    return reply.code(200).send(post);

  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}

export async function deletePostHandler(
  request: FastifyRequest<{
    Params: IdParams
  }>,
  reply: FastifyReply
) {
  const id: number = parseInt(request.params.id);

  // find post by id
  const post = await getPostById(id);

  if (!post) {
    return reply.code(401).send({
      message: "Invalid post id"
    });
  }

  try {
    const post = await deletePost(id);

    return reply.code(200).send(post);
  } catch(err) {
    console.error(err);

    return reply.code(500);
  }
}