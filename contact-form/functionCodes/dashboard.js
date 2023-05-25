const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  try {
    // Retrieve user data from the DynamoDB table
    const params = {
      TableName: 'ServerlessApplication',
    };
    const { Items } = await dynamodb.scan(params).promise();

    // Calculate user count and nationality count from DynamoDB
    const userCount = Items.length;
    const nationalityCounts = {};
    const userList = Items.map((item) => {
      const nationality = item.Nationality;
      nationalityCounts[nationality] = (nationalityCounts[nationality] || 0) + 1;

      return {
        Fullname: item.Fullname,
        Email: item.Email,
        Age: item.Age,
      };
    });

    // Retrieve user details from the Cognito user pool
    const cognitoParams = {
      UserPoolId: 'us-east-2_Yx8vdCvu1',
    };
    const users = await cognitoIdentityServiceProvider.listUsers(cognitoParams).promise();
    const totalUsers = users.Users.length;
    const userDetails = users.Users.map(user => {
      const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
      const userCreateDate = user.UserCreateDate;
      return {
        Email: emailAttribute ? emailAttribute.Value : '',
        UserCreateDate: userCreateDate
      };
    });

    // Prepare the response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        users: userDetails,
        userCount,
        nationalityCounts,
        userList,
        totalUserCount: totalUsers,
      }),
    };

    return response;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};
