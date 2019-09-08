from aws_cdk import core, aws_sns, aws_eks, aws_ec2, aws_iam, aws_ecs, aws_ecs_patterns


class CdkPyFargateStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # import default VPC
        vpc = aws_ec2.Vpc.from_lookup(self, 'VPC', is_default=True)

        # ECS cluster
        cluster = aws_ecs.Cluster(self, 'Cluster', vpc=vpc)
        svc = aws_ecs_patterns.LoadBalancedFargateService(
            self, 'FargateService',
            cluster=cluster,
            image=aws_ecs.ContainerImage.from_asset('flask-docker-app'),
            container_port=5000,
            environment={
                'PLATFORM': 'AWS Fargate :-)'
            }
        )

        core.CfnOutput(self, 'SericeURL', value="http://{}".format(
            svc.load_balancer.load_balancer_dns_name))


class CdkPyEksStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # import default VPC
        vpc = aws_ec2.Vpc.from_lookup(self, 'VPC', is_default=True)

        # create an admin role
        eks_admin_role = aws_iam.Role(self, 'AdminRole',
                                      assumed_by=aws_iam.AccountPrincipal(
                                          account_id=self.account)
                                      )

        # create the cluster
        cluster = aws_eks.Cluster(self, 'cluster',
                                  cluster_name='MyEksCluster',
                                  masters_role=eks_admin_role
                                  )
