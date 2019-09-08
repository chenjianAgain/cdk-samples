# Building Fargate CI/CD pipelines from scratch with AWS CDK

On git pushes to BitBucket, AWS CodeBuild being triggered by webhook, building new docker images, pushing to ECR the ECR event triggers the AWS CodePipeline to start the Fargate service rolling update.

![](images/fargate-cicd-cdk.png)



## Sample Code

Check the [sample code](https://github.com/pahud/cdk-samples/blob/master/lib/fargate-cicd.ts) 



## Tweets

tweets([1](https://twitter.com/pahudnet/status/1162626512064897024) and [2](https://twitter.com/pahudnet/status/1162970527989825536)).
