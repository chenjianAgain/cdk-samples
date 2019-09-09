#!/usr/bin/env python3

import os
from aws_cdk import core
from aws_cdk.core import Stack, Construct, Environment
from cdk_py_samples.fargate_flask_stack import CdkPyFargateStack
# from cdk_py_samples.amazon_eks_stack import CdkPyEksStack


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
Usage: cdk deploy -c region=ap-northeast-1 cdk-py-eks
'''
# eks_demo = CdkPyEksStack(app, "cdk-py-eks", env=AWS_ENV)


app.synth()
