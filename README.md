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
  internals.html        How it works: page layout, versions, log frame, checkpoints
  sql.html              Types, statements, and NusaDB's own behaviours
  transactions.html     Isolation, conflicts and retries, savepoints
  clients.html          Drivers, connection settings, TLS and SCRAM
  configuration.html    Server flags, resource defaults, systemd, metrics, backup
  limits.html           Capacity, log growth, restart time, what is missing
css/style.css           The whole design system
js/main.js              Theme toggle, navigation, copy buttons, tabs, page contents,
                        chart tooltips, the write-path figure on the home page
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

The site reads like a datasheet and an engineering drawing: a paper-coloured ground with hairline
rules, numbered sections with a margin label, numbered figures with captions, and monospace for
anything that is a name, a size, a flag or a byte offset. Headings are IBM Plex Serif, text is
IBM Plex Sans and code is IBM Plex Mono, loaded from Google Fonts with system fallbacks.

Colour is spent where it means something. Navy `#293880` and blue `#4297C8` are the brand; one
warm signal colour (`#b23c0a` light, `#f0884a` dark) marks the durability point in diagrams, such
as the fsync of a commit or the CRC field of a log frame, and nothing else. Every colour is a token
on `:root`, redefined for the dark theme; contrast ratios are listed at the top of
`css/style.css`. The page follows the operating system's colour scheme, and the toggle overrides
it and is remembered in `localStorage`.

Diagrams are inline SVG drawn with classes (`d-box`, `d-txt`, `d-line-sig` and so on), so both
themes come from the same tokens. Fig. 1 on the home page is the only animated element: it steps
through a write, a commit and a checkpoint, has pause and step buttons, starts only when it is on
screen, and stays still when the reader prefers reduced motion. Every page works without
JavaScript: tab panels then show one under another and the figure shows its pre-checkpoint state.

Session output on the home page and in the docs was produced by the release binary and is pasted
unedited, apart from trimmed `ls` columns. Measured numbers carry the date, the build and the
machine they were measured on.

## Editing

The documentation pages share one shell: masthead, sidebar, breadcrumb, contents and
footer. When adding a page, copy an existing one in `docs/`, then add it to three places
so navigation stays consistent:

1. the sidebar group it belongs to, in every `docs/*.html` file
2. the previous and next links on its neighbours
3. the footer column on `index.html`

Bump the `?v=` string on `style.css` and `main.js` in every page when either file changes, so
browsers fetch the new copy.

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
