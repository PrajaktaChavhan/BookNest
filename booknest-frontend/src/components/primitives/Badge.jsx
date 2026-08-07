// Per-transaction-type badge - the subtle color language that lets a shelf
// of mixed listings be scanned at a glance without reading every label.
const TYPE_STYLES = {
  Sell: 'bg-sell-tint text-sell',
  Rent: 'bg-rent-tint text-rent',
  Donate: 'bg-donate-tint text-donate',
  Exchange: 'bg-exchange-tint text-exchange',
};

export function TransactionBadge({ type }) {
  return (
    <span
      className={
        'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium ' +
        (TYPE_STYLES[type] || 'bg-hairline text-ink-soft')
      }
    >
      {type}
    </span>
  );
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  const TONES = {
    neutral: 'bg-hairline/60 text-ink-soft',
    moss: 'bg-sage-light text-moss-deep',
    ochre: 'bg-ochre-light text-ochre',
  };
  return (
    <span
      className={
        'inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium ' +
        TONES[tone] + ' ' + className
      }
    >
      {children}
    </span>
  );
}
