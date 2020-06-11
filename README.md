#MAPROVER--API-VISUALIZATION

### Serverless (local development)

[Serverless GraphQL APIs with Node.js and Apollo](https://www.thomasmaximini.com/build-a-serverless-graphlql-api-with-apollo-server-on-aws-lambda)

3. Install serverless plugins for development:
```
serverless plugin install -n serverless-domain-manager --save-dev
```

4. Before decide to deploy `sls deploy -v` must create domain `sls create_domain`, otherwise it will fail.
   [More info](https://github.com/amplify-education/serverless-domain-manager/issues/343)

5. Deployment in production:

   - enable domain first in serverless file by chainging createRoute53Record to true and enabled to true
   ```
   customDomain:
    domainName: 'visualization.api.maprover.io'
    stage: ${self:provider.stage}
    basePath: ''
    certificateName: '*.api.maprover.io'
    createRoute53Record: true
    endpointType: 'edge'
    securityPolicy: 'tls_1_2'
    apiType: 'rest'
    enabled: true
   ```

   - then create domain by running
   ```sls create_domain```

   - finally run sls deploy