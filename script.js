const data = {
  "title": "Ram Kalo",
  "description": "Collection of works across Music, Photography, and Coding",
  "footer": "© 2026 Ram Kalo",
  "categories": [
    {
      "name": "Ram Kalo Music",
      "links": [
        {
          "title": "YouTube",
          "url": "https://www.youtube.com/@ramkalomusic",
          "description": "YouTube is a little evil but at least its free"
        },
        {
          "title": "Bandcamp",
          "url": "https://ramkalo.bandcamp.com/",
          "description": "Bandcamp is actually kinda good and its free"
        },
        {
          "title": "SoundCloud",
          "url": "https://on.soundcloud.com/d8szPdu5brCmBwFP7",
          "description": "I've never met anyone irl who uses SoundCloud"
        },
        {
          "title": "Spotify",
          "url": "https://www.spotify.com/us/signed-out/cancel/",
          "description": "Spotify is fully evil"
        },
        {
          "title": "Instagram",
          "url": "https://www.instagram.com/ramkalomusic/",
          "description": "I post visual art that I make"
        }
      ]
    },
    {
      "name": "Hadean Lights Music",
      "links": [
        {
          "title": "Bandcamp",
          "url": "https://hadeanlights.bandcamp.com/",
          "description": "This is another music project I started in collaboration with other local musicians"
        }
      ]
    },
    {
      "name": "My Coding Projects",
      "links": [
        {
          "title": "BXTRXT",
          "url": "https://ramkalo.github.io/bxtrxt",
          "description": "Free web based photo editor, works offline"
        },
        {
          "title": "Tunnelinator",
          "url": "https://ramkalo.github.io/Tunnelinator",
          "description": "Visual Synthesizer"
        },
        {
          "title": "Obeyinator",
          "url": "https://ramkalo.github.io/Obeyinator",
          "description": "MIDI Generator"
        },
        {
          "title": "arpulator",
          "url": "https://ramkalo.github.io/arpulator",
          "description": "Graphing calculator based midi arpeggiator"
        }
      ]
    },
    {
      "name": "Recommended Reading",
      "links": [
        {
          "title": "Provo Music Scene",
          "url": "https://www.provomusicscene.com/",
          "description": "music, events, and bands in provo"
        },
        {
          "title": "https://b-e-a-u.com/",
          "url": "https://b-e-a-u.com/",
          "description": "works of Beau Johnson"
        },
        {
          "title": "A FUCKING WEBSITE",
          "url": "https://www.punk-website.com/",
          "description": "its just a website"
        },
        {
          "title": "English Budgies Bandcamp",
          "url": "https://englishbudgies.bandcamp.com/music",
          "description": "this is a cool band"
        },
        {
          "title": "just a reddit page",
          "url": "https://www.reddit.com/r/Piracy/",
          "description": "stealing is bad"
        },
        {
          "title": "just a QR Code",
          "url": "https://justaqrcode.com/",
          "description": "anti-capitalist QR code generator site made by Gabe"
        },
        {
          "title": "Baby Becoming - Bentelou",
          "url": "https://youtube.com/playlist?list=OLAK5uy_kItxjq2DjKw1cGHFlk3LPNl2NJYo0vyvU",
          "description": "Fantastic album by a local artist"
        },
        {
          "title": "𝔱𝔥𝔢 𝔣𝔬𝔯𝔢𝔰𝔱 𝔬𝔣 𝔞𝔷𝔲𝔯𝔢",
          "url": "https://www.instagram.com/theforestofazure/",
          "description": "Instagram page with some art"
        },
        {
          "title": "ReelName",
          "url": "https://sentient-soup.github.io/reelname/",
          "description": "app for fixing the metadata of your music and movies"
        },
        {
          "title": "wtf is the point of this page?",
          "url": "https://aphelion.live/projects/fiberwave/",
          "description": "it exists isn't that enough"
        },
        {
          "title": "Exorcism",
          "url": "https://www.usccb.org/prayer-and-worship/sacraments-and-sacramentals/sacramentals-blessings/exorcism",
          "description": "Big black shape with eyes of fire Tellin' people their desire Satan's sittin' there, he's smilin' Watches those flames get higher and higher Oh, no, no, please, God, help me"
        },
        {
          "title": "Recommended Listening",
          "url": "https://ramkalo.github.io/music-lists/",
          "description": "This page contains lists of musicians that are recommended by me or people I know"
        },
        {
          "title": "Pope Leo Encyclical",
          "url": "https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html",
          "description": "pope spittin str8 fire on these hoes"
        }
      ]
    }
  ]
};

render(data);

function render(data) {
  document.title = data.title || 'My Projects';

  const titleEl = document.getElementById('page-title');
  titleEl.textContent = data.title || 'My Projects';

  const descEl = document.getElementById('page-description');
  if (data.description) {
    descEl.textContent = data.description;
  } else {
    descEl.style.display = 'none';
  }

  const footerEl = document.getElementById('page-footer');
  if (data.footer) {
    const p = document.createElement('p');
    p.textContent = data.footer;
    footerEl.prepend(p);
  }

  const container = document.getElementById('categories');

  if (!data.categories || data.categories.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No categories yet. Add some links!</p>';
    return;
  }

  container.innerHTML = data.categories.map(category => `
    <section class="category">
      <h2 class="category-title">${escapeHtml(category.name)}</h2>
      <div class="links">
        ${category.links.map(link => `
          <a href="${escapeHtml(link.url)}" class="link-card" target="_blank" rel="noopener noreferrer">
            <div class="link-title">${escapeHtml(link.title)}</div>
            ${link.description ? `<div class="link-description">${escapeHtml(link.description)}</div>` : ''}
            ${link.url ? `<div class="link-url">${escapeHtml(link.url)}</div>` : ''}
          </a>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
