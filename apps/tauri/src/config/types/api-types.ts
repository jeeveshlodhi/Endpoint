export interface ResponseDataType {
    content: string;
    execution_time_ms: number;
    headers: Record<string, string>;
    request_details: {
        method: string;
        url: string;
        headers: Record<string, string>;
        params: Record<string, string>;
        body: any;
    };
    size_bytes: number;
    status_code: number;
}

export interface BasicAuthType {
    username: string;
    password: string;
}

export interface ApiKeyType {
    key: string;
    location: "header" | "query";
    name: string;
}

export interface OAuth2Type {
    grantType: string;
    accessTokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
}

export interface DigestAuthType {
    username: string;
    password: string;
}

export interface AwsAuthType {
    accessKey: string;
    secretKey: string;
    region: string;
    service: string;
}

export interface AuthConfigType {
    bearerToken: string;
    basicAuth: BasicAuthType;
    apiKey: ApiKeyType;
    oauth2: OAuth2Type;
    digestAuth: DigestAuthType;
    awsAuth: AwsAuthType;
}

export interface ParamItemType {
    key: string;
    value: string;
    description: string;
    checked: boolean;
}

export interface FormDataItemType extends ParamItemType {
    type: "text" | "file";
}

export interface RequestPayloadType {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    body: any;
    timeout: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type BodyType = "none" | "form-data" | "x-www-form-urlencoded" | "raw" | "graphql" | "binary";
export type RawFormat = "text" | "json" | "xml" | "html" | "javascript";
export type ResponseFormat = "text" | "json" | "html";
export type AuthType = "no-auth" | "bearer-token" | "basic-auth" | "api-key" | "oauth2" | "digest-auth" | "aws-auth";
