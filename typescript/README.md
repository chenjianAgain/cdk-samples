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




# Available Samples

- [x] **fargateAlbSvc** - A simple PHP service running with AWS Fargate and ALB
- [x] **fargatecicd** - Building Fargate CI/CD pipelines from scratch with AWS CDK([README](./fargate-cicd/README.md))
- [x] **fargateEventTarget** - Fargate as CloudWatch Events target 
- [x] **serverlessRestApi** - Serverless REST API with AWS Lambda in VPC and Amazon API Gateway
- [ ] **awsFireLensDemo** - [WIP] AWS Fargate with Firelens log driver



