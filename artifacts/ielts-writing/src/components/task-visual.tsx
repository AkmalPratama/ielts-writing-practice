import type { TaskVisual } from '@workspace/api-client-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = [1, 2, 3, 4, 5].map((n) => `hsl(var(--chart-${n}))`);

function Grid({ title, cells }: { title: string; cells: string[] }) {
  const items = Array.from({ length: 9 }, (_, i) => cells[i] ?? '');
  return (
    <div className="flex-1 min-w-[140px]">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{title}</p>
      <div className="grid grid-cols-3 gap-1 aspect-square">
        {items.map((c, i) => (
          <div
            key={i}
            className={`flex items-center justify-center text-center text-[11px] sm:text-xs leading-tight p-1 rounded-sm border ${
              c ? 'bg-secondary border-border font-medium' : 'bg-background/50 border-dashed'
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskVisualView({ visual }: { visual: TaskVisual }) {
  const labels = visual.labels ?? [];
  const series = visual.series ?? [];
  let body: React.ReactNode = null;

  if (visual.kind === 'chart' && series.length) {
    const data = labels.map((l, i) => {
      const row: Record<string, string | number> = { label: l };
      series.forEach((s) => (row[s.name] = s.values[i] ?? 0));
      return row;
    });
    const Line_ = series.length === 1 && labels.length > 6;
    body = (
      <div className="h-64 w-full" data-testid="visual-chart">
        <ResponsiveContainer width="100%" height="100%">
          {Line_ ? (
            <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line dataKey={series[0].name} stroke={COLORS[0]} strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s, i) => (
                <Bar key={s.name} dataKey={s.name} fill={COLORS[i % 5]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  } else if (visual.kind === 'table' && series.length) {
    body = (
      <div className="overflow-x-auto" data-testid="visual-table">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2 border-b-2 border-primary/40" />
              {labels.map((l) => (
                <th key={l} className="p-2 border-b-2 border-primary/40 font-semibold">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.name} className="odd:bg-secondary/50">
                <th className="p-2 text-left font-medium">{s.name}</th>
                {labels.map((l, i) => (
                  <td key={l} className="p-2 tabular-nums">
                    {s.values[i] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (visual.kind === 'process' && visual.steps?.length) {
    body = (
      <ol className="space-y-0" data-testid="visual-process">
        {visual.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              {i < visual.steps!.length - 1 && <span className="w-px flex-1 bg-primary/30 my-1" />}
            </div>
            <p className="pb-4 text-sm pt-1">{s}</p>
          </li>
        ))}
      </ol>
    );
  } else if (visual.kind === 'map') {
    body = (
      <div className="flex flex-wrap gap-4" data-testid="visual-map">
        <Grid title="Before" cells={visual.before ?? []} />
        <Grid title="After" cells={visual.after ?? []} />
      </div>
    );
  }

  return (
    <figure className="rounded-lg border bg-card p-4">
      <figcaption className="display text-base mb-3">{visual.title}</figcaption>
      {body ?? <p className="text-sm text-muted-foreground">No visual data supplied for this task.</p>}
    </figure>
  );
}
