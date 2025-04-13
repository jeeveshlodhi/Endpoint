import React from 'react';
import { Input } from '@/components/shared/shadcn-components/input';
import { Label } from '@/components/shared/shadcn-components/label';

interface DigestAuthFormProps {
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
}

const DigestAuthForm: React.FC<DigestAuthFormProps> = ({ username, password, setUsername, setPassword }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="digest-username">Username</Label>
                <Input
                    id="digest-username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </div>
            <div>
                <Label htmlFor="digest-password">Password</Label>
                <Input
                    id="digest-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
            </div>
            <div className="text-sm text-gray-500">
                Digest authentication is similar to Basic Authentication but provides improved security as the password
                is not sent in plain text over the network.
            </div>
        </div>
    );
};

export default DigestAuthForm;
