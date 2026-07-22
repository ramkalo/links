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
- **map code** — the map turned into JavaScript: a whole `map.js`, ready to save over the
  old one.
- **element** — one thing on a block that has an arrangement: a title, a line, a
  paragraph, an image, a button.

The labyrinth is the whole site. There is no front page and no way out — the escape rope
in the backpack drops you back at the start block.

## labyrinth-editor.html

Double-click it. It opens in your browser as a normal file, no server needed. Everything
it needs — the links, the map, the movement rules — comes from `../map.js` and
`../labyrinth.js`.

- click a block to select it and edit its link, exits and tunnel settings in the **block**
  tab
- click its **✎** to open **layout mode** and arrange what's actually on it
- **cmd/ctrl-click** (or shift-click) to select several — dragging any one of them moves
  the whole group, and delete removes them all. A group move is refused outright if any
  block would land on top of another, so it can't half-apply
- **delete** / **backspace** removes the selection, **escape** clears it
- the **links** tab is the catalogue: every link the maze can hold. Blocks point at these
  by url, so editing one here fixes every block using it. Changing a url drags the blocks
  along with it rather than leaving them pointing at nothing
- the **place** tab is one card per link: red means it's nowhere in the maze. Drag a card
  onto an empty square to add it, or onto an existing block to swap that block's link
- the dashed **blank block** card makes a block with no link at all — just a title and a
  note, for putting cryptic text in the maze with nothing to click
- the amber **tunnel block** card makes a tunnel. Its block tab gives you a background
  color, two timings, one of five effects (fade, crossfade, slide, iris, flicker), and the
  odds of each way out

## Arranging a block

A block starts out as one centred title with an optional line under it. That's still what
most of them are, and blocks left that way are untouched by any of this.

Press **✎** on a block for layout mode. The map disappears behind a scale drawing of the
block itself and the side panel becomes a palette. A block that has never been arranged
gets one built from whatever it already said, so you're always editing something.

Elements sit on a **12 by 20 grid**. You get **one title, two single lines, two
paragraphs, three images and one button** — the caps are the point, not a limitation to
work around. Drag an element to move it, drag its bottom-right corner to resize, or type
the numbers in. Arrow keys nudge the selected one a cell at a time; delete removes it.

**phone / desktop** at the top redraws the same block at the two extremes of what a real
screen can be. Check both — that's the whole reason the toggle is there.

The canvas fills the full height of the screen and up to 900px of width, centred, with the
block's background running past it to the edges. So a layout is never letterboxed
vertically, and on a wide monitor it settles into a tall column rather than smearing out.

### Text

Single lines are plain text. Paragraphs take a small amount of markup:

    **bold**            [a link](https://example.com)
    *italic*            blank line starts a new paragraph

The **B** / **I** / **link** buttons wrap whatever you've selected. What's underneath the
box is the real renderer, not an approximation — it's the same function the site uses.

Anything that isn't `http`, `https`, `mailto` or a path inside the site is refused and the
link renders as plain text. That includes `javascript:`, so a link can't be made to do
anything but go somewhere.

### Images

There's no build step and the editor can't write to your repo, so:

1. put the file in the site's `images/` folder yourself
2. type `images/whatever.jpg` into the image element

The thumbnail turns red if there's nothing at that path, which is how you'll catch a typo.
Paths already used elsewhere in the map show up as suggestions. External `https://` urls
work too, but the host can take the picture away and will see who's visiting you.

**fit** decides what happens when the box isn't the same shape as the picture — `contain`
fits the whole thing in and leaves gaps, `cover` fills the box and crops, `fill` stretches
it out of shape. `contain` unless you have a reason.

### The button

One per block. It either opens a link, sends the visitor to a block you name, or throws
them at a random chamber. A go-to button pointing at a block that no longer exists is a
hard error — it's a dead end someone can actually press.

## Testing without pasting anything

**test** walks the draft map right there in the editor — the real labyrinth code, the real
gestures, the real tunnel effects, running on whatever you have on the grid this second.
No copying, no saving, no reloading.

It starts on the selected block if that block is a chamber, otherwise on the map's start
block. Select a chamber *next to* a tunnel to test that tunnel, not the tunnel itself —
starting inside one routes straight through without ever playing its effect.

Leave the test the same way you'd leave layout mode: backpack → escape rope. Inside a test
the rope means "back to the editor"; on the live site it means "back to the start block".
A test run writes nothing to `sessionStorage`, so it can't disturb the real site's saved
position.

## Saving your work

The editor autosaves your draft to `localStorage` in that browser. Nothing reaches the
site until you save it out:

1. hit **copy map code**
2. save the whole thing over `map.js` in the project root — the entire file, links and all
3. `node _tools/maze-check.js`
4. `open index.html`

Because the draft lives in the browser, reopening the editor later gives you the *draft*,
not what's in `map.js`. If they've drifted apart, **load live map** pulls the real one
back in.

## maze-check.js

`node _tools/maze-check.js` from the project root. Decodes the map out of `map.js` and
reports unreachable blocks, exits pointing at blocks that no longer exist, two blocks
stacked on the same square, links that aren't in the maze anywhere, and everything that
can be wrong with a block's arrangement. No browser involved.

It shares its rules with the editor rather than keeping a second copy — `layoutProblems()`,
`cellUrls()` and `resolveExit()` all live in `labyrinth.js` and are called by both, so the
two can't come to different conclusions about the same map.

## About the two maps in map.js

`map.js` contains a plain, readable `LABYRINTH_MAP` object and an encoded blob. **The
readable one is a decoy** — nothing reads it. The real map is `LABYRINTH_CACHE`, XOR'd
against a fixed key and base64'd, so View Source shows noise instead of a map. The decoy
keeps every block in its real square and every arrangement in its real shape, and lies
about all of the contents.

The links array is the same in both. The urls were never the secret; where they sit is.

This is a speed bump, not security. Anyone who opens DevTools and calls `decodeMaze()`
gets the whole thing instantly, and there is no way around that for a static site — the
map has to reach the browser to work. It just means a curious visitor who hits Ctrl+U
finds a map that lies to them.

Both halves are regenerated together by **copy map code**. Don't hand-edit either one; the
decoy has to keep looking plausible, and the blob isn't editable by hand at all.
