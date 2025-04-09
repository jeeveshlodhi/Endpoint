import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { CirclePlus, FolderIcon, GripVertical, X, ChevronRight, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// dnd-kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const requestTypes = [
    { value: 'http', label: 'HTTP' },
    { value: 'grpc', label: 'GRPC' },
    { value: 'socket', label: 'Socket' },
];

// Define interface for sidebar items
interface SidebarItem {
    id: string;
    type: 'request' | 'folder';
    label: string;
    parentId: string | null;
    isOpen?: boolean;
    requestType?: string;
}

// SortableItem component using dnd-kit
function SortableItem({
    item,
    onToggle,
    onDelete,
}: {
    item: SidebarItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        paddingLeft: `${item.parentId ? 8 : 4}px`,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative flex items-center py-1.5',
                isDragging && 'opacity-50',
                isOver && 'bg-accent/50 rounded-md',
            )}
            {...attributes}
        >
            <SidebarMenuItem className="w-full pr-8 group-hover:bg-accent/50 rounded-md">
                <div className="flex items-center w-full">
                    <div {...listeners} className="cursor-move mr-2">
                        <GripVertical size={16} className="text-muted-foreground" />
                    </div>

                    {item.type === 'folder' && (
                        <button onClick={() => onToggle(item.id)} className="mr-1">
                            {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}

                    {item.type === 'folder' ? (
                        <FolderIcon size={16} className="mr-2 text-blue-500" />
                    ) : (
                        <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                                item.requestType === 'HTTP'
                                    ? 'bg-green-500'
                                    : item.requestType === 'GRPC'
                                      ? 'bg-purple-500'
                                      : 'bg-orange-500'
                            }`}
                        />
                    )}

                    <span className="flex-1 truncate">{item.label}</span>

                    <button
                        onClick={() => onDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={14} className="text-muted-foreground hover:text-destructive" />
                    </button>
                </div>
            </SidebarMenuItem>
        </div>
    );
}

// Main component
export function AppSidebar() {
    const [newRequest, setNewRequest] = useState<string | null>(null);
    const [items, setItems] = useState<SidebarItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Configure dnd-kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // Generate a unique ID
    const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Add a new request
    const addRequest = (type: string) => {
        const newItem: SidebarItem = {
            id: generateId(),
            type: 'request',
            label: `New ${type} Request`,
            parentId: null,
            requestType: type,
        };

        setItems([...items, newItem]);
        setNewRequest(null);
    };

    // Add a new folder
    const addFolder = () => {
        const newItem: SidebarItem = {
            id: generateId(),
            type: 'folder',
            label: 'New Folder',
            parentId: null,
            isOpen: true,
        };

        setItems([...items, newItem]);
        setNewRequest(null);
    };

    // Toggle folder open/closed
    const toggleFolder = (id: string) => {
        setItems(items.map(item => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)));
    };

    // Delete an item
    const deleteItem = (id: string) => {
        // Delete the item and all its children if it's a folder
        setItems(items.filter(item => item.id !== id && item.parentId !== id));
    };

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // Handle drag over - for dropping into folders
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        // Skip if no over target or same as active
        if (!over || active.id === over.id) return;

        const activeItem = items.find(item => item.id === active.id);
        const overItem = items.find(item => item.id === over.id);

        // Skip if items not found
        if (!activeItem || !overItem) return;

        // If hovering over a folder and not the same item
        if (overItem.type === 'folder' && activeItem.type === 'request') {
            // Move the item into the folder
            setItems(items.map(item => (item.id === activeItem.id ? { ...item, parentId: overItem.id } : item)));
        }
    };

    // Handle drag end - for reordering items
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems(items => {
                // Find the indices in the flat array
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                // Create a new array with the item moved
                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    // Function to get the visible items in their display order
    const getVisibleItems = () => {
        const result: SidebarItem[] = [];

        // First, add all top-level items
        const topLevelItems = items.filter(item => item.parentId === null);

        // Then, recursively add children of open folders
        const addItemsRecursively = (parentItems: SidebarItem[]) => {
            for (const item of parentItems) {
                result.push(item);

                // If this is an open folder, add its children
                if (item.type === 'folder' && item.isOpen) {
                    const children = items.filter(child => child.parentId === item.id);
                    addItemsRecursively(children);
                }
            }
        };

        addItemsRecursively(topLevelItems);
        return result;
    };

    const visibleItems = getVisibleItems();

    return (
        <>
            <Dialog open={newRequest === 'request'} onOpenChange={open => !open && setNewRequest(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Request</DialogTitle>
                        <DialogDescription>Choose a Request Type from these</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 grid-cols-3">
                        {requestTypes.map(type => (
                            <Button
                                variant={'outline'}
                                key={type.value}
                                className="flex items-center justify-center h-20"
                                onClick={() => addRequest(type.label)}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                        type.label === 'HTTP'
                                            ? 'bg-green-500'
                                            : type.label === 'GRPC'
                                              ? 'bg-purple-500'
                                              : 'bg-orange-500'
                                    }`}
                                />
                                <span>{type.label}</span>
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <Sidebar
                collapsible="offcanvas"
                variant="inset"
                className="h-full flex flex-col transition-all duration-300 ease-in-out"
            >
                <SidebarHeader className="shrink-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex justify-between items-center">
                                <h5 className="font-semibold">Workspace</h5>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <CirclePlus size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setNewRequest('request')}>
                                            <CirclePlus className="mr-2" size={16} /> New Request
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={addFolder}>
                                            <FolderIcon className="mr-2" size={16} /> New Folder
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <div className="flex-1 overflow-auto">
                    <SidebarMenu className="space-y-0.5 px-2">
                        {items.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <p>No items yet</p>
                                <p className="text-xs mt-1">Add a request or folder to get started</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={visibleItems.map(item => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {visibleItems.map(item => (
                                        <SortableItem
                                            key={item.id}
                                            item={item}
                                            onToggle={toggleFolder}
                                            onDelete={deleteItem}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </SidebarMenu>
                </div>
            </Sidebar>
        </>
    );
}
