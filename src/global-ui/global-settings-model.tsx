import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/lib/utils';

const settingsCategories = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'api', label: 'API Keys' },
    { id: 'themes', label: 'Themes' },
    { id: 'network', label: 'Network' },
    { id: 'proxy', label: 'Proxy Settings' },
    { id: 'requests', label: 'Request Defaults' },
];

const GlobalSettingsModal: React.FC = () => {
    const { isModalOpen, closeModal } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState('general');

    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-6xl w-full flex h-2/3">
                {/* Sidebar */}
                <div className="w-2/6 bg-gray-100 p-4 rounded-l-xl">
                    <h2 className="text-lg font-semibold mb-4">Settings</h2>
                    <ul>
                        {settingsCategories.map(category => (
                            <li
                                key={category.id}
                                className={cn(
                                    'cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-200',
                                    selectedCategory === category.id && 'bg-gray-300',
                                )}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel */}
                <div className="w-4/6 p-6">
                    <DialogHeader>
                        <DialogTitle>{settingsCategories.find(c => c.id === selectedCategory)?.label}</DialogTitle>
                        <DialogDescription>Manage your {selectedCategory} settings here.</DialogDescription>
                    </DialogHeader>

                    {/* Settings Content */}
                    <div className="mt-4">
                        {/* Settings options can be dynamically rendered here */}
                        <p className="text-gray-600">Settings content for {selectedCategory} will go here.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GlobalSettingsModal;
