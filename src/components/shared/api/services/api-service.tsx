import axios, { AxiosRequestConfig } from 'axios';

export interface AuthConfig {
    bearerToken: string;
    basicAuth: { username: string; password: string };
    apiKey: { key: string; location: string; name: string };
    oauth2: { grantType: string; accessTokenUrl: string; clientId: string; clientSecret: string; scope: string };
    digestAuth: { username: string; password: string };
    awsAuth: { accessKey: string; secretKey: string; region: string; service: string };
}

export interface RequestParams {
    method: string;
    url: string;
    authType: string;
    authConfig: AuthConfig;
    params: { key: string; value: string; description: string; checked: boolean }[];
    headers: { key: string; value: string; description: string; checked: boolean }[];
    bodyType: string;
    formData?: { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[];
    urlEncodedData?: { key: string; value: string; description: string; checked: boolean }[];
    rawData?: string;
    rawFormat?: string;
    graphqlQuery?: string;
    graphqlVariables?: string;
    binaryFile?: File | null;
    responseType: 'text' | 'json' | 'html';
}

export const makeApiRequest = async (requestParams: RequestParams) => {
    try {
        // Build auth headers
        let authHeaders: Record<string, string> = {};
        switch (requestParams.authType) {
            case 'bearer':
                authHeaders = { Authorization: `Bearer ${requestParams.authConfig.bearerToken}` };
                break;
            case 'basic':
                const basicAuth = btoa(
                    `${requestParams.authConfig.basicAuth.username}:${requestParams.authConfig.basicAuth.password}`,
                );
                authHeaders = { Authorization: `Basic ${basicAuth}` };
                break;
            case 'api-key':
                if (requestParams.authConfig.apiKey.location === 'header') {
                    authHeaders = { [requestParams.authConfig.apiKey.name]: requestParams.authConfig.apiKey.key };
                }
                break;
            // Add other auth types as needed
        }

        // Build request headers
        const headers = requestParams.headers
            .filter(h => h.checked && h.key)
            .reduce(
                (acc, { key, value }) => {
                    acc[key] = value;
                    return acc;
                },
                {} as Record<string, string>,
            );

        // Build query params
        const params = requestParams.params
            .filter(p => p.checked && p.key)
            .reduce(
                (acc, { key, value }) => {
                    acc[key] = value;
                    return acc;
                },
                {} as Record<string, string>,
            );

        // If API key is in query params
        if (requestParams.authType === 'api-key' && requestParams.authConfig.apiKey.location === 'query') {
            params[requestParams.authConfig.apiKey.name] = requestParams.authConfig.apiKey.key;
        }

        // Build request body based on body type
        let data: any = null;
        let contentType = '';

        switch (requestParams.bodyType) {
            case 'form-data':
                // Handle form data with FormData API
                const formData = new FormData();
                requestParams.formData?.forEach(item => {
                    if (item.checked && item.key) {
                        if (item.type === 'file' && item.value) {
                            formData.append(item.key, item.value);
                        } else {
                            formData.append(item.key, item.value);
                        }
                    }
                });
                data = formData;
                break;

            case 'x-www-form-urlencoded':
                // Handle URL encoded data
                const urlEncodedParams = new URLSearchParams();
                requestParams.urlEncodedData?.forEach(item => {
                    if (item.checked && item.key) {
                        urlEncodedParams.append(item.key, item.value);
                    }
                });
                data = urlEncodedParams;
                contentType = 'application/x-www-form-urlencoded';
                break;

            case 'raw':
                // Handle raw data with the specified format
                data = requestParams.rawData;
                switch (requestParams.rawFormat) {
                    case 'json':
                        contentType = 'application/json';
                        break;
                    case 'xml':
                        contentType = 'application/xml';
                        break;
                    case 'html':
                        contentType = 'text/html';
                        break;
                    case 'javascript':
                        contentType = 'application/javascript';
                        break;
                    default:
                        contentType = 'text/plain';
                }
                break;

            case 'binary':
                // Handle binary file
                data = requestParams.binaryFile;
                contentType = 'application/octet-stream';
                break;

            case 'graphql':
                // Handle GraphQL
                data = JSON.stringify({
                    query: requestParams.graphqlQuery,
                    variables: requestParams.graphqlVariables ? JSON.parse(requestParams.graphqlVariables) : undefined,
                });
                contentType = 'application/json';
                break;
        }

        // Add content type header if needed
        if (contentType && !headers['Content-Type']) {
            headers['Content-Type'] = contentType;
        }

        // Create request config
        const config: AxiosRequestConfig = {
            method: requestParams.method,
            url: requestParams.url,
            headers: { ...headers, ...authHeaders },
            params,
            data,
            responseType: requestParams.responseType === 'json' ? 'json' : 'text',
        };

        // Make the request
        const response = await axios(config);

        // Format response based on selected type
        let formattedResponse: any;
        switch (requestParams.responseType) {
            case 'json':
                // If the response is already parsed JSON, stringify it for display
                formattedResponse =
                    typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data;
                break;
            case 'html':
            case 'text':
            default:
                formattedResponse = response.data;
        }

        return {
            success: true,
            data: formattedResponse,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        };
    } catch (error: any) {
        // Handle errors
        return {
            success: false,
            error: error.response
                ? {
                      data: error.response.data,
                      status: error.response.status,
                      statusText: error.response.statusText,
                      headers: error.response.headers,
                  }
                : {
                      message: error.message,
                  },
        };
    }
};
