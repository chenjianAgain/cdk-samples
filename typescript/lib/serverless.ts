import cdk = require('@aws-cdk/core');
import { Function, Code, Runtime, Tracing } from '@aws-cdk/aws-lambda';
import path = require('path');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';

export class ServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    })

    const backend = new Function(this, 'Func', {
      code: Code.fromAsset(path.join(__dirname, '../function/hello-world')),
      handler: 'lambda_function.handler',
      runtime: Runtime.PYTHON_3_7,
      tracing: Tracing.ACTIVE,
      memorySize: 1024,
      vpc: vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE
      }
    })

    const api = new apigateway.LambdaRestApi(this, 'RestApi', {
      handler: backend
    })
  }
}

