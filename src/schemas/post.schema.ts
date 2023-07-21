import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const postInput = {
  title: z.string(),
  content: z.string().optional(),
  published: z.boolean().optional()
};

const postGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const postResponseSchema = z.object({
  ...postInput,
  ...postGenerated,
});

const createPostSchema = z.object({
  ...postInput,
});

const postsResponseSchema = z.array(postResponseSchema);

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const { schemas: postSchemas, $ref } = buildJsonSchemas({
  createPostSchema,
  postResponseSchema,
  postsResponseSchema,
},
{ $id: "PostSchema" });