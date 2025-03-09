import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from '@tiptap/react';
import FormDataBody from './body-types/form-data-body';
import UrlEncodedBody from './body-types/url-encoded-body';
import RawBody from './body-types/raw-body';
import BinaryBody from './body-types/binary-body';
import GraphQLBody from './body-types/graphQL-body';

interface BodyPanelProps {
    bodyType: string;
    setBodyType: React.Dispatch<React.SetStateAction<string>>;
    formData: { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[];
    setFormData: React.Dispatch<
        React.SetStateAction<
            { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[]
        >
    >;
    urlEncodedData: { key: string; value: string; description: string; checked: boolean }[];
    setUrlEncodedData: React.Dispatch<
        React.SetStateAction<{ key: string; value: string; description: string; checked: boolean }[]>
    >;
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

const BodyPanel: React.FC<BodyPanelProps> = props => {
    return (
        <Tabs defaultValue="none" onValueChange={value => props.setBodyType(value)}>
            <TabsList>
                <TabsTrigger value="none">none</TabsTrigger>
                <TabsTrigger value="form-data">form-data</TabsTrigger>
                <TabsTrigger value="x-www-form-urlencoded">x-www-form-urlencoded</TabsTrigger>
                <TabsTrigger value="raw">raw</TabsTrigger>
                <TabsTrigger value="binary">binary</TabsTrigger>
                <TabsTrigger value="graphql">GraphQL</TabsTrigger>
            </TabsList>

            <TabsContent value="none">
                <div className="text-sm text-gray-500 p-4">This request does not have a body</div>
            </TabsContent>

            <TabsContent value="form-data">
                <FormDataBody formData={props.formData} setFormData={props.setFormData} />
            </TabsContent>

            <TabsContent value="x-www-form-urlencoded">
                <UrlEncodedBody urlEncodedData={props.urlEncodedData} setUrlEncodedData={props.setUrlEncodedData} />
            </TabsContent>

            <TabsContent value="raw">
                <RawBody rawFormat={props.rawFormat} setRawFormat={props.setRawFormat} bodyEditor={props.bodyEditor} />
            </TabsContent>

            <TabsContent value="binary">
                <BinaryBody selectedFile={props.selectedFile} setSelectedFile={props.setSelectedFile} />
            </TabsContent>

            <TabsContent value="graphql">
                <GraphQLBody
                    graphqlQuery={props.graphqlQuery}
                    setGraphqlQuery={props.setGraphqlQuery}
                    graphqlVariables={props.graphqlVariables}
                    setGraphqlVariables={props.setGraphqlVariables}
                />
            </TabsContent>
        </Tabs>
    );
};

export default BodyPanel;
