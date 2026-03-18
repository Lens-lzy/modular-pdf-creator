import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Block, BlockType } from '../types';
import { EditorBlock } from './EditorBlock';
import { Plus, Users } from 'lucide-react';

interface EditorPanelProps {
  blocks: Block[];
  updateBlock: (id: string, data: any) => void;
  deleteBlock: (id: string) => void;
  addBlock: (type: BlockType) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ blocks, updateBlock, deleteBlock, addBlock }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">组件编辑 (Component Editor)</h2>
        <p className="text-sm text-gray-500">Drag blocks to reorder content</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <EditorBlock
              key={block.id}
              block={block}
              onChange={updateBlock}
              onDelete={deleteBlock}
            />
          ))}
        </SortableContext>

        <div className="mt-6 border-t pt-6">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">Add Content Block</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => addBlock(BlockType.PARAGRAPH)}
              className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded hover:border-blue-500 hover:text-blue-500 transition-colors text-sm"
            >
              <Plus size={14} /> 段落 (Text)
            </button>
            <button 
              onClick={() => addBlock(BlockType.DEPT_GROUP)}
              className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded hover:border-indigo-600 hover:text-indigo-600 transition-colors text-sm"
            >
              <Users size={14} /> 部门任免 (Dept Group)
            </button>
             <button 
              onClick={() => addBlock(BlockType.TITLE)}
              className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded hover:border-purple-500 hover:text-purple-500 transition-colors text-sm"
            >
              <Plus size={14} /> 标题 (Title)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
