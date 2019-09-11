import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

export class FargateAlbSvcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    })

    const cluster = new Cluster(this, 'Cluster', {
      vpc: vpc
    })

    const svc = new ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster: cluster,
      image: ContainerImage.fromRegistry('abiosoft/caddy:php'),
      containerPort: 2015,
      containerName: 'php'
    })

    new cdk.CfnOutput(this, 'FargateServiceURL', {
      value: `http://${svc.loadBalancer.loadBalancerDnsName}/`
    })

  }
}

