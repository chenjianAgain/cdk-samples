import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { countResources } from '@aws-cdk/assert';

export interface MyStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
}

export class InfraStack extends cdk.Stack {
  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'SharedVPC', {
      natGateways: 1,
    })

    new cdk.CfnOutput(this, 'vpcId', {
      value: this.vpc.vpcId
    })
  }
}

export class FargateStack extends cdk.Stack {
  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    this.vpc = props.vpc

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: this.vpc
    })

    const svc = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      image: ContainerImage.fromRegistry('nginx')
    })

    new cdk.CfnOutput(this, 'ServiceURL', {
      value: `http://${svc.loadBalancer.loadBalancerDnsName}/`
    })
  }
}

