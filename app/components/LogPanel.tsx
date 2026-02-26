import React from 'react';
import { Terminal, Trash2, MessageSquare } from 'lucide-react';
import { LogEntry } from './types';

interface LogPanelProps {
  logs: LogEntry[];
  onClear: () => void;
  logEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function LogPanel({ logs, onClear, logEndRef }: LogPanelProps) {
  return (
    <div className="lg:col-span-2 flex flex-col bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden h-[800px]">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900 text-xs">
        <div className="flex items-center gap-2 text-white uppercase tracking-widest">
          <Terminal size={14} /> <span>Traffic Log</span>
        </div>
        <button
          onClick={onClear}
          className="text-neutral-500 hover:text-white transition-colors"
          title="Clear Logs"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2 opacity-50">
            <MessageSquare size={48} />
            <p className="text-xs">Awaiting traffic...</p>
          </div>
        )}
        {logs.map(log => (
          <div
            key={log.id}
            className={`group border-l-2 pl-4 py-1 transition-all text-xs ${
              log.type === 'received'
                ? 'border-emerald-600 hover:border-emerald-500 bg-emerald-950/10 rounded ps-3 animate-in'
                : 'border-neutral-800 hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-neutral-600">{log.timestamp}</span>
              <span
                className={`text-[10px] font-bold uppercase px-1.5 rounded ${
                  log.type === 'sent'
                    ? 'bg-blue-500/10 text-blue-500'
                    : log.type === 'received'
                    ? 'bg-emerald-500/10 text-emerald-500 ring ring-emerald-500/30'
                    : log.type === 'error'
                    ? 'bg-rose-500/10 text-rose-500'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {log.type}
              </span>
              {log.destination && (
                <span className="text-[10px] text-neutral-500 italic">to: {log.destination}</span>
              )}
            </div>
            <pre
              className={`text-white text-xs break-all whitespace-pre-wrap p-3 rounded border ${
                log.type === 'received'
                  ? 'bg-emerald-950/30 border-emerald-600/30'
                  : 'bg-neutral-950/50 border-neutral-800/50'
              }`}
            >
              {log.content}
            </pre>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
