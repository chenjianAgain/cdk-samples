from aws_cdk import aws_ec2, core


class CdkCustomAmiStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # to deploy in our default VPC
        vpc = aws_ec2.Vpc.from_lookup(self, 'VPC', is_default=True)

        linux = aws_ec2.GenericLinuxImage({
            'us-west-2': 'i-1111111',
            'ap-northeast-1': 'i-222222'
        })

        aws_ec2.Instance(self, 'EC2', instance_type=aws_ec2.InstanceType.of(
            aws_ec2.InstanceClass.BURSTABLE3, aws_ec2.InstanceSize.LARGE),
            machine_image=linux,
            vpc=vpc),
