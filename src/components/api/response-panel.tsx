import React from 'react';
import { Editor } from '@tiptap/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor from '../general-components/editor';
import { ResponseDataType } from '@/types/api-types';

interface ResponsePanelProps {
    responseEditor: Editor | null;
    responseType: 'text' | 'json' | 'html';
    setResponseType: (type: 'text' | 'json' | 'html') => void;
    response: ResponseDataType | null;
    error: string | null;
    isLoading: boolean;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({
    responseEditor,
    responseType,
    setResponseType,
    response,
    error,
    isLoading,
}) => {
    const getStatusClass = (statusCode: number) => {
        if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
        if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800';
        if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
        if (statusCode >= 500) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                    <p className="font-medium mr-4">Response</p>
                    <Select
                        value={responseType}
                        onValueChange={value => setResponseType(value as 'text' | 'json' | 'html')}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {response && (
                    <>
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(response.status_code)}`}
                        >
                            {response.status_code}
                        </span>
                        <span className="text-sm text-gray-600">
                            {formatBytes(response.size_bytes)} • {response.execution_time_ms.toFixed(2)}ms
                        </span>
                    </>
                )}
                {error && <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Error</span>}
            </div>
            <CodeEditor
                initialValue={response?.content || ''}
                height="100%"
                language={responseType === 'json' ? 'json' : 'text'}
                onChange={value => responseEditor?.commands.setContent(value)}
                readOnly={false}
                theme="light"
            />
        </div>
    );
};

export default ResponsePanel;
