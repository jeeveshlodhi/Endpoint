import { useState, useEffect } from 'react';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/config/utils/utils';
import { Button } from '@/components/shared/shadcn-components/button';
import { useTheme } from '@/components/shared/general-components/theme-provider';
import { X } from 'lucide-react';

const settingsCategories = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'themes', label: 'Themes' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'api', label: 'API Keys' },
    { id: 'network', label: 'Network' },
    { id: 'proxy', label: 'Proxy Settings' },
    { id: 'requests', label: 'Request Defaults' },
];

const GlobalSettingsModal: React.FC = () => {
    const { isModalOpen, closeModal } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState('general');
    const { currentTheme, changeTheme, availableThemes } = useTheme();
    console.log('availableThemes', availableThemes);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleEscKey);

        // Prevent scrolling when modal is open
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [isModalOpen, closeModal]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with reduced opacity */}
            <div
                className="absolute inset-0 bg-background/30 dark:bg-background/60"
                onClick={closeModal}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                className="relative bg-card text-card-foreground dark:bg-card dark:text-card-foreground rounded-xl shadow-lg w-11/12 max-w-6xl h-4/5 z-10 flex overflow-hidden border border-border"
                onClick={e => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className="w-2/6 bg-muted/50 dark:bg-muted/20 p-4 rounded-l-xl border-r border-border">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">Settings</h2>
                    <ul>
                        {settingsCategories.map(category => (
                            <li
                                key={category.id}
                                className={cn(
                                    'cursor-pointer py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors',
                                    selectedCategory === category.id && 'bg-accent text-accent-foreground',
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
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-foreground">
                            {settingsCategories.find(c => c.id === selectedCategory)?.label}
                        </h2>
                        <p className="text-muted-foreground">Manage your {selectedCategory} settings here.</p>
                    </div>

                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <X />
                    </button>

                    {/* Settings Content */}
                    <div className="mt-4">
                        {/* Content specific to each setting category */}
                        <div className="space-y-4">
                            {selectedCategory === 'general' && (
                                <div className="p-4 border border-border rounded-lg bg-background dark:bg-background/30">
                                    <h3 className="font-medium text-foreground mb-2">Application Settings</h3>
                                    <p className="text-muted-foreground">Configure general application behavior.</p>
                                </div>
                            )}

                            {selectedCategory === 'themes' && (
                                <div className="p-4 border border-border rounded-lg bg-background dark:bg-background/30">
                                    <h3 className="font-medium text-foreground mb-2">Theme Selection</h3>
                                    <p className="text-muted-foreground">
                                        Choose between light, dark, or system theme.
                                    </p>
                                    <div className="flex gap-3 mt-3">
                                        <Button
                                            onClick={() => changeTheme('light')}
                                            variant={currentTheme === 'light' ? 'default' : 'outline'}
                                            className={
                                                currentTheme === 'light' ? 'bg-primary text-primary-foreground' : ''
                                            }
                                        >
                                            Light
                                        </Button>

                                        <Button
                                            onClick={() => changeTheme('dark')}
                                            variant={currentTheme === 'dark' ? 'default' : 'outline'}
                                            className={
                                                currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : ''
                                            }
                                        >
                                            Dark
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {selectedCategory !== 'general' && selectedCategory !== 'themes' && (
                                <div className="p-4 border border-border rounded-lg bg-background dark:bg-background/30">
                                    <h3 className="font-medium text-foreground mb-2">
                                        {settingsCategories.find(c => c.id === selectedCategory)?.label} Settings
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Settings content for {selectedCategory} will go here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSettingsModal;
