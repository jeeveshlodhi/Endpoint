import React from 'react';
import { Input } from '@/components/shared/shadcn-components/input';
import { Label } from '@/components/shared/shadcn-components/label';

interface BasicAuthFormProps {
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
}

const BasicAuthForm: React.FC<BasicAuthFormProps> = ({ username, password, setUsername, setPassword }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label>Username</Label>
                <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <Label>Password</Label>
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
        </div>
    );
};

export default BasicAuthForm;
