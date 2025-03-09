import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface HeadersPanelProps {
    headers: { key: string; value: string; description: string; checked: boolean }[];
    setHeaders: React.Dispatch<
        React.SetStateAction<{ key: string; value: string; description: string; checked: boolean }[]>
    >;
}

const HeadersPanel: React.FC<HeadersPanelProps> = ({ headers, setHeaders }) => {
    const deleteHeader = (index: number) => {
        if (
            index === headers.length - 1 ||
            (headers[index].key === '' && headers[index].value === '' && headers[index].description === '')
        ) {
            return;
        }
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    const updateHeader = (index: number, field: 'key' | 'value' | 'description', value: string) => {
        const newHeaders = [...headers];
        if (newHeaders.length === index + 1) {
            newHeaders.push({ key: '', value: '', description: '', checked: false });
        }
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {headers.map((header, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Checkbox
                                checked={!!(header.key || header.value || header.description)}
                                disabled={!(header.key || header.value || header.description)}
                                onCheckedChange={(checked: boolean) => {
                                    const newHeaders = [...headers];
                                    newHeaders[index].checked = checked;
                                    setHeaders(newHeaders);
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                value={header.key}
                                onChange={e => updateHeader(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent focus:border-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                value={header.value}
                                onChange={e => updateHeader(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center w-full">
                                <Input
                                    value={header.description}
                                    onChange={e => updateHeader(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent flex-1"
                                />
                                <Button
                                    className="text-black hover:text-white bg-white hover:bg-black ml-auto"
                                    onClick={() => deleteHeader(index)}
                                    style={{
                                        display:
                                            index === headers.length - 1 &&
                                            !header.key &&
                                            !header.value &&
                                            !header.description
                                                ? 'none'
                                                : 'flex',
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default HeadersPanel;
