# CLAUDE.md

## Project

Linkinator — a static link directory hosted on GitHub Pages. No build step, no dependencies, no
package manager. **The labyrinth is the whole site**; there used to be a normal linktree page in
front of it and there isn't any more.

- `index.html` — page shell, and almost nothing else: an empty `#labyrinth` div. Loads `styles.css`,
  `map.js`, and `labyrinth.js` with a `?v=Date.now()` cache buster. The scripts are injected with
  `async = false` so they run in order — `labyrinth.js` reads what `map.js` defines.
- `map.js` — **generated, never hand-edit.** The contents: links, blocks, and where they sit.
- `labyrinth.js` — the engine (see below). Holds no content.
- `styles.css` — all styling. Everything is `.lab-*`.
- `README.md` — end-user instructions. **Out of date as of the labyrinth work; don't treat it as a
  spec and don't update it unless asked.**

Adding or editing a link means opening `_tools/labyrinth-editor.html`, changing it in the links tab,
and saving the exported file over `map.js`.

## The labyrinth

A deliberately hostile way to browse a pile of links. One link per full screen; swipe or arrow-key
to move. It opens on load and there is no way out — the escape rope in the backpack drops you back
at the start block rather than leaving (unless the author deletes it; see The pack).

**Vocabulary — use these words, they're the user's:** a **block** is one square of the maze (one
full screen); the **map** is all the blocks plus the start; **map code** is the generated JavaScript
the editor emits. Don't use "block" for the generated code — that collision already caused
confusion once. In the source, a block is a `cell` in the maze data and `.lab-page` in the DOM.

Sparse grid of `(x,y)` cells, so a missing neighbor is a wall. Cells can override a direction: an id
is a wormhole, `null` is a hard wall. `resolveExit()` in `labyrinth.js` is the single source of
truth for movement — the site, the editor, and the checker all call it so they can't disagree.

The map carries its own `links` array (`url`, `title`, `description`, `category` — the category is a
flat string, used only to group the editor's deck). Cells reference a link **by url**, with optional
`title` / `note` overrides, so one link can sit on several blocks and editing it once fixes all of
them. A cell with **no `link` at all** is a text-only block — it renders as a `div.lab-text` instead
of an anchor, so there's nothing to click.

## The pack

The backpack's contents live in the map as an optional `items` array — text, not icons. An item is
`{ id, name, flavor, action, to, room, start }`: `flavor` is the line shown when it's tapped,
`action` is one of `ITEM_ACTIONS` (`none` / `goto` / `start` / `random`), `to` is the block a `goto`
item leads to, `room` optionally restricts the action to fire only while the visitor is standing in
that block (`itemUsableIn()` is the check, exported so the tests agree), and `start: true` puts it in
the pack from the first screen. A room-gated item still shows its flavor everywhere; only the action
is withheld, so a key reads the same in every room but turns only at its door. The escape rope is just the default
item with `action: 'start'`; **`DEFAULT_ITEMS` is the original hardcoded pack, now editable**, and a
map that leaves it untouched carries no `items` array at all (same copy-on-write omission as the
theme). Delete every `start`/`goto`-to-start item and there is genuinely no reset — the author's
call. Items are **never consumed**; tapping one is repeatable.

Which items a visitor is currently holding is session state (`held`, an id list in `sessionStorage`
under `ITEMS_KEY`), initialised from the `start` items and grown by **add-item buttons**: a `button`
element with `action: 'additem'` and `to` an item id (`BUTTON_ACTIONS` now includes `additem`).
`cellUrls()` deliberately does **not** collect an additem `to` — it's an item id, not a url. The pack
button hides entirely when the catalogue is empty. `itemProblems()` (exported, run by the editor and
`maze-check`) flags duplicate ids, missing names, and `goto` items pointing nowhere.

## Theme

The map carries an optional `theme` object — nine colours (`bg`, `title`, `text`, `muted`, `link`,
`accent`, `arrow`, `border`, `packColor`), four fonts (`titleFont`, `lineFont`, `paraFont`,
`packFont`, ids into the `FONTS` list), `arrowScale`, `packScale`, and the boolean `pack`. `accent`
is buttons; `arrow` is the four navigation arrows, split off so they colour independently.
`arrowScale` is a **multiplier on the base arrow size**, defaulting to `1.5` — arrows ship 50% bigger
than the base `.lab-arrow` rule, and the theme tab can dial it 0.5–3×.

The **backpack has its own set** — `packColor`, `packFont`, `packScale`, and `pack: false` to switch
it off entirely (no button at all; the reset then only exists if a block hands the way back). They
drive `--lab-pack` / `--lab-pack-font` / `--lab-pack-scale`, read by `.lab-pack`, `.lab-inventory`
and `.lab-slot`. `THEME_BOOLS` is the new value class alongside `THEME_COLORS` / `THEME_FONTS` /
`THEME_NUMBERS`; `themeJs` writes numbers and booleans bare and quotes the rest.

Anything left at its `THEME_DEFAULTS` value isn't serialised.

`applyTheme(theme, el)` paints it by overriding the CSS variables the `.lab-*` rules already read —
`--card-bg`, `--green`, `--text-muted` and so on, plus `--lab-font-title/line/para`. It's set **on a
container, never on `:root`**: the site puts it on `#labyrinth`, the editor puts it on its layout
stage and its theme preview, and the editor's own chrome keeps the `:root` values. The panel colour
`--bg` is derived from `bg` by `lift()` rather than being a separate control.

Tunnels are untouched — a tunnel's `color` still overrides the background, and `isLight()` still
picks its text colour.

Fonts marked `google` in `FONTS` are fetched by `ensureFonts()` only when a theme actually uses one,
so a theme using none makes no third-party request. The rest are the local `neogreekrunic.ttf`, the
`JetBrains Mono` already in `styles.css`, or system stacks.

`themeProblems()` checks colours parse, fonts exist, and — the useful one — that nothing has become
unreadable against the background, via `contrastRatio()`. Thresholds live in `CONTRAST_NEEDS` and are
read by the editor's live ratio readout, the problems tab and `maze-check` alike. **They sit a little
under WCAG's 4.5/3.0** because the default link blue is 4.3:1 against the default background, and a
checker that warns about its own shipped defaults is one nobody reads. There's a test asserting the
default palette clears every bar in `CONTRAST_NEEDS`.

## Block layouts

A cell can carry a `layout` array and arrange its contents itself instead of using the fixed centred
stack. **Legacy blocks have no `layout` and render exactly as they always did** — it's opt-in per
block, which is why `map.js` stays small.

Elements sit on a **12 × 20 grid** (`GRID` in `labyrinth.js`) with `x`, `y`, `w`, `h` in grid units,
0-indexed. Types: `title`, `line`, `para`, `image`, `button`, **10 of each** (`EL_LIMITS`) — a
backstop against an unreadable block rather than a design rule, since the grid runs out first.
Shared optional fields: `size` 1–5, `align`, `valign`, `href`. `size` scales every type except
`image` — for a `button` it drives the font on `.lab-el-button[data-size]` and, since the padding is
`em`, the whole button grows with it. `image` takes `src` / `alt` / `fit`; `button` takes `action`
(`url` / `goto` / `random` / `additem`) and `to`. Anything equal to `EL_DEFAULTS` is left out when
serialising, so the map file doesn't carry a wall of defaults.

**Clicking an image** opens it full-screen in `.lab-lightbox` — an image boxed into a few grid cells
is too small for anything with detail in it. This only applies to images with **no `href`**: one the
author gave a link to is a link and goes where they pointed it, and `buildElement()` marks the
others `.is-zoomable`. While the lightbox is open `move()` refuses, so a swipe can't change the
block out from under the picture; `showCell()` closes it so it can never outlive its block.

The canvas fills the **full screen height** and up to **900px of width**, centred, with the block
background bleeding past it. That's deliberate: it narrows the aspect range a layout must survive
from ~4× (phone vs desktop) down to ~2×, while keeping "one block = one full screen". Text sizes are
`clamp()`ed and measured in `cqw` against the canvas, not the element's own box, so a box that goes
wide and short on desktop doesn't inflate its font.

Paragraphs take a small markup subset — `**bold**`, `*italic*`, `[text](url)`, blank line for a new
paragraph — parsed by `renderMarkup()`. It escapes first and applies the patterns to the escaped
text, so nothing an author types can become an element, and `safeUrl()` allows only http/https/
mailto/relative in an href. Paragraphs are always top-aligned and scroll inside their box; the
editor hides their vertical-align control to match, and `bindGestures()` leaves drags that start in
an overflowing one alone so reading to the bottom doesn't swipe to the next block.

Four things in `labyrinth.js` are exported specifically so the site, the editor and `maze-check`
can't disagree, the same way they all defer to `resolveExit()` for movement:

- `buildElement()` — the editor's layout stage renders real elements with it, not a lookalike
- `renderMarkup()` — one parser, so a preview matches what ships
- `cellUrls()` — every url a block points at, including ones only present on a button or inside a
  paragraph. The editor's "unused link" badge and `maze-check`'s placement count both go through it
- `layoutProblems()` — the whole validation list for an arrangement

**Tunnels.** A cell with a `tunnel` object (`color`, `ms`, `fx`, `effect`, `back`, `weights`) is a
block
you pass through, not one you stop in — a **chamber** is a block you stop in. `tunnelRoute()` walks
a run of tunnels to the chamber beyond, weighted per direction; `back` (default 0) governs returning
the way you came, whichever direction that turns out to be. It takes an injected `rng` so the
routing is testable in Node without a browser — do that rather than reasoning about it by eye. A
tunnel run is capped at `TUNNEL_HOPS`; `dest: null` means it never found a chamber, which both the
editor and `maze-check` report as a hard error because it would trap a visitor.

`ms` and `fx` are independent: `fx` is one transition, played on the way in and again on the way
out, so a tunnel costs `fx + ms + fx` door to door. Don't carve one out of the other.

`map.js` holds two maps. The readable `LABYRINTH_MAP` object is a **decoy** — same shape, same
squares, wrong contents; the real map is the XOR+base64 `LABYRINTH_CACHE` blob under it. The links
array is the same in both, since the urls aren't the secret, where they sit is. The editor emits the
whole file — **never hand-edit any of it.**

- `_tools/labyrinth-editor.html` — visual editor. Open it directly as a file; no server. Five tabs:
  **block** edits the selected block, **links** is the catalogue, **place** drags links onto the
  grid, **theme** is the palette and fonts, **pack** edits the inventory items, **issues** is live
  validation. The ✎ on a block (or
  "arrange this block…") opens **layout
  mode**, an overlay sharing `<main>`'s first grid cell with `#canvas` so it covers the map without
  scrolling with it; the side panel becomes the element palette and settings. Its stage renders the
  block at true pixel size inside a scaled-down wrapper, so `clamp()`ed fonts and the capped canvas
  width land where they really will. The stage also shows the block's real navigation arrows (the
  directions `resolveExit()` gives it) in a non-interactive `.lab-arrow-guides` layer, so elements
  can be arranged around them. "copy map code" gives you a whole `map.js` to save over the old
  one. Blocks copy/paste (buttons on the block tab, or ⌘/ctrl-C/V, ⌘/ctrl-D to duplicate): the pure
  `duplicateCells()` clones the selection with fresh ids and remaps intra-group wormhole exits and
  goto buttons to the copies, `findPasteOffset()` drops them clear of existing squares, and the
  clipboard persists in `localStorage` so it survives a reload and crosses maps. Its `#labyrinth` div
  is marked `data-preview` so the engine doesn't open the live map over the
  editor on load — only the test button starts it, via `preview()` — and `data-asset-base="../"` so
  image paths resolve from `_tools/`. It loads `../styles.css` **before** its own `<style>` so the
  real `.lab-*` rules are available while the editor's rules still win any tie.
- `_tools/maze-check.js` — `node _tools/maze-check.js`. Validates reachability, dangling exits,
  stacked pages, unplaced links. Use this instead of trying to look at the site. Both browser files
  run as function bodies, so `map.js`'s globals are injected into `labyrinth.js`'s scope by hand.

`_config.yml` keeps `_tools/`, `CLAUDE.md`, and `.claude/` off the published GitHub Pages site.

## Rules for LLMs / agents

These are hard rules. Do not work around them, and do not ask for an exception.

- **Never run a test/dev server.** No `npm run dev`, `npm start`, `bun run`, `python -m http.server`,
  `npx serve`, or any other local server. This project is static files opened directly in a browser;
  a server is never needed to make a change.
- **Never try to visually confirm anything.** Do not open a browser, take screenshots, use browser
  automation tools, or otherwise attempt to look at the rendered page. Verify changes by reading the
  code you edited.
- **Never commit to git.** No `git commit`, `git add`, `git push`, `git stash`, `git reset`, or any
  other command that writes to history or the index. Leave changes in the working tree for the user
  to review and commit themselves.
- **Never create a worktree.** No `git worktree add` and no worktree-isolated agents.
- **Never create a branch.** No `git checkout -b`, `git branch`, or `git switch -c`. Work on
  whatever branch is already checked out.

Read-only git commands (`git status`, `git diff`, `git log`) are fine.
