# Brownstone Audio

`index.html` is a JSON-driven GitHub Pages app. It reads episode cards from `articles.json` and heard state from `listens.json`.

Do not regenerate `index.html` from the old static card template when adding an episode. That removes listened tracking, HEARD status, KEEP controls, and repository dispatches. Add new episode metadata to `articles.json` and its MP3 under `audio/` instead.

`removed.json` is the permanent episode blocklist. Slugs in this file must never be re-added. Any tool or workflow that adds episodes must check `removed.json` before changing `articles.json` or adding an MP3.

Run the regression check with:

```sh
node --test tests/listen-feature.test.mjs
```
