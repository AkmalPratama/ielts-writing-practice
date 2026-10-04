import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetAiStatus } from '@workspace/api-client-react';

export const DISCLAIMER =
  'Unofficial practice tool. It is not affiliated with IELTS, the British Council, IDP or Cambridge, and sample bands are illustrations, not predictions of an official score.';

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const status = useGetAiStatus();
  const nav = [
    { href: '/', label: 'Practice' },
    { href: '/guide', label: 'Guide' },
  ];
  const aiLabel = status.isLoading
    ? 'Checking AI'
    : status.isError
      ? 'AI status unknown'
      : status.data?.enabled
        ? 'AI on'
        : 'AI off';
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b bg-card/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="display text-lg whitespace-nowrap" data-testid="link-home">
            Writing <span className="text-[hsl(var(--chart-2))] italic">Desk</span>
          </Link>
          <nav className="flex gap-1 ml-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-testid={`link-nav-${n.label.toLowerCase()}`}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  loc === n.href ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span
            data-testid="status-ai"
            className="ml-auto text-xs px-2.5 py-1 rounded-full border bg-accent text-accent-foreground whitespace-nowrap"
          >
            {aiLabel}
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-5 px-4 text-xs text-muted-foreground text-center max-w-3xl mx-auto">
        {DISCLAIMER} Everything you type stays in this browser.
      </footer>
    </div>
  );
}
