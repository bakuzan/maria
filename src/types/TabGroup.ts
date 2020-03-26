export interface StoredTab {
  title: string;
  url: string;
}

export interface TabGroup {
  id: string;
  name?: string;
  patterns: string[];
  items: StoredTab[];
  isLocked: boolean;
}
