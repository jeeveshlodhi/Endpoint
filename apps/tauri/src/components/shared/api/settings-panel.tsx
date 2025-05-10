import React from 'react';
import { Checkbox } from '@/components/shared/shadcn-components/checkbox';
import { Label } from '@/components/shared/shadcn-components/label';

const SettingsPanel: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="follow-redirects" />
                <Label htmlFor="follow-redirects">Follow Redirects</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="save-cookies" />
                <Label htmlFor="save-cookies">Save Cookies</Label>
            </div>
        </div>
    );
};

export default SettingsPanel;
