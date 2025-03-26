import React, { useEffect, useRef, useState } from 'react';
import RequestBar from '../components/api/request-bar';
import RequestTabs from '../components/api/request-tabs';
import ResponsePanel from '../components/api/response-panel';
import axios, { AxiosError } from 'axios';
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
    const isDraggingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPositionRef = useRef(0);

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

    // Mouse down event handler for the resize handle
    const handleMouseDown = (e: React.MouseEvent): void => {
        isDraggingRef.current = true;
        lastPositionRef.current = e.clientY;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';

        // Add these event listeners only when dragging starts
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Mouse move handler for resizing
    const handleMouseMove = (e: MouseEvent): void => {
        if (!isDraggingRef.current) return;

        const delta = e.clientY - lastPositionRef.current;
        lastPositionRef.current = e.clientY;

        setRequestHeight(prevHeight => {
            // Calculate the new height
            const newHeight = prevHeight + delta;

            // Set minimum and maximum heights
            if (newHeight < 100) return 100;
            if (containerRef.current && newHeight > containerRef.current.clientHeight - 100) {
                return containerRef.current.clientHeight - 100;
            }

            return newHeight;
        });
    };

    // Mouse up handler to stop resizing
    const handleMouseUp = (): void => {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Remove event listeners when dragging stops
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <AppLayout>
            <div className="w-full p-4 h-full flex flex-col" ref={containerRef}>
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

                <div className="flex flex-col flex-grow overflow-hidden">
                    {/* Request Tabs with controlled height */}
                    <div style={{ height: `${requestHeight}px`, overflow: 'auto' }}>
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
                    </div>

                    {/* Resize handle */}
                    <div
                        className="h-2 bg-gray-100 cursor-row-resize flex justify-center items-center"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
                    </div>

                    {/* Response Panel with flexible height */}
                    <div className="flex-grow overflow-auto">
                        <ResponsePanel
                            responseEditor={responseContent}
                            responseType={responseType}
                            setResponseType={setResponseType}
                            response={response}
                            error={error}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ApiClient;
