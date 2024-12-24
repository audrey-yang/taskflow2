export type Priority = 0 | 1 | 2;
const priorities = ["Low", "Medium", "High"];
export const PRIORITY = {
  LOW: 0 as Priority,
  MEDIUM: 1 as Priority,
  HIGH: 2 as Priority,
} as const;
export const priorityToString = (raw: Priority) => priorities[raw];
const priorityColors = ["green", "yellow", "red"];
export const priorityToColor = (raw: Priority) => priorityColors[raw];

export type Status = 0 | 1 | 2;
const statuses = ["Completed", "In progress", "Not started"];
export const STATUS = {
  COMPLETED: 0 as Status,
  IN_PROGRESS: 1 as Status,
  NOT_STARTED: 2 as Status,
} as const;
export const statusToString = (raw: Status) => statuses[raw];

export interface Task {
  title: string;
  priority: Priority;
  status: Status;
  note: string;
  parentId: string;
}

export interface DBTask extends Task {
  _id: string;
  _rev: string;
}

export interface Note {
  title: string;
  creationDate: number;
  content: string;
}

export interface DBNote extends Note {
  _id: string;
  _rev: string;
}
