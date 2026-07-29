import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">নিজের LLM বানাও</h1>
      <p className="mb-6 leading-relaxed text-fd-muted-foreground">
        Zero থেকে TypeScript দিয়ে LLM কীভাবে কাজ করে — interactive hands-on শেখা।
        প্রতিটি lesson-এ browser-এ code edit করে run করো। Terminal লাগবে না।
      </p>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/docs/part-00-intro/01-what-is-llm"
          className="rounded-lg bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Course শুরু করো
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
        >
          সব Module দেখো
        </Link>
      </div>

      <div className="grid w-full max-w-lg grid-cols-1 gap-4 text-sm text-fd-muted-foreground sm:grid-cols-3">
        <div className="rounded-xl border-2 border-indigo-200/60 bg-indigo-50/40 p-3 dark:border-indigo-800/40 dark:bg-indigo-950/20">
          <p className="mb-1 font-medium text-fd-foreground">কোড লিখো</p>
          <p>Browser-এ সরাসরি TypeScript edit করো</p>
        </div>
        <div className="rounded-xl border-2 border-emerald-200/60 bg-emerald-50/40 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <p className="mb-1 font-medium text-fd-foreground">তৎক্ষণাৎ Run</p>
          <p>Colorful console-এ output দেখো</p>
        </div>
        <div className="rounded-xl border-2 border-amber-200/60 bg-amber-50/40 p-3 dark:border-amber-800/40 dark:bg-amber-950/20">
          <p className="mb-1 font-medium text-fd-foreground">বাংলা গাইড</p>
          <p>English terms, বাংলায় ব্যাখ্যা</p>
        </div>
      </div>
    </div>
  );
}
