import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages } from '../../api/chat.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { StatusStamp } from '../primitives/Stamp.jsx';

const PAGE_SIZE = 20;

export function MessageThread({ conversation, conversationId }) {
  const { user } = useAuth();
  const { socket, isConnected, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [draft, setDraft] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const shouldStickToBottom = useRef(true);

  const otherPerson = conversation?.participants.find((p) => p._id !== user.id);
  const isOtherOnline = otherPerson && onlineUsers.has(otherPerson._id);

  // Initial load + join the socket room for this conversation.
  useEffect(() => {
    setIsLoading(true);
    setHasMore(true);
    getMessages(conversationId, { limit: PAGE_SIZE })
      .then((res) => {
        setMessages(res.data.messages);
        setHasMore(res.data.messages.length === PAGE_SIZE);
      })
      .finally(() => setIsLoading(false));

    if (socket && isConnected) {
      socket.emit('join_conversation', { conversationId });
    }
  }, [conversationId, socket, isConnected]);

  // Load older messages when the user scrolls near the top - preserving
  // scroll position so the view doesn't jump when history is prepended.
  async function loadOlderMessages() {
    if (isLoadingOlder || !hasMore || messages.length === 0) return;
    const container = scrollRef.current;
    const oldScrollHeight = container.scrollHeight;

    setIsLoadingOlder(true);
    shouldStickToBottom.current = false;
    try {
      const oldest = messages[0];
      const res = await getMessages(conversationId, {
        before: oldest.createdAt,
        limit: PAGE_SIZE,
      });
      const older = res.data.messages;
      setMessages((prev) => [...older, ...prev]);
      setHasMore(older.length === PAGE_SIZE);

      // Restore scroll position relative to the content that was already visible.
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - oldScrollHeight;
      });
    } finally {
      setIsLoadingOlder(false);
    }
  }

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollTop < 60) {
      loadOlderMessages();
    }
    // Only auto-stick to bottom on new messages if the user is already near it.
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    shouldStickToBottom.current = nearBottom;
  }

  // Listen for live messages and typing, scoped to this conversation.
  useEffect(() => {
    if (!socket) return;

    function handleNewMessage({ message }) {
      if (message.conversation !== conversationId) return;
      setMessages((prev) => [...prev, message]);
      if (message.sender !== user.id) setIsOtherTyping(false);
      shouldStickToBottom.current = true;
    }

    function handleTyping({ conversationId: cid, userId }) {
      if (cid !== conversationId || userId === user.id) return;
      setIsOtherTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2000);
    }

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, conversationId, user.id]);

  useEffect(() => {
    if (shouldStickToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOtherTyping]);

  function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !socket) return;
    socket.emit('send_message', { conversationId, text });
    setDraft('');
  }

  function handleTypingInput(e) {
    setDraft(e.target.value);
    socket?.emit('typing', { conversationId });
  }

  return (
    <div className="flex flex-col h-full">
      {conversation && (
        <div className="border-b border-hairline px-4 py-3 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-sm bg-moss/10 flex items-center justify-center shrink-0">
            <span className="font-display text-moss text-sm font-semibold">
              {otherPerson?.name?.[0]?.toUpperCase() || '?'}
            </span>
            {isOtherOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-moss rounded-full border-2 border-paper-raised" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink truncate">{otherPerson?.name}</p>
            <p className="text-xs text-ink-soft">{isOtherOnline ? 'Online now' : 'Offline'}</p>
          </div>
          {conversation.listing && (
            <Link
              to={'/listings/' + conversation.listing._id}
              className="hidden sm:flex items-center gap-2 border border-hairline px-2.5 py-1.5 rounded-sm shrink-0"
            >
              <span className="text-xs text-ink-soft max-w-[120px] truncate">
                {conversation.listing.title}
              </span>
              <StatusStamp status={conversation.listing.status} />
            </Link>
          )}
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5"
      >
        {isLoading ? (
          <p className="text-center text-sm text-ink-soft font-mono">loading...</p>
        ) : (
          <>
            {isLoadingOlder && (
              <p className="text-center text-xs text-ink-soft font-mono py-1">
                loading earlier messages...
              </p>
            )}
            {!hasMore && messages.length > 0 && (
              <p className="text-center text-xs text-ink-soft py-1">
                Start of your conversation
              </p>
            )}
            {messages.length === 0 ? (
              <p className="text-center text-sm text-ink-soft">No messages yet - say hello.</p>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} isOwn={msg.sender === user.id} />
              ))
            )}
          </>
        )}
        {isOtherTyping && (
          <p className="text-xs text-ink-soft font-mono px-1">
            {otherPerson?.name || 'They'} is typing...
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-hairline p-3 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={handleTypingInput}
          placeholder="Write a message..."
          aria-label="Message"
          className="flex-1 rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="bg-moss text-paper-raised px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-moss-deep disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
