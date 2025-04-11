import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodeEditor, { LanguageType } from '../general-components/editor';
import { ResponseDataType } from '@/types/api-types';
import { MultiStepLoader } from './loaders/loading-skeleton';

interface ResponsePanelProps {
    responseEditor: string | null;
    responseType: 'text' | 'json' | 'html';
    setResponseType: (type: 'text' | 'json' | 'html') => void;
    response: ResponseDataType | null;
    error: string | null;
    isLoading: boolean;
}

const loadingStates = [
    { text: 'Training digital hamsters to run faster' },
    { text: 'Convincing the server to cooperate' },
    { text: 'Reticulating splines' },
    { text: 'Counting to infinity (twice)' },
    { text: 'Generating witty dialog...' },
    { text: 'Brewing coffee for the developers' },
    { text: 'Warming up the quantum fluctuator' },
    { text: 'Untangling the digital spaghetti' },
    { text: 'Checking if anyone actually reads these' },
    { text: 'Converting caffeine to code' },
    { text: 'Searching for the last digit of π' },
    { text: 'Calculating the meaning of life' },
    { text: 'Teaching AI to appreciate humor' },
    { text: 'Waiting for the universe to respond' },
    { text: 'Mining some cryptocurrency while we wait' },
    { text: 'Entertaining you with loading messages' },
    { text: 'Dividing by zero (carefully)' },
    { text: 'Polishing pixels to make them shinier' },
    { text: 'Summoning digital demons' },
    { text: 'Downloading more RAM' },
    { text: 'Taking a quick coffee break' },
    { text: 'Questioning existence' },
    { text: 'Feeding the server hamsters' },
    { text: 'Convincing electrons to move faster' },
    { text: 'Asking ChatGPT for better loading messages' },
    { text: 'Deflecting the inevitable stack overflow' },
    { text: 'Turning it off and on again' },
    { text: 'Playing rock-paper-scissors with the database' },
    { text: 'Applying machine learning to this loading bar' },
    { text: 'Sacrificing a byte to the coding gods' },
    { text: 'Almost there... maybe... probably' },
];

const ResponsePanel: React.FC<ResponsePanelProps> = ({
    responseEditor,
    responseType,
    setResponseType,
    response,
    error,
    isLoading,
}) => {
    const [language, setLanguage] = useState<LanguageType>('json');
    const getStatusClass = (statusCode: number) => {
        if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
        if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800';
        if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
        if (statusCode >= 500) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getLanguageFromType = (type: string): LanguageType => {
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

    const formatResponseContent = (content: string, type: 'json' | 'html' | 'text'): string => {
        try {
            switch (type) {
                case 'json':
                    return JSON.stringify(JSON.parse(content), null, 2); // Pretty JSON
                case 'html':
                    // Optional: Beautify HTML (you can add a library if needed)
                    return content; // Placeholder - could use prettier or html-beautifier
                case 'text':
                    return content.trim();
                default:
                    return content;
            }
        } catch (err) {
            // If formatting fails (like invalid JSON), return as-is
            return content;
        }
    };

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
                    <div className="flex flex-col items-center justify-center gap-4">
                        <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={800} />
                    </div>
                ) : (
                    <CodeEditor
                        initialValue={response?.content ? formatResponseContent(response.content, responseType) : ''}
                        height="100%"
                        language={language}
                        readOnly={false}
                        theme="light"
                    />
                )}
            </div>
            c
        </div>
    );
};

export default ResponsePanel;
