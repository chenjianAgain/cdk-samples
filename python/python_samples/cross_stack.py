from aws_cdk import core, aws_ec2, aws_ecs, aws_ecs_patterns


class CdkPyCrossStackInfraStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.vpc = aws_ec2.Vpc(self, 'Vpc', nat_gateways=1)
        core.CfnOutput(self, 'vpcId', value=self.vpc.vpc_id, export_name='ExportedVpcId')


class CdkPyCrossStackFargateStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, vpc: aws_ec2.Vpc, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.vpc = vpc

        cluster = aws_ecs.Cluster(self, 'Cluster', vpc=self.vpc)
        task = aws_ecs.TaskDefinition(self, 'Task',
                                      compatibility=aws_ecs.Compatibility.FARGATE,
                                      memory_mib='512',
                                      cpu='256'
                                      )

        task.add_container('Nginx', image=aws_ecs.ContainerImage.from_registry('nginx')).port_mappings(80)

        svc = aws_ecs_patterns.ApplicationLoadBalancedFargateService(
            self, 'FargateService',
            cluster=cluster,
            task_definition=task
        )

        core.CfnOutput(self, 'ServiceURL', value='http://{}/'.format(svc.load_balancer.load_balancer_full_name))


class CdkPyCrossStackFargateStack2(core.Stack):
    def __init__(self, scope: core.Construct, id: str, vpcId: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        cluster = aws_ecs.Cluster(self, 'Cluster', vpc=aws_ec2.Vpc.from_lookup(self, 'Vpc', vpc_id=vpcId))
        task = aws_ecs.TaskDefinition(self, 'Task',
                                      compatibility=aws_ecs.Compatibility.FARGATE,
                                      memory_mib='512',
                                      cpu='256'
                                      )

        task.add_container('Nginx', image=aws_ecs.ContainerImage.from_registry('nginx')).port_mappings(80)

        svc = aws_ecs_patterns.ApplicationLoadBalancedFargateService(
            self, 'FargateService',
            cluster=cluster,
            task_definition=task
        )

        core.CfnOutput(self, 'ServiceURL', value='http://{}/'.format(svc.load_balancer.load_balancer_full_name))
