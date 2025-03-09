import React, { useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Code from '@tiptap/extension-code';
import RequestBar from './api/request-bar';
import RequestTabs from './api/request-tabs';
import ResponsePanel from './api/response-panel';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const ApiClient: React.FC = () => {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('');

    // Auth states
    const [authType, setAuthType] = useState('no-auth');
    const [authConfig, setAuthConfig] = useState({
        bearerToken: '',
        basicAuth: { username: '', password: '' },
        apiKey: { key: '', location: 'header', name: '' },
        oauth2: { grantType: 'authorization_code', accessTokenUrl: '', clientId: '', clientSecret: '', scope: '' },
        digestAuth: { username: '', password: '' },
        awsAuth: { accessKey: '', secretKey: '', region: '', service: '' },
    });

    // Request params states
    const [params, setParams] = useState<{ key: string; value: string; description: string; checked: boolean }[]>([
        { key: '', value: '', description: '', checked: false },
    ]);
    const [headers, setHeaders] = useState<{ key: string; value: string; description: string; checked: boolean }[]>([
        { key: '', value: '', description: '', checked: false },
    ]);

    // Body states
    const [bodyType, setBodyType] = useState('none');
    const [formData, setFormData] = useState<
        { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[]
    >([{ key: '', value: '', description: '', type: 'text', checked: false }]);
    const [urlEncodedData, setUrlEncodedData] = useState<
        { key: string; value: string; description: string; checked: boolean }[]
    >([{ key: '', value: '', description: '', checked: false }]);
    const [rawFormat, setRawFormat] = useState<'text' | 'json' | 'xml' | 'html' | 'javascript'>('json');
    const [graphqlQuery, setGraphqlQuery] = useState('');
    const [graphqlVariables, setGraphqlVariables] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Response settings
    const [responseType, setResponseType] = useState<'text' | 'json' | 'html'>('json');

    // Editors
    const bodyEditor = useEditor({
        extensions: [StarterKit, Code],
        content: '',
    });

    const responseEditor = useEditor({
        extensions: [StarterKit],
        content: '',
        editable: false,
    });

    const handleSendRequest = async () => {
        // Implementation of request sending logic
        // This would call an API service function that processes the request
    };

    return (
        <div className="w-full p-4">
            <RequestBar
                method={method}
                setMethod={setMethod}
                url={url}
                setUrl={setUrl}
                onSendRequest={handleSendRequest}
            />

            <RequestTabs
                params={params}
                setParams={setParams}
                headers={headers}
                setHeaders={setHeaders}
                authType={authType}
                setAuthType={setAuthType}
                authConfig={authConfig}
                setAuthConfig={setAuthConfig}
                bodyType={bodyType}
                setBodyType={setBodyType}
                formData={formData}
                setFormData={setFormData}
                urlEncodedData={urlEncodedData}
                setUrlEncodedData={setUrlEncodedData}
                rawFormat={rawFormat}
                setRawFormat={setRawFormat}
                graphqlQuery={graphqlQuery}
                setGraphqlQuery={setGraphqlQuery}
                graphqlVariables={graphqlVariables}
                setGraphqlVariables={setGraphqlVariables}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                bodyEditor={bodyEditor}
            />

            <ResponsePanel
                responseEditor={responseEditor}
                responseType={responseType}
                setResponseType={setResponseType}
            />
        </div>
    );
};

export default ApiClient;
