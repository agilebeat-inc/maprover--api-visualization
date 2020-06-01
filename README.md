# maprover--api-tsjs-infer

Expose models with a lambda function through API Gateway

## To deploy:

These commands should be run in the container shell

1. Install node tensorflow module:
```
npm install @tensorflow/tfjs
npm install graphql
npm install curlrequest
```

2. Optimize distribution:
```
npm prune --production
```

3. Install serverless plugins for development:
```
serverless plugin install -n serverless-python-requirements --save-dev
serverless plugin install -n serverless-reqvalidator-plugin --save-dev
serverless plugin install -n serverless-aws-documentation --save-dev
serverless plugin install -n serverless-plugin-custom-roles --save-dev
serverless plugin install -n serverless-domain-manager --save-dev
```

4. Set up aws credentials

    - run command: `aws configure`

5. Check your aws configuration by: 

    - listing s3 buckets: `aws s3 ls`
    - you should see a list of all your buckets

6. Run:

    - serverless deploy command: `sls deploy -v`
    - you should see list of endpoints: 
    
    ```
    ```

7. Useful serverless comands in the project 

    - deploy project to the aws: `sls deploy -v`
    - run local test: `sls invoke local -f infer`
    - run test with post file `sls invoke -f infer -p test/tile_test.json`
    - pull out logs for the lambda function `sls logs -f infer`

8. Sources:

    - [aws nodejs canvas](https://github.com/Automattic/node-canvas/wiki/Installation:-AWS-Lambda)
    - [node-canvas](https://github.com/Automattic/node-canvas)
    - [problems with lambda so libs](https://github.com/Automattic/node-canvas/issues/680)
    - [build aws lambda issues](https://github.com/Automattic/node-canvas/issues/680)
    - [load image example](https://medium.com/@nico.axtmann95/scalable-image-classification-with-onnx-js-and-aws-lambda-ab3d7bd1723)
    - [tensorflow on aws - example](http://blog.zenof.ai/object-detection-in-react-native-app-using-tensorflow-js/)
    - [aws lambda nodjes - no body returned](https://medium.com/lifeomic/a-two-week-search-for-the-missing-body-of-a-lambda-function-response-c9ee79bd8093)
    - [example of resnet50](https://medium.com/@nico.axtmann95/scalable-image-classification-with-onnx-js-and-aws-lambda-ab3d7bd1723)
    - [encoding and decoding b64 in Node.js](https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/)
    - [convert model to tsjs](https://www.tensorflow.org/js/tutorials/conversion/import_keras)
    - [save Keras model as tsjs model](https://www.tensorflow.org/js/tutorials/conversion/import_keras)
    - [serverless API Gatewas custom domain + GraphQL](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/)
    - [serverless custom domain for api gateway - serverless-domain-manager](https://www.serverless.com/plugins/serverless-domain-manager/)

9. Lambda Tricks:
    - list files on the running machine
    
```javascript
const fs = require('fs');

exports.handler = async (event, context) => {
  return fs.readdirSync("/usr/lib64").filter(p => p.match(/\.so/)).sort().join("\n");
};
```

10. Issues

NPM is very aggressive. Sometimes it installs dependencies in the node_modules folder.
When that happens the lambda package is too big to run (~80MB). When that happens remove
node_modules, package-lock.json and package.json files and check them out again from the 
repo. After that reinstall tensorflowjs with command:

```bash
npm install @tensorflow/tfjs
```

