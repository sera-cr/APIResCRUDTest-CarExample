import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const idParams = z.object({
  userId: z.string()
})

const profileResponseSchema = z.object({
  bio: z.string().optional(),
  id: z.number(),
  userId: z.number()
})

const createProfileSchema = z.object({
  bio: z.string(),
})

const editProfileSchema = z.object({
  bio: z.string()
})

export type IdParams = z.infer<typeof idParams>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type EditProfileInput = z.infer<typeof editProfileSchema>;


export const { schemas: profileSchemas, $ref } = buildJsonSchemas({
  idParams,
  profileResponseSchema,
  createProfileSchema,
  editProfileSchema
},
{ $id: "ProfileSchema" })