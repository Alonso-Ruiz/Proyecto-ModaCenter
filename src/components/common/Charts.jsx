const palette = ['#0f172a', '#2563eb', '#059669', '#d97706', '#be123c', '#7c3aed'];

function maxValue(data) {
  return Math.max(...data.map((item) => Number(item.total || 0)), 1);
}

export function BarChart({ data, height = 180, valuePrefix = '' }) {
  const max = maxValue(data);

  if (!data.length) {
    return <div className="grid h-full min-h-[160px] place-items-center text-sm text-slate-400">Sin datos para mostrar.</div>;
  }

  return (
    <div className="flex min-h-[180px] items-end gap-3">
      {data.map((item, index) => {
        const barHeight = Math.max(18, Math.round((Number(item.total) / max) * height));

        return (
          <div key={`${item.label}-${index}`} className="group flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-slate-300 transition group-hover:bg-slate-900"
              style={{ height: `${barHeight}px` }}
              title={`${item.label}: ${valuePrefix}${item.total}`}
            />
            <span className="max-w-full truncate text-[11px] text-slate-400">{formatShortLabel(item.label)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBarChart({ data, valuePrefix = '' }) {
  const max = maxValue(data);

  if (!data.length) {
    return <div className="grid min-h-[160px] place-items-center text-sm text-slate-400">Sin datos para mostrar.</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate text-slate-700">{item.label}</span>
            <span className="font-semibold text-slate-950">{valuePrefix}{Number(item.total).toLocaleString('es-PE')}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-800 transition-all"
              style={{ width: `${Math.max(5, (Number(item.total) / max) * 100)}%` }}
              title={`${item.label}: ${valuePrefix}${item.total}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ data, valuePrefix = '' }) {
  const total = data.reduce((sum, item) => sum + Number(item.total || 0), 0);
  let cumulative = 0;

  if (!data.length || total === 0) {
    return <div className="grid min-h-[180px] place-items-center text-sm text-slate-400">Sin datos para mostrar.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-center">
      <svg viewBox="0 0 42 42" className="h-44 w-44">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
        {data.map((item, index) => {
          const value = (Number(item.total) / total) * 100;
          const dash = `${value} ${100 - value}`;
          const offset = 25 - cumulative;
          cumulative += value;

          return (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={palette[index % palette.length]}
              strokeWidth="6"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            >
              <title>{`${item.label}: ${valuePrefix}${item.total}`}</title>
            </circle>
          );
        })}
        <text x="21" y="20" textAnchor="middle" className="fill-slate-950 text-[4px] font-bold">
          {valuePrefix}{total.toLocaleString('es-PE')}
        </text>
        <text x="21" y="25" textAnchor="middle" className="fill-slate-400 text-[3px]">
          total
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette[index % palette.length] }} />
              <span className="truncate">{item.label}</span>
            </span>
            <strong>{valuePrefix}{Number(item.total).toLocaleString('es-PE')}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatShortLabel(label) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    const [, month, day] = label.split('-');
    return `${day}/${month}`;
  }

  return label;
}
