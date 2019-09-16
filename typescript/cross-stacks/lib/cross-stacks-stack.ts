import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { countResources } from '@aws-cdk/assert';
import { Vpc } from '@aws-cdk/aws-ec2';

export interface MyStackProps extends cdk.StackProps {
  vpc?: ec2.Vpc
  vpcId?: string
}

export class InfraStack extends cdk.Stack {
  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'SharedVPC', {
      natGateways: 1,
    })

    new cdk.CfnOutput(this, 'vpcId', {
      value: this.vpc.vpcId,
      exportName: 'ExportedVpcId'
    })

  }
}

/**
 * This Fargate stack will be created within the ec2.Vpc we pass in from another stack
 */
export class FargateStack extends cdk.Stack {
  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    this.vpc != props.vpc

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

/**
 * This Fargate stack will be created within the vpcId we pass in from another stack
 */
export class FargateStack2 extends cdk.Stack {
  readonly vpc: string

  constructor(scope: cdk.Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    this.vpc != props.vpcId

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: Vpc.fromLookup(this, 'Vpc', {
        vpcId: this.vpc
      })
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

