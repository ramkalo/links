# Linkinator

This project is a live webpage that I actually use AND it also serves as a template for other artists to use as their own landing page. It's a simple, free way to put all your links in one place — music, projects, social media, whatever. Looks good on phone and desktop.

No apps to install. No accounts required to get started. Just three files and a browser.

---

## What's in the folder

To get started, download, copy, or clone this project, also known as a repository. if you are reading this on the github page then scroll up and look for a green "Code" button, click on it and select "Download Zip". There are three main files:

- **`index.html`** — This is the actual webpage. You don't need to touch it.
- **`script.js`** — This is where all your content lives. Your name, your links, your categories — it's all in here. This is the only file you'll regularly edit.
- **`styles.css`** — This controls colors and fonts. You can leave it alone or experiment with it later.

Think of `index.html` as the frame of a house, `styles.css` as the paint, and `script.js` as the furniture — you only need to move the furniture around.

---

## Seeing it in your browser

Just double-click `index.html`. It'll open in your browser and you'll see the page with your links. No internet required — it works completely offline.

---

## Editing your links

Open `script.js` in any text editor. On a Mac, you can right-click the file and choose **Open With → TextEdit**. On Windows, right-click and choose **Open With → Notepad**.

At the very top of the file you'll see a block that looks like this:

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

This might look intimidating but it's just a list of labeled things. Here's what each part means:

- **`title`** — Your name, shown big at the top of the page
- **`description`** — A short tagline shown just under your name
- **`footer`** — Small text at the very bottom of the page
- **`categories`** — Sections that group your links (like "My Music" or "My Projects")
- **`links`** — The actual links inside each category. Each one has a `title` (the text people click), a `url` (the web address), and an optional `description`

**To change your name or description:** just replace the text between the quotes.

**To add a new link:** copy one of the existing link blocks (everything from `{` to `}`) and paste it right after, separated by a comma. Like this:

```js
{
  "title": "Bandcamp",
  "url": "https://yourname.bandcamp.com",
  "description": "Listen to my stuff here"
},
{
  "title": "SoundCloud",
  "url": "https://soundcloud.com/yourname",
  "description": "More tracks over here"
}
```

**To add a new category:** copy an entire category block (from `{` to the closing `}` that comes after all its links) and paste it after the previous one, separated by a comma.

**One important rule:** every item in a list needs a comma after it — except the last one. If something isn't showing up, a missing or extra comma is usually why.

---

## Publishing to the web for free with GitHub

GitHub is a website developers use to store and share code. It also has a free feature called **GitHub Pages** that turns your files into a real live website anyone can visit.

### Step 1 — Create a free GitHub account

Go to [github.com](https://github.com) and sign up. You just need an email address.

### Step 2 — Create a new repository

A "repository" is just a folder on GitHub where your files live.

1. Once you're logged in, click the **+** button in the top right corner
2. Choose **New repository**
3. Give it a name — something like `my-links` or `yourname-site`
4. Make sure it's set to **Public** (required for free hosting)
5. Click **Create repository**

### Step 3 — Upload your files

1. On the page that appears, look for the link that says **uploading an existing file** and click it
2. Drag and drop all three files from your computer: `index.html`, `script.js`, and `styles.css`
3. Scroll down to where it says **Commit changes** and click that button

"Committing" just means saving. That's all it is.

### Step 4 — Turn on GitHub Pages

1. Click the **Settings** tab near the top of your repository page
2. In the left sidebar, scroll down and click **Pages**
3. Under **Branch**, click the dropdown that says "None" and select `main`
4. Click **Save**
5. Wait about one minute, then refresh the page — a link to your live site will appear at the top

Your site will be live at:
`https://yourusername.github.io/your-repo-name`

Share that link wherever you want.

---

### Notes on publishing websites
There are lots of free ways to publish a simple website. Once you've published on github and feel comfortable editing your site I suggest looking into other options that may work better for you. Some options include Cloudflare and Vercel. The biggest downside to sites that provide free website hosting is that you are often forced into using a certain domain name, like mymusicsucks.github.io/mymusicreallysucks. But keep in mind that if you want a custom domain, like mymusicsucks.gov, then you will need to give someone some money, there isn't a way around this. 

---

## Updating your site after you've published

Whenever you want to change your links, here's the easiest way:

1. Make your edits to `script.js` on your computer
2. Go to your repository on GitHub
3. Click on `script.js` in the file list
4. Click the **pencil icon** in the top right corner of the file (it says "Edit this file" when you hover over it)
5. Select all the text in the editor and delete it, then paste in the contents of your updated file
6. Click **Commit changes**

Your live site will update within about a minute.

---

## Going further

Once your site is up and running, you might want to make it look different or add new features. Here's how to keep learning without getting overwhelmed.

### Ask a Human
Odds are there is someone in your life who can help teach you a bit about how to do this stuff. If you are in the Provo area then you can talk to me, Ram Kalo, at the musician town hall at 3Hive Record Lounge. You can also check to see what learning resources your local library, community center, or college has to offer. I've included some good online resources below.

### Learn the fundamentals

If you want to actually understand what you're doing — and eventually build more ambitious things — these are the best places to start:

- [The Odin Project](https://www.theodinproject.com/) — a free, project-based curriculum that takes you from zero to building real websites. One of the best free resources out there, full stop.
- [W3Schools](https://www.w3schools.com/) — straightforward explanations of HTML, CSS, and JavaScript with live examples you can edit in the browser. Great for looking things up.
- [freeCodeCamp](https://www.freecodecamp.org/) — free interactive lessons with certificates. Good if you like structured learning with built-in exercises.

### Use AI as a tutor

There are bunch of stupid and evil people doing stupid and evil things with AI. Fuck those people and fuck govenor Cox. However, I believe that AI tools can be used for good, provided that you are using them to learn or assit you in certain ways and NOT using them to replace your humanity. AI tools like [Claude](https://claude.ai) or [ChatGPT](https://chatgpt.com) are awesome for learning to code. You can paste your code directly into a chat and ask questions like:

- *"How do I change the background color in this CSS file?"*
- *"Can you explain what this line of code does?"*
- *"How would I add a profile photo to the top of this page?"*

The key is to use it to **learn**, not just to get answers. Ask it to explain what it's doing and why. You'll pick things up faster than you'd expect.

### Cheat sheets

These are quick-reference pages you can keep open in another tab while you're editing. You don't need to memorize anything — just look things up as you go.

- [HTML cheat sheet](https://htmlcheatsheet.com/) — the building blocks of every webpage
- [CSS cheat sheet](https://htmlcheatsheet.com/css/) — colors, fonts, spacing, layout
- [JavaScript cheat sheet](https://htmlcheatsheet.com/js/) — the language your `script.js` is written in
