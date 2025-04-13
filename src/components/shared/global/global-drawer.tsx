import { Button } from '@/components/shared/shadcn-components/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/shared/shadcn-components/sheet';
import useUIStore from '@/store/useUIStore';

const GlobalDrawer: React.FC = () => {
    const { isSidePanelOpen, closeSidePanel } = useUIStore();

    return (
        <Sheet open={isSidePanelOpen} onOpenChange={closeSidePanel}>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Side Panel</SheetTitle>
                    <SheetDescription>This is a side panel using Zustand & ShadCN.</SheetDescription>
                </SheetHeader>
                <SheetClose asChild>
                    <Button onClick={closeSidePanel} variant="destructive">
                        Close
                    </Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    );
};

export default GlobalDrawer;
