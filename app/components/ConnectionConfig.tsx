import React from 'react';
import { Settings } from 'lucide-react';

interface ConnectionConfigProps {
  url: string;
  setUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
  isConnected: boolean;
  isDisconnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  validateUrl: (url: string) => { valid: boolean; error?: string };
}

export default function ConnectionConfig({
  url,
  setUrl,
  token,
  setToken,
  isConnected,
  isDisconnecting,
  onConnect,
  onDisconnect,
  validateUrl,
}: ConnectionConfigProps) {
  return (
    <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2 mb-3">
        <Settings size={14} /> <span>CONNECTION CONFIG</span>
      </div>
      
      <div>
        <label className="block text-neutral-500 mb-1 text-xs">WS Endpoint URL</label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className={`w-full bg-black border p-2 rounded focus:outline-none transition-colors text-xs ${
            validateUrl(url).valid
              ? 'border-neutral-800 focus:border-emerald-500'
              : 'border-rose-600 focus:border-rose-500'
          }`}
          placeholder="http://localhost:8080/ws/chat"
        />
        {!validateUrl(url).valid && url && (
          <p className="text-rose-500 text-xs mt-1">⚠️ {validateUrl(url).error}</p>
        )}
        <p className="text-neutral-600 text-xs mt-2">
          💡 Format: <span className="text-neutral-400 font-mono">http://host:port/path</span> hoặc{' '}
          <span className="text-neutral-400 font-mono">https://host:port/path</span>
        </p>
      </div>
      
      <div>
        <label className="block text-neutral-500 mb-1 text-xs">JWT Token (Bearer)</label>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          rows={3}
          className="w-full bg-black border border-neutral-800 p-2 rounded focus:border-emerald-500 outline-none transition-colors overflow-hidden text-xs"
          placeholder="Paste your token here..."
        />
      </div>
      
      <div className="space-y-2 text-xs">
        <button
          onClick={onConnect}
          disabled={isConnected}
          className={`w-full p-2 rounded font-bold transition-all text-xs ${
            isConnected
              ? 'bg-neutral-700 text-neutral-400 cursor-default opacity-50'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          CONNECT
        </button>
        <button
          onClick={onDisconnect}
          disabled={!isConnected || isDisconnecting}
          className={`w-full p-2 rounded font-bold transition-all text-xs ${
            !isConnected
              ? 'bg-neutral-700 text-neutral-400 cursor-default opacity-50'
              : isDisconnecting
              ? 'bg-orange-600 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
        >
          {isDisconnecting ? 'ĐANG HỦY...' : 'DISCONNECT'}
        </button>
      </div>
    </div>
  );
}
