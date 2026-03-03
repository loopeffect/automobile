import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const Messages = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeConvId, setActiveConvId] = useState(null);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const bottomRef = useRef(null);

  // Connect socket
  useEffect(() => {
    const s = io(SOCKET_URL, { auth: { token: localStorage.getItem('token') } });
    s.emit('user:join', user._id);
    s.on('message:receive', ({ conversationId, message }) => {
      qc.setQueryData(['messages', conversationId], (old) => old ? [...old, message] : [message]);
      qc.invalidateQueries(['conversations']);
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user._id, qc]);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesAPI.getConversations().then((r) => r.data.data),
    refetchInterval: 30000,
  });

  const { data: messages = [], isLoading: loadingMsgs } = useQuery({
    queryKey: ['messages', activeConvId],
    queryFn: () => messagesAPI.getMessages(activeConvId).then((r) => r.data.data),
    enabled: !!activeConvId,
  });

  const sendMutation = useMutation({
    mutationFn: (t) => messagesAPI.sendMessage(activeConvId, { text: t }),
    onSuccess: (res) => {
      qc.setQueryData(['messages', activeConvId], (old) => [...(old || []), res.data.data]);
      qc.invalidateQueries(['conversations']);
      socket?.emit('message:send', { conversationId: activeConvId, message: res.data.data });
    },
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConvId) return;
    sendMutation.mutate(text.trim());
    setText('');
  };

  const activeConv = conversations.find((c) => c._id === activeConvId);
  const otherParticipant = (conv) => conv?.participants?.find((p) => p._id !== user._id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#0b1630] px-4 sm:px-6 py-4">
        <h1 className="text-white text-xl font-bold">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Conversation list */}
        <div className={`w-full md:w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Conversations ({conversations.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-center text-gray-400 text-sm p-8">No conversations yet</p>
            ) : conversations.map((conv) => {
              const other = otherParticipant(conv);
              const unread = conv.unreadCount?.[user._id] || 0;
              return (
                <button key={conv._id} onClick={() => { setActiveConvId(conv._id); socket?.emit('conversation:join', conv._id); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 text-left transition-colors ${activeConvId === conv._id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {other?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 truncate">{other?.name || 'Unknown'}</p>
                      {unread > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{unread}</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage?.text || 'No messages yet'}</p>
                    {conv.listing && <p className="text-xs text-blue-400 truncate">{conv.listing?.title}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${activeConvId ? 'flex' : 'hidden md:flex'}`}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
              <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-400 hover:text-gray-600 mr-1">←</button>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {otherParticipant(activeConv)?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{otherParticipant(activeConv)?.name}</p>
                  {activeConv?.listing && <p className="text-xs text-blue-500">{activeConv.listing?.title}</p>}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {loadingMsgs ? (
                  <div className="flex justify-center pt-8"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : messages.map((msg) => {
                  const isMine = msg.sender?._id === user._id || msg.sender === user._id;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {!isMine && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2 flex-shrink-0 self-end">
                          {msg.sender?.name?.[0] || '?'}
                        </div>
                      )}
                      <div className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-4 py-2.5 ${isMine ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}>
                        <p className="text-sm leading-relaxed">{msg.isDeleted ? <em className="opacity-50">Message deleted</em> : msg.text}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="bg-white border-t border-gray-200 px-4 py-3 flex gap-3 items-end">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  placeholder="Type a message…"
                  rows={1}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
                  style={{ minHeight: '44px' }}
                />
                <button type="submit" disabled={!text.trim() || sendMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white p-3 rounded-xl flex-shrink-0 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
