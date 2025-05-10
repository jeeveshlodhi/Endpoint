import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/shadcn-components/table';
import { Input } from '@/components/shared/shadcn-components/input';
import { Checkbox } from '@/components/shared/shadcn-components/checkbox';
import { Button } from '@/components/shared/shadcn-components/button';
import { Trash2 } from 'lucide-react';
import { ParamItemType } from '@/config/types/api-types';
import { sanitizeUrl } from '@/config/utils/utils';

interface QueryParamsProps {
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}

const QueryParams: React.FC<QueryParamsProps> = ({ url, setUrl }) => {
    const [params, setParams] = useState<ParamItemType[]>([{ key: '', value: '', description: '', checked: false }]);

    useEffect(() => {
        if (url) {
            try {
                const urlObj = new URL(sanitizeUrl(url));
                const paramsObj = Array.from(new URLSearchParams(urlObj.search).entries());

                setParams(prevParams => {
                    const newParams = paramsObj.map(([key, value], index) => {
                        const existingParam = prevParams[index];
                        return {
                            key,
                            value,
                            description: existingParam?.description || '',
                            checked: true, // Automatically check params from URL
                        };
                    });

                    // Keep any existing params beyond the ones in the URL
                    const remainingParams = prevParams.slice(paramsObj.length);
                    const paramsUpdated = [...newParams, ...remainingParams];
                    if (paramsUpdated.length === 0 || paramsUpdated[paramsUpdated.length - 1].key !== '') {
                        paramsUpdated.push({ key: '', value: '', description: '', checked: false });
                    }

                    return paramsUpdated;
                });
            } catch (error) {
                console.error('Invalid URL:', error);
            }
        }
    }, [url]);

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
            try {
                const activeParams = newParams.filter(p => p.checked && p.key);
                const queryString = new URLSearchParams(activeParams.map(({ key, value }) => [key, value])).toString();

                const urlObj = new URL(sanitizeUrl(url));
                urlObj.search = queryString;
                setUrl(urlObj.toString());
            } catch (e) {
                console.error('Invalid URL during param update');
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
