import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApiKeyAuthFormProps {
    apiKey: string;
    apiKeyLocation: string;
    apiKeyName: string;
    setApiKey: (key: string) => void;
    setApiKeyLocation: (location: string) => void;
    setApiKeyName: (name: string) => void;
}

const ApiKeyAuthForm: React.FC<ApiKeyAuthFormProps> = ({
    apiKey,
    apiKeyLocation,
    apiKeyName,
    setApiKey,
    setApiKeyLocation,
    setApiKeyName,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <Label>Key</Label>
                <Input placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            <div>
                <Label>Add to</Label>
                <Select value={apiKeyLocation} onValueChange={value => setApiKeyLocation(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="query">Query Params</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Key Name</Label>
                <Input placeholder="Key name" value={apiKeyName} onChange={e => setApiKeyName(e.target.value)} />
            </div>
        </div>
    );
};

export default ApiKeyAuthForm;
