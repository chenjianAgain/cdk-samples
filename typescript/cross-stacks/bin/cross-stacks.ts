#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { InfraStack, FargateStack, FargateStack2 } from '../lib/cross-stacks-stack';

const app = new cdk.App();

const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

/**
 * create our infra VPC
 */
const infra = new InfraStack(app, 'InfraStack', { env });

/**
 * create our Fargate service in the VPC from InfraStack
 */
const svc = new FargateStack(app, 'FargateServiceStack', {
    env,
    vpc: infra.vpc
})

/**
 * we can get the vpcId from the exported value from InfraStack
 */
const svc2 = new FargateStack2(app, 'FargateServiceStack2', {
    env,
    vpcId: cdk.Fn.importValue('ExportedVpcId')
})

