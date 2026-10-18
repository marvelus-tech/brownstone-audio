# Brownstone Audio

`index.html` is a JSON-driven GitHub Pages app. It reads episode cards from `articles.json` and heard state from `listens.json`.

The daily poster may regenerate `index.html` from its old static template. The canonical JSON-driven page lives at `template/index.template.html`. The `Restore Canonical Index` workflow restores that template over `index.html` automatically after a push to `main` changes `index.html` or `articles.json`. Edit the canonical template and `index.html` together when intentionally changing the page.

`removed.json` is the permanent episode blocklist. Slugs in this file must never be re-added. Any tool or workflow that adds episodes must check `removed.json` before changing `articles.json` or adding an MP3.

Run the regression check with:

```sh
node --test tests/listen-feature.test.mjs
```
