[![npm version](https://badge.fury.io/js/%40pahud%2Faws-fargate-cicd.svg)](https://badge.fury.io/js/%40pahud%2Faws-fargate-cicd)

# Generate Fargate CI/CD pipeline from any given source repo with AWS CDK

This CDK construct library helps you generate a complete Fargate CI/CD pipeline with a provided source repository such as Github, BitBucket or CodeCommit.

On git push to the source repo, AWS CodeBuild will be triggered by webhook, building new docker images, pushing to ECR and ECR event triggers the `AWS CodePipeline` to begin the Fargate service rolling update.

All you need to do is specify your source repo in this construct library.

![](https://raw.githubusercontent.com/pahud/cdk-samples/master/typescript/aws-fargate-cicd/images/fargate-cicd-cdk.png)



## Example


```js
/**
* import from local
* import fg = require('../lib/fargate-cicd');
**/
import fg = require('@pahud/aws-fargate-cicd');
import cdk = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');

const app = new cdk.App()

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

new fg.FargateCICD(app, 'FargateSampleStack', {
  env,
  defaultVpc: true,
  source: codebuild.Source.bitBucket({
    owner: 'pahud',
    repo: 'express',
    webhook: true,
    webhookFilters: [
      codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('master'),
    ],
  })
})
```

