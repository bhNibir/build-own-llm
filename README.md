# নিজের LLM বানাও · Build Your Own LLM

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink.svg)](https://github.com/sponsors/bhNibir)

**Open-source** interactive course: learn how LLMs work from zero by building every piece in TypeScript — in the browser, with Bangla explanations and English technical terms.

> API wrap করো না। Tokenizer → Bigram → Autograd → Attention → Mini GPT — নিজে বানাও।

**Live course:** [GitHub repo](https://github.com/bhNibir/build-own-llm) · Maintainer: [Biplob Hasan Nibir](https://github.com/bhNibir)

---

## Why this project?

Most “LLM courses” teach you how to *call* models. This one teaches you how they *work*.

| Principle | What it means |
| --- | --- |
| Browser-first | Edit & run TypeScript in the lesson — no terminal required for learners |
| Bangla + English terms | Prose in Bangla; `Tokenizer`, `Softmax`, `Attention` stay in English |
| No ML frameworks | Pure TypeScript + matrix math from scratch |
| Run early | Working Bigram before deep math |
| 49 lessons | Modules 0–10, from intro to a Mini GPT |

---

## Curriculum

```
Module 0   Introduction
Module 1   Tokenizer + Vocabulary
Module 2   Bigram LM
Module 3   Math Foundations
Module 4   Autograd
Module 5   Neural Network
Module 6   Neural LM
Module 7   Attention
Module 8   Transformer Block
Module 9   Mini GPT
Module 10  Production Bridge
```

Start here: [`content/docs/part-00-intro/`](./content/docs/part-00-intro/)

---

## Quick start

**Requirements:** [Bun](https://bun.sh)

```bash
git clone https://github.com/bhNibir/build-own-llm.git
cd build-own-llm
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### CLI lesson runners (optional)

```bash
bun part-01   # Tokenizer + Vocabulary
bun part-02   # Bigram train + generate
bun part-03   # Math foundations
# … through part-09
```

---

## Project layout

| Path | Role |
| --- | --- |
| `content/docs/` | Bangla MDX lessons (Fumadocs) |
| `components/` | Playgrounds, diagrams, visualizers |
| `code/` | Runnable TypeScript demos per module |
| `app/(home)` | Landing page |
| `app/docs` | Course UI |
| `PRD.md` | Product / curriculum source of truth |

---

## Contributing

This is a community-friendly open-source project. Contributions are welcome — lessons, diagrams, bug fixes, translations, docs.

1. Fork the repo and create a branch
2. Keep Bangla prose + English technical terms
3. Prefer one clear ConceptAnim / Mermaid idea per lesson
4. Open a PR with a short description of *why*

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## Support & sponsors

If this course helps you (or your team / university), please consider supporting development. Sponsorship funds:

- New lessons and visual polish
- Hosting / tooling costs
- Time for reviews and community help

**Ways to support:**

- **[GitHub Sponsors](https://github.com/sponsors/bhNibir)** — monthly or one-time
- **Star the repo** — helps others discover the project
- **Share** with CSE students and Bangla tech communities
- **Contribute** code, content, or issue reports

Company / education sponsors: open an issue or email via [nibir.pro.bd](https://nibir.pro.bd) — logos and shout-outs welcome for sustained support.

Thank you to everyone who stars, shares, sponsors, or contributes ❤️

---

## License

[MIT](./LICENSE) — free to use, share, and build on. Attribution appreciated.

---

## Credits

- Built and maintained by [Biplob Hasan Nibir](https://github.com/bhNibir) ([@bhnibir](https://twitter.com/bhnibir))
- Docs UI: [Fumadocs](https://fumadocs.dev) · App: [Next.js](https://nextjs.org)

---

<p align="center">
  <a href="https://github.com/sponsors/bhNibir">Become a sponsor</a>
  ·
  <a href="./CONTRIBUTING.md">Contribute</a>
  ·
  <a href="./PRD.md">PRD</a>
</p>
