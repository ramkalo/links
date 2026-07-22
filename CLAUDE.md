# CLAUDE.md

## Project

Linkinator — a static, single-page link directory hosted on GitHub Pages. No build step, no
dependencies, no package manager.

- `index.html` — page shell. Loads `styles.css`, `script.js`, and `labyrinth.js` with a
  `?v=Date.now()` cache buster. The scripts are injected with `async = false` so they run in order.
- `script.js` — the `data` object (title, description, footer, categories/links) at the top, then
  `render()` which builds the DOM from it. `escapeHtml()` sanitizes all interpolated values.
- `labyrinth.js` — labyrinth mode (see below).
- `styles.css` — all styling.
- `README.md` — end-user instructions. **Out of date as of the labyrinth work; don't treat it as a
  spec and don't update it unless asked.**

Adding or editing a link means editing the `data` object in `script.js` — nothing else.

## Labyrinth mode

A second, deliberately hostile way to browse the same links, reached by the toggle at the bottom of
the page. One link per full screen; swipe or arrow-key to move.

**Vocabulary — use these words, they're the user's:** a **block** is one square of the maze (one
full screen); the **map** is all the blocks plus the start; **map code** is the generated JavaScript
the editor emits. Don't use "block" for the generated code — that collision already caused
confusion once. In the source, a block is a `cell` in the maze data and `.lab-page` in the DOM.

Sparse grid of `(x,y)` cells, so a missing neighbor is a wall. Cells can override a direction: an id
is a wormhole, `null` is a hard wall. `resolveExit()` in `labyrinth.js` is the single source of
truth for movement — the site, the editor, and the checker all call it so they can't disagree.

Cells reference a link by URL into `data.categories`, with optional `title` / `note` overrides.
A cell with **no `link` at all** is a text-only block — it renders as a `div.lab-text` instead of an
anchor, so there's nothing to click.

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

`labyrinth.js` holds two maps. The readable `labyrinth` object is a **decoy**; the real map is the
XOR+base64 `LABYRINTH_CACHE` blob. Both sit between the `generated map` comment markers and are
emitted together by the editor — **never hand-edit either one.**

- `_tools/labyrinth-editor.html` — visual editor. Open it directly as a file; no server. Exports the
  block to paste into `labyrinth.js`.
- `_tools/maze-check.js` — `node _tools/maze-check.js`. Validates reachability, dangling exits,
  stacked pages, unplaced links. Use this instead of trying to look at the site.

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
