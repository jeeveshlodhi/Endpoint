import React from 'react';
import { Input } from '@/components/shared/shadcn-components/input';
import { Label } from '@/components/shared/shadcn-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/shadcn-components/select';

interface AwsAuthFormProps {
    aws: {
        accessKey: string;
        secretKey: string;
        region: string;
        service: string;
        sessionToken?: string;
        signatureVersion: string;
    };
    setAws: (aws: any) => void;
}

const AwsAuthForm: React.FC<AwsAuthFormProps> = ({ aws, setAws }) => {
    const updateField = (field: string, value: any) => {
        setAws({ ...aws, [field]: value });
    };

    const regions = [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ca-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'eu-central-1',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-northeast-3',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-south-1',
        'sa-east-1',
    ];

    const services = ['s3', 'ec2', 'dynamodb', 'lambda', 'sns', 'sqs', 'iam', 'cloudwatch', 'cloudfront', 'route53'];

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                    id="accessKey"
                    value={aws.accessKey}
                    onChange={e => updateField('accessKey', e.target.value)}
                    placeholder="AWS access key ID"
                />
            </div>

            <div>
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                    id="secretKey"
                    type="password"
                    value={aws.secretKey}
                    onChange={e => updateField('secretKey', e.target.value)}
                    placeholder="AWS secret access key"
                />
            </div>

            <div>
                <Label htmlFor="region">Region</Label>
                <Select value={aws.region} onValueChange={value => updateField('region', value)}>
                    <SelectTrigger id="region">
                        <SelectValue placeholder="Select AWS region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regions.map(region => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="service">Service</Label>
                <Select value={aws.service} onValueChange={value => updateField('service', value)}>
                    <SelectTrigger id="service">
                        <SelectValue placeholder="Select AWS service" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map(service => (
                            <SelectItem key={service} value={service}>
                                {service}
                            </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {aws.service === 'custom' && (
                <div>
                    <Label htmlFor="customService">Custom Service</Label>
                    <Input
                        id="customService"
                        value={aws.service}
                        onChange={e => updateField('service', e.target.value)}
                        placeholder="Enter AWS service name"
                    />
                </div>
            )}

            <div>
                <Label htmlFor="sessionToken">Session Token (Optional)</Label>
                <Input
                    id="sessionToken"
                    value={aws.sessionToken || ''}
                    onChange={e => updateField('sessionToken', e.target.value)}
                    placeholder="AWS session token (for temporary credentials)"
                />
            </div>

            <div>
                <Label htmlFor="signatureVersion">Signature Version</Label>
                <Select value={aws.signatureVersion} onValueChange={value => updateField('signatureVersion', value)}>
                    <SelectTrigger id="signatureVersion">
                        <SelectValue placeholder="Select signature version" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="v4">AWS Signature v4</SelectItem>
                        <SelectItem value="v2">AWS Signature v2 (Legacy)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-gray-500">
                AWS Signature authentication uses your AWS credentials to sign requests according to the AWS Signature
                protocol. Be careful with your AWS credentials.
            </div>
        </div>
    );
};

export default AwsAuthForm;
