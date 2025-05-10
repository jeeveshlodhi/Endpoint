import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';

// Define types for component props
type LanguageType = 'text' | 'json' | 'html';

interface CodeEditorProps {
    initialValue?: string;
    language?: LanguageType;
    onChange?: (value: string, language: LanguageType) => void;
    readOnly?: boolean;
    height?: string;
    theme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    initialValue = '',
    language = 'text',
    onChange,
    readOnly = false,
    height = '400px',
    theme = 'vs-dark',
}) => {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setValue(initialValue);
        if (language === 'json') {
            formatIfJson(initialValue);
        }
    }, [language, initialValue]);

    const formatIfJson = useCallback(
        (content: string): void => {
            if (language === 'json' && content.trim()) {
                try {
                    const parsed = JSON.parse(content);
                    const formatted = JSON.stringify(parsed, null, 2);
                    setValue(formatted);
                    setError(null);
                    if (onChange) {
                        onChange(formatted, language);
                    }
                } catch (e) {
                    if (e instanceof Error) {
                        setError(`JSON Syntax Error: ${e.message}`);
                    } else {
                        setError('Invalid JSON format');
                    }
                }
            }
        },
        [language, onChange],
    );

    const handleEditorChange = (newValue: string | undefined) => {
        if (newValue !== undefined) {
            setValue(newValue);
            setError(null);

            if (language === 'json') {
                try {
                    // Just validate the JSON, don't format it on every change
                    if (newValue.trim()) {
                        JSON.parse(newValue);
                    }
                    setError(null);
                } catch (e) {
                    if (e instanceof Error) {
                        setError(`JSON Syntax Error: ${e.message}`);
                    }
                }
            }

            if (onChange) {
                onChange(newValue, language);
            }
        }
    };

    const handleFormat = () => {
        formatIfJson(value);
    };

    const getMonacoLanguage = () => {
        switch (language) {
            case 'json':
                return 'json';
            case 'html':
                return 'html';
            default:
                return 'plaintext';
        }
    };

    const editorOptions = {
        readOnly,
        minimap: { enabled: false },
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
    };

    return (
        <div className="code-editor-container">
            <Editor
                height="100vh"
                language={getMonacoLanguage()}
                value={value}
                theme={theme}
                onChange={handleEditorChange}
                options={editorOptions}
            />
        </div>
    );
};

export default CodeEditor;
