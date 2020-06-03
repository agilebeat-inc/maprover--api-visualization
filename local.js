// local.js
const { ApolloServer } = require("apollo-server");

const schema = require("./graphql/schema");

const server = new ApolloServer({
    schema,
    graphiql: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});