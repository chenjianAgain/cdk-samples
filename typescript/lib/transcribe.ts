import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import s3n = require('@aws-cdk/aws-s3-notifications');
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { Topic } from '@aws-cdk/aws-sns';
import path = require('path');

export class TranscribeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket')

    /**
     * Use the existing SNS_TOPIC_ARN from context variable; otherwise create a new one
     * We use thie SNS TOPIC for notification on task status change
     */
    const snsTopicArn = this.node.tryGetContext('SNS_TOPIC_ARN') || new Topic(this, 'SNS').topicArn

    const fn = new Function(this, 'VideoHandler', {
      code: AssetCode.fromAsset(path.join(__dirname, '../../', 'function/transcribe/lambda')),
      handler: 'app.lambda_handler',
      runtime: Runtime.PYTHON_3_7,
      environment: {
        'BUCKET_NAME': bucket.bucketName,
        'SNS_TOPIC_ARN': snsTopicArn
      },
      timeout: Duration.minutes(1)
    })
    const transcribeStatement = new PolicyStatement();
    transcribeStatement.addActions("transcribe:StartTranscriptionJob");
    transcribeStatement.addActions("transcribe:GetTranscriptionJob");
    transcribeStatement.addResources("*");
    fn.addToRolePolicy(transcribeStatement);

    const snsStatement = new PolicyStatement();
    snsStatement.addActions("sns:Publish");
    snsStatement.addResources(snsTopicArn)
    fn.addToRolePolicy(snsStatement)



    bucket.grantReadWrite(fn);
    bucket.addObjectCreatedNotification(new s3n.LambdaDestination(fn))

    const eventTranscribeComplete = new events.Rule(this, 'OnTranscribeCompleteEvent', {
      description: 'on Transcribe complete',
      ruleName: 'OnTranscribeCompleteEvent',
    })

    eventTranscribeComplete.addEventPattern({
      "source": [
        "aws.transcribe"
      ],
      "detailType": [
        "Transcribe Job State Change"
      ],
      "detail": {
        "TranscriptionJobStatus": [
          "COMPLETED"
        ]
      }
    })
    eventTranscribeComplete.addTarget(new targets.LambdaFunction(fn))

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName
    })
  }
}