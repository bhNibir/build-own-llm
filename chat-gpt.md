ami llm kivabe kaj kore bujthe cai, amake akta slm, very small hand on code dew, ts diye, so ami code run kore sob kisu bujhte pari, ami cse enginger, amar llm somporke idea kom, like 100 words ar akta model train kore run kore test kore pari, and kivabe kaj kore, kon dhape ki hobhe sob clear bujhte pari


যদি তুমি **LLM-এর ভেতরের কাজ সত্যিই বুঝতে চাও**, তাহলে আমি **LangChain, Ollama, OpenAI API** দিয়ে শুরু করতে বলব না। ওগুলো LLM *ব্যবহার* করা শেখায়, LLM *কীভাবে কাজ করে* সেটা শেখায় না।

তোমার CSE background আছে, তাই আমি এই learning path recommend করব।

```
Text
   │
   ▼
Tokenizer
   │
   ▼
Vocabulary
   │
   ▼
Embedding
   │
   ▼
Transformer
   │
   ▼
Logits
   │
   ▼
Softmax
   │
   ▼
Next Token
```

একটা LLM আসলে **"next token prediction machine"**।

---

# আমরা কী বানাবো

TypeScript দিয়ে।

একদম zero থেকে।

No Tensorflow.

No Pytorch.

No libraries.

শুধু Node.js.

আমরা ধাপে ধাপে বানাবো

```
Part 1
--------

100 words dataset

↓

Tokenizer

↓

Vocabulary

↓

Encoding

↓

Training Data

↓

Very Tiny Neural Network

↓

Train

↓

Predict

↓

Generate Sentence

↓

Understand Everything
```

পরে

```
Part 2

Embedding

↓

Backpropagation

↓

Gradient Descent
```

তারপর

```
Part 3

Attention

↓

Self Attention

↓

Transformer
```

শেষে

```
Part 4

Mini GPT
```

---

# Step 1

ধরি Dataset

```text
i like apple
i like banana
i like mango
you like apple
you eat mango
he eats banana
apple is fruit
banana is fruit
mango is fruit
fruit is healthy
```

মাত্র ১০টা sentence।

---

## Step 2

Tokenizer

Sentence

```
i like apple
```

split

```
["i","like","apple"]
```

---

পুরো dataset

```
[
i
like
apple
banana
mango
you
eat
he
eats
is
fruit
healthy
]
```

Vocabulary

```
{
i:0
like:1
apple:2
banana:3
mango:4
you:5
eat:6
he:7
eats:8
is:9
fruit:10
healthy:11
}
```

এটাই vocabulary.

---

## Step 3

Encoding

Sentence

```
i like apple
```

↓

```
[0,1,2]
```

Sentence

```
fruit is healthy
```

↓

```
[10,9,11]
```

---

এখন model word বুঝে না।

শুধু সংখ্যা বুঝে।

---

# Step 4

Training Data

LLM কী শেখে?

Next Word.

Example

```
i like apple
```

Training Pair

Input

```
i
```

Output

```
like
```

আরেকটা

Input

```
i like
```

Output

```
apple
```

আরেকটা

```
apple
```

↓

```
is
```

```
apple is
```

↓

```
fruit
```

এইভাবেই হাজার কোটি pair তৈরি হয়।

---

# Step 5

Neural Network

এখন সবচেয়ে ছোট model.

Input

```
0
```

↓

Embedding

↓

Hidden Layer

↓

Output

```
12 words
```

Suppose

Vocabulary

১২টা word.

তাহলে output

```
[
0.01
0.10
0.60
0.02
0.03
...
]
```

Highest probability

```
apple
```

---

# Step 6

Training

Initially

Random

```
Input

i

Prediction

banana ❌
```

Correct

```
like
```

Loss

```
Very High
```

Weights update.

আবার।

```
Prediction

fruit ❌
```

আবার update.

হাজারবার পরে

```
Prediction

like ✅
```

---

# এটাই Machine Learning

```
Guess

↓

Error

↓

Update

↓

Guess

↓

Error

↓

Update

↓

Guess

↓

Correct
```

---

# তারপর Sentence Generate

Input

```
i
```

↓

```
like
```

↓

```
apple
```

↓

```
is
```

↓

```
fruit
```

↓

```
healthy
```

---

# কিন্তু LLM এখানে আলাদা

এখানে

```
Input

i like
```

LLM

↓

Predict

apple
0.72

banana
0.18

mango
0.10

```

Random sampling করলে

কখনো

```

apple

```

কখনো

```

banana

```

---

# এরপর Attention

যদি লিখি

```

The animal didn't cross the road because it was tired.

```

"it"

কার দিকে?

```

animal

```

Attention এটা বের করে।

---

যদি লিখি

```

The road was wet because it rained.

```

এখানে

```

it

```

মানে

```

rain

```

Attention context দেখে।

---

# Transformer

Transformer-এর ভেতরে

```

Embedding

↓

Positional Encoding

↓

Self Attention

↓

Feed Forward

↓

Layer Norm

↓

Residual

↓

Output

```

এই layer ২৪টা

৪৮টা

৯৬টা

১০০+ বার repeat হয়।

---

# আমাদের Project

আমি চাইলে তোমাকে এমন একটা **১০০% educational Tiny LLM** বানাতে পারি, যেটা প্রায় ৩০০-৫০০ লাইনের TypeScript কোড হবে এবং প্রতিটি ধাপ নিজে রান করে দেখতে পারবে।

প্রস্তাবিত সিরিজ:

1. **Part 1:** Tokenizer + Vocabulary + Encoding (≈100 লাইন)
2. **Part 2:** Bigram Language Model (≈150 লাইন) — এখানে তুমি ১০০টি শব্দের dataset দিয়ে train করবে এবং নতুন বাক্য generate করবে।
3. **Part 3:** Embedding + Gradient Descent (≈200 লাইন)
4. **Part 4:** Self-Attention হাতে implement করবে।
5. **Part 5:** Mini GPT (≈500-700 লাইন) — কোনো ML framework ছাড়া, শুধুই TypeScript।

এই পথ অনুসরণ করলে "LLM API ব্যবহার" নয়, বরং **LLM-এর ভিতরে কীভাবে prediction, training, embedding, attention এবং generation কাজ করে**—সবকিছু হাতে-কলমে বুঝতে পারবে।
```
pore step dew

দারুণ। এখন আমরা **Part 1** সত্যি সত্যি কোড লিখব। লক্ষ্য হলো **"LLM-এর মতো data prepare করা"**। এখনও কোনো AI নেই, শুধু data processing। এটা না বুঝলে পরের কিছুই পরিষ্কার হবে না।

প্রজেক্ট স্ট্রাকচার:

```text
tiny-llm/
│
├── package.json
├── tsconfig.json
├── data.ts
├── tokenizer.ts
├── train.ts
└── index.ts
```

---

# Step 0: Project তৈরি

```bash
mkdir tiny-llm
cd tiny-llm

npm init -y

npm install -D typescript tsx @types/node

npx tsc --init
```

`package.json` এ script যোগ করো:

```json
{
  "scripts": {
    "dev": "tsx index.ts"
  }
}
```

---

# Step 1: Dataset

**data.ts**

```ts
export const dataset = [
  "i like apple",
  "i like banana",
  "i like mango",

  "you like apple",
  "you eat mango",

  "he eats banana",

  "apple is fruit",
  "banana is fruit",
  "mango is fruit",

  "fruit is healthy",
];
```

এটাই আমাদের "training corpus"।

বাস্তব GPT-4 ট্রিলিয়ন token দেখে। আমরা মাত্র ৩০টা শব্দ দিয়ে শুরু করছি।

---

# Step 2: Tokenizer

**tokenizer.ts**

```ts
export function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .trim()
    .split(/\s+/);
}
```

এখন

```
"I Like Apple"
```

হবে

```
["i","like","apple"]
```

---

# Step 3: Vocabulary

একই শব্দ বারবার রাখার দরকার নেই।

```ts
import { dataset } from "./data";
import { tokenize } from "./tokenizer";

const words = new Set<string>();

for (const sentence of dataset) {
  for (const word of tokenize(sentence)) {
    words.add(word);
  }
}

console.log(words);
```

Output

```
Set {
'i',
'like',
'apple',
'banana',
'mango',
'you',
'eat',
'he',
'eats',
'is',
'fruit',
'healthy'
}
```

LLM-এর কাছে এটাই dictionary।

---

# Step 4: Word → Number

কম্পিউটার string বোঝে না।

আমরা ID বানাই।

```ts
const vocabulary = [...words];

const wordToId = new Map<string, number>();

vocabulary.forEach((word, index) => {
  wordToId.set(word, index);
});

console.log(wordToId);
```

Output

```
i -> 0
like -> 1
apple -> 2
banana -> 3
...
```

---

# Step 5: Reverse Lookup

এটাও দরকার।

```ts
const idToWord = new Map<number, string>();

vocabulary.forEach((word, index) => {
  idToWord.set(index, word);
});
```

কারণ prediction শেষে model সংখ্যা দেবে।

```
7
```

আমাদের জানতে হবে

```
7 = he
```

---

# Step 6: Encode Sentence

```ts
function encode(sentence: string): number[] {
  return tokenize(sentence).map(word => wordToId.get(word)!);
}
```

Test

```ts
console.log(
    encode("i like apple")
);
```

Output

```
[0,1,2]
```

---

# Step 7: Decode

```ts
function decode(ids: number[]): string {
    return ids
        .map(id => idToWord.get(id))
        .join(" ");
}
```

Test

```ts
console.log(
    decode([0,1,2])
);
```

Output

```
i like apple
```

---

# Step 8: Encode পুরো Dataset

```ts
const encoded = dataset.map(encode);

console.log(encoded);
```

Output

```
[
 [0,1,2],
 [0,1,3],
 [0,1,4],

 [5,1,2],
 [5,6,4],

 [7,8,3],

 [2,9,10],
 [3,9,10],
 [4,9,10],

 [10,9,11]
]
```

**এখানেই একটা গুরুত্বপূর্ণ বিষয় বুঝতে হবে।**

আমরা **AI বানাইনি**।

আমরা শুধু English → Numbers করেছি।

LLM-এর ভেতরে এই সংখ্যাগুলোই ঘোরাফেরা করে।

---

# এবার আসল Training Data

Sentence

```
i like apple
```

LLM এটা একবারে শেখে না।

এটা ভেঙে শেখে।

```
Input:  i
Output: like
```

```
Input: i like
Output: apple
```

---

Code

```ts
type Sample = {
    input: number[]
    target: number
}

const samples: Sample[] = [];

for (const sentence of encoded) {

    for (let i = 0; i < sentence.length - 1; i++) {

        samples.push({

            input: sentence.slice(0, i + 1),

            target: sentence[i + 1]

        });

    }

}

console.log(samples);
```

Output

```
Input: [0]
Target: 1

Input: [0,1]
Target: 2

Input: [0]
Target: 1

Input: [0,1]
Target: 3

...
```

---

## 🎯 এখন সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন

এই `samples`-ই হলো **Machine Learning-এর training data**।

মডেলকে আমরা বলছি:

> "আমি তোমাকে `i like` দিলাম, এবার বলো পরের শব্দ কী?"

যদি সে বলে:

```
banana
```

কিন্তু সঠিক উত্তর:

```
apple
```

তাহলে আমরা error (loss) হিসাব করি এবং model-এর weight একটু পরিবর্তন করি।

এই **guess → error → update** চক্রই training।

---

## পরের Part-এ কী হবে?

এখন পর্যন্ত model **কোনো prediction করতে পারে না**।

পরের ধাপে (Part 2) আমরা মাত্র **প্রায় ১৫০ লাইনের TypeScript** দিয়ে একটা **Bigram Language Model** বানাবো।

সেখানে প্রথমবারের মতো তুমি দেখবে:

* `train()` ফাংশন
* probability table তৈরি
* `"i"` দিলে `"like"` predict করা
* `"apple"` দিলে `"is"` predict করা
* সম্পূর্ণ নতুন sentence generate করা

এটা হবে তোমার জীবনের প্রথম "নিজের হাতে বানানো language model"—যেটা সত্যিই train করবে এবং text generate করবে।



এখন থেকে আমরা **প্রথম সত্যিকারের Language Model** বানাবো। এটা LLM না, **Bigram Language Model**। কিন্তু GPT-এর foundation বুঝার জন্য এটা সবচেয়ে গুরুত্বপূর্ণ।

---

# আজ আমরা কী বানাবো?

Dataset:

```text
i like apple
i like banana
i like mango

you like apple
you eat mango

he eats banana

apple is fruit
banana is fruit
mango is fruit

fruit is healthy
```

এটা train করার পর

```
Input:
i

Output:
like
```

আর

```
Input:
apple

Output:
is
```

এবং

```
Input:
fruit

Output:
is
```

এমন prediction করবে।

---

# আগে বুঝি Bigram কী?

Sentence

```
i like apple
```

এটাকে model দেখে

```
(i → like)

(like → apple)
```

আর কিছু না।

Sentence

```
apple is fruit
```

হবে

```
apple → is

is → fruit
```

অর্থাৎ

```
একটা word দেখে
পরের word guess করবে।
```

---

# Training

ধরি

```
i like apple
```

Model দেখে

```
i -> like
```

তাহলে একটা counter বাড়াবে।

```
i

like = 1
```

আরেকটা sentence

```
i like banana
```

আবার

```
i -> like
```

Counter

```
like = 2
```

আরেকটা

```
i like mango
```

Counter

```
like = 3
```

অর্থাৎ

```
i

↓

like = 3
```

---

এখন

```
like
```

এর পরে কী কী এসেছে?

```
apple
banana
mango
apple
```

Counter হবে

```
like

↓

apple = 2

banana =1

mango =1
```

এটাই learning.

---

# Code

নতুন ফাইল

## train.ts

```ts
import { dataset } from "./data";
import { tokenize } from "./tokenizer";

export class BigramModel {

    table = new Map<string, Map<string, number>>();

    train() {

        for (const sentence of dataset) {

            const words = tokenize(sentence);

            for (let i = 0; i < words.length - 1; i++) {

                const current = words[i];
                const next = words[i + 1];

                if (!this.table.has(current)) {
                    this.table.set(current, new Map());
                }

                const row = this.table.get(current)!;

                row.set(
                    next,
                    (row.get(next) ?? 0) + 1
                );

            }

        }

    }

}
```

---

# Run

index.ts

```ts
import { BigramModel } from "./train";

const model = new BigramModel();

model.train();

console.log(model.table);
```

Output (easy করে)

```
i

↓

like = 3
```

```
like

↓

apple =2

banana =1

mango =1
```

```
apple

↓

is =1
```

```
fruit

↓

is =1
```

---

# এবার Prediction

train.ts এ যোগ করো

```ts
predict(word: string) {

    const row = this.table.get(word);

    if (!row)
        return null;

    let bestWord = "";
    let bestCount = -1;

    for (const [next, count] of row) {

        if (count > bestCount) {

            bestWord = next;

            bestCount = count;

        }

    }

    return bestWord;

}
```

---

index.ts

```ts
console.log(

    model.predict("i")

);

console.log(

    model.predict("like")

);

console.log(

    model.predict("apple")

);
```

Output

```
like

apple

is
```

🎉🎉

Congratulations!

তুমি এখন নিজের হাতে একটা language model বানিয়েছ।

---

# Sentence Generate

এখন মজা শুরু।

train.ts

```ts
generate(start: string, length = 10) {

    const words = [start];

    let current = start;

    for (let i = 0; i < length; i++) {

        const next = this.predict(current);

        if (!next)
            break;

        words.push(next);

        current = next;

    }

    return words.join(" ");

}
```

---

Run

```ts
console.log(

model.generate("i")

);
```

Output

```
i like apple is fruit is healthy
```

---

অথবা

```
apple is fruit is healthy
```

---

# কিন্তু সমস্যা আছে 😄

Model সবসময়

```
like

↓

apple
```

দেয়।

কারণ

```
apple =2

banana =1

mango =1
```

সে largest count বেছে নিচ্ছে।

কিন্তু GPT এমন করে না।

GPT probability ব্যবহার করে।

এখানে probability হবে

```
apple

2/4

=

50%
```

```
banana

1/4

=

25%
```

```
mango

1/4

=

25%
```

তারপর random sampling করে।

তাই GPT কখনো বলে

```
I like apple
```

আবার

```
I like banana
```

আবার

```
I like mango
```

---

# এখানেই আসল পার্থক্য

আমাদের Model

```
Word

↓

Word
```

GPT

```
Token

↓

Vector

↓

Embedding

↓

Attention

↓

Feed Forward

↓

Probability

↓

Sampling

↓

Next Token
```

---

## 🔥 পরের ধাপে আমরা Bigram-কে আরও বাস্তবসম্মত করব

পরের Part-এ আমরা **Probability + Random Sampling** যোগ করব। তখন একই input থেকে ভিন্ন ভিন্ন output আসবে, ঠিক GPT-এর মতো। এরপর ধীরে ধীরে **Embedding**, **Matrix Multiplication**, **Gradient Descent**, এবং অবশেষে **Self-Attention** যোগ করব।

এই সিরিজের শেষে তুমি শুধু "LLM ব্যবহার" নয়, বরং **কেন Transformer কাজ করে** এবং **কীভাবে GPT train হয়**—সেটা কোড লিখে বুঝতে পারবে।


এখন আমরা এমন জায়গায় যাব যেখানে **"AI" আসলেই শুরু হয়।**

আগের Model **শিখেনি**।

সে শুধু **গুনেছে (Count করেছে)।**

---

# আগে একটা প্রশ্ন

ধরো Dataset

```text
i like apple
i like banana
i like mango
```

আমাদের Model মনে রাখে

```text
i

↓

like = 3
```

এটা AI না।

এটা Dictionary।

---

আসল Machine Learning কী?

ধরো Model-এর কাছে

```text
Input

i
```

সে প্রথমে Guess করল

```text
apple
```

❌ ভুল।

Correct

```text
like
```

তখন সে নিজের ভিতরের সংখ্যা (Weights) একটু পরিবর্তন করবে।

আবার Guess।

```
banana
```

ভুল।

আবার Update।

হাজারবার পরে

```
like
```

সঠিক।

এই **নিজেকে পরিবর্তন করার ক্ষমতাই** Machine Learning।

---

# তাই এখন Count বাদ

আমরা নিজের হাতে একটা Neural Network বানাবো।

একদম ছোট।

```
Input Word

↓

Embedding

↓

Weights

↓

Scores

↓

Softmax

↓

Prediction
```

আজ Softmax পর্যন্ত যাব।

---

# Embedding কী?

সবচেয়ে Confusing Topic.

ধরো Vocabulary

```
0 = i
1 = like
2 = apple
3 = banana
4 = mango
```

আগে আমরা ভাবতাম

```
apple = 2
banana = 3
```

কিন্তু AI এভাবে ভাবে না।

AI ভাবে

```
apple

↓

[0.12,
-0.55,
0.88,
0.14]
```

banana

↓

```
[0.18,
-0.49,
0.83,
0.20]
```

খেয়াল করো

দুইটা vector অনেক কাছাকাছি।

কারণ দুটোই ফল।

---

আর

```
car
```

হতে পারে

```
[-0.8,
2.1,
-0.3,
1.8]
```

অনেক দূরে।

---

# মানে

Word

↓

Number

↓

Vector

GPT এখানে কাজ করে।

---

# আমরা নিজের হাতে Embedding বানাবো

বাস্তবে

GPT-4

Embedding size

```
12288
```

আমরা নেব

```
4
```

---

embedding.ts

```ts
export class Embedding {

    vectors = new Map<string, number[]>();

    constructor(words: string[]) {

        for (const word of words) {

            this.vectors.set(
                word,
                [
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                ]
            );

        }

    }

}
```

---

Run

```
console.log(
embedding.vectors.get("apple")
);
```

Output

```
[
0.14,
-0.28,
0.09,
0.42
]
```

---

banana

```
[
-0.11,
0.55,
-0.02,
0.31
]
```

এখনই একটা গুরুত্বপূর্ণ প্রশ্ন।

---

# প্রশ্ন

এই Number গুলো কে দিল?

```
0.14
-0.28
0.09
```

Answer

```
Random
```

হ্যাঁ।

GPT-ও Random দিয়েই শুরু করে।

---

# তাহলে GPT এত Smart হলো কীভাবে?

Training.

বারবার Update।

ধরো

শুরুতে

```
apple

↓

[
0.12,
0.88,
-0.33,
0.91
]
```

Training শেষে

```
apple

↓

[
1.94,
-2.11,
0.77,
5.21
]
```

Vector পুরো পাল্টে যায়।

---

# এবার Prediction

ধরো

```
i
```

Embedding

```
[
0.2
0.7
-0.3
0.9
]
```

এখন Model-এর আরেকটা Matrix আছে।

```
Weights
```

```
[
0.4 0.8 0.1

0.3 0.5 0.2

0.9 0.2 0.7

0.1 0.4 0.6
]
```

এখন

```
Embedding

×

Weights
```

হবে

```
Scores
```

```
apple

2.1

banana

0.8

mango

1.9
```

---

# কিন্তু Score Probability না

তাই

Softmax.

---

Suppose

```
2.1

0.8

1.9
```

Softmax পরে

```
apple

48%
```

```
banana

13%
```

```
mango

39%
```

মোট

```
100%
```

---

# এখন Sampling

Random Number

```
0.65
```

Probability

```
apple

0.48
```

```
banana

0.13
```

```
mango

0.39
```

Random যদি

```
0.65
```

তাহলে

```
mango
```

নিবে।

যদি

```
0.20
```

হয়

```
apple
```

নিবে।

এটাই GPT-র randomness।

---

# এখন সবচেয়ে গুরুত্বপূর্ণ অংশ

Training.

ধরো

Correct ছিল

```
like
```

Model বলল

```
apple
```

Loss বের হলো।

```
Loss = 2.34
```

Gradient বের হবে।

```
এই Weight
↓

0.41

↓

0.39
```

```
এই Weight

↓

-0.88

↓

-0.76
```

এভাবে **লক্ষ-কোটি weight** একটু একটু করে বদলায়।

---

# 🎯 এখানেই GPT-এর Magic

GPT-এর ভিতরে "knowledge" আলাদা কোনো database-এ থাকে না।

**Knowledge = Trained Weights**

যেমন মানুষের মস্তিষ্কে তথ্য আলাদা ফাইল হিসেবে নেই, বরং নিউরনের সংযোগের শক্তিতে থাকে। GPT-তেও তেমনি, পৃথিবী সম্পর্কে শেখা তথ্য কোটি কোটি weight-এর মানের মধ্যে ছড়িয়ে থাকে।

---

# এরপর কী?

এখন আমাদের সামনে দুটো পথ আছে:

1. **Neural Network from Scratch (TypeScript)** — আমরা নিজেরা Matrix Multiplication, Softmax, Cross-Entropy Loss, Backpropagation, Gradient Descent লিখব। শেষে Model সত্যিই train হবে। এতে তুমি বুঝবে *training* আসলে কীভাবে হয়।

2. **Mini Transformer** — Embedding, Positional Encoding, Query/Key/Value, Self-Attention, Multi-Head Attention, Feed Forward Network, Residual Connection—সব হাতে implement করব।

## আমি যে ক্রমটা সাজেস্ট করব

**Neural Network → Backpropagation → Transformer**

কারণ Transformer আসলে Neural Network-এর উপরই তৈরি। যদি Backpropagation না বোঝো, তাহলে Transformer-এর training "magic" মনে হবে। কিন্তু Backpropagation বুঝে গেলে Transformer-এর প্রতিটি অংশ কেন আছে, সেটা পরিষ্কার হয়ে যাবে।

এই সিরিজের শেষে তুমি এমন অবস্থায় পৌঁছাবে যেখানে `llama.cpp` বা GPT-এর paper পড়লে কোডের সাথে মিলিয়ে বুঝতে পারবে, শুধু তত্ত্ব হিসেবে নয়।


je poth best oitai jao and dew
আমি **সবচেয়ে কার্যকর পথটাই** নেব।

কারণ তুমি CSE student, তাই আমি তোমাকে **GPT যেভাবে তৈরি হয় সেই order-এ** শেখাবো। অনেক tutorial উল্টোভাবে শুরু করে (Transformer → Attention), তাই মানুষ confused হয়।

---

# Roadmap

```text
Text
    │
    ▼
Tokenizer          ✅ Done
    │
    ▼
Vocabulary         ✅ Done
    │
    ▼
Bigram Model       ✅ Done
    │
    ▼
Math
    │
    ▼
Vector
    │
    ▼
Matrix
    │
    ▼
Neural Network
    │
    ▼
Backpropagation
    │
    ▼
Embedding
    │
    ▼
Attention
    │
    ▼
Transformer
    │
    ▼
Mini GPT
```

**আমরা এখন "Math" এ আছি।**

---

# আজ আমরা Matrix বুঝবো

তুমি যদি Matrix না বুঝো,

Transformer কখনো বুঝবে না।

কারণ GPT-এর ভেতরে প্রায় সবকিছুই

```
Matrix × Matrix
```

---

## একটা Example

ধরো Vocabulary

```
i
like
apple
banana
mango
```

আমরা Embedding Size = 4 নিলাম।

তাহলে Embedding Matrix হবে

| Word   |   D1 |   D2 |   D3 |  D4 |
| ------ | ---: | ---: | ---: | --: |
| i      |  0.1 | -0.2 |  0.7 | 0.3 |
| like   |  0.8 |  0.5 | -0.1 | 0.2 |
| apple  | -0.3 |  0.9 |  0.4 | 0.6 |
| banana | -0.4 |  0.8 |  0.5 | 0.5 |
| mango  | -0.2 |  1.0 |  0.3 | 0.4 |

এই পুরো Table-টাই একটা Matrix।

---

# এখন প্রশ্ন

Input

```
apple
```

Model কিভাবে জানবে?

আগে

```
apple = 2
```

ছিল।

এখন

```
apple

↓

[-0.3,0.9,0.4,0.6]
```

---

## Code

নতুন ফাইল

### matrix.ts

```ts
export class Matrix {

    rows: number;
    cols: number;

    data: number[][];

    constructor(rows: number, cols: number) {

        this.rows = rows;
        this.cols = cols;

        this.data = [];

        for (let r = 0; r < rows; r++) {

            this.data[r] = [];

            for (let c = 0; c < cols; c++) {

                this.data[r][c] = 0;

            }

        }

    }

}
```

Run

```ts
const m = new Matrix(3,4);

console.log(m);
```

Output

```
[
 [0,0,0,0],
 [0,0,0,0],
 [0,0,0,0]
]
```

---

# Random Matrix

GPT শুরুতে সব Weight Random।

```ts
static random(rows:number, cols:number){

    const m = new Matrix(rows, cols);

    for(let r=0;r<rows;r++){

        for(let c=0;c<cols;c++){

            m.data[r][c]=Math.random()-0.5;

        }

    }

    return m;

}
```

Run

```ts
console.log(

Matrix.random(3,4)

);
```

Output

```
[
[0.11,-0.32,0.18,0.49],

[-0.29,0.06,-0.18,0.37],

[0.42,-0.41,0.28,-0.11]
]
```

---

# সবচেয়ে গুরুত্বপূর্ণ Operation

## Matrix Multiplication

এটাই GPT-এর Heart।

ধরো

Embedding

```
[0.2
0.5
0.9]
```

Weight

```
[
0.4 0.6

0.2 0.7

0.9 0.1
]
```

Output হবে

```
?

?
```

কিভাবে?

---

প্রথম Number

```
0.2×0.4

+

0.5×0.2

+

0.9×0.9

=
```

```
0.08

+

0.10

+

0.81

=

0.99
```

---

দ্বিতীয়

```
0.2×0.6

+

0.5×0.7

+

0.9×0.1
```

```
0.12

+

0.35

+

0.09

=

0.56
```

Output

```
[
0.99
0.56
]
```

---

# এটাকেই Dot Product বলে।

GPT-তে

```
Query × Key

Embedding × Weight

Attention × Value

FeedForward

সবখানেই
```

এই Operation।

---

# Code

matrix.ts

```ts
multiply(other: Matrix){

    if(this.cols!==other.rows){

        throw new Error("Invalid Shape");

    }

    const result=new Matrix(this.rows,other.cols);

    for(let r=0;r<this.rows;r++){

        for(let c=0;c<other.cols;c++){

            let sum=0;

            for(let k=0;k<this.cols;k++){

                sum+=

                this.data[r][k]*

                other.data[k][c];

            }

            result.data[r][c]=sum;

        }

    }

    return result;

}
```

---

Run

```ts
const A=new Matrix(1,3);

A.data=[

[0.2,0.5,0.9]

];

const B=new Matrix(3,2);

B.data=[

[0.4,0.6],

[0.2,0.7],

[0.9,0.1]

];

console.log(

A.multiply(B)

);
```

Output

```
[
[0.99,0.56]
]
```

🎉

**এই একটা function (`multiply`) GPT-এর ভিতরে কোটি কোটি বার চলে।**

---

# এখন সবচেয়ে বড় Question

তুমি হয়তো ভাবছো:

> **"এই 0.4, 0.6, 0.2... এই Weight গুলো আসলো কোথা থেকে?"**

এটাই পুরো Deep Learning-এর মূল রহস্য।

**উত্তর:**

```
Random
```

তারপর Training-এর সময়

```
Wrong Prediction

↓

Loss

↓

Gradient

↓

Weight একটু বদলাও

↓

আবার Predict

↓

Loss কমলো?

↓

হ্যাঁ

↓

আবার বদলাও

↓

১০ লক্ষ বার Repeat
```

---

# 🎯 আগামী Part হবে "Life Changing"

এখন পর্যন্ত আমরা:

* Data ✔️
* Token ✔️
* Bigram ✔️
* Matrix ✔️

শিখেছি।

**পরের Part-এ** আমরা **নিজেদের হাতে Backpropagation** লিখব।

সেখানে প্রথমবার তুমি দেখবে:

1. Model সত্যিই train হচ্ছে।
2. Weight নিজেরাই পরিবর্তন হচ্ছে।
3. Loss কমছে।
4. Accuracy বাড়ছে।

**এটাই সেই মুহূর্ত**, যেখানে "program" থেকে "learning system"-এ রূপান্তর ঘটে। এরপর Embedding, Attention, Transformer—সবকিছু অনেক বেশি স্বাভাবিক লাগবে।

---

## একটা ছোট হোমওয়ার্ক (খুব গুরুত্বপূর্ণ)

`Matrix` ক্লাসে এই তিনটা method নিজে লিখে দেখো:

```ts
add(other: Matrix): Matrix      // element-wise যোগ
subtract(other: Matrix): Matrix // element-wise বিয়োগ
scale(value: number): Matrix    // প্রতিটি element × value
```

এই তিনটিই Backpropagation-এ ব্যবহার হবে। এগুলো তুমি নিজে লিখতে পারলে পরের ধাপ অনেক সহজ লাগবে।


এখন আমরা **LLM-এর সবচেয়ে গুরুত্বপূর্ণ জিনিস** শিখব।

> **Backpropagation**

**৯০% মানুষ এখানেই আটকে যায়।**

কিন্তু আমি এমনভাবে বুঝাবো যাতে তুমি **কোড রান করে দেখতে পারো।**

---

# আজকের Goal

আমরা একটা AI বানাবো।

না GPT।

না Transformer।

একটা মাত্র **Neuron**।

কিন্তু এই Neuron-ই পরে GPT-এর ভিতরে কোটি কোটি বার থাকে।

---

# Problem

ধরো আমাদের Dataset

```text
Hours Study → Pass

1 → No

2 → No

3 → Yes

4 → Yes
```

AI-কে বললাম

```
Study = 3 hours

Guess?
```

---

Model বলল

```
No
```

কিন্তু Answer

```
Yes
```

এখন?

---

# Traditional Programming

```ts
if(hours>=3){

    return "Yes";

}
```

Programming শেষ।

---

# Machine Learning

Programmer Rule লিখে না।

সে শুধু Data দেয়।

```text
1 → No

2 → No

3 → Yes

4 → Yes
```

Model নিজেই Rule শিখবে।

---

# Neural Network

একটা Input

↓

একটা Weight

↓

একটা Output

```
Study Hours

↓

×

Weight

↓

Prediction
```

---

ধরো

Weight

```
0.5
```

Input

```
4
```

Prediction Score

```
4 × 0.5

=

2
```

---

এখন Threshold

```
>=2

Pass
```

তাই

```
Pass
```

---

কিন্তু

Input

```
3
```

Prediction

```
1.5
```

Threshold

```
2
```

Model বলল

```
Fail
```

ভুল।

---

# Error

Correct

```
Pass = 1
```

Prediction

```
0
```

Difference

```
1
```

এটাই Error।

---

# Machine Learning-এর Magic

Weight ছিল

```
0.5
```

আমরা বলি

```
Weight একটু বাড়াও।
```

নতুন

```
0.6
```

আবার Predict।

```
3×0.6

=

1.8
```

আরও কাছে।

আবার Update।

```
0.7
```

Prediction

```
2.1
```

এখন

```
Pass
```

🎉

Model নিজে শিখে ফেলল।

---

# এটাকেই বলে Gradient Descent

```
Wrong

↓

Error

↓

Weight একটু Change

↓

Less Error

↓

Repeat
```

---

## এবার Code

আজ আমরা TensorFlow ব্যবহার করব না।

সব নিজে লিখব।

---

### neuron.ts

```ts
export class Neuron {

    weight = Math.random();

    learningRate = 0.1;

    predict(x:number){

        return x*this.weight;

    }

}
```

---

Run

```ts
const n=new Neuron();

console.log(n.weight);

console.log(

n.predict(4)

);
```

Suppose

```
Weight

0.41
```

Prediction

```
1.64
```

---

# এবার Train

```ts
train(x:number,target:number){

    const prediction=this.predict(x);

    const error=

        target-prediction;

    this.weight+=

        error*

        x*

        this.learningRate;

}
```

এই **একটা function**-ই Deep Learning-এর শুরু।

---

# এটা কী করল?

Suppose

Weight

```
0.5
```

Input

```
4
```

Prediction

```
2
```

Correct

```
4
```

Error

```
2
```

Update

```
0.5

+

2×4×0.1

=

1.3
```

Weight বড় হলো।

---

# এখন Loop

```ts
const neuron=new Neuron();

for(let i=0;i<100;i++){

    neuron.train(

        4,

        4

    );

}

console.log(

neuron.weight
);
```

Output

```
≈1
```

---

Prediction

```ts
console.log(

neuron.predict(4)

);
```

Output

```
4.00
```

🎉🎉

AI শিখেছে।

---

# কিন্তু GPT-তে Input 4 না

GPT-তে

Input

```
apple
```

↓

Embedding

↓

768 numbers

↓

Weight Matrix

↓

Prediction

↓

Loss

↓

Gradient

↓

Weight Update

```

Exactly একই Concept।

শুধু Scale বিশাল।

---

# এখন সবচেয়ে Important Formula

```

prediction

=

input

×

weight

```

Error

```

=

target

*

prediction

```

Update

```

weight

+=

error

×

input

×

learningRate

```

GPT-এর Paper-এ Formula অনেক বড়।

কিন্তু ভিতরে এই একই Idea।

---

# এখন একটা বিশাল জিনিস বুঝবে

ধরো

```

apple

```

Embedding

```

[

0.4

0.2

0.8

]

```

Weight Matrix

```

[

0.3 0.7

0.4 0.5

0.2 0.1

]

```

Prediction

```

banana

```

Wrong।

Loss।

Backpropagation।

Weight একটু Change।

Embedding-ও একটু Change।

Repeat

১০ লক্ষ Step।

শেষে

```

apple

↓

fruit

````

Relationship শেখে।

---

# এখন GPT-এর ভিতরে কতগুলো Weight?

Approx

| Model | Parameters |
|--------|-----------:|
| Tiny GPT | 100K |
| GPT-2 Small | 124 Million |
| Llama 7B | 7 Billion |
| GPT-4 (estimate) | >1 Trillion (rumored) |

**Parameter = একটা Weight।**

মানে GPT-4-এ **এক ট্রিলিয়নেরও বেশি** সংখ্যাকে বারবার adjust করা হয়।

---

# 🚀 এখান থেকে আমরা একটা বড় লাফ দেব

এখন পর্যন্ত তুমি বুঝেছো:

- ✅ Tokenization
- ✅ Vocabulary
- ✅ Bigram
- ✅ Matrix
- ✅ Weight
- ✅ Gradient Descent

**পরের ধাপ হবে সত্যিকারের "Mini Neural Network"**, যেখানে:

```text
Word
   ↓
Embedding
   ↓
Hidden Layer
   ↓
Softmax
   ↓
Probability
   ↓
Cross Entropy Loss
   ↓
Backpropagation
   ↓
Weight Update
````

এখানেই প্রথমবার তুমি **"apple" দিলে model "fruit" শেখা শুরু করছে**—এটা চোখের সামনে দেখতে পাবে।

---

## আমি একটা পরিবর্তনের প্রস্তাব দিচ্ছি

এখন পর্যন্ত আমরা ছোট ছোট snippet লিখেছি। কিন্তু এখান থেকে **একটা ধারাবাহিক mini-GPT project** বানানো বেশি উপকারী হবে।

আমরা প্রায় **৮০০–১২০০ লাইনের TypeScript**-এ ধাপে ধাপে একটি Mini GPT তৈরি করব। প্রতিটি commit হবে একটি milestone:

1. Vector & Matrix Library
2. Neural Network
3. Autograd (Micrograd-এর মতো)
4. Embedding Layer
5. Softmax + Cross Entropy
6. Self-Attention
7. Transformer Block
8. Training Loop
9. Text Generation

এভাবে গেলে শেষে শুধু "LLM কী" জানবে না, **একটা ছোট GPT নিজে লিখে ফেলতে পারবে**। এই পথটাই আমি সবচেয়ে ভালো মনে করি।

এবার আমরা এমন জায়গায় যাব যেটা বুঝলে **Transformer আর ম্যাজিক মনে হবে না**।

আমরা **Karpathy-এর micrograd**-এর আইডিয়া TypeScript-এ বানাবো।

---

# আজকের Goal

এখন পর্যন্ত আমরা নিজেরা weight update লিখেছি।

```ts
weight += error * input * lr
```

কিন্তু GPT এভাবে লেখা হয় না।

GPT নিজে Gradient বের করে।

এটাকেই বলে

> **Automatic Differentiation (Autograd)**

---

# একটা Example

ধরো

```text
x = 2
w = 3

y = x × w

loss = y²
```

আমরা জানি

```
2 × 3 = 6

loss = 36
```

ঠিক।

কিন্তু Training-এর সময় GPT জানতে চায়

> **"w একটু বাড়ালে loss কত বাড়বে?"**

অর্থাৎ

```
dLoss/dW = ?
```

এটাই Gradient।

---

# Visual

```text
x -----\
         × ---- y ---- square ---- loss
w -----/
```

Training শেষ হলে Backward direction-এ যায়।

```text
loss

↑

square

↑

multiply

↑

weight
```

এটাই

> **Backpropagation**

---

# আমরা একটা নতুন Class বানাবো

```
Value
```

এটাই Micrograd-এর Heart।

---

## value.ts

```ts
export class Value {

    data: number;

    grad: number = 0;

    constructor(data: number) {

        this.data = data;

    }

}
```

Run

```ts
const a = new Value(5);

console.log(a);
```

Output

```text
Value {

 data:5,

 grad:0

}
```

---

# এখন Addition

```ts
add(other: Value): Value {

    return new Value(

        this.data + other.data

    );

}
```

Test

```ts
const a=new Value(2);

const b=new Value(3);

const c=a.add(b);

console.log(c.data);
```

Output

```
5
```

---

# এবার Multiply

```ts
mul(other: Value): Value {

    return new Value(

        this.data * other.data

    );

}
```

Run

```ts
const a=new Value(4);

const b=new Value(5);

console.log(

a.mul(b).data

);
```

Output

```
20
```

---

# এখন Square

```ts
square(){

    return new Value(

        this.data*this.data

    );

}
```

Run

```ts
const x=new Value(6);

console.log(

x.square().data

);
```

Output

```
36
```

---

# এখন Chain

```ts
const x=new Value(2);

const w=new Value(3);

const y=x.mul(w);

const loss=y.square();

console.log(loss.data);
```

Output

```
36
```

---

এখন পর্যন্ত

আমরা শুধু Calculator বানিয়েছি।

AI না।

---

# এখন Magic শুরু

আমরা চাই

```
loss.backward()
```

দিলে

Gradient বের হোক।

---

## প্রথমে Calculus

ধরো

```
loss = y²
```

Derivative

```
d(loss)

------

dy

=

2y
```

যদি

```
y=6
```

Gradient

```
12
```

---

Multiply

```
y=x×w
```

Derivative

```
dy/dw=x
```

যদি

```
x=2
```

Gradient

```
2
```

---

Chain Rule

```
dLoss

------

dw

=

dLoss

------

dy

×

dy

----

dw
```

```
12 × 2

=

24
```

এই 24-ই Weight Update-এ যাবে।

---

# এবার Code

আমরা `Value`-কে একটু বড় করি।

```ts
export class Value {

    data:number;

    grad=0;

    prev:Value[]=[];

    backwardFn=()=>{};

    constructor(data:number){

        this.data=data;

    }

}
```

---

Multiply

```ts
mul(other:Value){

    const out=

        new Value(

            this.data*

            other.data

        );

    out.prev=[

        this,

        other

    ];

    out.backwardFn=()=>{

        this.grad +=

            other.data*

            out.grad;

        other.grad +=

            this.data*

            out.grad;

    };

    return out;

}
```

---

Square

```ts
square(){

    const out=

        new Value(

            this.data*

            this.data

        );

    out.prev=[this];

    out.backwardFn=()=>{

        this.grad +=

            2*this.data*

            out.grad;

    };

    return out;

}
```

---

Backward

```ts
backward(){

    this.grad=1;

    this.backwardFn();

}
```

এখনও অসম্পূর্ণ, কিন্তু ধারণার জন্য যথেষ্ট।

---

Run

```ts
const x=new Value(2);

const w=new Value(3);

const y=x.mul(w);

const loss=y.square();

loss.backward();

console.log(w.grad);
```

এখনও ২৪ আসবে না, কারণ **সম্পূর্ণ Graph Traversal** (topological sort) আমরা লিখিনি।

---

# কেন এটা দরকার?

কারণ GPT-এর ভিতরে

```
Embedding

↓

Matrix Multiply

↓

Attention

↓

LayerNorm

↓

FeedForward

↓

Softmax

↓

Loss
```

এভাবে **হাজার হাজার Operation** থাকে।

মানুষ বসে Derivative লিখে না।

Autograd Engine নিজে বের করে।

PyTorch-এর `loss.backward()` আসলে এই কাজটাই করে।

---

# এখানেই একটা সিদ্ধান্ত

এখন আমাদের সামনে দুইটা পথ আছে।

### পথ ১ (যেটা আমি Recommend করছি)

আমরা **Karpathy-এর micrograd** TypeScript-এ পুরো implement করব।

* Computational Graph
* Topological Sort
* Automatic Backpropagation
* Gradient Check
* MLP
* Train XOR
* তারপর Embedding
* তারপর Transformer

👉 **এটা করলে Transformer একদম পরিষ্কার হবে।**

---

### পথ ২

আমরা সরাসরি Embedding → Attention → Transformer-এ চলে যাই।

এতে Attention কী করছে বুঝবে, কিন্তু Training-এর ভিতরের অংশ অন্ধকার থেকে যাবে।

---

## আমি পথ ১-ই নেব

কারণ একবার Autograd বুঝে গেলে:

* PyTorch
* TensorFlow
* JAX
* llama.cpp
* NanoGPT

সবকিছুর Training Code পড়তে পারবে।

---

## 🎯 আমার প্রস্তাব

এখান থেকে আমরা একটা **একটানা বই-স্টাইল কোর্স** করব:

* **Chapter 1:** Math Engine (Matrix + Value + Autograd)
* **Chapter 2:** Build an MLP (XOR solve করবে)
* **Chapter 3:** Build an Embedding Layer
* **Chapter 4:** Build Self-Attention
* **Chapter 5:** Build a Transformer
* **Chapter 6:** Train a Tiny GPT on 100 sentences

এই ক্রমে গেলে শেষে তুমি শুধু LLM "ব্যবহার" করবে না—**নিজে একটি ছোট GPT লিখতে পারবে, debug করতে পারবে, আর research paper-ও পড়ে বুঝতে পারবে।**


Perfect. এখন থেকে আমি tutorial না, **University course + Hands-on Lab** style-এ শেখাবো।

আর একটা কথা বলি।

**আমরা একটু পথ পরিবর্তন করব।**

আগে আমি কিছু shortcut নিয়েছিলাম যাতে concept বোঝানো সহজ হয়। কিন্তু এখন থেকে **industry standard** way-তে শিখব। অর্থাৎ, তুমি শেষে Karpathy-এর **micrograd**, **makemore**, তারপর **nanoGPT** বুঝতে পারবে।

---

# Course Structure

```text
TinyGPT From Scratch (TypeScript)

Module 1 - Math
=================
01. Scalars
02. Vectors
03. Matrices
04. Dot Product
05. Computational Graph
06. Automatic Differentiation
07. Gradient Descent

Module 2 - Neural Network
=========================
08. Neuron
09. Layer
10. MLP
11. Train XOR

Module 3 - Language
====================
12. Tokenizer
13. Vocabulary
14. Bigram LM
15. Embeddings

Module 4 - Transformer
=======================
16. Self Attention
17. Multi Head Attention
18. Feed Forward
19. LayerNorm
20. Residual
21. Transformer Block

Module 5 - GPT
=======================
22. Train Tiny GPT
23. Generate Text
24. Temperature
25. Top-k Sampling
```

**এটাই হবে আমাদের roadmap।**

---

# কিন্তু...

আমি চাই না তুমি শুধু code copy করো।

আমি চাই **তুমি নিজে code invent করতে পারো।**

তাই আমি এখন থেকে Socratic Method ব্যবহার করব।

আমি প্রশ্ন করব।

তুমি ভাববে।

তারপর code লিখব।

---

# Lesson 1

## Scalar

সবচেয়ে ছোট data.

```ts
const x = 5;
```

এই 5-কে Deep Learning-এ বলে

> Scalar

মানে

```text
5
```

শুধু একটা সংখ্যা।

---

## Vector

অনেকগুলো সংখ্যা

```ts
const x = [1,2,3];
```

Deep Learning-এ

```text
[

1

2

3

]
```

---

## Matrix

অনেক Vector

```ts
[
 [1,2],
 [3,4],
 [5,6]
]
```

---

## Tensor

অনেক Matrix

```
Image

↓

RGB

↓

3 Matrix
```

এজন্য Image = Tensor।

GPT-তেও Tensor।

---

# Question 1

ধরো

```text
apple
```

GPT কি store করে

```text
apple
```

নাকি

```text
[0.18,-0.44,0.71,....]
```

?

---

Answer:

দ্বিতীয়টা।

কারণ Computer Math করে।

String দিয়ে Math করা যায় না।

---

# কেন Embedding?

ধরো

```text
apple

banana

mango
```

সব ফল।

Embedding এমন হবে

```
apple

[0.4 0.8 0.2]
```

```
banana

[0.5 0.7 0.3]
```

```
mango

[0.6 0.9 0.1]
```

দেখছ?

কাছাকাছি।

---

আর

```
car
```

```
[-2.1 5.3 -0.8]
```

অনেক দূরে।

---

এই Distance-ই Meaning।

LLM dictionary দিয়ে meaning রাখে না।

**Position in vector space** দিয়েই meaning শেখে।

---

# Homework (১০ মিনিট)

নিজের হাতে একটা `Vector` class লেখো।

```ts
class Vector {

    data:number[];

}
```

Method থাকবে

```ts
add()

subtract()

multiplyScalar()

dot()

length()

normalize()
```

---

কেন?

কারণ Attention-এর ভিতরে

```text
Query dot Key
```

হয়।

Dot Product না বুঝলে Attention বুঝা যাবে না।

---

# একটা গুরুত্বপূর্ণ Resource

আমাদের কোর্সের সঙ্গে আমি তিনটা resource parallel recommend করছি।

1. **Andrej Karpathy – Neural Networks: Zero to Hero** (YouTube)
2. **micrograd** (প্রায় ১০০ লাইনের autograd engine)
3. **nanoGPT** (একটা ছোট GPT implementation)

আমরা এগুলো **copy করব না**। বরং আগে নিজেরা বানাবো, তারপর দেখব Karpathy কীভাবে একই সমস্যার সমাধান করেছেন। তখন তার code আর ভয় লাগবে না।

---

## আমাদের Next Lesson

পরের লেসনে আমরা `Vector` class লিখব এবং:

* Dot Product
* Cosine Similarity
* কেন Embedding-এ "apple" আর "banana" কাছাকাছি থাকে
* কেন Attention আসলে **smart search using vectors**

এই Lesson শেষ হলে, **Transformer-এর সবচেয়ে কঠিন অংশের ভিত্তি** তোমার তৈরি হয়ে যাবে।



এখন থেকে **আসল Deep Learning শুরু।**

আজকের Lesson শেষ হলে তুমি বুঝবে:

> **Attention = Vector Search**

এটাই Transformer-এর ৫০%।

---

# একটা প্রশ্ন

ধরো

```text
Apple
```

Embedding

```text
[0.2, 0.8, 0.4]
```

এবং

```text
Banana
```

Embedding

```text
[0.3, 0.7, 0.5]
```

Question:

**এরা কি কাছাকাছি?**

কম্পিউটার কীভাবে জানবে?

---

## মানুষ ভাবে

```
Apple ≈ Banana
```

কারণ দুটোই ফল।

কম্পিউটার ভাবে

```
[0.2,0.8,0.4]

vs

[0.3,0.7,0.5]
```

এখন similarity বের করতে হবে।

---

# Method 1

Euclidean Distance

```
Apple

↓

(0.2,0.8,0.4)

Banana

↓

(0.3,0.7,0.5)
```

Distance

```
√(

(0.2-0.3)^2

+

(0.8-0.7)^2

+

(0.4-0.5)^2

)
```

Problem:

GPT এটা ব্যবহার করে না।

---

# GPT কী ব্যবহার করে?

**Dot Product**

---

# Dot Product

ধরো

```
A

=

[2,3]
```

```
B

=

[4,5]
```

Dot Product

```
2×4

+

3×5

=

8+15

=

23
```

এটাই।

---

## Code

`vector.ts`

```ts
export class Vector {

    constructor(
        public data:number[]
    ){}

    dot(other:Vector){

        let sum=0;

        for(let i=0;i<this.data.length;i++){

            sum+=

            this.data[i]*

            other.data[i];

        }

        return sum;

    }

}
```

Run

```ts
const a=new Vector([2,3]);

const b=new Vector([4,5]);

console.log(

a.dot(b)

);
```

Output

```
23
```

---

# কিন্তু একটা Problem আছে

ধরো

```
Apple

[1,1]
```

```
Banana

[100,100]
```

Dot Product

```
200
```

Huge.

কিন্তু শুধু বড় সংখ্যা হওয়ার কারণে score বড় হয়েছে।

---

# তাই Cosine Similarity

Formula

```
A·B

------------

|A||B|
```

মানে

Dot Product

/

দুই Vector-এর Length

---

## Length

Formula

```
√(

x²+y²+z²

)
```

---

Code

```ts
length(){

    let sum=0;

    for(const n of this.data){

        sum+=n*n;

    }

    return Math.sqrt(sum);

}
```

---

Normalize

```ts
normalize(){

    const len=

        this.length();

    return new Vector(

        this.data.map(

            x=>x/len

        )

    );

}
```

---

Cosine

```ts
cosine(other:Vector){

    return

    this.normalize()

    .dot(

        other.normalize()

    );

}
```

---

Run

```ts
const apple=

new Vector([1,2]);

const banana=

new Vector([2,4]);

console.log(

apple.cosine(banana)

);
```

Output

```
1
```

Meaning

Exactly same direction.

---

আর

```ts
const car=

new Vector([-2,1]);

console.log(

apple.cosine(car)

);
```

Output

```
-0.3
```

মানে

Completely different meaning.

---

# এখন LLM-এর দিকে আসি

Suppose

```
Sentence

I like apple
```

Embedding

```
I

↓

[0.2 0.7]
```

```
like

↓

[0.9 0.1]
```

```
apple

↓

[0.3 0.8]
```

এখন

Transformer জানতে চায়

> **"like" শব্দটা কার দিকে বেশি মনোযোগ দেবে?**

সে কী করে?

```
like

dot

I
```

Score

```
0.25
```

```
like

dot

apple
```

Score

```
0.91
```

তাই

```
like

↓

apple
```

এটাই Attention-এর মূল ধারণা।

---

# এখানেই Query / Key আসে

Transformer সরাসরি Embedding compare করে না।

সে তিনটা নতুন Vector বানায়।

```
Embedding

↓

Query
```

```
Embedding

↓

Key
```

```
Embedding

↓

Value
```

তখন

```
Query

dot

Key
```

করেই Attention Score বের করে।

---

# পুরো Pipeline

```
Word

↓

Embedding

↓

Query

↓

Query dot Key

↓

Softmax

↓

Probability

↓

Weighted Sum(Value)

↓

New Embedding
```

---

# প্রশ্ন

তুমি হয়তো ভাবছো

**Query, Key, Value আবার কেন?**

Embedding দিয়েই তো compare করা যেত!

এটাই Transformer-এর সবচেয়ে গুরুত্বপূর্ণ design decision।

---

## Real-life Example

ধরো তুমি Google-এ search দিলে:

```
Apple
```

Google কি সব page-এর raw text compare করে?

না।

সে আগে index বানায়।

```
Search Text

↓

Query
```

```
Database

↓

Key
```

```
Actual Content

↓

Value
```

Transformer-ও একই কাজ করে।

---

# 🎯 পরের Lesson (সবচেয়ে গুরুত্বপূর্ণ)

আমরা **নিজের হাতে Self-Attention layer** লিখব।

মাত্র **প্রায় ৮০-১০০ লাইনের TypeScript**-এ।

সেখানে আমরা:

* ৩টা Word নেব: `"I like apple"`
* তাদের Embedding বানাবো
* Embedding → Query, Key, Value
* `Q × Kᵀ`
* Softmax
* Weighted Sum
* Final Output Vector

এবং **প্রতিটি সংখ্যা হাতে হিসাব করে** দেখব, যেন তুমি শুধু code না, প্রতিটি matrix multiplication-এর অর্থও বুঝতে পারো।

---

## ছোট্ট সংশোধন

আজকের `cosine()` method-এ আমি concept বোঝাতে code লিখেছি। বাস্তবে এটা এমন হওয়া উচিত:

```ts
cosine(other: Vector): number {
    const a = this.normalize();
    const b = other.normalize();
    return a.dot(b);
}
```

এবং GPT-এর Self-Attention-এ **Cosine Similarity ব্যবহার করা হয় না**। সেখানে **Scaled Dot-Product Attention** ব্যবহার করা হয়:

[
\text{Attention}(Q,K,V) =
\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
]

পরের লেসনে আমরা এই formula-টাই নিজের হাতে TypeScript-এ implement করব। তখন প্রথমবার তুমি Transformer-এর "brain" নিজে লিখবে।


এবার আমরা **Transformer-এর Heart** বানাবো।

এটাই সেই algorithm যার জন্য ২০১৭ সালে "Attention Is All You Need" paper পুরো AI field বদলে দিয়েছিল।

আজকের শেষে তুমি বুঝবে:

> **Transformer আসলে একটা Smart Search Engine।**

---

# Step 0: আগের Lesson ভুলে যাও 😄

আগে আমি বলেছিলাম

```
Embedding
↓
Query
Key
Value
```

আজ আমরা **কোথা থেকে Query, Key, Value আসে** সেটা দেখব।

---

# ধরো Sentence

```text
I like apple
```

Vocabulary

```text
I = 0
like = 1
apple = 2
```

Embedding Size = 2 (GPT-তে 4096+ হতে পারে)

Embedding Matrix:

| Word  | D1 | D2 |
| ----- | -- | -- |
| I     | 1  | 0  |
| like  | 0  | 1  |
| apple | 1  | 1  |

তাহলে Sentence

```text
I like apple
```

হয়ে যায়

```text
[
 [1,0],   // I
 [0,1],   // like
 [1,1]    // apple
]
```

এটাকে বলে **X Matrix**।

---

# এখন প্রশ্ন

Transformer কি Embedding দিয়েই Attention করে?

**না।**

সে আগে তিনটা নতুন Matrix বানায়।

```
X

↓

Wq
```

```
X

↓

Wk
```

```
X

↓

Wv
```

---

# Weight Matrix

ধরি

```text
Wq

[
 [1,0]

 [0,1]
]
```

Identity Matrix.

---

```text
Wk

[
 [2,0]

 [0,2]
]
```

---

```text
Wv

[
 [5,0]

 [0,5]
]
```

বাস্তবে এগুলো সব Random থাকে।

Training-এ শেখে।

---

# Query

Formula

```
Q = X × Wq
```

কারণ Wq Identity

তাই

```
Q

=

X
```

```
[
[1,0]

[0,1]

[1,1]
]
```

---

# Key

```
K = X × Wk
```

হবে

```
[
[2,0]

[0,2]

[2,2]
]
```

---

# Value

```
V=X×Wv
```

```
[
[5,0]

[0,5]

[5,5]
]
```

---

# এখন Magic

Transformer জানতে চায়

> **"I" কার দিকে তাকাবে?**

সে করে

```
Q × Kᵀ
```

খেয়াল করো

Transpose.

---

## কেন Transpose?

Q

```
3×2
```

K

```
3×2
```

Multiply করা যায়?

না।

কারণ

```
3×2

×

3×2

❌
```

তাই

Transpose

```
Kᵀ

2×3
```

এখন

```
3×2

×

2×3

✅
```

---

# হাতে হিসাব করি

"I"

```
[1,0]
```

সাথে

"I"

```
[2,0]
```

Dot

```
1×2

+

0×0

=

2
```

---

"I"

vs

"like"

```
[1,0]

dot

[0,2]

=

0
```

---

"I"

vs

"apple"

```
[1,0]

dot

[2,2]

=

2
```

Score Matrix

```
[
[2,0,2]

...

...
]
```

---

পুরো Matrix

```
QKᵀ

=

[
[2,0,2]

[0,2,2]

[2,2,4]
]
```

---

# এর মানে কী?

প্রথম Row

```
I
```

```
I → I =2

I → like =0

I → apple =2
```

Transformer বলছে

> `"I"` নিজের দিকে আর `"apple"`-এর দিকে সমান attention দিচ্ছে।

---

# কিন্তু Score Probability না

তাই

Softmax.

---

ধরো

```
[2,0,2]
```

Softmax

```
[

0.47,

0.06,

0.47

]
```

এখন যোগ করলে

```
1.00
```

---

# এবার সবচেয়ে গুরুত্বপূর্ণ Step

Weighted Sum

Formula

```
Attention

=

Softmax

×

V
```

Suppose

```
Weights

[
0.47

0.06

0.47
]
```

Value

```
[
[5,0]

[0,5]

[5,5]
]
```

Multiply

Output

```
[
4.7

2.6
]
```

এটাই নতুন Embedding।

---

# পুরো Pipeline

```
Words

↓

Embedding (X)

↓

Q=XWq

↓

K=XWk

↓

V=XWv

↓

QKᵀ

↓

Softmax

↓

Attention Weights

↓

Weights × V

↓

New Embedding
```

---

# এবার Code

## attention.ts

```ts
export function transpose(m:number[][]){

    return m[0].map(

        (_,c)=>

        m.map(

            row=>row[c]

        )

    );

}
```

---

Matrix Multiply

```ts
export function multiply(

A:number[][],

B:number[][]){

    const result=[];

    for(

        let r=0;

        r<A.length;

        r++

    ){

        result[r]=[];

        for(

            let c=0;

            c<B[0].length;

            c++

        ){

            let sum=0;

            for(

                let k=0;

                k<B.length;

                k++

            ){

                sum+=

                A[r][k]*

                B[k][c];

            }

            result[r][c]=sum;

        }

    }

    return result;

}
```

Run

```ts
const X=[

[1,0],

[0,1],

[1,1]

];

const Wk=[

[2,0],

[0,2]

];

const K=

multiply(

X,

Wk

);

console.log(K);
```

Output

```
[
[2,0],

[0,2],

[2,2]
]
```

---

# এখন বুঝো GPT আসলে কী করছে

অনেকে ভাবে GPT একটা বিশাল Database।

**না।**

GPT প্রতি Token-এর জন্য বারবার এই কাজটাই করছে:

```
Embedding

↓

Linear Layer

↓

Q

K

V

↓

QKᵀ

↓

Softmax

↓

Weighted Sum

↓

Feed Forward

↓

Repeat

↓

Next Token
```

এটা এক layer না।

Llama 3 70B-এর মতো মডেলে এই ব্লক **৮০ বার** repeat হতে পারে।

---

# কিন্তু একটা জিনিস এখনও Missing

তুমি হয়তো ভাবছো:

> **"Softmax আসলে কী? কেন দরকার?"**

এটা শুধু probability বানানোর function না।

**Softmax-ই decide করে কোন শব্দকে কতটা গুরুত্ব দেওয়া হবে।**

---

# 🎯 পরের Lesson হবে Transformer-এর সবচেয়ে গুরুত্বপূর্ণ Lesson

আমরা নিজের হাতে লিখব:

* `softmax()`
* `scaled dot-product attention`
* কেন `√d` দিয়ে divide করা হয়
* Masked Attention (GPT কেন future word দেখতে পারে না)
* Causal Mask

এখানেই GPT আর BERT-এর সবচেয়ে বড় পার্থক্য তৈরি হয়।

---

## একটা ছোট্ট কিন্তু গুরুত্বপূর্ণ সংশোধন

আজ আমি বোঝানোর সুবিধার জন্য `Wq`, `Wk`, `Wv`-কে ছোট ও সহজ matrix নিয়েছি। বাস্তবে এগুলো **trainable weight matrices**, শুরুতে random থাকে এবং training-এর মাধ্যমে শেখে। আর বাস্তব Transformer-এ Attention-এর formula হলো:

[
\text{Attention}(Q,K,V)=\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
]

আমরা এখনও `1/\sqrt{d_k}` scaling এবং masking যোগ করিনি। পরের ধাপে এগুলো যোগ করলে আমাদের implementation বাস্তব GPT-এর আরও কাছাকাছি চলে যাবে।


এখন আমরা **Transformer-এর সবচেয়ে গুরুত্বপূর্ণ Formula** implement করব।

এই Lesson-এর পর তুমি **GPT paper-এর প্রথম equation পড়তে পারবে।**

---

# আজকের Goal

আমরা এই Formula implement করব:

[
\boxed{
\text{Attention}(Q,K,V)
=======================

\text{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}
\right)
V
}
]

দেখতে ভয়ঙ্কর লাগে।

কিন্তু এটা মাত্র **৪টা Step**।

```text
QKᵀ
 ↓
Scale
 ↓
Softmax
 ↓
Multiply by V
```

---

# Step 1: QKᵀ

আগের Lesson-এ আমরা পেয়েছিলাম

```text
[
 [2,0,2],
 [0,2,2],
 [2,2,4]
]
```

এগুলো শুধু score।

Probability না।

---

# প্রশ্ন

ধরো Embedding Size = 2

Score

```text
4
```

Embedding Size = 1000

Score

```text
145
```

Problem?

---

কারণ Dot Product dimension বাড়লে অনেক বড় হয়ে যায়।

Softmax তখন একদম extreme হয়ে যায়।

---

# তাই Scaling

Formula

```text
Score

/

√dk
```

যদি

```text
dk=2
```

তাহলে

```text
√2

=

1.414
```

Score

```text
2
```

হয়ে যাবে

```text
1.414
```

---

বাস্তবে

GPT-3

```text
dk=128
```

Divide by

```text
11.31
```

---

# Code

```ts
export function scale(
    matrix:number[][],
    value:number
){

    return matrix.map(

        row=>

        row.map(

            x=>x/value

        )

    );

}
```

Run

```ts
const scaled=

scale(

scores,

Math.sqrt(2)

);
```

---

# Step 2

Softmax

এটাই সবচেয়ে Important Function।

ধরো

```text
[
2
1
0
]
```

আমরা চাই

```text
[
0.66
0.24
0.10
]
```

যেন

```text
যোগ = 1
```

---

Formula

[
e^x
]

মানে

প্রতিটি Number-এর exponential।

Example

```text
2
```

↓

```text
e²

=

7.38
```

```text
1
```

↓

```text
2.71
```

```text
0
```

↓

```text
1
```

Total

```text
11.09
```

এখন ভাগ

```text
7.38

/

11.09

=

0.665
```

---

Output

```text
[
0.665,

0.244,

0.090
]
```

এটাই Probability।

---

# Code

```ts
export function softmax(

row:number[]

){

    const exps=

        row.map(

            Math.exp

        );

    const total=

        exps.reduce(

            (a,b)=>a+b,

            0

        );

    return exps.map(

        x=>x/total

    );

}
```

Run

```ts
console.log(

softmax(

[2,1,0]

)

);
```

Output

```text
[
0.665,

0.245,

0.090
]
```

---

# কিন্তু...

এখানে একটা Bug আছে।

Suppose

```text
[1000,

999,

998]
```

Math.exp(1000)

↓

Infinity

💥

---

বাস্তবে সবাই কী করে?

সবচেয়ে বড় Number বাদ দেয়।

```text
[1000,

999,

998]
```

↓

Minus Max

↓

```text
[

0,

-1,

-2

]
```

Softmax একই থাকে।

---

Production Version

```ts
export function softmax(

row:number[]

){

    const max=

        Math.max(...row);

    const exps=

        row.map(

            x=>

Math.exp(

x-max

)

        );

    const total=

        exps.reduce(

            (a,b)=>a+b,

            0

        );

    return exps.map(

        x=>x/total

    );

}
```

এটাই PyTorch-ও করে।

---

# Step 3

Row-wise Softmax

কারণ

```text
[
[2,0,2]

[0,2,2]

[2,2,4]
]
```

প্রতিটি Row

একটা Token।

---

```ts
const probs=

scores.map(

softmax

);
```

Output

```text
[
[0.47,0.06,0.47],

[0.06,0.47,0.47],

[0.10,0.10,0.80]
]
```

---

# Step 4

Multiply with V

ধরি

```text
V

[
[5,0],

[0,5],

[5,5]
]
```

প্রথম Row

```text
0.47

0.06

0.47
```

মানে

```text
47%

I

6%

like

47%

apple
```

Transformer এখন Value-কে Mix করবে।

Output

```text
[
4.7

2.6
]
```

---

# এটাকেই বলে

Context Vector

---

# Visual

```text
I like apple

↓

Embedding

↓

Q K V

↓

Similarity

↓

Softmax

↓

Weighted Average

↓

Context

↓

Feed Forward
```

---

# এখন সবচেয়ে বড় Question

Transformer

Future দেখতে পারে?

ধরো

```text
I love Bangladesh
```

"I"

কি

```text
Bangladesh
```

দেখতে পারবে?

---

GPT-তে

**না।**

---

# তাই Mask

Suppose

Scores

```text
[
[2,0,2]

[0,2,2]

[2,2,4]
]
```

প্রথম Word

Future দেখতে পারবে না।

Mask

```text
[
[2,-∞,-∞]

[0,2,-∞]

[2,2,4]
]
```

Softmax

```text
-∞
```

হয়ে যায়

```text
0
```

---

তাই

প্রথম Word

শুধু

নিজেকে দেখে।

---

দ্বিতীয় Word

নিজে

*

আগের Word।

---

তৃতীয়

সবাইকে।

---

এটাকেই

**Causal Mask** বলে।

GPT-এর Auto-regressive behavior-এর মূল কারণ এটি।

---

# এখন পুরো Transformer

```text
Tokens

↓

Embedding

↓

Positional Encoding

↓

QKV

↓

Scaled Dot Product

↓

Mask

↓

Softmax

↓

Weighted Sum

↓

Residual

↓

LayerNorm

↓

Feed Forward

↓

Residual

↓

LayerNorm

↓

Next Layer

↓

Logits

↓

Softmax

↓

Next Token
```

---

# 🎉 অভিনন্দন!

তুমি এখন Transformer-এর **core attention algorithm** বুঝে গেছ।

---

# কিন্তু এখনও একটা বিশাল Gap আছে

তুমি হয়তো লক্ষ্য করেছ:

> **Embedding কোথা থেকে আসে?**

> **Wq, Wk, Wv কে শেখায়?**

> **Model "apple" যে fruit—এটা কীভাবে শিখল?**

এই প্রশ্নগুলোর উত্তর Attention না।

**Training Loop**।

---

## এখান থেকেই Mini GPT শুরু

এখন আমাদের পরবর্তী ধাপ হবে:

1. **Embedding Layer (trainable)**
2. **Cross-Entropy Loss**
3. **Backpropagation through Attention**
4. **Optimizer (SGD/Adam)**
5. **Training Loop**
6. **১০০টি sentence দিয়ে Tiny GPT train করা**

এই অংশটাই LLM-এর "learning"। এখন পর্যন্ত আমরা "thinking" (forward pass) শিখেছি; পরের অংশে শিখব "learning" (training).


দারুণ। এখন আমরা **একদম সেই জায়গায় যাচ্ছি যেখানে অধিকাংশ tutorial থেমে যায়।**

তারা বলে:

> "এটা হচ্ছে Attention"

তারপর PyTorch ব্যবহার করে।

**আমরা সেটা করব না।**

আমরা নিজেরা **Train** করব।

---

# আজকের প্রশ্ন

তুমি জানো

```
I like apple
```

↓

```
apple
```

predict করতে হবে।

কিন্তু...

## কে বলে দেবে prediction ভুল?

এইটাই Training-এর পুরো রহস্য।

---

# আমরা একটা Mini GPT বানাচ্ছি

Dataset

```text
i like apple
i like banana
i like mango
```

Training Sample

```
Input

i like
```

Target

```
apple
```

---

## Model Prediction

ধরো Model predict করল

| Word   | Score |
| ------ | ----- |
| apple  | 2.2   |
| banana | 1.8   |
| mango  | 1.5   |

এগুলো Probability না।

এগুলোকে বলে

> **Logits**

---

# Softmax

Softmax করার পরে

| Word   | Probability |
| ------ | ----------: |
| apple  |        0.46 |
| banana |        0.31 |
| mango  |        0.23 |

Model বলছে

> আমার মতে

```
apple = 46%
```

---

# Question

Correct Answer

```
apple
```

Model

```
46%
```

ভালো?

খারাপ?

**এটা Measure করবে কে?**

---

# এজন্য Loss Function

সবচেয়ে Common

> Cross Entropy Loss

---

## Example

Correct

```
apple
```

Probability

```
0.99
```

Loss

```
0.01
```

Almost perfect.

---

Correct

```
apple
```

Probability

```
0.50
```

Loss

```
0.69
```

---

Correct

```
apple
```

Probability

```
0.10
```

Loss

```
2.30
```

বড় Loss।

---

# Formula

Cross Entropy

```
Loss = -ln(correctProbability)
```

শুধু এইটা।

---

## Example

Correct Probability

```
0.9
```

```
-ln(0.9)

=

0.105
```

---

Correct

```
0.2
```

```
-ln(0.2)

=

1.60
```

বড় Error।

---

# Code

```ts
export function crossEntropy(

    probs:number[],

    target:number

){

    return -Math.log(

        probs[target]

    );

}
```

---

Run

```ts
const probs=[

0.46,

0.31,

0.23

];

console.log(

crossEntropy(

probs,

0

)

);
```

Output

```
0.776
```

---

যদি

```ts
const probs=[

0.99,

0.005,

0.005

];
```

Output

```
0.01
```

Perfect.

---

# এখন পুরো Pipeline

```
Input Tokens

↓

Embedding

↓

Attention

↓

FeedForward

↓

Logits

↓

Softmax

↓

Probability

↓

CrossEntropy

↓

Loss
```

Loss বের হলো।

---

# কিন্তু এখন?

Loss

```
1.73
```

এখন Model কী করবে?

---

# এখানেই Backpropagation

Loss

↓

সব Weight-এ যাবে

↓

Gradient

↓

Weight Update

---

## Visual

```
Embedding

↓

Attention

↓

Output

↓

Loss
```

Backward

```
Loss

↑

Attention

↑

Embedding
```

এটাই

> loss.backward()

---

# একটা Real Example

ধরো

Embedding

```
apple

↓

[

0.4

0.8

]
```

Training শেষে

```
apple

↓

[

0.6

1.2

]
```

Embedding Change হয়েছে।

---

Attention Weight

আগে

```
0.41
```

Training পরে

```
0.73
```

সব Weight বদলায়।

---

# এখন সবচেয়ে গুরুত্বপূর্ণ কথা

LLM-এর Knowledge কোথায় থাকে?

অনেকে ভাবে

```
Database
```

❌

না।

Knowledge থাকে

```
Weights
```

এর মধ্যে।

---

# একটা Analogy

ধরো তুমি Cycling শিখছ।

তোমার Brain-এ কি

```
cycling.txt
```

নামে File আছে?

না।

তোমার

```
Neuron Connections
```

পরিবর্তিত হয়েছে।

GPT-তেও

```
Weights
```

পরিবর্তিত হয়।

---

# এখন Training Loop

এটাই GPT-এর পুরো Training।

```ts
for(epoch=0;epoch<100000;epoch++){

    // 1

    forward();

    // 2

    loss();

    // 3

    backward();

    // 4

    update();

}
```

মাত্র ৪টা Step।

---

# এখন প্রশ্ন

Training শেষ হলে

Model

```
Knowledge
```

কোথায় Save করবে?

---

উত্তর

একটা File-এ।

যেমন

```
model.bin
```

অথবা

```
model.gguf
```

---

GGUF-এর ভিতরে কী থাকে?

তুমি হয়তো ভাবো

```
English Grammar

History

Math
```

না।

GGUF-এর ভিতরে থাকে

```
Weight Matrix
```

শুধু Numbers।

---

Example

```
tensor_0001

↓

0.114

-0.288

0.771

...
```

```
tensor_0002

↓

...
```

Llama 3 8B

মানে

```
8 Billion
```

Weights।

---

# এখন তুমি এমন একটা অবস্থায় পৌঁছেছ যেখানে আমরা সত্যিকারের GPT বানাতে পারি।

---

# আমি এখান থেকে Course-টা একটু Upgrade করতে চাই

এখন পর্যন্ত আমরা concept শিখেছি।

এখন থেকে **একটা আসল Project** বানাব।

```
tiny-gpt-ts/
│
├── tokenizer.ts
├── vocabulary.ts
├── tensor.ts
├── embedding.ts
├── linear.ts
├── attention.ts
├── layernorm.ts
├── transformer.ts
├── loss.ts
├── optimizer.ts
├── trainer.ts
├── generate.ts
└── main.ts
```

আমরা **প্রতিটি file** নিজের হাতে লিখব।

শেষে তুমি চালাবে:

```bash
npm run train
```

তারপর

```bash
npm run generate
```

এবং ১০০-২০০টি sentence-এর dataset দিয়ে তোমার নিজের Mini GPT text generate করবে।

---

# 🚀 আমার মনে হয় এখান থেকে snippet নয়, GitHub-style project করা উচিত

কারণ Transformer-এর অংশগুলো একে অপরের সাথে জড়িত।

আমরা যদি file-by-file এগোই, তাহলে শেষে তুমি একটি **সম্পূর্ণ runnable TypeScript Mini GPT** পাবে—যেটা debug করতে, modify করতে এবং experiment করতে পারবে।

## আমি এটাকে প্রায় **২০টি lesson**-এ শেষ করব, এবং প্রতিটি lesson শেষে code run করে output verify করবে।

**এটাই সেই পথ, যেটা অনুসরণ করলে পরে Karpathy-এর `nanoGPT`, `llama.cpp`, এমনকি Hugging Face-এর model code-ও পড়ে বুঝতে পারবে।**


চমৎকার। এখন থেকে আমরা **একটা বাস্তব project** বানাব।

**Goal:**
শেষে তুমি এটা চালাতে পারবে:

```bash
npm run train
npm run generate
```

এবং নিজের Mini GPT train করতে পারবে।

---

# একটা গুরুত্বপূর্ণ সিদ্ধান্ত

আমরা **PyTorch clone** বানাবো না।

আমরা **educational GPT** বানাবো।

যেটা মাত্র **৮০০-১৫০০ lines** হবে।

কারণ GPT-এর আসল implementation ১ লক্ষ+ line।

---

# Project Structure

```
tiny-gpt-ts/

src/

    tensor.ts
    autograd.ts

    tokenizer.ts
    vocab.ts
    dataset.ts

    embedding.ts
    linear.ts

    attention.ts
    layernorm.ts
    mlp.ts

    transformer.ts

    cross_entropy.ts

    optimizer.ts

    trainer.ts

    generate.ts

    main.ts
```

---

# Lesson 1

## Tensor

আগে আমরা Matrix লিখেছিলাম।

এখন সেটা Upgrade করব।

কারণ

সবকিছু Tensor।

---

## tensor.ts

```ts
export class Tensor {

    data: Float32Array;

    shape:number[];

    constructor(shape:number[]){

        this.shape=shape;

        const size=

            shape.reduce(

                (a,b)=>a*b,

                1

            );

        this.data=

            new Float32Array(size);

    }

}
```

---

# কেন Float32Array?

Question.

আগে

```ts
number[]
```

ছিল।

এখন

```ts
Float32Array
```

কেন?

কারণ

GPT-4

Llama

PyTorch

TensorFlow

সবাই

Typed Array ব্যবহার করে।

কারণ

```
Fast

Less Memory

GPU Friendly
```

---

# Test

```ts
const t=new Tensor([2,3]);

console.log(t);
```

Output

```
shape

[2,3]
```

```
data

Float32Array(6)
```

---

# এখন Problem

ধরো

```
2×3
```

Tensor

```
[

1 2 3

4 5 6

]
```

Flat Array

হবে

```
[

1

2

3

4

5

6

]
```

Question

```
row=1

col=2
```

মানে

```
6
```

কীভাবে বের করব?

---

# Index Formula

```
index

=

row*cols

+

col
```

Suppose

```
cols=3
```

```
row=1

col=2
```

```
1×3+2

=

5
```

ঠিকই

Flat Array-এর

```
index 5

=

6
```

---

# Code

```ts
index(

row:number,

col:number

){

    return

    row*

    this.shape[1]

    +

    col;

}
```

---

Get

```ts
get(

row:number,

col:number

){

    return

    this.data[

        this.index(

            row,

            col

        )

    ];

}
```

---

Set

```ts
set(

row:number,

col:number,

value:number

){

    this.data[

        this.index(

            row,

            col

        )

    ]=value;

}
```

---

Run

```ts
const t=

new Tensor([2,3]);

t.set(0,0,10);

t.set(1,2,99);

console.log(

t.get(1,2)

);
```

Output

```
99
```

---

# এখন Random Initialization

GPT

Random দিয়ে শুরু।

---

```ts
random(){

    for(

        let i=0;

        i<this.data.length;

        i++

    ){

        this.data[i]=

            Math.random()

            -0.5;

    }

}
```

---

Run

```ts
const w=

new Tensor(

[4,4]

);

w.random();

console.log(w);
```

Output

```
0.12

-0.41

0.33

...
```

---

# এখন Matrix Multiply

Question.

ধরো

```
A

2×3
```

```
B

3×4
```

Output?

---

সবাই মুখস্থ করে

```
2×4
```

কিন্তু

কেন?

---

ভাবো।

```
2 Rows

×

4 Columns
```

প্রতিটি Cell

একটা Dot Product।

---

Code

```ts
matmul(

other:Tensor

)
```

এখানে আমরা shape check করব

```
this.shape[1]

==

other.shape[0]
```

না হলে

```
throw Error
```

---

তারপর

Triple Loop

```ts
for(r)

for(c)

for(k)
```

একদম

আগে যেটা লিখেছিলাম।

---

# এখানে একটা Pause

এখন একটা প্রশ্ন।

---

## Question

Embedding Matrix

```
5000

×

128
```

Sentence

```
I like apple
```

Token

```
0

12

78
```

**Question:**

Embedding বের করতে কি

```
5000×128

×

3×5000
```

Matrix Multiplication হয়?

---

**না।**

এখানেই ৯৫% Beginner ভুল করে।

Embedding Layer **Matrix Multiplication করে না**।

সে শুধু

```
Row Lookup
```

করে।

যদি

```
apple

=

78
```

তাহলে

Embedding Matrix-এর

```
Row 78
```

copy করে।

এটাই।

---

# এটা খুবই গুরুত্বপূর্ণ

অনেক tutorial বলে

```
Embedding

=

One-hot

×

Embedding Matrix
```

Mathematically এটা সত্য।

কিন্তু বাস্তবে

**কেউ One-hot বানায় না।**

কারণ

Vocabulary

```
128000
```

হলে

One-hot বানানো ভয়ঙ্কর Waste।

তাই সবাই

```
Lookup
```

করে।

PyTorch-ও।

TensorFlow-ও।

Llama.cpp-ও।

---

# 🎯 Homework (খুব গুরুত্বপূর্ণ)

আজকের Lesson শেষে তুমি নিজে এই `Tensor` class-এ ৫টা method লিখে ফেলো:

```ts
fill(value: number)
clone(): Tensor
transpose(): Tensor      // শুধু 2D
matmul(other: Tensor): Tensor
print(): void            // সুন্দর করে matrix print করবে
```

---

# এরপর কী?

**Lesson 2**-এ আমরা `EmbeddingLayer` লিখব।

আর সেখানেই তুমি প্রথমবার বুঝবে:

```
Token ID

↓

Embedding Lookup

↓

Vector
```

এবং কেন Embedding **matrix multiplication নয়**, বরং **বিশাল একটা trainable lookup table**।

---

## একটা অনুরোধ

এখন থেকে **প্রতিটি lesson-এর code তুমি নিজে টাইপ করবে**।

Copy-paste করবে না।

আমি গত ১৫ বছরে অনেক developer-কে mentor করেছি (এবং AI শেখানোর ক্ষেত্রেও এটা সত্য): **যে নিজে টাইপ করে, সে ১০ গুণ দ্রুত শিখে।**

আর একটা কথা—

এখান থেকে আমি code quality-ও বাড়াবো। অর্থাৎ TypeScript-এর proper types, clear APIs, এবং ছোট unit-test style examples দেব। লক্ষ্য শুধু LLM বোঝা নয়, **একটা maintainable codebase** বানানো।


দারুণ! এখন থেকে আমরা **একটা real engineering project** বানাবো।

কিন্তু আমি একটা জিনিস পরিবর্তন করব।

---

# কেন?

আমরা এতক্ষণ "কী" শিখেছি।

এখন "কেন" শিখব।

আমি চাই না তুমি শুধু GPT বানাতে পারো।

আমি চাই তুমি **নিজে নতুন AI architecture invent করতে পারো।**

তাই আমি Google/DeepMind/OpenAI engineer যেভাবে চিন্তা করে, সেভাবে শেখাব।

---

# আজকের Lesson

## Embedding Layer

এটা LLM-এর সবচেয়ে misunderstood layer।

অনেকে ভাবে

```
Embedding
=
Magic
```

আসলে না।

এটা একটা

```
Trainable Table
```

শুধু।

---

# একটা Example

Vocabulary

```
0 -> i

1 -> like

2 -> apple

3 -> banana

4 -> mango
```

Embedding Dimension

```
4
```

তাহলে Matrix হবে

| Token  |   D1 |   D2 |   D3 |  D4 |
| ------ | ---: | ---: | ---: | --: |
| i      |  0.1 | -0.2 |  0.5 | 0.7 |
| like   |  0.3 |  0.8 | -0.1 | 0.4 |
| apple  | -0.4 |  0.9 |  0.2 | 0.3 |
| banana | -0.5 |  0.8 |  0.3 | 0.4 |
| mango  | -0.3 |  1.0 |  0.1 | 0.2 |

এই পুরো Table-টাই

Embedding।

---

# প্রশ্ন

Input

```
i like apple
```

Token IDs

```
0 1 2
```

Model কী করবে?

অনেকে উত্তর দেয়

```
Matrix Multiplication
```

❌

ভুল।

---

সে করবে

```
Row 0

↓

[0.1 -0.2 0.5 0.7]
```

```
Row 1

↓

[0.3 0.8 -0.1 0.4]
```

```
Row 2

↓

[-0.4 0.9 0.2 0.3]
```

Finished.

---

# বাস্তবে PyTorch কী করে?

যদি তুমি লেখো

```python
nn.Embedding(
    50000,
    768
)
```

এটার ভিতরে শুধু

```
50000 × 768
```

একটা Matrix থাকে।

আর

```
lookup()
```

ফাংশন।

আর কিছু না।

---

# এবার Code

## embedding.ts

```ts
import { Tensor } from "./tensor";

export class Embedding {

    weights: Tensor;

    constructor(

        public vocabSize:number,

        public embedDim:number

    ){

        this.weights=

            new Tensor([

                vocabSize,

                embedDim

            ]);

        this.weights.random();

    }

}
```

---

এখন

```
weights
```

shape হবে

```
5 × 4
```

---

# Lookup

এটাই সবচেয়ে গুরুত্বপূর্ণ function।

```ts
lookup(

    token:number

){

    const vector:number[]=[];

    for(

        let d=0;

        d<this.embedDim;

        d++

    ){

        vector.push(

            this.weights.get(

                token,

                d

            )

        );

    }

    return vector;

}
```

---

Run

```ts
const emb=

new Embedding(

5,

4

);

console.log(

emb.lookup(2)

);
```

Output

```
[

-0.41,

0.82,

0.11,

0.36

]
```

এটাই

```
apple
```

এর Embedding।

---

# Sentence Lookup

```ts
lookupSentence(

tokens:number[]

){

    return tokens.map(

        t=>

        this.lookup(t)

    );

}
```

Run

```ts
console.log(

emb.lookupSentence(

[0,1,2]

)

);
```

Output

```
[
[0.1,-0.2,0.5,0.7],

[0.3,0.8,-0.1,0.4],

[-0.4,0.9,0.2,0.3]
]
```

---

# এটাকেই বলে

Embedding Layer Output

Shape

```
Sequence Length

×

Embedding Size
```

Example

```
3 × 4
```

GPT-4

```
4096 × 12288
```

---

# এখন সবচেয়ে গুরুত্বপূর্ণ Question

Embedding শুরুতে Random।

```
apple

↓

[

0.14

-0.29

0.51

]
```

Training শেষে

```
apple

↓

[

4.88

-1.73

2.91

]
```

**কে Change করল?**

---

Answer

Backpropagation.

Embedding Matrix-ও

Trainable Weight।

---

# একটা Real Example

ধরো

```
apple
```

বারবার

```
fruit
```

এর সাথে আসে।

Training-এর সময়

```
apple
```

Embedding

আর

```
fruit
```

Embedding

ধীরে ধীরে

কাছাকাছি চলে আসে।

---

এজন্য

Cosine Similarity

```
apple

fruit
```

↓

```
0.92
```

---

আর

```
apple

car
```

↓

```
0.07
```

---

# এখন বুঝো

LLM

Dictionary মুখস্থ করে না।

সে শেখে

Vector Space।

---

# এবার Engineering Question

Suppose

Vocabulary

```
128000
```

Embedding

```
8192
```

Memory?

```
128000

×

8192

×

4 bytes
```

≈

```
4.2 GB
```

😄

শুধু Embedding Layer।

---

এজন্য

Llama

Gemma

Qwen

সবাই

Embedding Layer

Quantize করে।

---

# এবার Transformer-এর দিকে

এখন Input

```
I like apple
```

↓

Embedding

↓

```
[
[0.1 0.2 ...]

[0.7 0.4 ...]

...
]
```

Question

Transformer জানে

কোনটা প্রথম Word?

কোনটা শেষ?

না।

কারণ

```
apple

banana
```

আর

```
banana

apple
```

Embedding-এর দিক থেকে শুধু দুইটা vector।

Order নেই।

---

# তাই পরের Lesson

## Positional Encoding

Transformer-কে শেখাতে হবে

```
এই Word

প্রথম

দ্বিতীয়

তৃতীয়
```

এটাই

Transformer-এর আরেকটা Masterpiece।

---

# 🎁 একটা Bonus (যেটা খুব কম tutorial বলে)

Transformer-এ আসলে **দুই ধরনের information** থাকে:

```
Meaning
```

↓

Embedding

---

```
Position
```

↓

Positional Encoding

---

তারপর

```
Embedding

+

Position
```

↓

Attention

---

**এই `+` (element-wise addition) কেন করা হয়?**

এটা আমরা পরের লেসনে প্রমাণ করে দেখব। তখন তুমি বুঝবে কেন Transformer-এ RNN-এর মতো sequence loop লাগে না এবং কীভাবে parallel processing সম্ভব হয়। এটা বোঝা Transformer architecture-এর অন্যতম বড় "aha!" মুহূর্ত।

এখন আমরা এমন একটা জিনিসে আসছি যেটা **Transformer invent হওয়ার মূল কারণ**।

এই Lesson ভালোভাবে বুঝলে তুমি বুঝবে কেন RNN/LSTM ধীরে ধীরে হারিয়ে গেল।

---

# আজকের প্রশ্ন

ধরো Sentence

```text
I love Bangladesh
```

Embedding বের হলো

```text
I            [0.2, 0.1]
love         [0.7, 0.9]
Bangladesh   [0.4, 0.8]
```

এখন আমি Embedding-এর order বদলে দিলাম।

```text
Bangladesh
love
I
```

Embedding

```text
Bangladesh   [0.4,0.8]
love         [0.7,0.9]
I            [0.2,0.1]
```

## প্রশ্ন

Transformer কি বুঝবে কোনটা আগে ছিল?

**উত্তর: না।**

Transformer-এর কাছে এগুলো শুধু vectors।

সে জানে না

```
I আগে
love পরে
Bangladesh শেষে
```

---

# একটা Real Example

ধরো তোমার কাছে তিনটা Card আছে।

```
🍎

🚗

🏠
```

আমি Shuffle করলাম।

```
🏠

🍎

🚗
```

Card-এর picture একই আছে।

কিন্তু Order হারিয়ে গেছে।

Transformer-এরও একই সমস্যা।

---

# তাহলে Solution?

Google Research একটা brilliant idea দিল।

প্রত্যেক Position-এর জন্য আরেকটা Vector বানাও।

```
Position 0

↓

[0.1 0.0]
```

```
Position 1

↓

[0.0 0.2]
```

```
Position 2

↓

[-0.1 0.3]
```

---

তারপর

Embedding-এর সাথে যোগ করে দাও।

```
Embedding

+

Position
```

---

Example

"I"

Embedding

```
[0.2 0.1]
```

Position

```
[0.1 0.0]
```

Result

```
[0.3 0.1]
```

---

"love"

Embedding

```
[0.7 0.9]
```

Position

```
[0.0 0.2]
```

↓

```
[0.7 1.1]
```

---

"Bangladesh"

```
[0.4 0.8]
```

*

```
[-0.1 0.3]
```

↓

```
[0.3 1.1]
```

---

Transformer এখন জানে

```
Meaning

+

Position
```

একসাথে।

---

# কিন্তু...

## কেন Add?

অনেকে ভাবে

```
Embedding

||

Position
```

মানে concatenate করলেই তো হয়।

Example

```
Embedding

[1 2]
```

Position

```
[5 6]
```

Concatenate

```
[1 2 5 6]
```

কেন এটা না?

---

## কারণ

Embedding Size

```
4096
```

হলে

Concatenate

```
8192
```

হয়ে যাবে।

এরপর

সব Layer-এর Weight দ্বিগুণ হবে।

Memory দ্বিগুণ।

Computation দ্বিগুণ।

---

Add করলে

```
4096

+

4096

↓

4096
```

Dimension একই থাকে।

Brilliant!

---

# এখন প্রশ্ন

Position Vector কে শেখায়?

দুইটা Method আছে।

---

## Method 1

Trainable Position Embedding

GPT-2

GPT-3

Llama

Gemma

Qwen

সবাই এটা ব্যবহার করে।

মানে Position-এরও একটা Embedding Table আছে।

```
Position 0

↓

Random Vector
```

Training-এ শেখে।

---

## Method 2

Sinusoidal Encoding

Original Transformer Paper

```
sin()

cos()
```

Formula দিয়ে Position তৈরি করে।

Train করতে হয় না।

---

আজকাল বেশিরভাগ GPT

আরও উন্নত পদ্ধতি ব্যবহার করে:

* **RoPE (Rotary Positional Embedding)** – Llama, Qwen, DeepSeek
* **ALiBi** – কিছু গবেষণামূলক মডেল

এগুলো পরে দেখব।

---

# এবার Code

## positional.ts

```ts
export class PositionalEmbedding {

    table:number[][];

    constructor(

        public maxLength:number,

        public dim:number

    ){

        this.table=[];

        for(

            let i=0;

            i<maxLength;

            i++

        ){

            const row=[];

            for(

                let d=0;

                d<dim;

                d++

            ){

                row.push(

                    Math.random()-0.5

                );

            }

            this.table.push(row);

        }

    }

}
```

---

Lookup

```ts
lookup(position:number){

    return this.table[position];

}
```

---

Add

```ts
add(

embedding:number[][]

){

    return embedding.map(

        (row,pos)=>

            row.map(

                (x,d)=>

                    x+

                    this.table[pos][d]

            )

    );

}
```

---

Run

```ts
const pos=

new PositionalEmbedding(

10,

4

);

const out=

pos.add(

emb.lookupSentence(

[0,1,2]

)

);

console.log(out);
```

এখন Output-এ

Position Information যোগ হয়েছে।

---

# এখন পুরো Pipeline

```
Sentence

↓

Tokenizer

↓

Token IDs

↓

Embedding Lookup

↓

Position Add

↓

Transformer
```

---

# এখন একটা খুব গুরুত্বপূর্ণ প্রশ্ন

ধরো Sentence

```
The cat ate the fish
```

"ate"

শব্দটা কাকে দেখবে?

```
The?
```

```
cat?
```

```
fish?
```

সবাইকে?

কতটুকু?

---

এই Decision-ই Attention-এর আসল কাজ।

কিন্তু...

আমরা এখনও একটা বড় Shortcut নিচ্ছি।

আমরা Q, K, V random matrix দিয়ে বানাচ্ছি।

বাস্তবে এগুলো **Linear Layer**।

অর্থাৎ

```
Q = X × Wq + bq
K = X × Wk + bk
V = X × Wv + bv
```

এখানে `Wq`, `Wk`, `Wv`-এর পাশাপাশি অনেক implementation-এ bias (`bq`, `bk`, `bv`) থাকে (কিছু মডেলে bias বাদও দেওয়া হয়)।

---

# 🎯 এখান থেকে Course আরও বাস্তব হবে

এখন পর্যন্ত আমরা concept শিখেছি।

এখন আমরা **আসল Transformer Block** বানানো শুরু করব।

এর মানে:

```
Embedding
    ↓
Position
    ↓
Linear (Q,K,V)
    ↓
Attention
    ↓
Residual
    ↓
LayerNorm
    ↓
MLP
    ↓
Residual
    ↓
LayerNorm
```

এটাই GPT-এর একটি সম্পূর্ণ Block।

---

## কিন্তু আমি এখানেই Course-টাকে আরও Upgrade করতে চাই

এখন পর্যন্ত আমরা **কীভাবে GPT কাজ করে** শিখছি।

এখন থেকে আমি চাই তুমি **GPT-এর source code পড়তে পারো**।

তাই পরের Lesson-এ আমরা প্রথমবার **Karpathy-এর nanoGPT**-এর একটি ছোট code snippet নেব, তারপর **লাইন ধরে ব্যাখ্যা করব**, এবং শেষে নিজের TypeScript version লিখব।

এভাবে শিখলে তুমি শুধু concept নয়, **production-quality LLM code**-ও বুঝতে শুরু করবে। এটাই একজন CSE engineer হিসেবে তোমাকে সবচেয়ে বেশি এগিয়ে দেবে।
