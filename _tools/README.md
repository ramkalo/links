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
in the backpack drops you back at the start block (unless you delete it; see The pack).

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
- **copy** and **paste** the selected block(s) with the buttons at the top of the block tab,
  or **⌘/ctrl-C** and **⌘/ctrl-V**; **⌘/ctrl-D** duplicates in place. A pasted block lands on
  the nearest free square and comes in selected, ready to drag. Copy a few connected blocks
  and the wormholes and go-to buttons *between* them re-point to the copies; links to blocks
  outside the copied set stay as they were. The clipboard sticks around in the browser, so
  you can paste into a different map too
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
- the **theme** tab is the whole site's colours and fonts — see below
- the **pack** tab is the backpack's items — see below

## The pack

The backpack holds items. They're text — a name, and a line that shows when the visitor
taps them. An item can also *do* something when tapped:

- **nothing** — just shows its line
- **go to a block** — a wormhole in your pocket; you pick the block
- **back to the start** — what the escape rope does
- **jump somewhere at random**

An item that does something can also be **limited to one room**. Leave it "usable
anywhere" and it works wherever the visitor taps it; pick a block and the action only fires
while they're standing in that block — a key that turns nothing until you're at the right
door. The item's line still shows everywhere, so it reads the same; it just doesn't *do*
anything until you're in the room. (The line is the only feedback, so word it to suit.)

Each item has a **starts in pack** checkbox. Checked, the visitor has it from the first
screen. Unchecked, it only appears once an **add-item button** hands it over (see the
button element in layout mode — set its action to "add an item to the pack" and choose
which). Items are never used up; a visitor can tap one as many times as they like.

The five default items — the escape rope and its four useless companions — are just a
starting point. Edit them, delete them, add your own. If you change nothing they aren't
written into `map.js` at all. **Delete every "back to the start" item and there's no reset
button any more** — that's allowed, just know it's the only way back.

An add-item button pointing at an item you later delete goes dead; the issues tab flags it,
same as a go-to button pointing at a deleted block.

## Theme

Seven colours and three fonts, and they apply everywhere at once. The preview at the top
of the tab is a real block using the real rules, so it isn't lying to you. If layout mode
is open, that updates live too.

The colours are named by the job they do:

| what | where you'll see it |
| --- | --- |
| background | behind every block. **tunnels override this** with their own colour |
| titles & highlights | title text, and anything hovered |
| strong text | `**bold**` inside a paragraph |
| body text | single lines and paragraph text |
| links | links inside paragraphs |
| buttons | button labels and outlines |
| direction arrows | the four navigation arrows |
| borders | button outlines, the backpack panel |

Buttons and arrows are separate colours — the arrows are the way *out* of a block, so it's
worth being able to make them stand out on their own.

Below the fonts is an **arrow size** slider. Arrows ship at 1.5× the old size; the slider
goes from 0.5× to 3× if you want them bigger or smaller still.

The **backpack** has its own block at the bottom: a checkbox to show or hide it, and its own
colour, font and size. Turn it off and there's no backpack button at all — which also means
no escape rope, so make sure some block hands the visitor a way back first (or don't, if
that's the point). Everything else in the panel — the item names, the heading — follows the
backpack colour and font, and grows with the size.

The inventory panel's own background isn't a separate choice — it's worked out from the
page background, so those two can never drift apart and start looking unrelated.

Next to each colour is a number like `7.2:1`. That's how far it stands out from the
background. **It goes red when text is getting hard to read** — around 4:1 for body text,
3:1 for titles and arrows, which are bigger. Red isn't fatal; it's a warning that shows up
in the issues tab too. Use your judgement, especially for something decorative.

Fonts are set separately for titles, single lines and paragraphs. Anything marked
**(google)** is fetched from Google Fonts the first time a theme uses it — pick only from
the unmarked ones if you'd rather the site made no third-party requests at all. The runes
are a font file in the repo, so they cost nothing.

**reset to default** puts everything back. A theme left entirely at the defaults isn't
written into `map.js` at all.

## Arranging a block

A block starts out as one centred title with an optional line under it. That's still what
most of them are, and blocks left that way are untouched by any of this.

Press **✎** on a block for layout mode. The map disappears behind a scale drawing of the
block itself and the side panel becomes a palette. A block that has never been arranged
gets one built from whatever it already said, so you're always editing something.

Elements sit on a **12 by 20 grid**. You get up to **ten of each kind** — title, single
line, paragraph, image, button. In practice the grid runs out well before the count does,
which is the real limit. Drag an element to move it, drag its bottom-right corner to
resize, or type the numbers in. Arrow keys nudge the selected one a cell at a time; delete
removes it.

The block's **navigation arrows** show in the stage too — the same ones the visitor will
see, at the edges this block actually leads somewhere from — so you can arrange elements
around them instead of underneath. They're just guides here; you can't drag them, and a
drag near an edge passes straight through to whatever's under it. (Which arrows appear
depends on the block's exits, set back in the block tab.)

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

**Clicking an image opens it full-screen**, because a few grid cells is nowhere near
enough for anything with detail in it. Tap anywhere, press escape, or hit the ✕ to close.
Swiping does nothing while it's open, so nobody loses the picture by trying to look at it.

The exception is an image you gave a **link** to — that's a link, so clicking it goes where
you pointed it. Leave the link empty for the full-screen behaviour. The hint under the
link field tells you which one you're getting.

### The button

A button opens a link, sends the visitor to a block you name, throws them at a random
chamber, or drops an item into the pack. A go-to button pointing at a block that no longer
exists — or an add-item button pointing at an item you deleted — is a hard error, since
it's a dead end someone can actually press.

Buttons have a **size** just like the text elements, 1 to 5. The whole button grows with
it, not only the label.

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
