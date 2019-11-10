import cdk = require('@aws-cdk/core');
import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');
import codebuild = require('@aws-cdk/aws-codebuild');
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');

const NAME_PREFIX = 'autobuild'

export interface ScheduledBuildProps extends cdk.StackProps {
  source?: codebuild.ISource
  schedule?: events.Schedule
  repositoryName?: string
}

export class ScheduledBuild extends cdk.Stack {
  readonly ecrRepository: ecr.Repository
  readonly source: codebuild.ISource
  readonly schedule: events.Schedule

  constructor(scope: cdk.Construct, id: string, props: ScheduledBuildProps) {
    super(scope, id, props);
    this.ecrRepository = new ecr.Repository(this, 'Repository', {
      repositoryName: props.repositoryName === undefined ? `${NAME_PREFIX}-${this.stackName.toLowerCase()}` : props.repositoryName,
    });

    const buildRole = new iam.Role(this, 'CodeBuildIamRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
    })
    buildRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecr:GetAuthorizationToken']
    }));

    buildRole.addToPolicy(new iam.PolicyStatement({
      resources: [`${this.ecrRepository.repositoryArn}*`],
      actions: ['ecr:*']
    }));

    this.ecrRepository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });

    this.source = props.source === undefined ?
      codebuild.Source.gitHub({
        owner: 'aws',
        repo: 'aws-cdk'
      }) : props.source

    const rule = new events.Rule(this, 'Rule', {
      schedule: props.schedule == undefined ? events.Schedule.rate(cdk.Duration.days(1)) : props.schedule,
    })


    const project = new codebuild.Project(this, 'CodeBuildProject', {
      role: buildRole,
      source: this.source,
      // Enable Docker AND custom caching
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.CUSTOM),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              docker: 18
            }
          },
          build: {
            commands: [
              'TAG=${CODEBUILD_RESOLVED_SOURCE_VERSION}',
              'LATEST="latest"',
              'echo "Building image now"',
              `docker build -t ${this.ecrRepository.repositoryUri}:$LATEST .`,
              `docker tag ${this.ecrRepository.repositoryUri}:$LATEST ${this.ecrRepository.repositoryUri}:$TAG`,
              'echo "ECR login now"',
              '$(aws ecr get-login --no-include-email)',
              'echo "Pushing to ECR now"',
              `docker push ${this.ecrRepository.repositoryUri}:$TAG`,
              `docker push ${this.ecrRepository.repositoryUri}:$LATEST`,
            ]
          }
        }
      })
    });

    rule.addTarget(new targets.CodeBuildProject(project));
  }
}