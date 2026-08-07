// Rectangular ink-stamp mark for full-page contexts (Book Details) where
// there's no card fold to embed status in - see index.css .ink-stamp.
const STATUS_COLORS = {
  Available: 'text-moss',
  Reserved: 'text-ochre',
  Sold: 'text-ink-soft',
};

export function StatusStamp({ status, animate = false }) {
  return (
    <span
      className={
        'ink-stamp bg-paper-raised font-medium ' +
        (STATUS_COLORS[status] || 'text-ink-soft') +
        (animate ? ' stamp-animate' : '')
      }
      role="status"
      aria-label={'Availability: ' + status}
    >
      {status}
    </span>
  );
}
