const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const s3 = new AWS.S3();

const tableName = 'ServerlessApplication';
const bucketName = 'serverlessapplication-backup';

exports.handler = async (event) => {
  try {
    // Retrieve data from DynamoDB table
    const scanParams = {
      TableName: tableName,
    };
    const result = await dynamodb.scan(scanParams).promise();
    const items = result.Items;

    // Convert data to JSON string
    const data = JSON.stringify(items);

    // Store data in S3 bucket
    const putObjectParams = {
      Bucket: bucketName,
      Key: 'data.json', // Set the desired file name
      Body: data,
      ContentType: 'application/json', // Set the content type of the file
    };
    await s3.putObject(putObjectParams).promise();

    return {
      statusCode: 200,
      body: 'Data stored in S3 successfully',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error storing data in S3',
    };
  }
};
