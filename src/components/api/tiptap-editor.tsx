// Tiptap Toolbar Component
import React from 'react';
import { Bold, Italic, List, ListOrdered, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Toolbar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="flex space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-accent' : ''}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-accent' : ''}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-accent' : ''}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-accent' : ''}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
            >
                <Code className="h-4 w-4" />
            </Button>
        </div>
    );
};
