import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Editor, EditorContent } from '@tiptap/react';

interface RawBodyProps {
    rawFormat: 'text' | 'json' | 'xml' | 'html' | 'javascript';
    setRawFormat: React.Dispatch<React.SetStateAction<'text' | 'json' | 'xml' | 'html' | 'javascript'>>;
    bodyEditor: Editor | null;
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
            <EditorContent editor={bodyEditor} className="min-h-[200px] border p-2 rounded" />
        </div>
    );
};

export default RawBody;
