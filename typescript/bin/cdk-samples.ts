#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { FargateCICDStack } from '../lib/fargate-cicd';
// import { EcsStack } from '../lib/ecs';
import { FargateSvcStack } from '../lib/fargate';
import { ServerlessStack } from '../lib/serverless';
import { AwsFireLensStack } from '../lib/awsfirelens';
import { FargateEventTargetDemoStack } from '../lib/fargate-event-targets';
const app = new cdk.App();

const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

// const fargateEventTargetDemoStack = new FargateEventTargetDemoStack(app, 'fargateEventTargetDemo', {
//     env: env
// })


const awsFireLensDemo = new AwsFireLensStack(app, 'awsFireLensDemo1', {
    env: env
})

// const fargatesvc = new FargateCICDStack(app, 'FargateCICD', {
//     env: env
// })

// const serverlessApi = new ServerlessStack(app, 'ServerlessAPI2', {
//     env: env
// })


// const fargatesvc = new FargateSvcStack(app, 'FargateSvcDemo', {
//     env: env
// })

// const ecssvc = new EcsStack(app, 'EcsStack', {
//     env: env
// })

