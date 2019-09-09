import cdk = require('@aws-cdk/core');
import targets = require('@aws-cdk/aws-events-targets');
import events = require('@aws-cdk/aws-events');
import { TaskDefinition, Compatibility, ContainerImage, NetworkMode, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster } from '@aws-cdk/aws-ecs';
import { Topic } from '@aws-cdk/aws-sns';


export interface FargateEventTargetProps extends cdk.StackProps {
    topicArn: string
}


export class FargateEventTarget extends cdk.Stack {
    public readonly topicArn: string
    constructor(scope: cdk.Construct, id: string, props: FargateEventTargetProps) {
        super(scope, id, props);

        this.topicArn = props.topicArn

        const vpc = Vpc.fromLookup(this, 'DefaultVPC', {
            isDefault: true
        })

        const cluster = new Cluster(this, 'EcsCluster', {
            vpc: vpc,
        })

        const ecsTask = new TaskDefinition(this, 'EcsTask', {
            networkMode: NetworkMode.AWS_VPC,
            compatibility: Compatibility.FARGATE,
            cpu: '512',
            memoryMiB: '1024',

        })

        ecsTask.addContainer('snsPublisher', {
            image: ContainerImage.fromRegistry('pahud/awscli:with-bash'),
            command: ['aws sns publish --topic-arn $TOPIC_ARN --message "Hello CDK!"'],
            entryPoint: ['bash', '-c'],
            memoryLimitMiB: 1024,
            logging: new AwsLogDriver({
                streamPrefix: 'snsPublisher'
            }),
            environment: {
                'TOPIC_ARN': this.topicArn,
                'AWS_DEFAULT_REGION': `${this.region}`,
                'AWS_REGION': `${this.region}`
            }
        })

        const topic = Topic.fromTopicArn(this, 'Topic', this.topicArn)
        topic.grantPublish(ecsTask.taskRole)

        const everyMinute = new events.Rule(this, 'ScheduledEvents', {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
        })

        const eventTarget = new targets.EcsTask({
            taskDefinition: ecsTask,
            cluster: cluster,
        })

        everyMinute.addTarget(eventTarget)
    }
}