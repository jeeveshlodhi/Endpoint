import React from 'react';
import { Textarea } from '@/components/shared/shadcn-components/textarea';
import { Label } from '@/components/shared/shadcn-components/label';

interface GraphQLBodyProps {
    graphqlQuery: string;
    setGraphqlQuery: React.Dispatch<React.SetStateAction<string>>;
    graphqlVariables: string;
    setGraphqlVariables: React.Dispatch<React.SetStateAction<string>>;
}

const GraphQLBody: React.FC<GraphQLBodyProps> = ({
    graphqlQuery,
    setGraphqlQuery,
    graphqlVariables,
    setGraphqlVariables,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <Label>Query</Label>
                <Textarea
                    placeholder="Enter GraphQL query"
                    className="min-h-[200px] font-mono"
                    value={graphqlQuery}
                    onChange={e => setGraphqlQuery(e.target.value)}
                />
            </div>
            <div>
                <Label>Variables</Label>
                <Textarea
                    placeholder="Enter variables as JSON"
                    className="min-h-[100px] font-mono"
                    value={graphqlVariables}
                    onChange={e => setGraphqlVariables(e.target.value)}
                />
            </div>
        </div>
    );
};

export default GraphQLBody;
