import cdk = require('@aws-cdk/core');
import serverless = require('../lib/lambda');

const app = new cdk.App()

new serverless.LambdaRestApi(app, 'Api');