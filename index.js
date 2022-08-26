import { PrismaClient } from "@prisma/client";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import bodyParser from "body-parser";

const prisma = new PrismaClient();

const typeDefs = `


type People {
    id: Int
    name: String
    User:User
  }

  type User {
    id: Int
    name: String
    People: People 
  }

  type Query {
    allUsers: User!
    allPeople: People!
  }
`;

const resolvers = {
  Query: {
    allUsers: async (_parent,  te) => {
      console.log(te);
      return prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          People: {
            select: {
                id: true
            }
          }
        },
      });
    },
    allPeople: async() => {
      
      const a =  await prisma.people.findFirst({
        select: {
          id: true,
          name: true,
          User: {
            select: {
                id: true
            }
          }
        },
      });

      console.log(a)
      return a
    },
  },
};

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const app = express();

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
  })
);

app.listen(4500);
