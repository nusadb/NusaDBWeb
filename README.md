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

The brand palette has five colours: navy `#293681`, blue `#4274D9`, light blue `#95CCDD`,
pale mint `#D0E7E6` and a very light blue `#E3F2FD`. The page is white. Navy is for headings,
key figures and the panels that show the product itself: the terminal in the hero, code blocks
and the write-path figure. Blue is the accent for buttons, links, focus and chart marks; the
button uses `#3d6dd3`, the nearest shade of it that carries white text at AA. Mint and light
blue appear only as small accents (diagram fills, a badge, a chart series), and `#E3F2FD` is used
for hover and selected states and for the one quiet section, Install. Every other value is a tint
or shade of those five, except one amber used only for caution notes and error output. Every
colour is a token on `:root`, redefined for the dark theme (navy-black grounds), and a navy
panel (`.on-navy`) redefines the tokens again so code and diagrams repaint themselves on it.
Contrast ratios are listed at the top of `css/style.css`. The page follows the operating
system's colour scheme, and the toggle overrides it and is remembered in `localStorage`.

Text is Plus Jakarta Sans, from an Indonesian type foundry, at 700 with tight tracking for
headings. Code, flags, file names and byte fields are JetBrains Mono with ligatures turned off,
so `<=` in a transcript stays two characters. Both load from Google Fonts with system
fallbacks. The hyphen alone is taken from a system face, because the one in Plus Jakarta Sans is
long enough to read as a dash in `0.1.0-beta.16`.

The logo is a database cylinder: a navy body in three stacked disks, separated by light blue
bands, under a blue top. The same drawing is inlined in the header and footer of every page
(its colours are tokens, so it repaints in the dark theme) and is the favicon as an SVG data URI.

Diagrams are inline SVG drawn with classes (`d-box`, `d-txt`, `d-line-sig` and so on), so every
ground comes from the same tokens. Field and file names in them are set in the mono face and
descriptions in the text face. Fig. 1 on the home page is the only animated element: it steps
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
