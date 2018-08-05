import express from "express";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./schema/typeDefinitions";
import resolvers from "./schema/resolvers";

const DEFAULT_PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();
server.applyMiddleware({ app });

app.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
