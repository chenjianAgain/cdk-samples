# cdk-samples in TypeScript

A curated list of AWS CDK samples in **TypeScript**. Check [bin/cdk-samples.ts](bin/cdk-samples.ts) for all available samples and usage.

Make sure you run `npm install` to instrall required packages defined in `packages.json` and `npm run build` to compile typescript to javascript.

For example:

```bash
$ cd cdk-samples/typescript
# install the latest aws-cdk in typescript
$ npm i -g aws-cdk
# run 'cdk bootstrap' to generate the staging s3 bucket(only for the 1st time)
$ cdk bootstrap
# install all required packages
$ npm i
# compile typescript to javascript
$ npm run build  // alternatively you can open another terminal and run 'npm run watch'
# list all available stacks
$ cdk list
# Now you can 'cdk deploy' your favorite stack from the list
# e.g. cdk deploy -c region=ap-northeast-1 fargateAlbSvc
```




# Available Sample Libraries

- [x] **EcsEc2Service** Amazon ECS running with EC2
- [x] **FargateAlbService** - A simple PHP service running with AWS Fargate and ALB
- [x] **FargateCICD** - Building Fargate CI/CD pipelines from scratch with AWS CDK([README](./fargate-cicd/README.md))
- [x] **ServerlessRestAPI** - Serverless REST API with AWS Lambda in VPC and Amazon API Gateweway([tweet](https://twitter.com/pahudnet/status/1192283115793764352))
- [x] **fargateEventTarget** - Fargate as CloudWatch Events target 
- [x] **APISIX** - [APISIX refarch on AWS](apisix/README.md)([tweet](https://twitter.com/pahudnet/status/1187770945471049729)) 
- [x] **apiGatewayCustomDomain** API Gateway wildcard custom domain with ACM and Route53 sample([tweet](https://twitter.com/pahudnet/status/1186471121769525249))
- [x] **TranscribeStack** - Amazon Transcribe with Auto SRT generation refarch([tweet](https://twitter.com/pahudnet/status/1183307485035151360)|[tweet](https://twitter.com/pahudnet/status/1183607846425903104))
- [x] **LambdaRestApiStack** - API Gateway REST API with AWS Lambda as backend handler([tweet](https://twitter.com/pahudnet/status/1192283115793764352))
- [ ] **awsFireLensDemo** - [WIP] AWS Fargate with Firelens log driver
- [ ] **EksIrsaStack** Amazon EKS with IRSA support



# Available NPM Packages

The following samples were published in npmjs as a standalone package you may import as a CDK construct library. Most of them are still in a very early stage and not recommended for production.

- [x] **[@pahud/aws-serverless-patterns](packages/aws-serverless-patterns/)**  [![npm version](https://badge.fury.io/js/%40pahud%2Faws-serverless-patterns.svg)](https://badge.fury.io/js/%40pahud%2Faws-serverless-patterns)
- [x] **[@pahud/aws-codebuild-patterns](packages/aws-codebuild-patterns/)**  [![npm version](https://badge.fury.io/js/%40pahud%2Faws-codebuild-patterns.svg)](https://badge.fury.io/js/%40pahud%2Faws-codebuild-patterns)
- [x] **[@pahud/aws-fargate-cicd](packages/aws-fargate-cicd/)**  [![npm version](https://badge.fury.io/js/%40pahud%2Faws-fargate-cicd.svg)](https://badge.fury.io/js/%40pahud%2Faws-fargate-cicd)



