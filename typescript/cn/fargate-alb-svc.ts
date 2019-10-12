import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, TaskDefinition, Compatibility, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import path = require('path');

const app = new cdk.App();

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};


const stack = new cdk.Stack(app, 'FargateAlbSvc', { env });

const vpc = Vpc.fromLookup(stack, 'VPC', {
  isDefault: true
});

const cluster = new Cluster(stack, 'Cluster', {
  vpc
});

const taskDefinition = new TaskDefinition(stack, 'Task', {
  compatibility: Compatibility.FARGATE,
  memoryMiB: '512',
  cpu: '256'
});

taskDefinition
  .addContainer('flask', {
    // image: ContainerImage.fromRegistry('pahud/amazon-ecs-flask-sample'),
    image: ContainerImage.fromAsset(path.join(__dirname, '../../python/flask-docker-app/')),
    environment: {
      'PLATFORM': `AWS Fargate(${stack.region})`
    }
  })
  .addPortMappings({
    containerPort: 5000
  });

const svc = new ApplicationLoadBalancedFargateService(stack, 'FargateService', {
  cluster,
  taskDefinition
});
