#MAPROVER--API-VISUALIZATION

### Serverless (local development)

1. Install packages

```npm install apollo-server apollo-server-lambda graphql nodemon lodash moment```
```npm install mocha --save-dev```

2. Run local development environment

```npm run dev```

[Serverless GraphQL APIs with Node.js and Apollo](https://www.thomasmaximini.com/build-a-serverless-graphlql-api-with-apollo-server-on-aws-lambda)

3. Install serverless plugins for development:
```
serverless plugin install -n serverless-domain-manager --save-dev
serverless plugin install -n serverless-aws-documentation --save-dev
serverless plugin install -n serverless-reqvalidator-plugin --save-dev
serverless plugin install -n serverless-plugin-custom-roles --save-dev
serverless plugin install -n serverless-python-requirements --save-dev
```
4. Before decide to deploy `sls deploy -v` must create domain `sls create_domain`, otherwise it will fail.
   [More info](https://github.com/amplify-education/serverless-domain-manager/issues/343)