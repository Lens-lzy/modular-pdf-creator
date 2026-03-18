import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Lock, Plus, UserMinus, UserPlus, Briefcase, ToggleLeft, ToggleRight, Palette } from 'lucide-react';
import { Block, BlockType, PersonEntry } from '../types';

interface EditorBlockProps {
  block: Block;
  onChange: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({ block, onChange, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (field: string, value: string) => {
    onChange(block.id, { ...block.data, [field]: value });
  };

  const handlePersonChange = (
    listType: 'appointments' | 'removals' | 'concurrents',
    personId: string,
    field: keyof PersonEntry,
    value: any
  ) => {
    const list = block.data[listType] || [];
    const newList = list.map(p => p.id === personId ? { ...p, [field]: value } : p);
    onChange(block.id, { ...block.data, [listType]: newList });
  };

  const addPerson = (listType: 'appointments' | 'removals' | 'concurrents') => {
    const list = block.data[listType] || [];
    const newPerson: PersonEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      employeeId: '',
      position: '',
      level: '',
      hasLevelChange: true // Default to true
    };
    onChange(block.id, { ...block.data, [listType]: [...list, newPerson] });
  };

  const removePerson = (listType: 'appointments' | 'removals' | 'concurrents', personId: string) => {
    const list = block.data[listType] || [];
    const newList = list.filter(p => p.id !== personId);
    onChange(block.id, { ...block.data, [listType]: newList });
  };

  const renderColorSelector = () => (
    <div className="flex items-center gap-3 mt-2 bg-gray-50 p-2 rounded border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
        <Palette size={12} /> 颜色 (Color)
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => handleChange('color', 'red')}
          className={`w-6 h-6 rounded-full bg-[#DD2C00] border-2 transition-all ${
            block.data.color !== 'black' ? 'border-gray-800 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
          }`}
          title="Red"
        />
        <button
          onClick={() => handleChange('color', 'black')}
          className={`w-6 h-6 rounded-full bg-black border-2 transition-all ${
            block.data.color === 'black' ? 'border-gray-500 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
          }`}
          title="Black"
        />
      </div>
    </div>
  );

  const renderPersonInput = (person: PersonEntry, type: 'appointments' | 'removals' | 'concurrents') => (
    <div key={person.id} className="bg-gray-50 p-2 rounded border border-gray-200 mb-2 relative group/item">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="text"
          placeholder="姓名"
          className="p-1 border border-gray-300 rounded text-sm w-full"
          value={person.name}
          onChange={(e) => handlePersonChange(type, person.id, 'name', e.target.value)}
        />
        <input
          type="text"
          placeholder="工号 (e.g. 002559)"
          className="p-1 border border-gray-300 rounded text-sm w-full"
          value={person.employeeId}
          onChange={(e) => handlePersonChange(type, person.id, 'employeeId', e.target.value)}
        />
      </div>
      <input
        type="text"
        placeholder="职位 (全称)"
        className="p-1 border border-gray-300 rounded text-sm w-full mb-2"
        value={person.position}
        onChange={(e) => handlePersonChange(type, person.id, 'position', e.target.value)}
      />
      {type === 'appointments' && (
        <div className="flex flex-col gap-1 mb-1 bg-white p-2 rounded border border-gray-200">
           <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">职级是否有变化?</span>
              <button 
                onClick={() => handlePersonChange(type, person.id, 'hasLevelChange', !person.hasLevelChange)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border hover:bg-gray-50 transition-colors"
              >
                {person.hasLevelChange ? (
                   <><ToggleRight className="text-blue-500" size={16} /> 是 (Yes)</>
                ) : (
                   <><ToggleLeft className="text-gray-400" size={16} /> 否 (No)</>
                )}
              </button>
           </div>
           <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-gray-500 whitespace-nowrap">
                {person.hasLevelChange ? "【职级" : "【原职级"}
             </span>
             <input
                type="text"
                placeholder="20"
                className="p-1 border border-gray-300 rounded text-sm w-16 text-center"
                value={person.level || ''}
                onChange={(e) => handlePersonChange(type, person.id, 'level', e.target.value)}
              />
             <span className="text-xs text-gray-500 whitespace-nowrap">
                {person.hasLevelChange ? "级】" : "级不变】"}
             </span>
           </div>
        </div>
      )}
      <button
        onClick={() => removePerson(type, person.id)}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 opacity-0 group-hover/item:opacity-100 transition-opacity"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );

  const renderInputs = () => {
    switch (block.type) {
      case BlockType.HEADER:
        return (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">发文机关 (Header)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={block.data.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
            {renderColorSelector()}
          </div>
        );
      case BlockType.DOC_NO:
        return (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">发文字号 (Doc No)</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="代字"
                className="w-20 p-2 border border-gray-300 rounded"
                value={block.data.word || ''}
                onChange={(e) => handleChange('word', e.target.value)}
              />
              <span className="text-gray-400">[</span>
              <input
                type="text"
                placeholder="年份"
                className="w-20 p-2 border border-gray-300 rounded"
                value={block.data.year || ''}
                onChange={(e) => handleChange('year', e.target.value)}
              />
              <span className="text-gray-400">]</span>
              <input
                type="text"
                placeholder="号"
                className="w-16 p-2 border border-gray-300 rounded"
                value={block.data.number || ''}
                onChange={(e) => handleChange('number', e.target.value)}
              />
              <span className="text-gray-400">号</span>
            </div>
          </div>
        );
      case BlockType.TITLE:
        return (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">标题 (Title)</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={2}
              value={block.data.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </div>
        );
      case BlockType.DEPT_GROUP:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-blue-600 uppercase mb-1 block">部门/大区 (Department)</label>
              <input
                type="text"
                placeholder="e.g. 华南大区"
                className="w-full p-2 border border-gray-300 rounded font-medium"
                value={block.data.deptName || ''}
                onChange={(e) => handleChange('deptName', e.target.value)}
              />
            </div>

            {/* Appointments Section */}
            <div className="border-l-2 border-green-500 pl-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-green-600 uppercase flex items-center gap-1">
                  <UserPlus size={14} /> 任命 (Appointments)
                </label>
                <button
                  onClick={() => addPerson('appointments')}
                  className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100 flex items-center gap-1"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(block.data.appointments || []).map(p => renderPersonInput(p, 'appointments'))}
                {(block.data.appointments || []).length === 0 && (
                   <p className="text-xs text-gray-400 italic">No appointments</p>
                )}
              </div>
            </div>

            {/* Concurrent Section */}
            <div className="border-l-2 border-orange-500 pl-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-orange-600 uppercase flex items-center gap-1">
                  <Briefcase size={14} /> 兼任 (Concurrent)
                </label>
                <button
                  onClick={() => addPerson('concurrents')}
                  className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-200 hover:bg-orange-100 flex items-center gap-1"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(block.data.concurrents || []).map(p => renderPersonInput(p, 'concurrents'))}
                {(block.data.concurrents || []).length === 0 && (
                   <p className="text-xs text-gray-400 italic">No concurrent positions</p>
                )}
              </div>
            </div>

            {/* Removals Section */}
            <div className="border-l-2 border-red-500 pl-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-red-600 uppercase flex items-center gap-1">
                  <UserMinus size={14} /> 免去 (Removals)
                </label>
                <button
                  onClick={() => addPerson('removals')}
                  className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-100 flex items-center gap-1"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(block.data.removals || []).map(p => renderPersonInput(p, 'removals'))}
                {(block.data.removals || []).length === 0 && (
                   <p className="text-xs text-gray-400 italic">No removals</p>
                )}
              </div>
            </div>
          </div>
        );
      case BlockType.APPOINTMENT: // Fallback for legacy
        return (
          <div className="space-y-2 opacity-50">
             <label className="text-xs font-semibold text-gray-500">Legacy Appointment Block</label>
             <input disabled value={block.data.name} className="w-full bg-gray-100 p-1 rounded text-sm" />
          </div>
        );
      case BlockType.REMOVAL: // Fallback for legacy
        return (
          <div className="space-y-2 opacity-50">
             <label className="text-xs font-semibold text-gray-500">Legacy Removal Block</label>
             <input disabled value={block.data.name} className="w-full bg-gray-100 p-1 rounded text-sm" />
          </div>
        );
      case BlockType.DATE:
        return (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">签发日期 (Date)</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={block.data.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
        );
      case BlockType.PARAGRAPH:
        return (
          <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500 uppercase">正文段落 (Paragraph)</label>
             <textarea
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={block.data.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </div>
        )
      case BlockType.RED_LINE:
        return (
          <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500 uppercase">分割线 (Separator)</label>
             <div className="h-8 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
               <div className={`h-1 w-full mx-4 transition-colors ${block.data.color === 'black' ? 'bg-black' : 'bg-[#DD2C00]'}`}></div>
             </div>
             {renderColorSelector()}
          </div>
        );
      default:
        return <div>Unknown Block</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 overflow-hidden"
    >
      <div className="flex items-stretch">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="w-8 bg-gray-50 flex items-center justify-center border-r border-gray-100 cursor-grab active:cursor-grabbing hover:bg-gray-100"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">
          {renderInputs()}
        </div>

        {/* Actions */}
        <div className="w-10 flex flex-col items-center justify-start py-2 gap-2">
           {block.isLocked ? (
             <Lock size={14} className="text-gray-300 mt-2" />
           ) : (
            <button 
              onClick={() => onDelete(block.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
           )}
        </div>
      </div>
    </div>
  );
};