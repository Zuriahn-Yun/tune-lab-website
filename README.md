# LLM Tune Lab

Field notes on fine-tuning, evaluating, and serving open-weight LLMs.

**Live site:** https://llmtunelab.com  
**Netlify URL:** https://precious-syrniki-2eff11.netlify.app

---

## Stack

- Vanilla HTML + React 18 (via CDN, no build step)
- Hosted on Netlify (static)
- Email subscriptions via Netlify Forms

## Adding posts

Edit `content.jsx` — instructions are at the top of the file. Add entries to the `POSTS` array, newest first.

## Email subscriptions

Submissions are captured in the Netlify dashboard under **Forms → subscribe**.

To get notified by email when someone subscribes:
1. Go to Netlify → your site → **Site configuration → Notifications**
2. Add an **Email notification** for form submissions

## Local development

Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve .
```

> Note: Netlify Form submissions won't work locally — they only work on the deployed site.
