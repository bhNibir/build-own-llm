# Contributing to Build Your Own LLM

Thanks for helping make this open-source Bangla LLM course better.

## Ways to contribute

- Fix typos or unclear Bangla / English explanations
- Improve or add lesson diagrams (`ConceptAnim`, Mermaid)
- Fix playground / CLI bugs
- Add tests or accessibility improvements
- Suggest curriculum gaps via GitHub Issues

## Development

```bash
bun install
bun dev
```

- Lessons live in `content/docs/`
- Playgrounds and diagrams in `components/`
- Curriculum source of truth: `PRD.md`

## Content guidelines

1. Technical terms in **English** (`Tokenizer`, `Softmax`, `Attention`)
2. Explanations in **Bangla**
3. One primary idea per lesson visual — avoid duplicate diagrams for the same concept
4. Prefer browser-runnable TypeScript; no heavy ML frameworks

## Pull requests

1. Fork → branch → PR against `main`
2. Describe the problem and the change
3. Keep diffs focused; don’t reformat unrelated files
4. If you touch diagrams, note light/dark mode checks

## Code of conduct

Be respectful. This project is for learners — especially CSE students in Bangladesh and the Bangla-speaking community. Harassment or gatekeeping is not welcome.

## Sponsors

Sustained work is supported by [GitHub Sponsors](https://github.com/sponsors/bhNibir). See the README **Support & sponsors** section.
