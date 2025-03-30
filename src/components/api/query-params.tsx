import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface QueryParamsProps {
    params: { key: string; value: string; description: string; checked: boolean }[];
    setParams: React.Dispatch<
        React.SetStateAction<{ key: string; value: string; description: string; checked: boolean }[]>
    >;
}

const QueryParams: React.FC<QueryParamsProps> = ({ params, setParams }) => {
    const deleteParam = (index: number) => {
        setParams(prevParams => {
            // Prevent deleting the last empty row
            if (
                index === prevParams.length - 1 &&
                !prevParams[index].key &&
                !prevParams[index].value &&
                !prevParams[index].description
            ) {
                return prevParams;
            }
            return prevParams.filter((_, i) => i !== index);
        });
    };

    const updateParam = (index: number, field: 'key' | 'value' | 'description', value: string) => {
        setParams(prevParams => {
            const newParams = [...prevParams];
            newParams[index][field] = value;

            // Ensure a new row is added only when editing the last row
            const lastParam = newParams[newParams.length - 1];
            if (lastParam.key || lastParam.value || lastParam.description) {
                newParams.push({ key: '', value: '', description: '', checked: false });
            }

            return newParams;
        });
    };

    return (
        <>
            <h2 className="text-sm font-medium">Query params</h2>
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
                    {params.map((param, index) => (
                        <TableRow key={index} className="relative">
                            <TableCell>
                                <Checkbox
                                    checked={!!(param.key || param.value || param.description)}
                                    disabled={!(param.key || param.value || param.description)}
                                    onCheckedChange={checked => {
                                        setParams(prevParams => {
                                            const newParams = [...prevParams];
                                            newParams[index].checked = Boolean(checked);
                                            return newParams;
                                        });
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={param.key}
                                    onChange={e => updateParam(index, 'key', e.target.value)}
                                    placeholder="Key"
                                    className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent focus:border-transparent"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={param.value}
                                    onChange={e => updateParam(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent"
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center w-full">
                                    <Input
                                        value={param.description}
                                        onChange={e => updateParam(index, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="shadow-none border-none focus:ring-0 focus:outline-none bg-transparent flex-1"
                                    />
                                    {!(
                                        index === params.length - 1 &&
                                        !param.key &&
                                        !param.value &&
                                        !param.description
                                    ) && (
                                        <Button
                                            className="text-black hover:text-white bg-white hover:bg-black ml-auto"
                                            onClick={() => deleteParam(index)}
                                            style={{
                                                display:
                                                    index === params.length - 1 &&
                                                    !param.key &&
                                                    !param.value &&
                                                    !param.description
                                                        ? 'none'
                                                        : 'flex',
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
export default QueryParams;
