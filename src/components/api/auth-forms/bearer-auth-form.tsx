import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BearerAuthFormProps {
    token: string;
    setToken: (token: string) => void;
}

const BearerAuthForm: React.FC<BearerAuthFormProps> = ({ token, setToken }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label>Token</Label>
                <Input placeholder="Enter token" value={token} onChange={e => setToken(e.target.value)} />
            </div>
            <div className="text-sm text-gray-500">The token will be sent as: Authorization: Bearer {token}</div>
        </div>
    );
};

export default BearerAuthForm;
