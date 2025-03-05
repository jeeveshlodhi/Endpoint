import React, { useState } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Code from '@tiptap/extension-code';
import { Trash2 } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const ApiClient: React.FC = () => {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('');
    const [responseType, setResponseType] = useState<'text' | 'json' | 'html'>('json');

    // Auth states
    const [authType, setAuthType] = useState('no-auth');

    // Bearer Token
    const [bearerToken, setBearerToken] = useState('');

    // Basic Auth
    const [basicUsername, setBasicUsername] = useState('');
    const [basicPassword, setBasicPassword] = useState('');

    // API Key
    const [apiKey, setApiKey] = useState('');
    const [apiKeyLocation, setApiKeyLocation] = useState('header');
    const [apiKeyName, setApiKeyName] = useState('');

    // OAuth 2.0
    const [oauthGrantType, setOauthGrantType] = useState('authorization_code');
    const [accessTokenUrl, setAccessTokenUrl] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [scope, setScope] = useState('');

    // Digest Auth
    const [digestUsername, setDigestUsername] = useState('');
    const [digestPassword, setDigestPassword] = useState('');

    // AWS Signature
    const [awsAccessKey, setAwsAccessKey] = useState('');
    const [awsSecretKey, setAwsSecretKey] = useState('');
    const [awsRegion, setAwsRegion] = useState('');
    const [awsService, setAwsService] = useState('');

    const [params, setParams] = useState<{ key: string; value: string; description: string; checked: boolean }[]>([
        { key: '', value: '', description: '', checked: false },
    ]);
    const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
    const bodyEditor = useEditor({
        extensions: [StarterKit, Code],
        content: `
                <p>This isn’t code.</p>
                <p><code>This is code.</code></p>
              `,
    });
    const responseEditor = useEditor({
        extensions: [StarterKit],
        content: '',
        editable: false,
    });

    const handleSendRequest = async () => {
        try {
            // Get body content as HTML or JSON depending on context
            let authHeaders = {};
            switch (authType) {
                case 'bearer':
                    authHeaders = { Authorization: `Bearer ${bearerToken}` };
                    break;
                case 'basic':
                    const basicAuth = btoa(`${basicUsername}:${basicPassword}`);
                    authHeaders = { Authorization: `Basic ${basicAuth}` };
                    break;
                case 'api-key':
                    if (apiKeyLocation === 'header') {
                        authHeaders = { [apiKeyName]: apiKey };
                    }
                    // Handle query params case in the params object
                    break;
                // Add other auth types as needed
            }
            const bodyContent = bodyEditor?.getHTML() || '';

            const config = {
                method,
                url,
                headers: {
                    ...headers.reduce(
                        (acc, { key, value }) => {
                            if (key) acc[key] = value;
                            return acc;
                        },
                        {} as Record<string, string>,
                    ),
                    ...authHeaders,
                },
                params: params.reduce(
                    (acc, { key, value }) => {
                        if (key) acc[key] = value;
                        return acc;
                    },
                    {} as Record<string, string>,
                ),
                data: bodyContent,
            };

            const res = await axios(config);

            // Format response based on selected type
            let formattedResponse = '';
            switch (responseType) {
                case 'json':
                    formattedResponse = JSON.stringify(res.data, null, 2);
                    break;
                case 'html':
                    formattedResponse = res.data;
                    break;
                default:
                    formattedResponse = res.data.toString();
            }

            // Update response editor
            responseEditor?.commands.setContent(formattedResponse);
        } catch (error) {
            // Handle error
            responseEditor?.commands.setContent(JSON.stringify(error, null, 2));
        }
    };

    const deleteParam = (index: number) => {
        if (
            index === params.length - 1 ||
            (params[index].key === '' && params[index].value === '' && params[index].description === '')
        ) {
            return;
        }
        const newParams = params.filter((_, i) => i !== index);
        setParams(newParams);
    };

    const updateParam = (index: number, field: 'key' | 'value' | 'description', value: string) => {
        const newParams = [...params];
        if (newParams.length === index + 1) {
            newParams.push({ key: '', value: '', description: '', checked: false });
        }
        newParams[index][field] = value;
        setParams(newParams);
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    return (
        <div className="w-full p-4">
            <div className="flex-row items-center justify-between">
                <div className="flex items-center space-x-2 py-2">
                    <Select value={method} onValueChange={value => setMethod(value as HttpMethod)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Enter request URL"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleSendRequest}>Send</Button>
                </div>
            </div>

            <Tabs defaultValue="params">
                <TabsList className="grid w-full grid-cols-6 max-w-2xl">
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="authorization">Authorization</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="params">
                    <h2 className="text-sm font-medium">Query params</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {params.map((param, index) => (
                                <TableRow key={index} className="relative">
                                    <TableCell>
                                        <Checkbox
                                            checked={!!(param.key || param.value || param.description)}
                                            disabled={!(param.key || param.value || param.description)}
                                            onCheckedChange={(checked: boolean) => {
                                                const newParams = [...params];
                                                newParams[index].checked = checked;
                                                setParams(newParams);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={param.key}
                                            onChange={e => updateParam(index, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent focus:border-transparent"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={param.value}
                                            onChange={e => updateParam(index, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center w-full">
                                            <Input
                                                value={param.description}
                                                onChange={e => updateParam(index, 'description', e.target.value)}
                                                placeholder="Description"
                                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent flex-1"
                                            />
                                            <Button
                                                className="text-black hover:text-white bg-white hover:bg-black ml-auto"
                                                onClick={() => deleteParam(index)}
                                                style={{
                                                    display:
                                                        index === params.length - 1 &&
                                                        !param.key &&
                                                        !param.value &&
                                                        !param.description
                                                            ? 'none'
                                                            : 'flex',
                                                }}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="authorization">
                    <div className="w-full grid grid-cols-5 ">
                        <div className="p-2 col-span-1 border-r-2 border-zinc-200 ">
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
                                <div className="text-sm text-gray-500">
                                    No authentication will be used for this request.
                                </div>
                            )}

                            {/* Bearer Token */}
                            {authType === 'bearer' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Token</Label>
                                        <Input
                                            placeholder="Enter token"
                                            value={bearerToken}
                                            onChange={e => setBearerToken(e.target.value)}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        The token will be sent as: Authorization: Bearer {bearerToken}
                                    </div>
                                </div>
                            )}

                            {/* Basic Auth */}
                            {authType === 'basic' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Username</Label>
                                        <Input
                                            placeholder="Username"
                                            value={basicUsername}
                                            onChange={e => setBasicUsername(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={basicPassword}
                                            onChange={e => setBasicPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* API Key */}
                            {authType === 'api-key' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Key</Label>
                                        <Input
                                            placeholder="API Key"
                                            value={apiKey}
                                            onChange={e => setApiKey(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Add to</Label>
                                        <Select
                                            value={apiKeyLocation}
                                            onValueChange={value => setApiKeyLocation(value)}
                                        >
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
                                        <Input
                                            placeholder="Key name"
                                            value={apiKeyName}
                                            onChange={e => setApiKeyName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* OAuth 2.0 */}
                            {authType === 'oauth2' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Grant Type</Label>
                                        <Select
                                            value={oauthGrantType}
                                            onValueChange={value => setOauthGrantType(value)}
                                        >
                                            <SelectTrigger>
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
                                        <Label>Access Token URL</Label>
                                        <Input
                                            placeholder="https://api.example.com/oauth/token"
                                            value={accessTokenUrl}
                                            onChange={e => setAccessTokenUrl(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Client ID</Label>
                                        <Input
                                            placeholder="Client ID"
                                            value={clientId}
                                            onChange={e => setClientId(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Client Secret</Label>
                                        <Input
                                            type="password"
                                            placeholder="Client Secret"
                                            value={clientSecret}
                                            onChange={e => setClientSecret(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Scope</Label>
                                        <Input
                                            placeholder="read write"
                                            value={scope}
                                            onChange={e => setScope(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Digest Auth */}
                            {authType === 'digest' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Username</Label>
                                        <Input
                                            placeholder="Username"
                                            value={digestUsername}
                                            onChange={e => setDigestUsername(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={digestPassword}
                                            onChange={e => setDigestPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* AWS Signature */}
                            {authType === 'aws' && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Access Key</Label>
                                        <Input
                                            placeholder="AWS Access Key"
                                            value={awsAccessKey}
                                            onChange={e => setAwsAccessKey(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Secret Key</Label>
                                        <Input
                                            type="password"
                                            placeholder="AWS Secret Key"
                                            value={awsSecretKey}
                                            onChange={e => setAwsSecretKey(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Region</Label>
                                        <Input
                                            placeholder="us-east-1"
                                            value={awsRegion}
                                            onChange={e => setAwsRegion(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Service</Label>
                                        <Input
                                            placeholder="s3"
                                            value={awsService}
                                            onChange={e => setAwsService(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="headers">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {headers.map((header, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={header.key}
                                            onChange={e => updateHeader(index, 'key', e.target.value)}
                                            placeholder="Key"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={header.value}
                                            onChange={e => updateHeader(index, 'value', e.target.value)}
                                            placeholder="Value"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Button variant="outline" onClick={addHeader}>
                                        Add Header
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="body">
                    <EditorContent editor={bodyEditor} className="min-h-[200px] border p-2 rounded" />
                </TabsContent>

                <TabsContent value="scripts">
                    <Textarea placeholder="Pre-request and test scripts" className="h-40" />
                </TabsContent>

                <TabsContent value="settings">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="follow-redirects" />
                        <Label htmlFor="follow-redirects">Follow Redirects</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="save-cookies" />
                        <Label htmlFor="save-cookies">Save Cookies</Label>
                    </div>
                </TabsContent>
            </Tabs>
            <div>
                <p>Response </p>
            </div>
            <EditorContent editor={responseEditor} className="min-h-[300px] border p-2 rounded" />
        </div>
    );
};

export default ApiClient;
