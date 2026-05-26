# Linkinator

A simple, mobile-friendly page for hosting links to your music, projects, and whatever else you want to share.

No server. No install. Just edit a file and open it in a browser.

---

## How it works

All your links live at the top of `script.js` in a `data` object. Edit that file to change your title, description, and links. Open `index.html` in any browser and it works — no setup required.

---

## Editing your links

Open `script.js` in a text editor (Notepad, TextEdit, VS Code — anything works).

At the top you'll see something like this:

```js
const data = {
  "title": "Your Name",
  "description": "A little something about you",
  "footer": "© 2026 Your Name",
  "categories": [
    {
      "name": "My Music",
      "links": [
        {
          "title": "Bandcamp",
          "url": "https://yourname.bandcamp.com",
          "description": "Listen to my stuff here"
        }
      ]
    }
  ]
};
```

- **title** — your name or the name of the page
- **description** — a short line that appears under your name
- **footer** — text at the bottom of the page
- **categories** — sections that group your links
- **links** — each link has a `title`, `url`, and optional `description`

To add a new link, copy one of the existing link blocks and paste it inside the same category. To add a new category, copy an entire category block. Make sure every block ends with a comma except the last one.

---

## File structure

- `index.html` — the page itself (you don't need to touch this)
- `script.js` — **your links live here, at the top** (edit this!)
- `styles.css` — colors and layout (optional tweaks)

---

## Publishing to the web with GitHub Pages

GitHub Pages lets you host this site for free. Here's how to do it from scratch.

### Step 1 — Create a GitHub account

Go to [github.com](https://github.com) and sign up for a free account if you don't have one.

### Step 2 — Create a new repository

1. Click the **+** button in the top right corner and choose **New repository**
2. Give it a name like `my-links` or `yourname-links`
3. Leave it set to **Public**
4. Click **Create repository**

### Step 3 — Upload your files

1. On your new repository page, click **uploading an existing file**
2. Drag and drop all your files: `index.html`, `script.js`, `styles.css`
3. Scroll down and click **Commit changes**

### Step 4 — Turn on GitHub Pages

1. Click the **Settings** tab at the top of your repository
2. In the left sidebar, click **Pages**
3. Under **Branch**, select `main` and click **Save**
4. Wait about a minute, then refresh the page — you'll see a link to your live site

Your site will be at: `https://yourusername.github.io/your-repo-name`

### Updating your site

Whenever you want to change your links:

1. Edit `script.js` on your computer
2. Go to your repository on GitHub
3. Click on `script.js` in the file list
4. Click the **pencil icon** (Edit this file) in the top right
5. Paste in your updated file content
6. Click **Commit changes**

Your live site will update within a minute.
