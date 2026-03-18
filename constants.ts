import { Block, BlockType } from './types';

export const INITIAL_BLOCKS: Block[] = [
  { 
    id: "1", 
    type: BlockType.HEADER, 
    isLocked: true, 
    data: { text: "广东海大集团股份有限公司文件", color: 'red' } 
  },
  { 
    id: "2", 
    type: BlockType.RED_LINE, 
    isLocked: true, 
    data: { color: 'red' } 
  },
  { 
    id: "3", 
    type: BlockType.DOC_NO, 
    isLocked: false, 
    data: { word: "海大字", year: "2025", number: "12" } 
  },
  { 
    id: "4", 
    type: BlockType.TITLE, 
    isLocked: false, 
    data: { text: "关于程深明等同志职务任免的通知" } 
  },
  { 
    id: "5", 
    type: BlockType.PARAGRAPH, 
    isLocked: false, 
    data: { text: "集团各中心、大区/事业部、分子公司：" } 
  },
  { 
    id: "6", 
    type: BlockType.PARAGRAPH, 
    isLocked: false, 
    data: { text: "经集团研究决定，人事任免如下：" } 
  },
  {
    id: "7",
    type: BlockType.DEPT_GROUP,
    isLocked: false,
    data: {
      deptName: "华南大区",
      appointments: [
        { 
          id: "p1", 
          name: "程深明", 
          employeeId: "002559", 
          position: "华南大区茂名区域茂名海维生产副经理", 
          level: "20",
          hasLevelChange: true 
        }
      ],
      concurrents: [], // Initialize concurrents
      removals: [
        {
          id: "p2",
          name: "赖伟君",
          employeeId: "001095",
          position: "华南大区粤赣片区三水番灵生产副经理"
        }
      ]
    }
  },
  { 
    id: "8", 
    type: BlockType.PARAGRAPH, 
    isLocked: false, 
    data: { text: "    以上任命干部的过往职务免去（含兼职），不再另行发文，以最新任命为准。" } 
  },
  { 
    id: "9", 
    type: BlockType.DATE, 
    isLocked: false, 
    data: { date: new Date().toISOString().split('T')[0] } 
  }
];