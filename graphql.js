// index.js
const { ApolloServer } = require("apollo-server-lambda");

const schema = require("./graphql/schema");

const server = new ApolloServer({
  schema,
  graphiql: true
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: false
  },
  endpointURL: "/graphql"
});
