# KnowledgeVerse

**Premium Knowledge Publishing Platform — Learn. Build. Grow.**

A world-class, SEO-first, fully static knowledge website built with pure HTML5, CSS3, and Vanilla JavaScript. No build process. No frameworks. No dependencies. Works by opening `index.html`.

---

## 🚀 GitHub Pages Deployment

### Method 1: Direct Upload
1. Download or clone this repository
2. Go to your GitHub repository → **Settings** → **Pages**
3. Under "Source", select your branch (usually `main`) and `/ (root)` folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/repository-name/`

### Method 2: GitHub Actions (Auto-deploy)
1. Push this folder to a GitHub repository
2. GitHub Pages will automatically detect and deploy the site

**No npm install. No build command. No terminal required.**

---

## 📁 Project Structure

```
KnowledgeVerse/
├── index.html              # Homepage
├── about.html              # About page
├── search.html             # Offline search
├── privacy.html            # Privacy Policy
├── terms.html              # Terms of Use
├── 404.html                # Custom 404 page
├── robots.txt              # SEO robots file
├── sitemap.xml             # XML sitemap (update URLs to your domain)
├── rss.xml                 # RSS feed (update URLs to your domain)
├── manifest.json           # PWA manifest
│
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (variables, components, layout)
│   │   └── responsive.css  # Responsive breakpoints
│   ├── js/
│   │   ├── app.js          # Main app (loads articles, renders homepage)
│   │   ├── search.js       # Offline search engine
│   │   ├── markdown.js     # Lightweight Markdown parser
│   │   ├── theme.js        # Dark/light mode toggle
│   │   ├── lazyload.js     # Lazy loading + scroll reveal animations
│   │   └── navigation.js   # Nav, mobile menu, back-to-top, FAQ
│   ├── icons/
│   │   └── favicon.svg
│   ├── images/             # Your images go here
│   └── fonts/              # Custom fonts (if self-hosted)
│
├── articles/               # Article HTML pages (one per article)
│   ├── getting-started-with-ai.html
│   ├── python-for-beginners.html
│   ├── web3-explained.html
│   ├── cybersecurity-fundamentals.html
│   ├── pi-network-guide.html
│   └── ... (12 sample articles included)
│
├── categories/             # Category pages (one per category)
│   ├── index.html          # All categories page
│   ├── artificial-intelligence.html
│   ├── programming.html
│   ├── web3.html
│   └── ... (all 20 categories included)
│
├── content/
│   ├── articles.json       # 🔑 Article database (the main data file)
│   ├── categories.json     # Category definitions
│   └── tags.json           # Tags list
│
└── markdown/               # Article content in Markdown format
    ├── getting-started-with-ai.md
    ├── python-for-beginners.md
    ├── web3-explained.md
    └── ...
```

---

## ✍️ Publishing New Articles

### Step 1: Create the Markdown File

Create a new `.md` file in the `markdown/` folder:

```markdown
---
title: Your Article Title
slug: your-article-slug
description: A compelling 1-2 sentence description for SEO and social sharing.
category: artificial-intelligence
tags: [AI, Machine Learning, Tutorial]
cover: https://images.unsplash.com/photo-XXXXX?w=1200&q=80
date: 2024-12-20
lastUpdated: 2024-12-20
readingTime: 8
readingLevel: Beginner
featured: false
editorsPick: false
trending: false
popular: false
---

Your article content here in **Markdown** format.

## Section Heading

Content...

### Subsection

More content...

:::info
This creates an info box.
:::

:::warning
This creates a warning box.
:::

```python
# Code blocks work too
print("Hello, KnowledgeVerse!")
```
```

**Supported categories:** `artificial-intelligence`, `programming`, `technology`, `web-development`, `data-analytics`, `machine-learning`, `cybersecurity`, `web3`, `blockchain`, `business`, `startups`, `finance`, `career`, `education`, `digital-marketing`, `productivity`, `agriculture`, `government-schemes`, `current-affairs`, `pi-network`

### Step 2: Add to articles.json

Open `content/articles.json` and add your article entry:

```json
{
  "id": "your-article-slug",
  "title": "Your Article Title",
  "slug": "your-article-slug",
  "description": "Your SEO description.",
  "category": "artificial-intelligence",
  "categoryName": "Artificial Intelligence",
  "tags": ["AI", "Tutorial"],
  "cover": "https://images.unsplash.com/photo-XXXXX?w=1200&q=80",
  "date": "2024-12-20",
  "lastUpdated": "2024-12-20",
  "readingTime": 8,
  "readingLevel": "Beginner",
  "featured": false,
  "editorsPick": false,
  "trending": false,
  "popular": false,
  "views": 0,
  "excerpt": "First 1-2 sentences of your article for card previews."
}
```

### Step 3: Create the Article HTML Page

Copy any existing file from `articles/` and rename it to `your-article-slug.html`. The JavaScript will automatically load the markdown content.

### Step 4: Update sitemap.xml and rss.xml

Add your new article URL to both `sitemap.xml` and `rss.xml`.

That's it. No build process. No npm. Push to GitHub and it's live.

---

## 🎨 Customization

### Colors (in `assets/css/style.css`)

```css
:root {
  --primary: #5C3B9E;        /* Main brand color */
  --accent: #F5B942;          /* Highlight/CTA color */
  --bg: #ffffff;              /* Page background */
  --bg-secondary: #F8F7FF;    /* Subtle background */
}
```

Change these to match your brand instantly.

### Site Name and Metadata

1. Edit `<title>` and `<meta name="description">` in each HTML file
2. Update `manifest.json` with your app name
3. Replace `https://knowledgeverse.io` with your domain in:
   - `sitemap.xml`
   - `rss.xml`
   - `robots.txt`
   - JSON-LD structured data in each page

### Adding Your Logo

Replace the `KV` text logo in the navbar with your logo:
```html
<!-- In .nav__logo-icon -->
<img src="assets/images/logo.svg" alt="Your Site Name" height="32">
```

---

## 🔍 SEO Checklist

- [x] Semantic HTML5 structure
- [x] Open Graph meta tags on all pages
- [x] Twitter Card meta tags
- [x] JSON-LD structured data (Article, Organization, WebSite schemas)
- [x] Breadcrumb navigation with schema markup
- [x] XML Sitemap (`sitemap.xml`)
- [x] Robots.txt
- [x] RSS Feed (`rss.xml`)
- [x] Canonical URLs
- [x] Mobile-responsive design
- [x] Fast loading (no frameworks, lazy images)
- [ ] Update all `https://knowledgeverse.io` to your actual domain
- [ ] Submit sitemap to Google Search Console
- [ ] Add your domain to `robots.txt`

---

## ⚡ Performance Tips

**Images:** Use Unsplash's URL parameters for optimization:
- `?w=1200&q=80` for hero images
- `?w=600&q=70` for card thumbnails
- `?w=300&q=60` for small thumbnails

**Lazy Loading:** All images are lazy-loaded by default. The `lazyload.js` handles this automatically using IntersectionObserver.

**Critical CSS:** The theme script loads first (before body) to prevent dark mode flash.

---

## 📱 PWA Support

The `manifest.json` enables Progressive Web App features. Users on mobile can "Add to Home Screen" for an app-like experience.

---

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure and semantics |
| CSS3 Custom Properties | Theming and design tokens |
| Vanilla JavaScript (ES2020) | Interactivity and data loading |
| JSON | Article and category database |
| Markdown | Article content format |
| Unsplash CDN | Article cover images |
| Google Fonts | Typography (Inter + Merriweather) |

**Zero dependencies. Zero build tools. Zero configuration.**

---

## 📄 License

© 2024 KnowledgeVerse. All content and code are proprietary unless otherwise noted.

---

*Built with ❤️ for curious minds who refuse to stop learning.*
