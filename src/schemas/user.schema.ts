import { z } from "zod";
import {buildJsonSchemas} from "fastify-zod";

const userCore = {
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email(),
  name: z.string()
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
})

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
})

const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email(),
  password: z.string(),
})

const loginResponseSchema = z.object({
  id: z.number(),
  ...userCore,
  role: z.string(),
  accessToken: z.string(),
})

const deleteSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email()
})

const deleteResponseSchema = z.object({
  id: z.number(),
  ...userCore
})

const idParams = z.object({
  id: z.string()
})

const emailParams = z.object({
  email: z.string().email()
})

const updateSchema = z.object({
  name: z.string().optional(),
  password: z.string({
    invalid_type_error: "Password must be a string",
  }).optional(),
})

const updateResponseSchema = z.object({
  message: z.string()
})

const userResponseSchema = z.object({
  id: z.number(),
  ...userCore,
  role: z.string()
})

const roleParams = z.object({
  email: z.string().email(),
  role: z.string()
})

const postUser = z.object({
  title: z.string(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const postUserInfo = z.object({
  title: z.string(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    name: z.string(),
    email: z.string()
  }),
})

const postsUser = z.object({
  posts: z.array(postUser)
})

const allPostsUsersResponse = z.object({
  posts: z.array(postUserInfo)
})

const emailExistsResponseSchema = z.object({
  message: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type EmailParams = z.infer<typeof emailParams>;
export type RoleParams = z.infer<typeof roleParams>;
export type PostsUser = z.infer<typeof postsUser>;
export type IdParams = z.infer<typeof idParams>;

export const {schemas: userSchemas, $ref} = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  deleteSchema,
  deleteResponseSchema,
  updateSchema,
  updateResponseSchema,
  emailParams,
  userResponseSchema,
  roleParams,
  postsUser,
  postUser,
  emailExistsResponseSchema,
  idParams,
  allPostsUsersResponse
},
{ $id: "UserSchema" })