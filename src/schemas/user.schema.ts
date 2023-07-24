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
  ...userCore,
})

const emailParams = z.object({
  email: z.string()
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
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type EmailParams = z.infer<typeof emailParams>;

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
  userResponseSchema
},
{ $id: "UserSchema" })