import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const AWS = require('aws-sdk');
const ssm = new (require('aws-sdk/clients/ssm'))();

export const handler = async(event) => {

  try {
    let params = {
      DocumentName: 'AWS-RunShellScript',
      InstanceIds: ['インスタンスID'],
      Parameters: {
        commands: ['touch hoge.txt'],
        workingDirectory: ['/home/ec2-user']
      },
      CloudWatchOutputConfig: {
        CloudWatchLogGroupName: 'SSMLogs',
        CloudWatchOutputEnabled: true
      },
      TimeoutSeconds: 3600
    }
    const sendCommandResult = await ssm.sendCommand(params).promise();  
  } catch(e){
    console.log(e);
  }

  const today = new Date();
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2);
  const formattedTime = hours + ':' + minutes + ':' + seconds;

  const user_id = event.queryStringParameters.user_id

  const response = {
    statusCode: 200,
    body: {
      userKey: JSON.stringify(`${user_id} ${formattedTime}`)
    },
  };
  return response;
};
