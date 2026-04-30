// content.jsx — post data + shared formatters

// ═══════════════════════════════════════════════════════════════
// HOW TO ADD A POST
// ═══════════════════════════════════════════════════════════════
// 1. Copy the template below into POSTS (keep newest first).
// 2. Fill in: slug, title, excerpt, date, tags, author.
// 3. Add body blocks inside the body array (see BLOCK REFERENCE).
// 4. Reading time is auto-calculated — no manual field needed.
// 5. Tags automatically populate the filter chips on Archive.
//
// {
//   slug: "your-post-slug",          // URL: yoursite.com/p/your-post-slug
//   title: "Your Post Title",
//   excerpt: "One-sentence summary shown in list views.",
//   date: "2026-05-01",              // YYYY-MM-DD
//   tags: ["Tag One", "Tag Two"],    // any strings; drives Archive filters
//   author: "you",
//   body: [
//     { kind: "p",  text: "Opening paragraph." },
//     { kind: "h2", text: "First section" },
//     // ... more blocks (see BLOCK REFERENCE at the bottom of this file)
//   ],
// },
// ═══════════════════════════════════════════════════════════════
const POSTS = [
  // ADD YOUR POSTS HERE — newest first
];

// ─────────────────────────────────────────────────────────────
// Read-time — auto-calculated from body word count at ~200 wpm.
// The Post page calls this; no manual "reading" field needed.
// ─────────────────────────────────────────────────────────────
function calcReadTime(body) {
  if (!body || body.length === 0) return 1;
  const text = body
    .map(b => [b.text || "", ...(b.items || [])].join(" "))
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ─────────────────────────────────────────────────────────────
// Tag helpers — derive unique tags from all posts for Archive filters.
// "All" is always first; remaining tags are sorted alphabetically.
// ─────────────────────────────────────────────────────────────
function getAllTags() {
  const seen = new Set();
  POSTS.forEach(p => (p.tags || []).forEach(t => seen.add(t)));
  return ["All", ...Array.from(seen).sort()];
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateShort(iso) {
  return iso; // YYYY-MM-DD, terminal-feel
}

// ═══════════════════════════════════════════════════════════════
// BLOCK REFERENCE — body block types for post content
// ═══════════════════════════════════════════════════════════════
//
//  Paragraph       { kind: "p",       text: "Body text." }
//  Section heading { kind: "h2",      text: "Heading" }
//  Sub-heading     { kind: "h3",      text: "Sub-heading" }
//  Block quote     { kind: "quote",   text: "Quote.", attribution: "— Source" }
//  Code block      { kind: "code",    lang: "bash", text: "$ cmd --flag" }
//  Note callout    { kind: "callout", tone: "note", text: "Highlighted note." }
//  Bullet list     { kind: "list",    items: ["Item one", "Item two"] }
//
// ═══════════════════════════════════════════════════════════════
