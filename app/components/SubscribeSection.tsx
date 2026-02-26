import React from 'react';
import { Plus, X } from 'lucide-react';

interface SubscribeSectionProps {
  subscribeDest: string;
  setSubscribeDest: (dest: string) => void;
  subscriptions: string[];
  messageCounters: { [key: string]: number };
  isConnected: boolean;
  onSubscribe: () => void;
  onUnsubscribe: (dest: string) => void;
}

export default function SubscribeSection({
  subscribeDest,
  setSubscribeDest,
  subscriptions,
  messageCounters,
  isConnected,
  onSubscribe,
  onUnsubscribe,
}: SubscribeSectionProps) {
  return (
    <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2 mb-3 text-xs">
        <Plus size={14} /> <span>SUBSCRIBE</span>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={subscribeDest}
          onChange={e => setSubscribeDest(e.target.value)}
          className="flex-1 bg-black border border-neutral-800 p-2 rounded outline-none text-xs focus:border-emerald-500"
          placeholder="/topic/..."
        />
        <button
          onClick={onSubscribe}
          disabled={!isConnected}
          className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 disabled:opacity-50 text-xs font-bold transition-all"
        >
          SUB
        </button>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto pt-2">
        {subscriptions.length === 0 ? (
          <p className="text-neutral-600 text-xs italic py-2">Chưa có subscriptions</p>
        ) : (
          subscriptions.map(s => (
            <div
              key={s}
              className={`flex items-center justify-between bg-black p-2 rounded border transition-all text-xs ${
                messageCounters[s] > 0
                  ? 'border-emerald-600 bg-emerald-950/20'
                  : 'border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-emerald-500 truncate flex-1">{s}</span>
                {messageCounters[s] > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {messageCounters[s]} new
                  </span>
                )}
              </div>
              <button
                onClick={() => onUnsubscribe(s)}
                className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded transition-all ml-2 flex-shrink-0"
                title="Hủy subscribe"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
