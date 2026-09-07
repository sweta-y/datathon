export const fmt = {
  /** Format a number with locale commas */
  number: (n) => n?.toLocaleString('en-US') ?? '—',

  /** Format as percentage with 1 decimal */
  pct: (n) => (n != null ? `${n.toFixed(1)}%` : '—'),

  /** Format currency in compact notation (e.g. $2.8M) */
  currency: (n) => {
    if (n == null) return '—';
    if (n >= 1_000_000) return `\$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `\$${(n / 1_000).toFixed(0)}K`;
    return `\$${n}`;
  },

  /** Format date as MMM DD */
  shortDate: (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  /** Delta with +/- sign */
  delta: (n) => (n > 0 ? `+${n}` : `${n}`),
};
