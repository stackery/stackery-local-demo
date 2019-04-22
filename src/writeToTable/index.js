const AWS = require('aws-sdk');

exports.handler = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  let promiseArray = [];

  for (let i = 0; i < 10; i++) {
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: `item-${i}`,
        title: `Item ${i}`,
        content: `One day something will go here`
      },
      ConditionExpression: 'attribute_not_exists(id)', // do not overwrite existing entries
      ReturnConsumedCapacity: 'TOTAL'
    };

    const p = dynamodb.put(params)
      .promise()
      .then(() => {
        console.log(`Writing item ${i} to table. Sweet!`);
      })
      .catch((error) => {
        console.log(`Something went wrong`);
        console.log(error.message);
      });
    promiseArray.push(p);
  };

  try {
    await Promise.all(promiseArray);
    console.log('Writing to dynamodb');
  } catch (error) {;
    console.log(error);
  }

  return 'Success!';
};
