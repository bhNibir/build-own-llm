import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">নিজের LLM বানাও</h1>
      <p className="text-fd-muted-foreground mb-6 leading-relaxed">
        Zero থেকে TypeScript দিয়ে LLM কীভাবে কাজ করে — interactive hands-on শেখা।
        প্রতিটি lesson-এ browser-এ code edit করে run করো। Terminal লাগবে না।
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          href="/docs"
          className="px-6 py-2.5 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Course শুরু করো
        </Link>
        <Link
          href="/docs/part-01-tokenizer/03-tokenizer"
          className="px-6 py-2.5 rounded-lg border border-fd-border font-medium hover:bg-fd-accent transition-colors"
        >
          Try Playground
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-fd-muted-foreground w-full max-w-lg">
        <div className="rounded-lg border border-fd-border p-3">
          <p className="font-medium text-fd-foreground mb-1">Edit Code</p>
          <p>Browser-এ সরাসরি TypeScript লিখো</p>
        </div>
        <div className="rounded-lg border border-fd-border p-3">
          <p className="font-medium text-fd-foreground mb-1">Run Instantly</p>
          <p>Run চাপলেই output দেখো</p>
        </div>
        <div className="rounded-lg border border-fd-border p-3">
          <p className="font-medium text-fd-foreground mb-1">Bangla Guide</p>
          <p>English terms, বাংলায় ব্যাখ্যা</p>
        </div>
      </div>
    </div>
  );
}
