import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { INITIAL_BLOCKS } from './constants';
import { Block, BlockType, Template } from './types';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { TemplateModal } from './components/TemplateModal';

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Load templates from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('red_header_templates');
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateBlock = (id: string, data: any) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, data } : block))
    );
  };

  const deleteBlock = (id: string) => {
    if (blocks.find(b => b.id === id)?.isLocked) return;
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      isLocked: false,
      data: type === BlockType.APPOINTMENT || type === BlockType.REMOVAL 
        ? { name: '', org: '', position: '' }
        : { text: 'New content...' },
    };
    
    const dateIndex = blocks.findIndex(b => b.type === BlockType.DATE);
    if (dateIndex !== -1) {
      const newBlocks = [...blocks];
      newBlocks.splice(dateIndex, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  // --- Template Management ---

  const handleSaveTemplate = (name: string) => {
    const newTemplate: Template = {
      id: generateId(),
      name,
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep copy
      createdAt: Date.now(),
      isSystem: false
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('red_header_templates', JSON.stringify(updatedTemplates));
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('red_header_templates', JSON.stringify(updatedTemplates));
  };

  const handleSelectTemplate = (template: Template) => {
    // Regenerate IDs to ensure clean state if needed, but keeping simple for now
    // We deep copy to avoid reference issues
    const newBlocks = JSON.parse(JSON.stringify(template.blocks));
    setBlocks(newBlocks);
    setIsTemplateModalOpen(false);
  };

  // Combine system default with user templates
  const allTemplates: Template[] = [
    {
      id: 'system-default',
      name: '标准干部任命 (Standard Appointment)',
      blocks: INITIAL_BLOCKS,
      isSystem: true,
      createdAt: Date.now()
    },
    ...templates
  ];

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-gray-100">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Left Side: Editor (40%) */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 h-1/2 md:h-full z-20 shadow-xl">
          <EditorPanel 
            blocks={blocks} 
            updateBlock={updateBlock} 
            deleteBlock={deleteBlock}
            addBlock={addBlock}
          />
        </div>

        {/* Right Side: Preview (Remaining space) */}
        <div className="flex-1 h-1/2 md:h-full z-10">
          <PreviewPanel 
            blocks={blocks} 
            onManageTemplates={() => setIsTemplateModalOpen(true)}
          />
        </div>
      </DndContext>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={allTemplates}
        onSelect={handleSelectTemplate}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default App;