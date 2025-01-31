
[![npm version](https://badge.fury.io/js/%40pahud%2Faws-codebuild-patterns.svg)](https://badge.fury.io/js/%40pahud%2Faws-codebuild-patterns)

# @pahud/aws-codebuild-patterns

This package helps you build a automated `AWS CodeBuild` project with `AWS CDK` that builds any public git repository containing the `Dockerfile`, tags the image and eventually pushes to a seperate `Amazon ECR` repository.


In the example below, we build the Amazon Linux docker image from the `Dockerfile` at https://github.com/pahud/amazonlinux-docker-autobuild in the daily basis.

```js
import cdk = require('@aws-cdk/core');
import { ScheduledDockderBuild } from '@pahud/aws-codebuild-patterns'
import codebuild = require('@aws-cdk/aws-codebuild');
import events = require('@aws-cdk/aws-events');

const app = new cdk.App();

const build = new ScheduledDockerBuild(app, 'ScheduledBuild', {
  source: codebuild.Source.gitHub({
    owner: 'pahud',
    repo: 'amazonlinux-docker-autobuild'
  }),
  schedule: events.Schedule.rate(cdk.Duration.days(1)),
  repositoryName: 'amazonlinux-autobuild'
})
```
