import React from 'react';
import { Block, BlockType } from '../types';
import { PreviewBlock } from './PreviewBlock';
import { Printer, Share2, Download, Layout } from 'lucide-react';

interface PreviewPanelProps {
  blocks: Block[];
  onManageTemplates: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ blocks, onManageTemplates }) => {
  // Find the ID of the first paragraph block
  const firstParagraphId = blocks.find(b => b.type === BlockType.PARAGRAPH)?.id;

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
           <h2 className="text-lg font-bold text-gray-800">实时预览 (Live Preview)</h2>
           <p className="text-xs text-gray-500">Standard A4 Layout</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={onManageTemplates}
             className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 border border-blue-200 transition-colors"
           >
             <Layout size={16} /> 模版 (Templates)
           </button>
           <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200">
             <Share2 size={16} /> 分享
           </button>
           <button 
             onClick={() => window.print()}
             className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm"
           >
             <Printer size={16} /> 打印
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-200/50">
        {/* A4 Paper Simulation: 210mm x 297mm approx ratio */}
        <div 
          className="bg-white shadow-a4 min-h-[297mm] w-[210mm] p-[25mm] relative box-border transform origin-top scale-75 md:scale-90 lg:scale-100 transition-transform duration-300"
        >
          {blocks.map((block) => (
            <PreviewBlock 
              key={block.id} 
              block={block} 
              isFirstParagraph={block.id === firstParagraphId}
            />
          ))}

          {/* Page Number Simulation (Bottom) */}
          {/* Right aligned (right-0 with padding or explicit right spacing) */}
          <div className="absolute bottom-10 right-[25mm] text-right font-serif text-gray-800 text-sm">
            — 1 —
          </div>
        </div>
      </div>
    </div>
  );
};