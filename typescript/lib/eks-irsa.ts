import cdk = require('@aws-cdk/core');
import eks = require('@aws-cdk/aws-eks');
import ec2 = require('@aws-cdk/aws-ec2');
import ecrAssets = require('@aws-cdk/aws-ecr-assets');
import path = require('path');

export class EksIrsaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // create a new VPC with single shared NAT gateway for cost saving
        // consider remove natGateways: 1 for your production
        const vpc = new ec2.Vpc(this, 'VPC', {
            natGateways: 1
        });

        const cluster = new eks.Cluster(this, 'EKSCluster', {
            clusterName: 'cdk-eks',
            defaultCapacity: 2,
            defaultCapacityInstance: new ec2.InstanceType('m5.large'),
            vpc: vpc
        });

        // create ECR image
        const image = new ecrAssets.DockerImageAsset(this, 'EcrImage', {
            directory: path.join(__dirname, '../../dockerAssets.d/irsa/docker.d')
        })

        const sa = 'my-serviceaccount'

        const appLabel = { app: "irsa-awscli-demo" };

        const deployment = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: { name: "irsa-awscli-demo" },
            spec: {
                replicas: 1,
                selector: { matchLabels: appLabel },
                template: {
                    metadata: { labels: appLabel },
                    spec: {
                        serviceAccountName: sa,
                        containers: [
                            {
                                name: "irsa-awscli-demo",
                                image: `${image.imageUri}`,
                                command: [
                                    "sh",
                                    "-c",
                                    "aws sts get-caller-identity"
                                ],
                                env: [
                                    {
                                        name: "AWS_DEFAULT_REGION",
                                        value: `${this.region}`,
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        };

        cluster.addResource('irsa-demo', deployment);

        new cdk.CfnOutput(this, 'EcrRepositoryUri', {
            value: image.imageUri
        })
    }
}

