// Deliberately NOT pill-shaped - a solid rectangular block with sharp
// corners reads closer to a library stamp than a SaaS button. Secondary
// actions are underlined text, not a bordered pill.
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const SIZES = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-[15px]',
  };

  if (variant === 'secondary') {
    return (
      <button
        className={
          'inline-flex items-center gap-1.5 font-medium text-ink-soft hover:text-moss ' +
          'underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-moss ' +
          'transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/40 rounded-sm ' +
          SIZES[size] + ' ' + className
        }
        {...props}
      >
        {children}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        className={
          'inline-flex items-center gap-1.5 font-medium text-ink-soft hover:text-ink transition-colors ' +
          'disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/40 rounded-sm ' +
          SIZES[size] + ' ' + className
        }
        {...props}
      >
        {children}
      </button>
    );
  }

  if (variant === 'danger') {
    return (
      <button
        className={
          'inline-flex items-center justify-center gap-2 font-medium border border-danger text-danger ' +
          'hover:bg-danger hover:text-paper-raised transition-colors disabled:opacity-50 ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 rounded-sm ' +
          SIZES[size] + ' ' + className
        }
        {...props}
      >
        {children}
      </button>
    );
  }

  // primary - solid rectangular block
  return (
    <button
      className={
        'inline-flex items-center justify-center gap-2 font-medium bg-moss text-paper-raised ' +
        'hover:bg-moss-deep transition-colors disabled:opacity-50 rounded-sm ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ' +
        SIZES[size] + ' ' + className
      }
      {...props}
    >
      {children}
    </button>
  );
}
