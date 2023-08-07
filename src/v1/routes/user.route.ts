import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { deleteUserHandler, getPostsUserHandler, getUserCredentialsHandler, getUserEmailHandler, getUserHandler, getUsersHandler, loginHandler, registerUserHandler, updateUserHandler, updateUserRoleHandler } from "../../controllers/user.controller.js";
import { $ref } from "../../schemas/user.schema.js";

async function userRoutes(server: FastifyInstance) {
  server
    // create an user
    .post("/", {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          200: $ref("createUserResponseSchema"),
          409: $ref("emailExistsResponseSchema")
        },
        tags: ["User"],
        description: "Create an user. Input: email, name, password. Output: id, email, name"
      }
    }, registerUserHandler)
    // login user
    .post("/login", {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        },
        tags: ["User"],
        description: "Login for users. It generates an access token. Input: email, password. Output: accessToken."
      }
    }, loginHandler)
    // list of users
    .get("/", {
      preHandler: [server.authenticate],
      schema: {
        tags:["User"],
        description: "It returns the list of users. Output: List of users."
      }
    }, getUsersHandler)
    // get user by id
    /*.get("/:id", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          id: {type: 'string'}
        },
        response: {
          200: $ref('userResponseSchema')
        },
        tags: ["User"],
        description: "Returns an user by it's id. Params: email. Output: id, email, name, role"
      }
    }, getUserHandler)*/
    .get("/:id", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          id: {type: 'string'}
        },
        response: {
          200: $ref('userResponseSchema')
        },
        tags: ["User"],
        description: "Returns an user by it's id. Params: email. Output: id, email, name, role"
      }
    }, getUserHandler)
    // get user by email
    .get("/email/:email", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          email: {type: 'string'}
        },
        response: {
          200: $ref('userResponseSchema')
        },
        tags:["User"],
        description: "Returns an user by it's email. Params: email. Output: id, email, name, role"
      }
    }, getUserEmailHandler)
    // delete user
    .delete("/", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('deleteSchema'),
        response: {
          200: $ref('deleteResponseSchema')
        },
        tags: ["User"],
        description: "Deletes an user. Input: email. Output: id, name, email."
      }
    }, deleteUserHandler)
    // update name/password user
    .put("/:email", {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('updateSchema'),
        querystring: {
          email: { type: 'string' }
        },
        response: {
          200: $ref('updateResponseSchema')
        },
        tags: ["User"],
        description: "Update an user. Params: email. Input: name, password. Both optional. Output: message."
      }
    }, updateUserHandler)
    // update role user
    .put("/:email/role/:role", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          email: { type: 'string' },
          role: { type: 'string' }
        },
        response: {
          200: $ref('updateResponseSchema')
        },
        tags: ["User"],
        description: "Modifies the role of an user. Params: email, role. Output: message."
      }
    }, updateUserRoleHandler)
    // get posts by user
    .get("/:email/posts", {
      preHandler: [server.authenticate],
      schema: {
        querystring: {
          email: { type: 'string' },
        },
        response: {
          200: $ref('postsUser')
        },
        tags: ["User"],
        description: "Get all the posts by an user. Params: email. Output: list of Posts(title, content, published, id, createdAt, updatedAt)"
      }
    }, getPostsUserHandler)
    // get credentials from accessToken
    .get("/credentials", {
      preHandler: [server.authenticate],
      schema: {
        response: {
          200: $ref('userResponseSchema')
        },
        tags: ["User"],
        description: "Get all user info by access token. Params: accessToken. Output. user info(id, email, name, role)"
      }
    }, getUserCredentialsHandler)
}

export default userRoutes;