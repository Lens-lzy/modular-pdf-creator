export enum BlockType {
  HEADER = 'header', // The big red company name
  RED_LINE = 'red_line', // The separator
  DOC_NO = 'doc_no', // "Human Resource [2025] No. 12"
  TITLE = 'title', // Document Title
  APPOINTMENT = 'appointment', // Legacy simple appointment
  REMOVAL = 'removal', // Legacy simple removal
  DEPT_GROUP = 'dept_group', // New: Department based grouping
  DATE = 'date', // Signature date
  PARAGRAPH = 'paragraph', // Generic text
}

export interface PersonEntry {
  id: string;
  name: string;
  employeeId: string; // e.g. 002559
  position: string;
  level?: string; // e.g. "20"
  hasLevelChange?: boolean; // True: 职级XX级; False: 原职级XX级不变
}

export interface BlockData {
  text?: string;
  year?: string;
  number?: string;
  word?: string; // e.g. "海大"
  // Legacy fields
  name?: string;
  org?: string;
  position?: string;
  // New fields for DEPT_GROUP
  deptName?: string; // e.g. "华南大区"
  appointments?: PersonEntry[];
  concurrents?: PersonEntry[]; // 兼任 (Concurrent)
  removals?: PersonEntry[];
  
  date?: string;
  color?: 'red' | 'black'; // Header or Line color
}

export interface Block {
  id: string;
  type: BlockType;
  isLocked: boolean; // Cannot be deleted if true
  data: BlockData;
}

export interface Template {
  id: string;
  name: string;
  blocks: Block[];
  isSystem?: boolean; // True if it's a built-in template
  createdAt: number;
}