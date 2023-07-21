import { FastifyRequest } from "fastify";
import { CreatePostInput } from "../schemas/post.schema.js";
import { createPost } from "../services/post.service.js";

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