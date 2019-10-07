#!/usr/bin/env python3

import os
from aws_cdk import core
from aws_cdk.core import Stack, Construct, Environment
from python_samples.fargate_flask_stack import CdkPyFargateStack
from python_samples.amazon_eks_cluster import CdkPyEksClusterStack
from python_samples.serverless_rest_api import CdkPyServerlessRestApiStack
from python_samples.cross_stack import CdkPyCrossStackInfraStack, CdkPyCrossStackFargateStack, CdkPyCrossStackFargateStack2

app = core.App()

ACCOUNT = app.node.try_get_context('account') or os.environ.get(
    'CDK_DEFAULT_ACCOUNT', 'unknown')
REGION = app.node.try_get_context('region') or os.environ.get(
    'CDK_DEFAULT_REGION', 'unknown')

AWS_ENV = Environment(region=REGION, account=ACCOUNT)


'''
Flask app running in AWS Fargate with ALB
Usage: cdk deploy -c region=ap-northeast-1 cdk-py-fargate-flask
'''
CdkPyFargateStack(app, "cdk-py-fargate-flask", env=AWS_ENV)


'''
Amaozn EKS cluster and nodegroup(s)
Usage: cdk deploy -c region=ap-northeast-1 cdk-py-eks-cluster
'''
CdkPyEksClusterStack(app, "cdk-py-eks-cluster", env=AWS_ENV)


'''
Serverless Rest API
Usage: cdk deploy -c region=ap-northeast-1 cdk-py-serverless-rest-api
'''
CdkPyServerlessRestApiStack(app, "cdk-py-serverless-rest-api", env=AWS_ENV)

'''
cross-stack demo
'''

infra_stack = CdkPyCrossStackInfraStack(app, "cdk-py-xstack-infra", env=AWS_ENV)
f1 = CdkPyCrossStackFargateStack(app, "cdk-py-xstack-fargate-svc1", env=AWS_ENV, vpc=infra_stack.vpc)
f2 = CdkPyCrossStackFargateStack2(app, "cdk-py-xstack-fargate-svc2",
                                  env=AWS_ENV,
                                  vpcId=core.Fn.import_value('ExportedVpcId')
                                  )


app.synth()
