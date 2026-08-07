// A horizontal "shelf" of books - the core browsing pattern for Home and
// campus/course discovery, replacing a plain results grid for anything
// that isn't an active search.
export function Shelf({ title, subtitle, children, action }) {
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-3 px-5 md:px-0">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-ink-soft mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="shelf-row flex gap-4 overflow-x-auto px-5 md:px-0 pb-1 snap-x snap-mandatory">
        {children}
      </div>
    </section>
  );
}
