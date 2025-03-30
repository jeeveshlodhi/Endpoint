import React, { useEffect, useRef, useState } from 'react';
import RequestBar from '../components/api/request-bar';
import RequestTabs from '../components/api/request-tabs';
import ResponsePanel from '../components/api/response-panel';
import axios, { AxiosError } from 'axios';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import {
    AuthConfigType,
    AuthType,
    BodyType,
    FormDataItemType,
    HttpMethod,
    ParamItemType,
    RawFormat,
    RequestPayloadType,
    ResponseDataType,
    ResponseFormat,
} from '@/types/api-types';
import AppLayout from '@/layouts/app-layout';
import { useKeybinding } from '@/lib/utils';
import { platform } from '@tauri-apps/plugin-os';

// Define interfaces for all the types

const ApiClient: React.FC = () => {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ResponseDataType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auth states
    const [authType, setAuthType] = useState<AuthType>('no-auth');
    const [authConfig, setAuthConfig] = useState<AuthConfigType>({
        bearerToken: '',
        basicAuth: { username: '', password: '' },
        apiKey: { key: '', location: 'header', name: '' },
        oauth2: { grantType: 'authorization_code', accessTokenUrl: '', clientId: '', clientSecret: '', scope: '' },
        digestAuth: { username: '', password: '' },
        awsAuth: { accessKey: '', secretKey: '', region: '', service: '' },
    });

    // Request params states
    const [params, setParams] = useState<ParamItemType[]>([{ key: '', value: '', description: '', checked: false }]);
    const [headers, setHeaders] = useState<ParamItemType[]>([{ key: '', value: '', description: '', checked: false }]);

    // Body states
    const [bodyType, setBodyType] = useState<BodyType>('none');
    const [formData, setFormData] = useState<FormDataItemType[]>([
        { key: '', value: '', description: '', type: 'text', checked: false },
    ]);
    const [urlEncodedData, setUrlEncodedData] = useState<ParamItemType[]>([
        { key: '', value: '', description: '', checked: false },
    ]);
    const [rawFormat, setRawFormat] = useState<RawFormat>('json');
    const [graphqlQuery, setGraphqlQuery] = useState('');
    const [graphqlVariables, setGraphqlVariables] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Response settings
    const [responseType, setResponseType] = useState<ResponseFormat>('json');
    const [responseContent, setResponseContent] = useState<string>('');

    const currentPlatform = platform();

    // Update response editor content when response changes
    useEffect(() => {
        if (response) {
            if (responseType === 'json') {
                try {
                    setResponseContent(JSON.stringify(response, null, 2));
                } catch (e) {
                    setResponseContent('Invalid JSON response');
                }
            } else {
                setResponseContent(response.content || '');
            }
        }
    }, [response, responseType]);

    useEffect(() => {
        if (url) {
            try {
                const urlObj = new URL(url);
                const paramsObj = Array.from(new URLSearchParams(urlObj.search).entries());

                setParams(prevParams => {
                    const newParams = paramsObj.map(([key, value], index) => {
                        const existingParam = prevParams[index];
                        return {
                            key,
                            value,
                            description: existingParam?.description || '',
                            checked: true, // Automatically check params from URL
                        };
                    });

                    // Keep any existing params beyond the ones in the URL
                    const remainingParams = prevParams.slice(paramsObj.length);
                    const paramsUpdated = [...newParams, ...remainingParams];
                    if (paramsUpdated.length === 0 || paramsUpdated[paramsUpdated.length - 1].key !== '') {
                        paramsUpdated.push({ key: '', value: '', description: '', checked: false });
                    }

                    return paramsUpdated;
                });
            } catch (error) {
                console.error('Invalid URL:', error);
            }
        }
    }, [url]);

    useEffect(() => {
        if (!url || !url.startsWith('http')) return; // Ensure URL is valid before processing

        try {
            console.log(url);
            const urlObj = new URL(url);

            let newUrl = `${urlObj.origin}${urlObj.pathname}`;

            params.forEach(({ key, value, checked }, index) => {
                if (checked && value.trim()) {
                    newUrl += `${index === 0 ? '?' : '&'}${key}=${encodeURIComponent(value)}`;
                }
            });

            if (decodeURIComponent(newUrl) !== decodeURIComponent(url)) {
                setUrl(newUrl);
            }
        } catch (error) {
            console.error('Invalid URL:', error);
        }
    }, [params]);

    // Helper function to escape HTML for safe display
    const escapeHtml = (html: string): string => {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // Resizing state
    const [requestHeight, setRequestHeight] = useState(350); // Initial height
    const containerRef = useRef<HTMLDivElement>(null);

    const buildRequestHeaders = (): Record<string, string> => {
        const requestHeaders: Record<string, string> = {};

        // Add checked headers from the headers state
        headers.forEach(header => {
            if (header.checked && header.key.trim() !== '') {
                requestHeaders[header.key] = header.value;
            }
        });

        // Add auth headers based on authType
        if (authType === 'bearer-token' && authConfig.bearerToken) {
            requestHeaders['Authorization'] = `Bearer ${authConfig.bearerToken}`;
        } else if (authType === 'basic-auth' && authConfig.basicAuth.username) {
            const token = btoa(`${authConfig.basicAuth.username}:${authConfig.basicAuth.password}`);
            requestHeaders['Authorization'] = `Basic ${token}`;
        } else if (authType === 'api-key' && authConfig.apiKey.key) {
            if (authConfig.apiKey.location === 'header' && authConfig.apiKey.name) {
                requestHeaders[authConfig.apiKey.name] = authConfig.apiKey.key;
            }
        }

        return requestHeaders;
    };

    const buildRequestParams = (): Record<string, string> => {
        const requestParams: Record<string, string> = {};

        params.forEach(param => {
            if (param.checked && param.key.trim() !== '') {
                requestParams[param.key] = param.value;
            }
        });

        // Handle API key in query params if selected
        if (authType === 'api-key' && authConfig.apiKey.location === 'query' && authConfig.apiKey.name) {
            requestParams[authConfig.apiKey.name] = authConfig.apiKey.key;
        }

        return requestParams;
    };

    const buildRequestBody = (): any => {
        if (bodyType === 'none' || method === 'GET') {
            return {};
        }

        if (bodyType === 'form-data') {
            const formDataObj: Record<string, string> = {};
            formData.forEach(item => {
                if (item.checked && item.key.trim() !== '') {
                    formDataObj[item.key] = item.value;
                }
            });
            return formDataObj;
        }

        if (bodyType === 'x-www-form-urlencoded') {
            const formDataObj: Record<string, string> = {};
            urlEncodedData.forEach(item => {
                if (item.checked && item.key.trim() !== '') {
                    formDataObj[item.key] = item.value;
                }
            });
            return formDataObj;
        }

        if (bodyType === 'raw' && responseContent) {
            try {
                if (rawFormat === 'json') {
                    return JSON.parse(responseContent);
                }
                return responseContent;
            } catch (e) {
                return `Error parsing JSON: ${e}`;
            }
        }

        if (bodyType === 'graphql') {
            try {
                return {
                    query: graphqlQuery,
                    variables: graphqlVariables ? JSON.parse(graphqlVariables) : {},
                };
            } catch (e) {
                return {
                    query: graphqlQuery,
                    variables: {},
                };
            }
        }

        return {};
    };

    const formatUrl = (url: string): string => {
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`; // Defaulting to https if protocol is missing
        }
        try {
            const formattedUrl = new URL(url);
            return formattedUrl.href;
        } catch (error) {
            console.error('Invalid URL format', error);
            return url; // Return as-is if URL is invalid
        }
    };

    const handleSendRequest = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        const formattedUrl = formatUrl(url);

        // Create the request payload
        const requestData: RequestPayloadType = {
            method: method,
            url: formattedUrl,
            headers: buildRequestHeaders(),
            params: buildRequestParams(),
            body: buildRequestBody(),
            timeout: 30.0,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/fetch', requestData);
            setResponse(response.data);
            console.log('Response:', response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error details:', axiosError.response?.data || axiosError.message);
            setError((axiosError.response?.data as any)?.message || axiosError.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useKeybinding(currentPlatform == 'macos' ? 'Cmd+ENTER' : 'Ctrl+ENTER', e => {
        e.preventDefault();
        // console.log('Keybinding triggered');
        handleSendRequest();
    });

    return (
        <AppLayout>
            <RequestBar
                method={method}
                setMethod={setMethod}
                url={url}
                setUrl={setUrl}
                onSendRequest={handleSendRequest}
                params={params}
                setParams={setParams}
                // isLoading={isLoading}
            />
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={25} className="p-2">
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
                        bodyEditor={responseContent}
                        setBodyEditor={setResponseContent}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex-grow overflow-auto p-2">
                        <ResponsePanel
                            responseEditor={responseContent}
                            responseType={responseType}
                            setResponseType={setResponseType}
                            response={response}
                            error={error}
                            isLoading={isLoading}
                        />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </AppLayout>
    );
};

export default ApiClient;
