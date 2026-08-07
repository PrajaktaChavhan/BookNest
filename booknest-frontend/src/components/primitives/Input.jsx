export function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-soft mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={
          'w-full rounded-sm border bg-paper-raised px-3.5 py-2.5 text-ink placeholder:text-ink-soft/60 ' +
          'focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition ' +
          (error ? 'border-danger' : 'border-hairline') +
          ' ' + className
        }
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? inputId + '-error' : undefined}
        {...props}
      />
      {error && (
        <p id={inputId + '-error'} className="text-sm text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ label, error, className = '', id, children, ...props }) {
  const selectId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-ink-soft mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={
          'w-full rounded-sm border bg-paper-raised px-3.5 py-2.5 text-ink ' +
          'focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition ' +
          (error ? 'border-danger' : 'border-hairline') +
          ' ' + className
        }
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', id, ...props }) {
  const areaId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={areaId} className="block text-sm font-medium text-ink-soft mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={
          'w-full rounded-sm border bg-paper-raised px-3.5 py-2.5 text-ink placeholder:text-ink-soft/60 ' +
          'focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition ' +
          (error ? 'border-danger' : 'border-hairline') +
          ' ' + className
        }
        {...props}
      />
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
}
