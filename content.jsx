// content.jsx — post data + shared formatters

// ─────────────────────────────────────────────────────────────
// POSTS — add one object per published post.
//
// Fields:
//   slug     – URL-safe identifier used in the page URL, e.g. "my-first-post"
//   title    – displayed in list rows and the post header
//   excerpt  – one-sentence summary shown in list rows on Home and Archive
//   date     – ISO 8601 string "YYYY-MM-DD", e.g. "2026-05-01"
//   reading  – estimated reading time in minutes (integer)
//   category – must exactly match one of the strings in CATEGORIES below
//   author   – short display name shown in the post byline
//
// Example entry (copy, fill in, and remove the comment slashes):
// {
//   slug: "your-post-slug",
//   title: "Your Post Title",
//   excerpt: "A one-sentence description of what the post covers.",
//   date: "2026-05-01",
//   reading: 5,
//   category: "Your Category",
//   author: "you",
// },
// ─────────────────────────────────────────────────────────────
const POSTS = [
  // ADD YOUR POSTS HERE — newest first
];

// ─────────────────────────────────────────────────────────────
// CATEGORIES — controls the filter chips on the Archive page.
// "All" must stay first. Add your own category strings after it.
// Each string must exactly match the category values used in POSTS above.
//
// Example: ["All", "Fine-tuning", "Evaluation", "Inference"]
// ─────────────────────────────────────────────────────────────
const CATEGORIES = ["All" /* , "Your Category", "Another Category" */];

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateShort(iso) {
  return iso; // already YYYY-MM-DD, terminal-feel
}

// ─────────────────────────────────────────────────────────────
// POST_BODY — the rendered body of the post shown on the Post page.
//
// Each block is a plain object with a "kind" field and content fields.
// Supported kinds:
//
//   Paragraph:
//   { kind: "p", text: "Your paragraph text." }
//
//   Section heading (h2):
//   { kind: "h2", text: "Section heading" }
//
//   Sub-heading (h3):
//   { kind: "h3", text: "Sub-heading" }
//
//   Block quote:
//   { kind: "quote", text: "The quoted text.", attribution: "— Source" }
//
//   Code block (supported langs: "bash", or leave blank for generic shell):
//   { kind: "code", lang: "bash", text: "$ your-command --flag value" }
//
//   Callout / note box:
//   { kind: "callout", tone: "note", text: "Highlighted callout text." }
//
//   Bullet list (renders as mono spaced terminal-style rows):
//   { kind: "list", items: ["Item one", "Item two", "Item three"] }
//
// Example body:
//   { kind: "p",  text: "Opening paragraph." },
//   { kind: "h2", text: "First section" },
//   { kind: "p",  text: "Section body text." },
//   { kind: "code", lang: "bash", text: "$ echo hello world" },
//   { kind: "callout", tone: "note", text: "Something worth highlighting." },
//   { kind: "quote", text: "A quote.", attribution: "— Attribution" },
//   { kind: "list", items: ["Metric one: value", "Metric two: value"] },
// ─────────────────────────────────────────────────────────────
const POST_BODY = [
  // ADD YOUR POST BODY BLOCKS HERE
];
