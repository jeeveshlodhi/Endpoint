import React, { useEffect, useState, useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shared/shadcn-components/select';
import CodeEditor from '../general-components/editor';
import { ResponseDataType } from '@/config/types/api-types';
import { Skeleton } from '../shadcn-components/skeleton';

interface ResponsePanelProps {
    responseEditor: string | null;
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
    const [language, setLanguage] = useState<string>('json');
    
    const formattedContent = useMemo(() => {
        if (!response?.content) return '';
        return formatResponseContent(response.content, responseType);
    }, [response?.content, responseType]);

    const getStatusClass = (statusCode: number) => {
        if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
        if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800';
        if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
        if (statusCode >= 500) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getLanguageFromType = (type: string) => {
        switch (type) {
            case 'application/json':
                return 'json';
            case 'text/html':
                return 'html';
            case 'text/plain':
                return 'text';
            default:
                return 'json';
        }
    };

    function formatResponseContent(content: string, type: 'json' | 'html' | 'text'): string {
        try {
            switch (type) {
                case 'json':
                    return JSON.stringify(JSON.parse(content), null, 2);
                case 'html':
                    return content;
                case 'text':
                    return content.trim();
                default:
                    return content;
            }
        } catch (err) {
            return content;
        }
    }


    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const timeTaken =
        response?.execution_time_ms !== undefined
            ? response.execution_time_ms < 1000
                ? `${response.execution_time_ms} ms`
                : `${(response.execution_time_ms / 1000).toFixed(2)} s`
            : 'N/A';

    useEffect(() => {
        if (!response || !response.headers) return;

        const contentType = response.headers['content-type']?.split(';')[0];
        if (contentType) {
            const newLang = getLanguageFromType(contentType);
            setLanguage(newLang);
        } else {
            setLanguage(responseType);
        }
    }, [response, responseType]);

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-center mb-2">
                    <p className="font-medium mr-4">Response</p>
                    <Select
                        value={responseType}
                        onValueChange={value => setResponseType(value as 'text' | 'json' | 'html')}
                    >
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 items-center">
                    {response && (
                        <>
                            <span className="text-sm text-gray-600">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(response.status_code)}`}
                                >
                                    {response.status_code}
                                </span>{' '}
                                • {formatBytes(response.size_bytes)} • {timeTaken}
                            </span>
                        </>
                    )}
                    {error && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Error</span>
                    )}
                </div>
            </div>
            <div className="min-h-[450px]">
                {isLoading ? (
                    <Skeleton className="h-100" />
                ) : (
                    <CodeEditor
                        initialValue={formattedContent}
                        height="100%"
                        language={language}
                        readOnly={false}
                        theme="light"
                    />
                )}
            </div>
        </div>
    );
};

export default ResponsePanel;
