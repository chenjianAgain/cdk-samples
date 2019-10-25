import cdk = require('@aws-cdk/core');
import { Vpc, Port } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, TaskDefinition, Compatibility } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService, NetworkLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

export class ApiSixStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    })

    const cluster = new Cluster(this, 'Cluster', {
      vpc
    })

    /**
     * ApiSix service
     */
    const taskDefinition = new TaskDefinition(this, 'TaskApiSix', {
      compatibility: Compatibility.FARGATE,
      memoryMiB: '512',
      cpu: '256'
    })

    taskDefinition
      .addContainer('apisix', {
        image: ContainerImage.fromRegistry('iresty/apisix'),
      })
      .addPortMappings({
        containerPort: 9080
      })

    taskDefinition
      .addContainer('etcd', {
        image: ContainerImage.fromRegistry('gcr.io/etcd-development/etcd:v3.3.12'),
      })
      .addPortMappings({
        containerPort: 2379
      })

    const svc = new ApplicationLoadBalancedFargateService(this, 'ApiSixService', {
      cluster,
      taskDefinition,
    })

    svc.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30')
    svc.targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(5),
      healthyHttpCodes: '404',
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.seconds(4)
    })

    /**
     * PHP service
     */
    const taskDefinitionPHP = new TaskDefinition(this, 'TaskPHP', {
      compatibility: Compatibility.FARGATE,
      memoryMiB: '512',
      cpu: '256'
    })

    taskDefinitionPHP
      .addContainer('php', {
        image: ContainerImage.fromRegistry('abiosoft/caddy:php'),
      })
      .addPortMappings({
        containerPort: 2015
      })

    const svcPHP = new NetworkLoadBalancedFargateService(this, 'PhpService', {
      cluster,
      taskDefinition: taskDefinitionPHP,
      assignPublicIp: true,
    })

    // allow Fargate task behind NLB to accept all traffic
    svcPHP.service.connections.allowFromAnyIpv4(Port.tcp(2015))
    svcPHP.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30')
    svcPHP.loadBalancer.setAttribute('load_balancing.cross_zone.enabled', 'true')

    new cdk.CfnOutput(this, 'ApiSixDashboardURL', {
      value: `http://${svc.loadBalancer.loadBalancerDnsName}/apisix/dashboard/`
    })
  }
}