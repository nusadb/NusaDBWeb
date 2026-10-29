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
  configuration.html    Server flags, resource defaults, systemd, metrics, backup
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

Structure comes from 1px lines rather than shadows or tinted bands, with corner radii of 2 to
6px. The two brand colours are `#293880` (navy) and `#4297C8` (blue). Blue is about 3.0:1
on the light ground, too low for text, so light-theme links use `#1d6e99` (5.2:1); on the
dark ground blue reaches 5.9:1 and is used for links directly. Body text is 16.9:1 (light)
and 15.8:1 (dark). The page follows the operating system's colour scheme, and the toggle
overrides it and is remembered in `localStorage`.

Type is IBM Plex Sans for text and headings and IBM Plex Mono for code, commands and
versions, loaded from Google Fonts with system fallbacks. The scale steps by about 1.2 from
16px. Every page works without JavaScript: the script only adds the theme toggle, the
mobile menus, copy buttons and the on-page contents list.

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
