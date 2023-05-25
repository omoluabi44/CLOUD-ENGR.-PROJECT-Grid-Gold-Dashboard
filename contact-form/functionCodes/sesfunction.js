const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const SENT_EMAILS_TABLE_NAME = 'sent-emails';

exports.handler = async (event, context) => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'INSERT') {
        const email = record.dynamodb.NewImage.Email.S;
        const name = record.dynamodb.NewImage.Fullname.S;
        const itemId = record.dynamodb.Keys.id.S;

        // Check if an email has already been sent for this item
        const response = await dynamodb.get({
          TableName: SENT_EMAILS_TABLE_NAME,
          Key: { id: itemId }
        }).promise();

        if (response.Item && response.Item.sent) {
          console.log(`Email already sent for item ${itemId}`);
          continue;
        }

        const message = `Hello ${name}, welcome to our service!`;
        try {
          // Send email
          await ses.sendEmail({
            Destination: { ToAddresses: [email] },
            Message: {
              Body: {
                Text: {
                  Data: message
                }
              },
              Subject: {
                Data: 'Welcome to our service'
              }
            },
            Source: 'emmanuelogunleye441999@gmail.com'
          }).promise();

          // Record that an email has been sent for this item
          await dynamodb.put({
            TableName: SENT_EMAILS_TABLE_NAME,
            Item: { id: itemId, sent: true }
          }).promise();

          console.log(`Email sent to ${email} for item ${itemId}`);
        } catch (e) {
          console.error(`Error sending email: ${e}`);
        }
      }
    }
  } catch (e) {
    console.error(`Error processing event: ${e}`);
  }
};
