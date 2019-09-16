#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { InfraStack, FargateStack } from '../lib/cross-stacks-stack';

const app = new cdk.App();

const env = {
    region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

/**
 * create our infra VPC
 */
const infra = new InfraStack(app, 'Infratack', { env });

/**
 * create our Fargate service in the VPC from Infratack
 */
const svc = new FargateStack(app, 'FargateServiceStack', {
    env,
    vpc: infra.vpc
})
