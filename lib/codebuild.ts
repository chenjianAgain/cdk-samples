import cdk = require('@aws-cdk/core');
import { Repository } from '@aws-cdk/aws-ecr';
import iam = require('@aws-cdk/aws-iam');
import codebuild = require('@aws-cdk/aws-codebuild');

const DOCKER_IMAGE_NAME = 'cdk-codebuild-sample-php'

export class CodebuildStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const repository = new Repository(this, 'Repository', {
            repositoryName: DOCKER_IMAGE_NAME,
        });

        const buildRole = new iam.Role(this, 'CodeBuildIamRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
        })
        buildRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['ecr:GetAuthorizationToken']
        }));

        buildRole.addToPolicy(new iam.PolicyStatement({
            resources: [`${repository.repositoryArn}*`],
            actions: ['ecr:*']
        }));

        // ECR Lifecycles
        // repository.addLifecycleRule({ tagPrefixList: ['prod'], maxImageCount: 9999 });
        repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });

        const bbSource = codebuild.Source.bitBucket({
            owner: 'pahud',
            repo: 'caddy',
            webhook: true,
            webhookFilters: [
                codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('master'),
            ],
        });

        new codebuild.Project(this, 'CodeBuildProject', {
            role: buildRole,
            source: bbSource,
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
                            'echo "Building image now"',
                            `docker build -t ${repository.repositoryUri}:$TAG .`,
                            'echo "ECR login now"',
                            '$(aws ecr get-login --no-include-email)',
                            'echo "Pushing to ECR now"',
                            `docker push ${repository.repositoryUri}:$TAG`
                        ]
                    }
                }
            })
        });
    }
}