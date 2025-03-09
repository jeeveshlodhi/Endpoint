import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BearerAuthForm from './auth-forms/bearer-auth-form';
import BasicAuthForm from './auth-forms/basic-auth-form';
import ApiKeyAuthForm from './auth-forms/apikey-auth-form';
import OAuth2Form from './auth-forms/oauth2-form';
import DigestAuthForm from './auth-forms/digest-auth-form';
import AwsAuthForm from './auth-forms/aws-auth-form';

interface AuthorizationProps {
    authType: string;
    setAuthType: React.Dispatch<React.SetStateAction<string>>;
    authConfig: any;
    setAuthConfig: React.Dispatch<React.SetStateAction<any>>;
}

const Authorization: React.FC<AuthorizationProps> = ({ authType, setAuthType, authConfig, setAuthConfig }) => {
    const updateAuthConfig = (key: string, value: any) => {
        setAuthConfig({
            ...authConfig,
            [key]: value,
        });
    };

    return (
        <div className="w-full grid grid-cols-5">
            <div className="p-2 col-span-1 border-r-2 border-zinc-200">
                <h2>Auth Type</h2>
                <Select value={authType} onValueChange={setAuthType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Authorization Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no-auth">No Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="api-key">API Key</SelectItem>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        <SelectItem value="digest">Digest Auth</SelectItem>
                        <SelectItem value="hawk">Hawk Authentication</SelectItem>
                        <SelectItem value="aws">AWS Signature</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="p-4 col-span-4">
                {authType === 'no-auth' && (
                    <div className="text-sm text-gray-500">No authentication will be used for this request.</div>
                )}

                {authType === 'bearer' && (
                    <BearerAuthForm
                        token={authConfig.bearerToken}
                        setToken={token => updateAuthConfig('bearerToken', token)}
                    />
                )}

                {authType === 'basic' && (
                    <BasicAuthForm
                        username={authConfig.basicAuth.username}
                        password={authConfig.basicAuth.password}
                        setUsername={username => updateAuthConfig('basicAuth', { ...authConfig.basicAuth, username })}
                        setPassword={password => updateAuthConfig('basicAuth', { ...authConfig.basicAuth, password })}
                    />
                )}

                {authType === 'api-key' && (
                    <ApiKeyAuthForm
                        apiKey={authConfig.apiKey.key}
                        apiKeyLocation={authConfig.apiKey.location}
                        apiKeyName={authConfig.apiKey.name}
                        setApiKey={key => updateAuthConfig('apiKey', { ...authConfig.apiKey, key })}
                        setApiKeyLocation={location => updateAuthConfig('apiKey', { ...authConfig.apiKey, location })}
                        setApiKeyName={name => updateAuthConfig('apiKey', { ...authConfig.apiKey, name })}
                    />
                )}

                {authType === 'oauth2' && (
                    <OAuth2Form oauth={authConfig.oauth2} setOauth={oauth => updateAuthConfig('oauth2', oauth)} />
                )}

                {authType === 'digest' && (
                    <DigestAuthForm
                        username={authConfig.digestAuth.username}
                        password={authConfig.digestAuth.password}
                        setUsername={username => updateAuthConfig('digestAuth', { ...authConfig.digestAuth, username })}
                        setPassword={password => updateAuthConfig('digestAuth', { ...authConfig.digestAuth, password })}
                    />
                )}

                {authType === 'aws' && (
                    <AwsAuthForm aws={authConfig.awsAuth} setAws={aws => updateAuthConfig('awsAuth', aws)} />
                )}
            </div>
        </div>
    );
};

export default Authorization;
