from aws_cdk import core, aws_ec2, aws_iam, aws_eks


class CdkPyEksClusterStack(core.Stack):

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
                                  masters_role=eks_admin_role
                                  )
