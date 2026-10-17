import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const index = readFileSync('index.html', 'utf8');
const articles = JSON.parse(readFileSync('articles.json', 'utf8'));
const listens = JSON.parse(readFileSync('listens.json', 'utf8'));
const removed = JSON.parse(readFileSync('removed.json', 'utf8'));
const recordWorkflow = readFileSync('.github/workflows/record-listen.yml', 'utf8');

test('page stays JSON-driven with listened controls', () => {
  assert.match(index, /fetch\('articles\.json'\)/);
  assert.match(index, /fetch\('listens\.json'\)/);
  assert.match(index, /audio\.addEventListener\('ended', markComplete\)/);
  assert.match(index, /localStorage\.setItem\('heardLocal'/);
  assert.match(index, /event_type: 'listen_complete'/);
  assert.match(index, /event_type: 'listen_keep'/);
  assert.match(index, /client_payload: \{\s*slug: article\.slug/);
  assert.match(index, /HEARD/);
  assert.match(index, /keepBtn\.textContent = 'KEEP'/);
  assert.doesNotMatch(index, /if \(existingBadge\) return/);
  assert.doesNotMatch(index, /<article class="card">/);
});

test('page dispatch contract matches the record workflow', () => {
  assert.match(recordWorkflow, /types: \[listen_complete, listen_keep\]/);
  assert.match(recordWorkflow, /github\.event\.client_payload\.slug/);
  assert.match(recordWorkflow, /select\(\.slug == \$slug\)' removed\.json/);
});

test('every current article has an audio file', () => {
  assert.ok(articles.length > 0);
  for (const article of articles) {
    assert.ok(existsSync(article.audio), `Missing ${article.audio}`);
  }
});

test('removed episodes cannot return to the catalog or listens', () => {
  assert.ok(Array.isArray(removed));

  const removedSlugs = new Set();
  for (const episode of removed) {
    assert.deepEqual(
      Object.keys(episode).sort(),
      ['date', 'removed_at', 'slug', 'title', 'url'],
    );
    assert.ok(episode.slug);
    assert.ok(episode.title);
    assert.ok(episode.date);
    assert.ok(episode.url);
    assert.ok(!Number.isNaN(Date.parse(episode.removed_at)));
    assert.ok(!removedSlugs.has(episode.slug), `Duplicate removed slug: ${episode.slug}`);
    removedSlugs.add(episode.slug);
  }

  for (const article of articles) {
    assert.ok(!removedSlugs.has(article.slug), `Blocked article was re-added: ${article.slug}`);
  }
  for (const slug of Object.keys(listens)) {
    assert.ok(!removedSlugs.has(slug), `Blocked listen was re-added: ${slug}`);
  }
});

test('page keeps light-theme and basic search metadata constraints', () => {
  assert.match(index, /--field: #F4F6F8/);
  assert.doesNotMatch(index, /—/);

  const description = index.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(description);
  assert.ok(description.length >= 120 && description.length <= 160);
  assert.match(index, /<link rel="canonical" href="https:\/\/marvelus-tech\.github\.io\/brownstone-audio\/"/);
});
