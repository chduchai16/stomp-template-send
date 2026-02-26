import React from 'react';
import { WifiOff } from 'lucide-react';

interface DisconnectConfirmProps {
  showConfirm: boolean;
  isDisconnecting: boolean;
  url: string;
  subscriptionCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DisconnectConfirm({
  showConfirm,
  isDisconnecting,
  url,
  subscriptionCount,
  onCancel,
  onConfirm,
}: DisconnectConfirmProps) {
  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md space-y-4 animate-in text-xs">
        <div className="border-b border-neutral-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <WifiOff size={20} className="text-rose-500" />
            Xác nhận hủy kết nối
          </h2>
        </div>

        <div className="space-y-2 text-sm text-neutral-300">
          <p>• Kết nối WebSocket sẽ bị đóng</p>
          <p>
            • Tất cả <span className="font-semibold text-emerald-500">{subscriptionCount} subscriptions</span> sẽ bị xóa
          </p>
          <p>• Bạn sẽ không nhận được tin nhắn trong khi ngắt kết nối</p>
        </div>

        <div className="bg-neutral-950/50 border border-neutral-800 rounded p-3">
          <p className="text-xs text-neutral-500 mb-2">Kết nối:</p>
          <p className="text-xs text-neutral-300 font-mono break-all">{url}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isDisconnecting}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded font-bold transition-all disabled:opacity-50 text-xs"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDisconnecting}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
          >
            {isDisconnecting ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Đang hủy...
              </>
            ) : (
              <>
                <WifiOff size={16} />
                Xác nhận hủy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
