import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const postInput = {
  title: z.string(),
  content: z.string().optional(),
  published: z.boolean().optional()
};

const postResponse = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.number()
}

const postGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const postResponseSchema = z.object({
  ...postInput,
  ...postGenerated,
  authorId: z.number()
});

const createPostSchema = z.object({
  ...postInput,
});

const postsResponseSchema = z.array(postResponseSchema);

const idParams = z.object({
  id: z.string()
})

const editPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().optional()
})

const editPostResponseSchema = z.object({
  ...postResponse
})

const getPostResponseSchema = z.object({
  ...postResponse
})

const createPostResponseSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string()
  }),
})

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type IdParams = z.infer<typeof idParams>;
export type EditPostSchema = z.infer<typeof editPostSchema>;
export type GetPostResponseSchema = z.infer<typeof getPostResponseSchema>;

export const { schemas: postSchemas, $ref } = buildJsonSchemas({
  createPostSchema,
  postResponseSchema,
  postsResponseSchema,
  idParams,
  editPostSchema,
  editPostResponseSchema,
  getPostResponseSchema,
  createPostResponseSchema
},
{ $id: "PostSchema" });