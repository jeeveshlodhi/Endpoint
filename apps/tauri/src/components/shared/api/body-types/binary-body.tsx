import React from 'react';
import { Input } from '@/components/shared/shadcn-components/input';

interface BinaryBodyProps {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const BinaryBody: React.FC<BinaryBodyProps> = ({ selectedFile, setSelectedFile }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="p-4">
            <Input type="file" className="w-full" onChange={handleFileChange} />
            {selectedFile && (
                <div className="mt-2 text-sm">
                    Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
            )}
        </div>
    );
};

export default BinaryBody;
