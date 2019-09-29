import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

export class VpcStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // use default VPC
        const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

        // or create a new one with single NAT for cost saving
        const newVpc = new ec2.Vpc(this, 'NewVpc', {
            maxAzs: 3,
            natGateways: 1
        })
    }
}