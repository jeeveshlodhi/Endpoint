import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QueryParams from './query-params';
import Authorization from './authorization';
import HeadersPanel from './headers-panel';
import BodyPanel from './body-panel';
import ScriptsPanel from './scripts-panel';
import SettingsPanel from './settings-panel';
import { Editor } from '@tiptap/react';
import { AuthConfigType, AuthType, BodyType, FormDataItemType, ParamItemType } from '@/types/api-types';

interface RequestTabsProps {
    // All the props from the parent component
    params: ParamItemType[];
    setParams: React.Dispatch<React.SetStateAction<ParamItemType[]>>;
    headers: ParamItemType[];
    setHeaders: React.Dispatch<React.SetStateAction<ParamItemType[]>>;
    authType: AuthType;
    setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
    authConfig: AuthConfigType;
    setAuthConfig: React.Dispatch<React.SetStateAction<AuthConfigType>>;
    bodyType: BodyType;
    setBodyType: React.Dispatch<React.SetStateAction<BodyType>>;
    formData: FormDataItemType[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataItemType[]>>;
    urlEncodedData: ParamItemType[];
    setUrlEncodedData: React.Dispatch<React.SetStateAction<ParamItemType[]>>;
    rawFormat: 'text' | 'json' | 'xml' | 'html' | 'javascript';
    setRawFormat: React.Dispatch<React.SetStateAction<'text' | 'json' | 'xml' | 'html' | 'javascript'>>;
    graphqlQuery: string;
    setGraphqlQuery: React.Dispatch<React.SetStateAction<string>>;
    graphqlVariables: string;
    setGraphqlVariables: React.Dispatch<React.SetStateAction<string>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    bodyEditor: Editor | null;
}

const RequestTabs: React.FC<RequestTabsProps> = (props: RequestTabsProps) => {
    return (
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
                <QueryParams params={props.params} setParams={props.setParams} />
            </TabsContent>

            <TabsContent value="authorization">
                <Authorization
                    authType={props.authType}
                    setAuthType={props.setAuthType}
                    authConfig={props.authConfig}
                    setAuthConfig={props.setAuthConfig}
                />
            </TabsContent>

            <TabsContent value="headers">
                <HeadersPanel headers={props.headers} setHeaders={props.setHeaders} />
            </TabsContent>

            <TabsContent value="body">
                <BodyPanel
                    bodyType={props.bodyType}
                    setBodyType={props.setBodyType}
                    formData={props.formData}
                    setFormData={props.setFormData}
                    urlEncodedData={props.urlEncodedData}
                    setUrlEncodedData={props.setUrlEncodedData}
                    rawFormat={props.rawFormat}
                    setRawFormat={props.setRawFormat}
                    graphqlQuery={props.graphqlQuery}
                    setGraphqlQuery={props.setGraphqlQuery}
                    graphqlVariables={props.graphqlVariables}
                    setGraphqlVariables={props.setGraphqlVariables}
                    selectedFile={props.selectedFile}
                    setSelectedFile={props.setSelectedFile}
                    bodyEditor={props.bodyEditor}
                />
            </TabsContent>

            <TabsContent value="scripts">
                <ScriptsPanel />
            </TabsContent>

            <TabsContent value="settings">
                <SettingsPanel />
            </TabsContent>
        </Tabs>
    );
};

export default RequestTabs;
