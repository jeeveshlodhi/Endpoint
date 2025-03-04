import React, { useState } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './api/tiptap-editor';
import Code from '@tiptap/extension-code';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const ApiClient: React.FC = () => {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('');
    const [responseType, setResponseType] = useState<'text' | 'json' | 'html'>('json');
    const [params, setParams] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
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
            const bodyContent = bodyEditor?.getHTML() || '';

            const config = {
                method,
                url,
                headers: headers.reduce(
                    (acc, { key, value }) => {
                        if (key) acc[key] = value;
                        return acc;
                    },
                    {} as Record<string, string>,
                ),
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

    const addParam = () => {
        setParams([...params, { key: '', value: '' }]);
    };

    const updateParam = (index: number, field: 'key' | 'value', value: string) => {
        const newParams = [...params];
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
        <div className="w-full mx-auto">
            <div className="flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2 p-4">
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
                <TabsList className="grid w-full grid-cols-6 max-w-5xl">
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="authorization">Authorization</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="params">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {params.map((param, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={param.key}
                                            onChange={e => updateParam(index, 'key', e.target.value)}
                                            placeholder="Key"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={param.value}
                                            onChange={e => updateParam(index, 'value', e.target.value)}
                                            placeholder="Value"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Button variant="outline" onClick={addParam}>
                                        Add Param
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="authorization">
                    <div className="p-4">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Authorization Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-auth">No Auth</SelectItem>
                                <SelectItem value="bearer">Bearer Token</SelectItem>
                                <SelectItem value="basic">Basic Auth</SelectItem>
                            </SelectContent>
                        </Select>
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
