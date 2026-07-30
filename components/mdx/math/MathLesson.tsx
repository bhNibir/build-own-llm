import type { ReactNode } from 'react';
import { KatexFormula } from './KatexFormula';

type SymbolRow = { sym: string; meaning: string };

export function MathLesson({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-6 not-prose overflow-hidden rounded-xl border border-fd-border bg-gradient-to-br from-indigo-50/80 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/30">
      {title && (
        <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-2.5">
          <span className="text-sm font-semibold text-fd-foreground">{title}</span>
        </div>
      )}
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

export function MathIntuition({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100">
      <span className="mr-1.5 font-semibold">বুঝো:</span>
      {children}
    </div>
  );
}

export function SymbolTable({ symbols }: { symbols: SymbolRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border bg-fd-muted/50">
            <th className="px-3 py-2 text-left font-medium">প্রতীক</th>
            <th className="px-3 py-2 text-left font-medium">মানে</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((row) => (
            <tr key={row.sym} className="border-b border-fd-border last:border-0">
              <td className="px-3 py-2 font-mono text-fd-primary">{row.sym}</td>
              <td className="px-3 py-2 text-fd-muted-foreground">{row.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-center">
      <KatexFormula>{children}</KatexFormula>
    </div>
  );
}

export function WorkedExample({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm leading-relaxed dark:border-emerald-800 dark:bg-emerald-950/40">
      <span className="mb-1 block font-semibold text-emerald-800 dark:text-emerald-200">
        উদাহরণ (গণনা)
      </span>
      <div className="whitespace-pre-wrap font-mono text-emerald-900 dark:text-emerald-100">{children}</div>
    </div>
  );
}

export function CodeLink({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-xs font-medium text-fd-muted-foreground">{children}</p>
  );
}

export { MathPractical } from './MathPractical';
