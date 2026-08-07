function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, isOwn }) {
  return (
    <div className={'flex ' + (isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={
          'max-w-[75%] px-3.5 py-2.5 rounded-sm ' +
          (isOwn
            ? 'bg-moss text-paper-raised'
            : 'bg-paper-raised border border-hairline text-ink')
        }
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={
            'font-mono text-[10px] mt-1 ' +
            (isOwn ? 'text-paper-raised/70' : 'text-ink-soft')
          }
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
