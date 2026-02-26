"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Send, Wifi, WifiOff, Trash2, Plus, X, MessageSquare, Terminal, Settings } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'sent' | 'received' | 'error';
  destination?: string;
  content: string;
}

export default function StompDebugger() {
  // Connection State
  const [url, setUrl] = useState('http://localhost:8080/ws/chat');
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // Messaging State
  const [subscribeDest, setSubscribeDest] = useState('/user/queue/messages');
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [sendDest, setSendDest] = useState('/app/chat.send');
  const [messageBody, setMessageBody] = useState('{\n  "receiverId": 7,\n  "content": "Hello world!"\n}');

  // Log State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Fix global is not defined for SockJS in Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).global = window;
    }
  }, []);

  // Auto scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type: LogEntry['type'], content: string, destination?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      content,
      destination
    };
    setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
  };

  const connect = () => {
    if (client) {
      client.deactivate();
    }

    addLog('info', `Đang kết nối tới ${url}...`);

    const stompClient = new Client({
      brokerURL: url.startsWith('https') ? url.replace('https', 'wss') : url.replace('http', 'ws'),
      connectHeaders: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Fallback to SockJS if it's an http URL
    if (url.startsWith('http')) {
      stompClient.webSocketFactory = () => {
        return new SockJS(url) as any;
      };
    }

    stompClient.onConnect = (frame) => {
      setIsConnected(true);
      addLog('info', 'Kết nối thành công!');
      setClient(stompClient);
    };

    stompClient.onStompError = (frame) => {
      addLog('error', `STOMP Error: ${frame.headers['message']}`);
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
      addLog('info', 'Đã ngắt kết nối WebSocket.');
    };

    stompClient.activate();
  };

  const disconnect = async () => {
    if (!client) return;
    
    setIsDisconnecting(true);
    try {
      // Hủy tất cả subscriptions
      subscriptions.forEach(dest => {
        try {
          const subscription = client.subscribe(dest, () => {});
          subscription?.unsubscribe();
        } catch (e) {
          console.log(`Failed to unsubscribe from ${dest}`);
        }
      });

      // Đợi một chút trước khi deactivate
      await new Promise(resolve => setTimeout(resolve, 500));

      client.deactivate();
      setIsConnected(false);
      setClient(null);
      setSubscriptions([]);
      addLog('info', '✓ Đã hủy kết nối thành công. Tất cả subscriptions đã bị xóa.');
      setShowDisconnectConfirm(false);
    } catch (err) {
      addLog('error', `Lỗi khi hủy kết nối: ${err}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleDisconnectClick = () => {
    if (isConnected) {
      setShowDisconnectConfirm(true);
    }
  };

  const unsubscribe = (destination: string) => {
    if (!client) return;
    
    try {
      const subscription = client.subscribe(destination, () => {});
      subscription?.unsubscribe();
      setSubscriptions(subscriptions.filter(s => s !== destination));
      addLog('info', `✓ Đã hủy subscribe: ${destination}`);
    } catch (err) {
      addLog('error', `Lỗi khi hủy subscribe ${destination}: ${err}`);
    }
  };

  const subscribe = () => {
    if (!client || !isConnected) return;

    if (subscriptions.includes(subscribeDest)) {
      alert('Destination này đã được subscribe!');
      return;
    }

    client.subscribe(subscribeDest, (message) => {
      addLog('received', message.body, subscribeDest);
    });

    setSubscriptions([...subscriptions, subscribeDest]);
    addLog('info', `Đã subscribe destination: ${subscribeDest}`);
  };

  const sendMessage = () => {
    if (!client || !isConnected) return;

    try {
      // Validate JSON
      JSON.parse(messageBody);

      client.publish({
        destination: sendDest,
        body: messageBody,
      });

      addLog('sent', messageBody, sendDest);
    } catch (e) {
      alert('Nội dung không phải là JSON hợp lệ!');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-4 font-mono text-sm">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header */}
        <header className="flex items-center justify-between bg-neutral-900 p-4 border border-neutral-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Settings Side */}
          <div className="lg:col-span-1 space-y-4 text-xs">

            {/* Connection Config */}
            <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2 mb-3">
                <Settings size={14} /> <span>CONNECTION CONFIG</span>
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">WS Endpoint URL</label>
                <input
                  type="text" value={url} onChange={e => setUrl(e.target.value)}
                  className="w-full bg-black border border-neutral-800 p-2 rounded focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">JWT Token (Bearer)</label>
                <textarea
                  value={token} onChange={e => setToken(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-neutral-800 p-2 rounded focus:border-emerald-500 outline-none transition-colors overflow-hidden"
                  placeholder="Paste your token here..."
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={isConnected ? () => {} : connect}
                  disabled={isConnected}
                  className={`w-full p-2 rounded font-bold transition-all ${isConnected
                      ? 'bg-neutral-700 text-neutral-400 cursor-default opacity-50'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                >
                  CONNECT
                </button>
                <button
                  onClick={handleDisconnectClick}
                  disabled={!isConnected || isDisconnecting}
                  className={`w-full p-2 rounded font-bold transition-all ${!isConnected
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

            {/* Subscriptions */}
            <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2 mb-3">
                <Plus size={14} /> <span>SUBSCRIBE</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text" value={subscribeDest} onChange={e => setSubscribeDest(e.target.value)}
                  className="flex-1 bg-black border border-neutral-800 p-2 rounded outline-none"
                  placeholder="/topic/..."
                />
                <button
                  onClick={subscribe} disabled={!isConnected}
                  className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 disabled:opacity-50"
                >
                  SUB
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pt-2">
                {subscriptions.length === 0 ? (
                  <p className="text-neutral-600 text-xs italic py-2">Chưa có subscriptions</p>
                ) : (
                  subscriptions.map(s => (
                    <div key={s} className="flex items-center justify-between bg-black p-2 rounded border border-neutral-700 hover:border-neutral-600 transition-colors">
                      <span className="text-emerald-500 truncate text-xs">{s}</span>
                      <button 
                        onClick={() => unsubscribe(s)}
                        className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded transition-all"
                        title="Hủy subscribe"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Publish Message */}
            <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <div className="flex items-center gap-2 text-white">
                  <Send size={14} /> <span>PUBLISH MESSAGE</span>
                </div>
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Destination</label>
                <input
                  type="text" value={sendDest} onChange={e => setSendDest(e.target.value)}
                  className="w-full bg-black border border-neutral-800 p-2 rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">Body (JSON)</label>
                <textarea
                  value={messageBody} onChange={e => setMessageBody(e.target.value)}
                  rows={6}
                  className="w-full bg-black border border-neutral-800 p-2 rounded outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={sendMessage} disabled={!isConnected}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold disabled:opacity-50"
              >
                SEND STOMP MESSAGE
              </button>
            </div>
          </div>

          {/* Log Panel */}
          <div className="lg:col-span-2 flex flex-col bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden h-[800px]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900">
              <div className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <Terminal size={14} /> <span>Traffic Log</span>
              </div>
              <button
                onClick={() => setLogs([])}
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
                  <p>Awaiting traffic...</p>
                </div>
              )}
              {logs.map(log => (
                <div key={log.id} className="group border-l-2 border-neutral-800 hover:border-neutral-600 pl-4 py-1 transition-all">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] text-neutral-600">{log.timestamp}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 rounded ${log.type === 'sent' ? 'bg-blue-500/10 text-blue-500' :
                        log.type === 'received' ? 'bg-emerald-500/10 text-emerald-500' :
                          log.type === 'error' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-neutral-800 text-neutral-400'
                      }`}>
                      {log.type}
                    </span>
                    {log.destination && (
                      <span className="text-[10px] text-neutral-500 italic">to: {log.destination}</span>
                    )}
                  </div>
                  <pre className="text-white text-xs break-all whitespace-pre-wrap bg-neutral-950/50 p-3 rounded border border-neutral-800/50">
                    {log.content}
                  </pre>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Dialog */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md space-y-4 animate-in">
            <div className="border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <WifiOff size={20} className="text-rose-500" />
                Xác nhận hủy kết nối
              </h2>
            </div>
            
            <div className="space-y-2 text-sm text-neutral-300">
              <p>• Kết nối WebSocket sẽ bị đóng</p>
              <p>• Tất cả <span className="font-semibold text-emerald-500">{subscriptions.length} subscriptions</span> sẽ bị xóa</p>
              <p>• Bạn sẽ không nhận được tin nhắn trong khi ngắt kết nối</p>
            </div>

            <div className="bg-neutral-950/50 border border-neutral-800 rounded p-3">
              <p className="text-xs text-neutral-500 mb-2">Kết nối:</p>
              <p className="text-xs text-neutral-300 font-mono break-all">{url}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                disabled={isDisconnecting}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded font-bold transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={disconnect}
                disabled={isDisconnecting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
      )}
    </div>
  );
}
