import React from 'react';
import { Block, BlockType } from '../types';

interface PreviewBlockProps {
  block: Block;
  isFirstParagraph?: boolean;
}

export const PreviewBlock: React.FC<PreviewBlockProps> = ({ block, isFirstParagraph }) => {
  const { type, data } = block;

  switch (type) {
    case BlockType.HEADER:
      return (
        <div className="text-center mb-2">
          {/* Use color from data, default to official-red */}
          <h1 className={`${data.color === 'black' ? 'text-black' : 'text-official-red'} text-[38px] font-serif leading-tight tracking-widest`}>
            {data.text || '发文机关'}
          </h1>
        </div>
      );

    case BlockType.RED_LINE:
      return (
        <div className={`border-b-[3px] ${data.color === 'black' ? 'border-black' : 'border-official-red'} mb-6 mt-2`}></div>
      );

    case BlockType.DOC_NO:
      // Right aligned
      return (
        <div className="flex justify-end items-center font-serif text-lg mb-8 text-black">
          <span>{data.word}</span>
          <span>〔{data.year}〕</span>
          <span>{data.number}号</span>
        </div>
      );

    case BlockType.TITLE:
      // No bold, 32px
      return (
        <div className="text-center mb-8 px-8">
          <h2 className="text-[32px] font-normal font-serif text-black leading-relaxed">
            {data.text}
          </h2>
        </div>
      );
    
    case BlockType.PARAGRAPH:
      // Logic: First paragraph no indent, others indent 2em
      return (
        <div className={`mb-4 text-xl font-serif text-black leading-8 tracking-wide whitespace-pre-wrap ${isFirstParagraph ? '' : 'indent-[2em]'}`}>
          {data.text}
        </div>
      )

    case BlockType.DEPT_GROUP:
      return (
        <div className="mb-6 font-serif text-black">
          {/* Level 1: Department Header */}
          {data.deptName && (
             <div className="text-xl leading-8 tracking-wide mb-2 font-bold indent-[2em]">
               {data.deptName}：
             </div>
          )}

          {/* Level 2 & 3: Appointments (任命) */}
          {data.appointments && data.appointments.length > 0 && (
            <div className="mb-4">
              <div className="text-xl leading-8 tracking-wide indent-[2em] mb-1">任命：</div>
              {data.appointments.map(p => {
                 let levelText = '';
                 if (p.level) {
                   levelText = p.hasLevelChange ? `，职级${p.level}级` : `，原职级${p.level}级不变`;
                 }

                 return (
                   <div key={p.id} className="text-xl leading-8 tracking-wide indent-[2em] pl-[1em]">
                      {p.name}
                      {p.employeeId && <span className="font-normal font-sans text-lg"> ({p.employeeId}) </span>}
                      为
                      {p.position}
                      {levelText}
                      {'。'}
                   </div>
                 )
              })}
            </div>
          )}

          {/* Level 2 & 3: Concurrent (兼任) */}
          {data.concurrents && data.concurrents.length > 0 && (
            <div className="mb-4">
              <div className="text-xl leading-8 tracking-wide indent-[2em] mb-1">兼任：</div>
              {data.concurrents.map(p => (
                 <div key={p.id} className="text-xl leading-8 tracking-wide indent-[2em] pl-[1em]">
                    {p.name}
                    {p.employeeId && <span className="font-normal font-sans text-lg"> ({p.employeeId}) </span>}
                    为
                    {p.position}
                    {'。'}
                 </div>
              ))}
            </div>
          )}

          {/* Level 2 & 3: Removals (免去) */}
          {data.removals && data.removals.length > 0 && (
            <div>
              <div className="text-xl leading-8 tracking-wide indent-[2em] mb-1">免去：</div>
              {data.removals.map(p => (
                 <div key={p.id} className="text-xl leading-8 tracking-wide indent-[2em] pl-[1em]">
                    {p.name}
                    {p.employeeId && <span className="font-normal font-sans text-lg"> ({p.employeeId}) </span>}
                    <span> </span>
                    {p.position}
                    {'。'}
                 </div>
              ))}
            </div>
          )}
        </div>
      );

    case BlockType.APPOINTMENT: // Legacy support
      return (
        <div className="mb-4 text-xl font-serif text-black leading-8 tracking-wide indent-[2em]">
          <span>任命 </span>
          <span className="font-bold underline decoration-1 underline-offset-4">{data.name}</span>
          <span> 为 </span>
          <span>{data.org}</span>
          <span> </span>
          <span className="font-bold">{data.position}</span>
          <span>。</span>
        </div>
      );

    case BlockType.REMOVAL: // Legacy support
      return (
        <div className="mb-4 text-xl font-serif text-black leading-8 tracking-wide indent-[2em]">
          <span>免去 </span>
          <span className="font-bold underline decoration-1 underline-offset-4">{data.name}</span>
          <span> 的 </span>
          <span>{data.org}</span>
          <span> </span>
          <span className="font-bold">{data.position}</span>
          <span> 职务。</span>
        </div>
      );

    case BlockType.DATE:
      const dateObj = data.date ? new Date(data.date) : new Date();
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      
      return (
        <div className="mt-12 flex flex-col items-end pr-8 font-serif text-xl">
          <div className="mb-2">广东海大集团股份有限公司</div>
          <div>{year}年{month}月{day}日</div>
        </div>
      );

    default:
      return null;
  }
};