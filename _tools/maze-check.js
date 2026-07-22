/* Checks the maze without a browser.  Run from the project root:
 *
 *   node _tools/maze-check.js
 *
 * Reports blocks you can't reach, exits pointing at blocks that don't exist, two
 * blocks stacked on one square, and links that never show up in the maze.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

/* Both files are browser scripts, so run them as function bodies and hand back
   the bindings we care about rather than trying to parse them. `globals` is how
   map.js's two variables get in front of labyrinth.js — on a real page they'd be
   window properties, but each file here runs in its own function scope. */
function evaluate(file, expression, globals) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  const names = Object.keys(globals || {});
  const shim = { exports: {} };

  return new Function(
    'document', 'window', 'module', ...names,
    src + '\n;return (' + expression + ');'
  )(stubDocument(), undefined, shim, ...names.map(n => globals[n]));
}

function stubDocument() {
  return {
    readyState: 'complete',
    getElementById: () => null,
    addEventListener: () => {},
    createElement: () => ({ set textContent(v) { this._v = v; }, get innerHTML() { return this._v; } })
  };
}

const map = evaluate('map.js', '({ LABYRINTH_MAP: LABYRINTH_MAP, LABYRINTH_CACHE: LABYRINTH_CACHE })');
const L = evaluate('labyrinth.js', 'module.exports', map);

const maze = L.loadMaze();
const index = L.indexMaze(maze);
const live = L.reachableFrom(index, maze.start);

const problems = [];
const notes = [];

const linkUrls = new Set();
(maze.links || []).forEach(link => { if (link.url) linkUrls.add(link.url); });

const seen = new Map();
maze.cells.forEach(cell => {
  const key = `${cell.x},${cell.y}`;
  if (seen.has(key)) problems.push(`two blocks on square ${key}: ${seen.get(key)} and ${cell.id}`);
  seen.set(key, cell.id);

  if (!live.has(cell.id)) problems.push(`${cell.id} (${key}) can't be reached from ${maze.start}`);

  if (cell.exits) {
    Object.keys(cell.exits).forEach(dir => {
      const target = cell.exits[dir];
      if (target && !index.byId.get(target)) {
        problems.push(`${cell.id} → ${dir} points at ${target}, which doesn't exist`);
      }
    });
  }

  /* Same rules the editor's problems tab shows, from the same function, so the
     two can't disagree about whether a block is sound. */
  L.layoutProblems(cell, index).forEach(([severity, text]) => {
    (severity === 'bad' ? problems : notes).push(text);
  });

  L.cellUrls(cell).forEach(url => {
    if (!linkUrls.has(url)) notes.push(`${cell.id} points at a url that isn't in the link list: ${url}`);
  });

  if (L.isTunnel(cell)) {
    if (cell.link) problems.push(`${cell.id} is a tunnel with a link on it`);

    /* The one that really matters: a tunnel that never lands in a chamber holds
       a visitor in an endless transition, which reads as a broken site. */
    if (!L.tunnelRoute(index, cell, null, () => 0.5).dest) {
      problems.push(`${cell.id} is a tunnel that never reaches a chamber — it would trap whoever walks in`);
    }
  } else if (!cell.link && !L.hasLayout(cell)) {
    if (!cell.title && !cell.note) notes.push(`${cell.id} is a blank block with nothing written on it`);
  }
});

if (L.isTunnel(index.byId.get(maze.start) || {})) {
  problems.push(`the start block ${maze.start} is a tunnel — visitors would arrive mid-transition`);
}

if (!index.byId.get(maze.start)) problems.push(`start "${maze.start}" isn't a real block`);

/* A link counts as placed wherever it turns up — on the block, on one of its
   elements, on a button, or inline in a paragraph. */
const placed = new Set();
maze.cells.forEach(c => L.cellUrls(c).forEach(url => placed.add(url)));
[...linkUrls].filter(url => !placed.has(url)).forEach(url => notes.push(`not in the maze: ${url}`));

const wormholes = maze.cells.filter(c => c.exits && Object.values(c.exits).some(v => v)).length;
const walls = maze.cells.filter(c => c.exits && Object.values(c.exits).some(v => v === null)).length;
const tunnels = maze.cells.filter(c => L.isTunnel(c)).length;
const blanks = maze.cells.filter(c => !c.link && !L.isTunnel(c) && !L.hasLayout(c)).length;
const laidOut = maze.cells.filter(c => L.hasLayout(c)).length;

console.log(`${maze.cells.length} blocks, ${live.size} reachable, ${tunnels} tunnels, ${wormholes} wormholes, ${walls} walls, ${blanks} text-only, ${laidOut} arranged`);
console.log(`${linkUrls.size} links, ${[...linkUrls].filter(u => placed.has(u)).length} of them placed`);
notes.forEach(n => console.log('  note: ' + n));
problems.forEach(p => console.log('  PROBLEM: ' + p));

if (problems.length) {
  console.log(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log('\nmaze is sound.');
