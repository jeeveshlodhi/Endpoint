import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/shadcn-components/table';
import { Input } from '@/components/shared/shadcn-components/input';
import { Checkbox } from '@/components/shared/shadcn-components/checkbox';

type UrlEncodedItem = {
    key: string;
    value: string;
    description: string;
    checked: boolean;
};

interface UrlEncodedBodyProps {
    urlEncodedData: UrlEncodedItem[];
    setUrlEncodedData: React.Dispatch<React.SetStateAction<UrlEncodedItem[]>>;
}

const UrlEncodedBody: React.FC<UrlEncodedBodyProps> = ({ urlEncodedData, setUrlEncodedData }) => {
    const updateUrlEncodedData = (index: number, field: keyof (typeof urlEncodedData)[0], value: any) => {
        const newData = [...urlEncodedData];
        if (newData.length === index + 1) {
            newData.push({ key: '', value: '', description: '', checked: false });
        }
        newData[index] = {
            ...newData[index],
            [field]: value,
        };
        setUrlEncodedData(newData);
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
                {urlEncodedData.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Checkbox
                                checked={item.checked}
                                onCheckedChange={checked => updateUrlEncodedData(index, 'checked', !!checked)}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Key"
                                value={item.key}
                                onChange={e => updateUrlEncodedData(index, 'key', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Value"
                                value={item.value}
                                onChange={e => updateUrlEncodedData(index, 'value', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={e => updateUrlEncodedData(index, 'description', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UrlEncodedBody;
