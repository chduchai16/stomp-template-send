import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-neutral-900 p-4 border border-neutral-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-rose-500/10 text-rose-500'
          }`}
        >
          {isConnected ? <Wifi size={24} /> : <WifiOff size={24} />}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">KnowHub STOMP Debugger</h1>
          <p className="text-neutral-500 text-xs">Real-time WebSocket Testing Tool</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={isConnected ? 'text-emerald-500' : 'text-rose-500'}>
          {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
      </div>
    </header>
  );
}
