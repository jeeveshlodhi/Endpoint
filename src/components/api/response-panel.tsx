import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResponsePanelProps {
    responseEditor: Editor | null;
    responseType: 'text' | 'json' | 'html';
    setResponseType: React.Dispatch<React.SetStateAction<'text' | 'json' | 'html'>>;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ responseEditor, responseType, setResponseType }) => {
    return (
        <div className="mt-4">
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
            <EditorContent editor={responseEditor} className="min-h-[300px] border p-2 rounded" />
        </div>
    );
};

export default ResponsePanel;
