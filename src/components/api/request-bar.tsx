import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ParamItemType } from '@/types/api-types';
import { CommandIcon } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestBarProps {
    method: HttpMethod;
    setMethod: (method: HttpMethod) => void;
    url: string;
    setUrl: (url: string) => void;
    onSendRequest: () => void;
    params: ParamItemType[];
    setParams: React.Dispatch<React.SetStateAction<ParamItemType[]>>;
}

const RequestBar: React.FC<RequestBarProps> = ({ method, setMethod, url, setUrl, onSendRequest }) => {
    useEffect(() => {
        console.log(url);
    }, [url]);

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setUrl(url);
    };

    return (
        <div className="flex-row items-center justify-between">
            <div className="flex items-center space-x-2 py-2">
                <Select value={method} onValueChange={value => setMethod(value as HttpMethod)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Enter request URL"
                    value={url}
                    onChange={handleUrlInputChange}
                    className="flex-grow"
                />
                <Button onClick={onSendRequest}>
                    Send (<CommandIcon /> Enter)
                </Button>
            </div>
        </div>
    );
};

export default RequestBar;
