import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const idParams = z.object({
  id: z.string()
})

const profileResponseSchema = z.object({
  bio: z.string(),
  id: z.number(),
  userId: z.number()
})

const createProfileSchema = z.object({
  bio: z.string(),
  userId: z.number()
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