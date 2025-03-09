import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormDataBodyProps {
    formData: { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[];
    setFormData: React.Dispatch<
        React.SetStateAction<
            { key: string; value: string; description: string; type: 'text' | 'file'; checked: boolean }[]
        >
    >;
}

const FormDataBody: React.FC<FormDataBodyProps> = ({ formData, setFormData }) => {
    const updateFormData = (index: number, field: keyof (typeof formData)[0], value: any) => {
        const newFormData = [...formData];
        if (newFormData.length === index + 1) {
            newFormData.push({ key: '', value: '', description: '', type: 'text', checked: false });
        }

        newFormData[index] = {
            ...newFormData[index],
            [field]: value,
        };
        setFormData(newFormData);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {formData.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Checkbox
                                checked={item.checked}
                                onCheckedChange={checked => updateFormData(index, 'checked', !!checked)}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Key"
                                value={item.key}
                                onChange={e => updateFormData(index, 'key', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Value"
                                value={item.value}
                                onChange={e => updateFormData(index, 'value', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={e => updateFormData(index, 'description', e.target.value)}
                                className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                            />
                        </TableCell>
                        <TableCell>
                            <Select
                                value={item.type}
                                onValueChange={value => updateFormData(index, 'type', value as 'text' | 'file')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="file">File</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default FormDataBody;
