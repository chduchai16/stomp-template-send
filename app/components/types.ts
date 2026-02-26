export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'sent' | 'received' | 'error';
  destination?: string;
  content: string;
}
