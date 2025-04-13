import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/shadcn-components/select';
import CodeEditor from '@/components/shared/general-components/editor';

interface RawBodyProps {
    rawFormat: 'text' | 'json' | 'xml' | 'html' | 'javascript';
    setRawFormat: React.Dispatch<React.SetStateAction<'text' | 'json' | 'xml' | 'html' | 'javascript'>>;
    bodyEditor: string | null;
}

const RawBody: React.FC<RawBodyProps> = ({ rawFormat, setRawFormat, bodyEditor }) => {
    return (
        <div className="space-y-4">
            <Select value={rawFormat} onValueChange={value => setRawFormat(value as any)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
            </Select>
            <CodeEditor
                initialValue={bodyEditor || ''}
                height="100%"
                language={rawFormat === 'json' ? 'json' : 'text'}
                readOnly={false}
                theme="light"
            />
        </div>
    );
};

export default RawBody;
