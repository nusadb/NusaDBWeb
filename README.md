# NusaDB website and documentation

The public site for [NusaDB](https://github.com/nusadb/nusadb), a relational database
engine written from scratch in Rust. Static HTML, CSS and JavaScript: no framework, no
build step, no dependencies to install.

## Layout

```
index.html              Landing page
docs/
  index.html            Documentation overview and architecture
  getting-started.html  Install, connect, create, load and export
  sql.html              Types, statements, and NusaDB's own behaviours
  transactions.html     Isolation, conflicts and retries, savepoints
  clients.html          Drivers, connection settings, TLS and SCRAM
  configuration.html    Server flags, resource defaults, systemd, metrics
  limits.html           Capacity, log growth, restart time, what is missing
css/style.css           The whole design system
js/main.js              Theme toggle, navigation, copy buttons, page contents
```

## Running it locally

Open `index.html` in a browser, or serve the directory so that relative paths and
directory indexes behave the way they will in production:

```bash
python -m http.server 8000
# or
npx serve .
```

## Design notes

Two brand colours: `#293880` for structure and `#4297C8` for interaction. The blue is
too light to carry body text on white: around 3.2:1 against it, below the 4.5:1 needed
for normal text. Links and inline text therefore use a darkened step of the same hue
(`--blue-ink`), and the lighter blue is kept for fills, rules and focus rings. Both a
light and a dark scheme are defined; the page follows the operating system by default and
a toggle overrides it, remembered in `localStorage`.

Type is one family at a small number of sizes: IBM Plex Sans for text and IBM Plex Mono
for code and labels. It was chosen over the more common pairings because it was designed
for technical documentation, its mono companion is genuinely readable in SQL, and using a
single family keeps the pages looking deliberate rather than assembled.

Structure leans on 1px rules rather than shadows, tables are used where a table is the
honest shape for the content, and there are no decorative gradients.

## Editing

The documentation pages share one shell: masthead, sidebar, breadcrumb, contents and
footer. When adding a page, copy an existing one in `docs/`, then add it to three places
so navigation stays consistent:

1. the sidebar group it belongs to, in every `docs/*.html` file
2. the previous and next links on its neighbours
3. the footer column on `index.html`

`js/main.js` builds the on-page contents list from `h2` and `h3` elements that carry an
`id`, so give every section heading one. Code samples use this shape, and the copy button
puts the text content on the clipboard, which is why the syntax spans do not interfere:

```html
<div class="code">
  <div class="code-bar">
    <span>sql</span>
    <button class="copy" type="button"><em>Copy</em></button>
  </div>
  <pre><span class="k">SELECT</span> 1;</pre>
</div>
```

The span classes are `k` for keywords, `s` for literals, `c` for comments and `o` for
sample output.

## What belongs here

Only behaviour the engine actually has. If something is planned but not built, it goes on
the limits page rather than the feature list, and measured figures state the conditions
they were measured under. The site is read by people deciding whether to trust the engine
with their data, so an overstatement costs more than a missing paragraph.

## Deployment

Pushing to `main` publishes the repository root through GitHub Pages
(`.github/workflows/pages.yml`). `.nojekyll` keeps Pages from reinterpreting the files.

## Licence

Apache-2.0, matching the engine.
