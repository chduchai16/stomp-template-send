import React from 'react';
import { Send } from 'lucide-react';

interface PublishMessageProps {
  sendDest: string;
  setSendDest: (dest: string) => void;
  messageBody: string;
  setMessageBody: (body: string) => void;
  isConnected: boolean;
  onSend: () => void;
}

export default function PublishMessage({
  sendDest,
  setSendDest,
  messageBody,
  setMessageBody,
  isConnected,
  onSend,
}: PublishMessageProps) {
  return (
    <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3 text-xs">
        <div className="flex items-center gap-2 text-white">
          <Send size={14} /> <span>PUBLISH MESSAGE</span>
        </div>
      </div>
      
      <div>
        <label className="block text-neutral-500 mb-1 text-xs">Destination</label>
        <input
          type="text"
          value={sendDest}
          onChange={e => setSendDest(e.target.value)}
          className="w-full bg-black border border-neutral-800 p-2 rounded outline-none text-xs focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-neutral-500 mb-1 text-xs">Body (JSON)</label>
        <textarea
          value={messageBody}
          onChange={e => setMessageBody(e.target.value)}
          rows={6}
          className="w-full bg-black border border-neutral-800 p-2 rounded outline-none focus:border-blue-500 text-xs"
        />
      </div>
      
      <button
        onClick={onSend}
        disabled={!isConnected}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold disabled:opacity-50 transition-all text-xs"
      >
        SEND STOMP MESSAGE
      </button>
    </div>
  );
}
