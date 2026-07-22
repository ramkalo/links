# _tools

Local-only stuff. Nothing in this folder is published — GitHub Pages skips
underscore-prefixed folders, and `_config.yml` excludes it explicitly too. It's still
visible to anyone browsing the repo on github.com, just not on the live site.

## Words

- **block** — one square of the maze, one full screen when you're in it.
- **chamber** — a block you stop in. Usually shows a link; can be text only.
- **tunnel** — a block you pass *through*. It shows its message for a moment, then hands
  you to one of its neighbours at random. You never get to choose.
- **map** — all the blocks together, plus which one you start on.
- **map code** — the map turned into JavaScript, ready to paste into `labyrinth.js`.

## labyrinth-editor.html

Double-click it. It opens in your browser as a normal file, no server needed. It loads
`../script.js` so the link picker always shows your real links.

- click a block to select it, its ✎ to edit it in the **block** tab
- **cmd/ctrl-click** (or shift-click) to select several — dragging any one of them moves
  the whole group, and delete removes them all. A group move is refused outright if any
  block would land on top of another, so it can't half-apply
- **delete** / **backspace** removes the selection, **escape** clears it
- the **place** tab is one card per link: red means it's nowhere in the maze. Drag a card
  onto an empty square to add it, or onto an existing block to swap that block's link
- the dashed **blank block** card at the top makes a block with no link at all — just a
  title and a note, for putting cryptic text in the maze with nothing to click. Dropping
  it on an existing block strips that block's link. To go the other way, set a block's
  link back to *none, text only* in the block tab
- the amber **tunnel block** card makes a tunnel. Its block tab gives you a background
  color, two timings, one of five effects (fade, crossfade, slide, iris, flicker), and the
  odds of each way out

### Tunnel timing

**on screen** and **transition** are independent. The transition plays twice — once going
in, once coming out — so the whole thing costs `transition + on screen + transition`:

    on screen 3s, transition 2s  ->  2 + 3 + 2 = 7s door to door

The panel spells that sum out under the effect picker, and the block's tag on the grid
shows the door-to-door total. Set transition to 0 for a hard cut with no effect at all.

### Tunnel odds

The weights are relative, not percentages — `30` and `70` behave the same as `3` and `7`.
The panel shows what each one works out to.

**back the way you came** is separate, and defaults to 0. Which direction that is depends
on how the visitor arrived, so it can't be one of the four boxes. At 0 a tunnel never
bounces you straight back — unless it has no other exit, in which case it sends you back
rather than trapping you.

Tunnels can run into other tunnels, each playing its own effect and time in turn. A run of
them is capped at 12 before the visitor gets put in the nearest chamber. A tunnel that
never reaches a chamber is a hard error in the editor and in `maze-check` — on the live
site it would hold someone in an endless transition.

### Testing without pasting anything

**test** walks the draft map right there in the editor — the real labyrinth code, the real
gestures, the real tunnel effects, running on whatever you have on the grid this second.
No copying, no saving, no reloading.

It starts on the selected block if that block is a chamber, otherwise on the map's start
block. Select a chamber *next to* a tunnel to test that tunnel, not the tunnel itself —
starting inside one routes straight through without ever playing its effect.

Leave the test the same way a visitor would: backpack → escape rope. A test run writes
nothing to the address bar and nothing to `sessionStorage`, so it can't disturb the real
site's saved position.

### Saving your work

The editor autosaves your draft to `localStorage` in that browser. Nothing reaches the
site until you paste it in:

1. hit **copy map code**
2. open `labyrinth.js` and replace everything *between* the two `generated map` comments
   — the readable `labyrinth` object and the long `LABYRINTH_CACHE` string both get
   replaced together; leave the comment lines themselves alone
3. `node _tools/maze-check.js`
4. `open index.html` and use the toggle at the bottom

Because the draft lives in the browser, reopening the editor later gives you the *draft*,
not what's in `labyrinth.js`. If they've drifted apart, **load live map** pulls the real
one back in.

## maze-check.js

`node _tools/maze-check.js` from the project root. Decodes the map out of `labyrinth.js`
and reports unreachable blocks, exits pointing at blocks that no longer exist, two blocks
stacked on the same square, and links that aren't in the maze anywhere. No browser
involved.

## About the two maps in labyrinth.js

`labyrinth.js` contains a plain, readable `labyrinth` object and an encoded blob. **The
readable one is a decoy** — nothing reads it. The real map is `LABYRINTH_CACHE`, XOR'd
against a fixed key and base64'd, so View Source shows noise instead of a map.

This is a speed bump, not security. Anyone who opens DevTools and calls `decodeMaze()`
gets the whole thing instantly, and there is no way around that for a static site — the
map has to reach the browser to work. It just means a curious visitor who hits Ctrl+U
finds a map that lies to them.

Both are regenerated together by **copy map code**. Don't hand-edit either one; the decoy
has to keep looking plausible, and the blob isn't editable by hand at all.
