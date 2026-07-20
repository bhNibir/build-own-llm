// ============================================================
// neural-char.ts — Ekta cholte-thaka SLM (Small Language Model)
// Kono ML library nai. Shob matrix math hater lekha (from scratch).
// Run: npx tsx code/part-03/neural-char.ts
// ============================================================

// ---------- STEP 1: Training data (corpus) ----------
// Asol LLM (GPT etc) internet-er billions word diye train hoy.
// Amra ekhane matro kichu naam diye choto scale-e dekhabo same idea.
const words: string[] = [
  "emma", "olivia", "ava", "sophia", "isabella",
  "mia", "amelia", "harper", "evelyn", "abigail",
  "emily", "elizabeth", "mila", "ella", "avery",
  "sofia", "camila", "aria", "scarlett", "victoria",
];

// ---------- STEP 2: Tokenization ----------
// LLM shobar age text-ke number-e convert kore (token id).
// Amra character-level tokenizer banachi (shobcheye simple version).
// '.' holo start/end special token.
const chars = Array.from(new Set(words.join(""))).sort();
const vocab = ["."].concat(chars);
const stoi: Record<string, number> = {};
const itos: Record<number, string> = {};
vocab.forEach((c, i) => { stoi[c] = i; itos[i] = c; });
const V = vocab.length; // vocab size

console.log("Vocab:", vocab.join(" "), `(size=${V})`);

// ---------- STEP 3: Training pairs banano ----------
// "Language model" আসলে ekta simple kaj kore: age ja dekhechi,
// tar upor base kore next token predict kora.
// Amra ekhane bigram: ekta char dekhle porerta ki hobe.
type Pair = [number, number];
const pairs: Pair[] = [];
for (const w of words) {
  const chs = ["."].concat(w.split("")).concat(["."]);
  for (let i = 0; i < chs.length - 1; i++) {
    pairs.push([stoi[chs[i]], stoi[chs[i + 1]]]);
  }
}
console.log(`Total training pairs: ${pairs.length}`);
console.log(
  "Example pairs:",
  pairs.slice(0, 6).map(([a, b]) => `${itos[a]}->${itos[b]}`)
);

// ---------- STEP 4: Model weights (parameters) ----------
// W[i] = char i-er por proti char-er "score" (logits).
// Eita e amader gotto "brain" — eita e train hobe.
function randMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.1)
  );
}
const W: number[][] = randMatrix(V, V);

// ---------- Helper: softmax ----------
// Raw score (logits) ke probability-te convert kore (shob mile 1.0)
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// ---------- STEP 5: Training loop ----------
const epochs = 200;
const lr = 10; // learning rate

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;
  const dW: number[][] = Array.from({ length: V }, () => new Array(V).fill(0));

  for (const [xi, yi] of pairs) {
    // ---- FORWARD PASS ----
    // input char (xi) -> logits -> probability
    const logits = W[xi];
    const probs = softmax(logits);

    // ---- LOSS ----
    // "Model koto vul korlo" - shothik char-er probability jotota kom,
    // loss totota beshi.
    totalLoss += -Math.log(probs[yi] + 1e-9);

    // ---- BACKWARD PASS (gradient) ----
    // Eita e "learning"-er mul secret: dL/dlogits = probs - one_hot(target)
    for (let j = 0; j < V; j++) {
      const grad = probs[j] - (j === yi ? 1 : 0);
      dW[xi][j] += grad;
    }
  }

  // ---- UPDATE WEIGHTS (gradient descent) ----
  const n = pairs.length;
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      W[i][j] -= (lr * dW[i][j]) / n;
    }
  }

  if (epoch % 20 === 0 || epoch === epochs - 1) {
    console.log(`Epoch ${epoch}: avg loss = ${(totalLoss / n).toFixed(4)}`);
  }
}

// ---------- STEP 6: Test / Generate ----------
// Eita e "inference" — train kora model diye notun jinis banano.
function sampleFromDistribution(probs: number[]): number {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (r < cum) return i;
  }
  return probs.length - 1;
}

function generate(): string {
  let idx = stoi["."];
  let out = "";
  for (let i = 0; i < 20; i++) {
    const probs = softmax(W[idx]);
    idx = sampleFromDistribution(probs);
    if (itos[idx] === ".") break;
    out += itos[idx];
  }
  return out;
}

console.log("\n--- Model-er generate kora notun 'naam' (test) ---");
for (let i = 0; i < 10; i++) {
  console.log(generate());
}
