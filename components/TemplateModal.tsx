import React, { useState } from 'react';
import { X, Save, FileText, Trash2, CheckCircle, Layout } from 'lucide-react';
import { Template } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelect: (template: Template) => void;
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelect,
  onSave,
  onDelete,
}) => {
  const [newTemplateName, setNewTemplateName] = useState('');
  const [activeTab, setActiveTab] = useState<'select' | 'save'>('select');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newTemplateName.trim()) return;
    onSave(newTemplateName);
    setNewTemplateName('');
    setActiveTab('select'); // Switch back to list after save
  };

  const systemTemplates = templates.filter(t => t.isSystem);
  const userTemplates = templates.filter(t => !t.isSystem);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
             <Layout className="text-blue-600" size={24} />
             <h2 className="text-xl font-bold text-gray-800">模版管理 (Template Manager)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'select' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            选择模版 (Select Template)
          </button>
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'save' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            保存当前文件为模版 (Save Current)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {activeTab === 'select' && (
            <div className="space-y-6">
              {/* System Templates */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  系统模版 (System Defaults)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {systemTemplates.map(template => (
                    <div 
                      key={template.id}
                      onClick={() => onSelect(template)}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group relative"
                    >
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <FileText size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{template.name}</h4>
                              <p className="text-xs text-gray-500">System Default</p>
                            </div>
                          </div>
                       </div>
                       <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* User Templates */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1 mt-2">
                  我的模版 (My Templates)
                </h3>
                {userTemplates.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-400 text-sm">暂无自定义模版 (No custom templates)</p>
                    <button 
                      onClick={() => setActiveTab('save')}
                      className="mt-2 text-blue-600 text-sm hover:underline"
                    >
                      保存当前为模版
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userTemplates.map(template => (
                      <div 
                        key={template.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group relative"
                      >
                         <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => onSelect(template)}>
                              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <FileText size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">{template.name}</h4>
                                <p className="text-xs text-gray-500">{formatDate(template.createdAt)}</p>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if(confirm('Are you sure you want to delete this template?')) onDelete(template.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors z-10"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'save' && (
            <div className="flex flex-col h-full justify-center max-w-md mx-auto">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                      <Save size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">保存为新模版</h3>
                    <p className="text-sm text-gray-500">
                      Save the current editor state as a reusable template.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">模版名称 (Template Name)</label>
                      <input 
                        type="text" 
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder="e.g. 华南大区月度任免"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleSave}
                      disabled={!newTemplateName.trim()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle size={18} />
                      确认保存 (Save Template)
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};