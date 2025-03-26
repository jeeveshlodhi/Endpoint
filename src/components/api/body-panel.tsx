import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormDataBody from './body-types/form-data-body';
import UrlEncodedBody from './body-types/url-encoded-body';
import RawBody from './body-types/raw-body';
import BinaryBody from './body-types/binary-body';
import GraphQLBody from './body-types/graphQL-body';
import { BodyType, FormDataItemType, ParamItemType, RawFormat } from '@/types/api-types';

interface BodyPanelProps {
    bodyType: BodyType;
    setBodyType: React.Dispatch<React.SetStateAction<BodyType>>;
    formData: FormDataItemType[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataItemType[]>>;
    urlEncodedData: ParamItemType[];
    setUrlEncodedData: React.Dispatch<React.SetStateAction<ParamItemType[]>>;
    rawFormat: RawFormat;
    setRawFormat: React.Dispatch<React.SetStateAction<RawFormat>>;
    graphqlQuery: string;
    setGraphqlQuery: React.Dispatch<React.SetStateAction<string>>;
    graphqlVariables: string;
    setGraphqlVariables: React.Dispatch<React.SetStateAction<string>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    bodyEditor: string;
    setBodyEditor: React.Dispatch<React.SetStateAction<string>>;
}

const BodyPanel: React.FC<BodyPanelProps> = props => {
    const handleValueChange = (value: string) => {
        // Check if value is a valid BodyType before setting it
        if (
            value === 'none' ||
            value === 'form-data' ||
            value === 'x-www-form-urlencoded' ||
            value === 'raw' ||
            value === 'binary' ||
            value === 'graphql'
        ) {
            props.setBodyType(value as BodyType);
        }
    };

    return (
        <Tabs defaultValue="none" onValueChange={handleValueChange} value={props.bodyType}>
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
