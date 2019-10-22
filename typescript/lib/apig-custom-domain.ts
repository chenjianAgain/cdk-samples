import cdk = require('@aws-cdk/core');
import apigw = require('@aws-cdk/aws-apigateway');
import route53 = require('@aws-cdk/aws-route53');
import route53_targets = require('@aws-cdk/aws-route53-targets');
import acm = require('@aws-cdk/aws-certificatemanager');
import lambda = require('@aws-cdk/aws-lambda');

export class ApiGatewayCustomDomainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'pahud.dev',
      privateZone: false
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'TestCertificate', {
      domainName: '*.gateway.pahud.dev',
      hostedZone,
    });

    const handler = new lambda.Function(this, 'MyFunc', {
      code: new lambda.InlineCode(`
import json

def lambda_handler(event, context):
  return {
    'statusCode': '200',
    'body': json.dumps(event),
    'headers': {
        'Content-Type': 'application/json',
    }
  }
      `),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.lambda_handler'
    })

    const api = new apigw.LambdaRestApi(this, 'myapi', {
      handler,
      domainName: {
        certificate,
        domainName: '*.gateway.pahud.dev',
      }
    });

    new route53.ARecord(this, 'CustomDomainAliasRecord', {
      recordName: '*.gateway.pahud.dev',
      zone: route53.HostedZone.fromLookup(this, 'MyHostedZone', {
        domainName: 'pahud.dev'
      }),
      target: route53.AddressRecordTarget.fromAlias(new route53_targets.ApiGateway(api))
    });

  }
}

