const AWS = require("aws-sdk");

// this flag is set when the process runs on AWS lambda
// so we can use it to determine if we run on AWS or not
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

// if we are local, add env vars to communicate with DynamoDB
if (!isLambda) {
    require("dotenv").config();
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    });
}

// promisified generic getter
const getByParams = params =>
    new Promise((resolve, reject) => {
        docClient.get(params, (err, data) => {
            if (err) {
                console.log("error getting from dynamodb", err);
                reject(err);
            } else {
                // transform the DB result to desired format before returning
                const result = transformArticle(data.Item);
                console.log("yay got data from dynamodb", result);
                resolve(result);
            }
        });
    });

// our resolver function
const getRecordsByState = async id => {
    const params = {
        ...defaultParams,
        Key: {
            ID: id
        }
    };

    return getByParams(params);
};

module.exports = {
    getRecordsByState
};