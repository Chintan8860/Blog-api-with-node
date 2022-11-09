import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import bodyParser from "body-parser";

const typeDefs = `

  type User {
    id: Int
    userId: Int
    title: String
    completed: Boolean
  }
  type Query {
    allUsers: [User]!
  }
`;

const getData = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  return await res.json()
}

const resolvers = {
  Query: {
    allUsers: async (_parent,  te) => {
      return getData()
    }
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
    graphiql:true
  })
);

app.listen(4500);
