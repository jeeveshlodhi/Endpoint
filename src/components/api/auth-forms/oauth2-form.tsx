import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface OAuth2FormProps {
    oauth: {
        grantType: string;
        clientId: string;
        clientSecret: string;
        accessTokenUrl: string;
        authUrl: string;
        redirectUrl: string;
        scope: string;
        state: string;
        accessToken: string;
        refreshToken: string;
        addTokenToRequest: boolean;
    };
    setOauth: (oauth: any) => void;
}

const OAuth2Form: React.FC<OAuth2FormProps> = ({ oauth, setOauth }) => {
    const updateField = (field: string, value: any) => {
        setOauth({ ...oauth, [field]: value });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="grantType">Grant Type</Label>
                <Select value={oauth.grantType} onValueChange={value => updateField('grantType', value)}>
                    <SelectTrigger id="grantType">
                        <SelectValue placeholder="Select grant type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="authorization_code">Authorization Code</SelectItem>
                        <SelectItem value="client_credentials">Client Credentials</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="implicit">Implicit</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="accessTokenUrl">Access Token URL</Label>
                <Input
                    id="accessTokenUrl"
                    value={oauth.accessTokenUrl}
                    onChange={e => updateField('accessTokenUrl', e.target.value)}
                    placeholder="https://example.com/oauth/token"
                />
            </div>

            <div>
                <Label htmlFor="authUrl">Authorization URL</Label>
                <Input
                    id="authUrl"
                    value={oauth.authUrl}
                    onChange={e => updateField('authUrl', e.target.value)}
                    placeholder="https://example.com/oauth/authorize"
                />
            </div>

            <div>
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                    id="clientId"
                    value={oauth.clientId}
                    onChange={e => updateField('clientId', e.target.value)}
                    placeholder="Enter client ID"
                />
            </div>

            <div>
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                    id="clientSecret"
                    type="password"
                    value={oauth.clientSecret}
                    onChange={e => updateField('clientSecret', e.target.value)}
                    placeholder="Enter client secret"
                />
            </div>

            <div>
                <Label htmlFor="scope">Scope</Label>
                <Input
                    id="scope"
                    value={oauth.scope}
                    onChange={e => updateField('scope', e.target.value)}
                    placeholder="read write"
                />
            </div>

            <div>
                <Label htmlFor="state">State</Label>
                <Input
                    id="state"
                    value={oauth.state}
                    onChange={e => updateField('state', e.target.value)}
                    placeholder="Optional state parameter"
                />
            </div>

            <div>
                <Label htmlFor="redirectUrl">Redirect URL</Label>
                <Input
                    id="redirectUrl"
                    value={oauth.redirectUrl}
                    onChange={e => updateField('redirectUrl', e.target.value)}
                    placeholder="https://callback.example.com"
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="addTokenToRequest"
                    checked={oauth.addTokenToRequest}
                    onCheckedChange={checked => updateField('addTokenToRequest', checked)}
                />
                <Label htmlFor="addTokenToRequest">Add access token to request</Label>
            </div>

            <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                    id="accessToken"
                    value={oauth.accessToken}
                    onChange={e => updateField('accessToken', e.target.value)}
                    placeholder="Existing access token (if any)"
                />
            </div>

            <div>
                <Label htmlFor="refreshToken">Refresh Token</Label>
                <Input
                    id="refreshToken"
                    value={oauth.refreshToken}
                    onChange={e => updateField('refreshToken', e.target.value)}
                    placeholder="Existing refresh token (if any)"
                />
            </div>

            <Button type="button">Get New Access Token</Button>
        </div>
    );
};

export default OAuth2Form;
