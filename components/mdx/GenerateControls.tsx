'use client';

import { useState } from 'react';

export function GenerateControls({
  defaultTemperature = 1,
  defaultTopK = 5,
}: {
  defaultTemperature?: number;
  defaultTopK?: number;
}) {
  const [temperature, setTemperature] = useState(defaultTemperature);
  const [topK, setTopK] = useState(defaultTopK);

  return (
    <div className="my-6 not-prose rounded-xl border border-fd-border bg-fd-muted/20 p-4">
      <p className="mb-3 text-sm font-medium">🎛️ Generation Controls (demo)</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-fd-muted-foreground">Temperature: {temperature.toFixed(1)}</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="block text-sm">
          <span className="text-fd-muted-foreground">Top-k: {topK}</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-fd-muted-foreground">
        Higher temperature → more random. Top-k limits choices to k highest-probability tokens.
      </p>
    </div>
  );
}
