import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">নিজের LLM বানাও</h1>
      <p className="text-fd-muted-foreground mb-6 leading-relaxed">
        Zero থেকে TypeScript দিয়ে LLM কীভাবে কাজ করে — hands-on শেখা।
        কোনো TensorFlow, PyTorch বা ML library ছাড়া। শুধু Node.js, matrix math,
        এবং তোমার CSE background।
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          href="/docs"
          className="px-6 py-2.5 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Course শুরু করো
        </Link>
        <Link
          href="/docs/part-01-tokenizer"
          className="px-6 py-2.5 rounded-lg border border-fd-border font-medium hover:bg-fd-accent transition-colors"
        >
          Part 1: Tokenizer
        </Link>
      </div>

      <div className="text-sm text-fd-muted-foreground space-y-1">
        <p>
          <code className="text-xs bg-fd-muted px-1.5 py-0.5 rounded">bun part-01</code>{' '}
          — Tokenizer demo
        </p>
        <p>
          <code className="text-xs bg-fd-muted px-1.5 py-0.5 rounded">bun part-02</code>{' '}
          — Bigram model train + generate
        </p>
      </div>
    </div>
  );
}
