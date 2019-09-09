#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { FargateAlbSvcStack } from '../lib/fargate-alb-svc';
import { FargateCICDStack } from '../lib/fargate-cicd';
import { ServerlessRestApiStack } from '../lib/serverless-rest-api';
// import { AwsFireLensStack } from '../lib/awsfirelens';
import { FargateEventTarget } from '../lib/fargate-event-targets';
const app = new cdk.App();

const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

/**
 * A simple PHP service running with AWS Fargate and ALB
 * https://github.com/pahud/cdk-samples/tree/master/typescript/fargate-alb-svc
 * Sample: cdk deploy -c region=ap-northeast-1 fargateAlbSvc
 */
const fargateAlbSvc = new FargateAlbSvcStack(app, 'FargateAlbService', {
    env: env
})

/**
 * Building Fargate CI/CD pipelines from scratch with AWS CDK
 * https://github.com/pahud/cdk-samples/tree/master/typescript/fargate-cicd
 * Sample: cdk deploy -c region=ap-northeast-1 fargatecicd
 */
const fargatecicd = new FargateCICDStack(app, 'FargateCICD', {
    env: env
})

/**
 * Fargate as CloudWatch Events target 
 * https://github.com/pahud/cdk-samples/tree/master/typescript/fargate-event-target
 * Sample: cdk deploy -c region=ap-northeast-1 -c topicArn=arn:aws:sns:ap-northeast-1:112233445566:SNS2IM fargateEventTarget
 */
const fargateEventTarget = new FargateEventTarget(app, 'fargateEventTarget', {
    env: env,
    topicArn: app.node.tryGetContext('topicArn') || 'undefined'
})

/**
 * Serverless REST API with AWS Lambda in VPC and Amazon API Gateway
 * https://github.com/pahud/cdk-samples/tree/master/typescript/serverless-rest-api
 * Sample: cdk deploy -c region=ap-northeast-1 serverlessApi
 */
const serverlessApi = new ServerlessRestApiStack(app, 'ServerlessRestAPI', {
    env: env
})

/**
 * WIP
 */
// const awsFireLensDemo = new AwsFireLensStack(app, 'awsFireLensDemo1', {
//     env: env
// })

