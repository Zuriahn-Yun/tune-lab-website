// content.jsx — post data + shared formatters

const POSTS = [
  {
    slug: "running-llama-3-on-a-single-3090",
    title: "Running Llama 3 70B on a single 3090, comfortably",
    excerpt: "Quantization, KV cache offload, and the surprisingly large gap between \"it boots\" and \"it's usable\".",
    date: "2026-04-21",
    reading: 9,
    category: "Local Inference",
    author: "ev",
  },
  {
    slug: "the-quiet-tooling-revolution",
    title: "The quiet tooling revolution around llama.cpp",
    excerpt: "Five small projects that have changed how we run models on commodity hardware in the last six months.",
    date: "2026-04-09",
    reading: 6,
    category: "Tooling",
    author: "mira",
  },
  {
    slug: "speculative-decoding-notes",
    title: "Speculative decoding: notes from a week of measurement",
    excerpt: "Draft models, acceptance rates, and why the published speedups don't always survive contact with real prompts.",
    date: "2026-03-28",
    reading: 12,
    category: "Models",
    author: "ev",
  },
  {
    slug: "mlx-vs-llama-cpp-on-apple-silicon",
    title: "MLX vs llama.cpp on Apple Silicon, six months later",
    excerpt: "Throughput, memory pressure, and the parts of the developer experience that still matter more than tokens/sec.",
    date: "2026-03-15",
    reading: 11,
    category: "Local Inference",
    author: "mira",
  },
  {
    slug: "context-length-is-a-systems-problem",
    title: "Context length is a systems problem",
    excerpt: "Long context isn't a model property — it's a memory hierarchy you have to engineer around.",
    date: "2026-02-27",
    reading: 8,
    category: "Models",
    author: "ev",
  },
  {
    slug: "a-quieter-rag",
    title: "A quieter RAG: retrieval without the framework tax",
    excerpt: "What we kept, what we threw away, and why most of the popular abstractions just got in the way.",
    date: "2026-02-12",
    reading: 7,
    category: "Tooling",
    author: "mira",
  },
  {
    slug: "small-models-are-the-story",
    title: "Small models are the story",
    excerpt: "Why the most interesting work in 2026 is happening below 8B parameters.",
    date: "2026-01-30",
    reading: 5,
    category: "Models",
    author: "ev",
  },
  {
    slug: "running-models-offline-on-a-laptop",
    title: "A field guide to running models entirely offline",
    excerpt: "Air-gapped setups, sensible defaults, and the parts of the stack that assume you have a network.",
    date: "2026-01-14",
    reading: 10,
    category: "Local Inference",
    author: "mira",
  },
  {
    slug: "a-grammar-for-tool-use",
    title: "A grammar for tool use",
    excerpt: "Constrained decoding, JSON schemas, and the difference between models that can call tools and models that should.",
    date: "2025-12-19",
    reading: 8,
    category: "Tooling",
    author: "ev",
  },
];

const CATEGORIES = ["All", "Local Inference", "Models", "Tooling"];

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateShort(iso) {
  return iso; // already YYYY-MM-DD, terminal-feel
}

// ─────────────────────────────────────────────────────────────
// One full post body for the Post page. Plain object array for renderer.
// blocks: { kind: 'p'|'h2'|'h3'|'quote'|'code'|'callout'|'figure'|'list', ... }
// ─────────────────────────────────────────────────────────────
const POST_BODY = [
  { kind: "p", text: "There's a particular shape to the question I get asked most often: can I really run a 70B model on a single consumer GPU? The answer has been yes for a while now, but the gap between \"it loads\" and \"it's usable for daily work\" is wider than most write-ups admit." },
  { kind: "p", text: "This is a working note from a month of using Llama 3 70B as a local assistant on a single RTX 3090, alongside a 5950X and 64GB of system memory. It is not a benchmark — it is the configuration I actually leave running." },

  { kind: "h2", text: "The quantization question" },
  { kind: "p", text: "At 4-bit, the model fits. At 5-bit, it fits with care. At 6-bit, you start swapping with the KV cache and everything slows down enough to notice. I settled on Q4_K_M for the working setup and keep a Q5_K_M build around for evaluation runs where I care about quality more than latency." },
  { kind: "callout", tone: "note", text: "If you only take one thing from this post: the difference between Q4_K_M and Q5_K_M is real but small. The difference between a 3-token/sec setup and a 14-token/sec setup is the difference between using the model and not." },

  { kind: "h2", text: "KV cache offload" },
  { kind: "p", text: "The trick that made everything usable was offloading the KV cache to CPU. llama.cpp exposes this as a flag; the cost is a small per-token overhead, the benefit is that you can fit a much larger context window without spilling weights back to system memory." },
  { kind: "code", lang: "bash", text: "./llama-server \\\n  --model models/llama-3-70b-q4_k_m.gguf \\\n  --ctx-size 16384 \\\n  --n-gpu-layers 81 \\\n  --cache-type-k q8_0 \\\n  --cache-type-v q8_0 \\\n  --threads 12" },
  { kind: "p", text: "The two cache-type flags are the important ones. q8_0 is a reasonable default; f16 gives marginally better quality at twice the memory; q4_0 will save more memory than you'd expect at the cost of slightly worse long-context behavior." },

  { kind: "h2", text: "What \"comfortable\" means" },
  { kind: "p", text: "Comfortable, for me, is 12–14 tokens per second on the prompt I'm actually using, which is rarely the prompt anyone benchmarks. Real prompts have system messages, long histories, retrieval context, and instructions that compound. The published numbers are almost always for a 32-token prompt — useful as a ceiling, not as a forecast." },
  { kind: "list", items: [
    "Idle VRAM: 22.4 GB of 24 GB",
    "Sustained throughput: 12 tok/s at 8K context",
    "Prefill: 380 tok/s",
    "First-token latency: 1.2s on a 4K prompt",
  ]},

  { kind: "quote", text: "The published numbers are a ceiling, not a forecast. Measure on the prompts you actually send.", attribution: "— a thing I now say to myself before every benchmark" },

  { kind: "h2", text: "What I would change" },
  { kind: "p", text: "If I were starting over, I would buy more system memory before I bought a second GPU. The KV cache offload pattern scales much further than people realize, and 128GB of DDR4 costs less than a used 3090. The bottleneck on a single-GPU setup is almost never compute — it's the memory hierarchy around the compute." },
  { kind: "p", text: "I'll write up the dual-GPU version of this configuration once I've used it for long enough to have an honest opinion about it. Until then: the single-3090 setup is enough. It has been enough for six months." },
];
