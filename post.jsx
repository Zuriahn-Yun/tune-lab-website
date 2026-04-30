// post.jsx — Post page + markdown renderer + simple syntax highlighting

const { useState: useStateP } = React;

// Tiny shell highlighter — scoped, no deps
function highlightShell(src) {
  const lines = src.split("\n");
  return lines.map((ln, i) => {
    // continuation marker
    let parts = [];
    let work = ln;
    // match backslash continuation
    if (work.endsWith("\\")) {
      parts.push(<span key="t" style={{ color: "var(--ws-fg)" }}>{work.slice(0, -1)}</span>);
      parts.push(<span key="b" style={{ color: "var(--ws-dim2)" }}>{"\\"}</span>);
    } else {
      // command vs flag vs string
      const tokens = work.split(/(\s+)/);
      let firstNonWs = true;
      tokens.forEach((tok, j) => {
        if (/^\s+$/.test(tok)) {
          parts.push(<span key={j}>{tok}</span>);
          return;
        }
        if (firstNonWs) {
          firstNonWs = false;
          parts.push(<span key={j} style={{ color: "var(--ws-fg)" }}>{tok}</span>);
          return;
        }
        if (tok.startsWith("--") || tok.startsWith("-")) {
          parts.push(<span key={j} style={{ color: "var(--ws-accent)" }}>{tok}</span>);
        } else if (/^[0-9]/.test(tok) && /^[0-9_]+$/.test(tok)) {
          parts.push(<span key={j} style={{ color: "#d4a574" }}>{tok}</span>);
        } else if (tok.includes("/") || tok.includes(".")) {
          parts.push(<span key={j} style={{ color: "var(--ws-dim2)" }}>{tok}</span>);
        } else {
          parts.push(<span key={j} style={{ color: "var(--ws-fg)" }}>{tok}</span>);
        }
      });
    }
    return (
      <div key={i} style={{ display: "flex", gap: 18, minHeight: "1.6em" }}>
        <span style={{
          color: "var(--ws-dim2)",
          opacity: 0.5,
          userSelect: "none",
          minWidth: 24,
          textAlign: "right",
          fontSize: 11,
          paddingTop: 2,
        }}>{(i + 1).toString().padStart(2, "0")}</span>
        <span style={{ flex: 1 }}>{parts}</span>
      </div>
    );
  });
}

function CodeBlock({ lang, text }) {
  return (
    <figure style={{ margin: "32px 0" }}>
      {/* Terminal-style chrome */}
      <div style={{
        border: "1px solid var(--ws-rule)",
        background: "rgba(255,255,255,0.012)",
        borderRadius: 4,
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderBottom: "1px solid var(--ws-rule)",
          fontFamily: "var(--ws-mono)",
          fontSize: 11,
          color: "var(--ws-dim)",
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ws-rule)" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ws-rule)" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ws-rule)" }} />
          </div>
          <span style={{ marginLeft: 8 }}>{lang || "shell"}</span>
          <span style={{ marginLeft: "auto", opacity: 0.6 }}>~/warpspeed</span>
        </div>
        <pre style={{
          margin: 0,
          padding: "16px 18px 18px",
          fontFamily: "var(--ws-mono)",
          fontSize: 13,
          lineHeight: 1.65,
          overflow: "auto",
          color: "var(--ws-fg)",
        }}>
          {highlightShell(text)}
        </pre>
      </div>
    </figure>
  );
}

function Callout({ tone, text }) {
  return (
    <aside style={{
      margin: "32px 0",
      padding: "20px 24px 22px",
      borderLeft: "1px solid var(--ws-accent)",
      background: "rgba(255,255,255,0.012)",
      fontFamily: "var(--ws-sans)",
      fontSize: 15,
      lineHeight: 1.65,
      color: "var(--ws-fg)",
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: 18,
      alignItems: "start",
    }}>
      <span style={{
        fontFamily: "var(--ws-mono)",
        fontSize: 11,
        color: "var(--ws-accent)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        paddingTop: 3,
      }}>
        note
      </span>
      <div>{text}</div>
    </aside>
  );
}

function Blockquote({ text, attribution }) {
  return (
    <blockquote style={{
      margin: "40px 0",
      padding: "0 0 0 28px",
      borderLeft: "1px solid var(--ws-rule)",
      fontFamily: "var(--ws-serif)",
      fontStyle: "italic",
      fontSize: 20,
      lineHeight: 1.5,
      color: "var(--ws-fg)",
      letterSpacing: "-0.005em",
    }}>
      <p style={{ margin: 0 }}>"{text}"</p>
      {attribution && (
        <footer style={{
          marginTop: 12,
          fontFamily: "var(--ws-mono)",
          fontStyle: "normal",
          fontSize: 12,
          color: "var(--ws-dim)",
        }}>{attribution}</footer>
      )}
    </blockquote>
  );
}

function PostBody({ blocks }) {
  return (
    <div className="ws-post-body">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return <p key={i} style={{
              fontFamily: "var(--ws-body)",
              fontSize: "var(--ws-body-size)",
              lineHeight: 1.7,
              color: "var(--ws-fg)",
              margin: "0 0 24px",
              letterSpacing: "var(--ws-body-tracking)",
            }}>{b.text}</p>;
          case "h2":
            return <h2 key={i} style={{
              fontFamily: "var(--ws-sans)",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              color: "var(--ws-fg)",
              margin: "56px 0 20px",
            }}>{b.text}</h2>;
          case "h3":
            return <h3 key={i} style={{
              fontFamily: "var(--ws-sans)",
              fontSize: 17,
              fontWeight: 500,
              color: "var(--ws-fg)",
              margin: "40px 0 14px",
            }}>{b.text}</h3>;
          case "code":
            return <CodeBlock key={i} {...b} />;
          case "callout":
            return <Callout key={i} {...b} />;
          case "quote":
            return <Blockquote key={i} {...b} />;
          case "list":
            return (
              <ul key={i} style={{
                listStyle: "none",
                padding: 0,
                margin: "8px 0 28px",
                fontFamily: "var(--ws-mono)",
                fontSize: 13,
                color: "var(--ws-fg)",
                lineHeight: 1.9,
              }}>
                {b.items.map((it, j) => (
                  <li key={j} style={{
                    display: "grid",
                    gridTemplateColumns: "20px 1fr",
                    gap: 8,
                    padding: "4px 0",
                    borderBottom: j < b.items.length - 1 ? "1px solid var(--ws-rule)" : "none",
                  }}>
                    <span style={{ color: "var(--ws-accent)" }}>›</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function PostPage({ slug, navigate }) {
  const idx = POSTS.findIndex(p => p.slug === slug);
  const post = POSTS[idx] || POSTS[0];
  const prev = POSTS[idx + 1];
  const next = POSTS[idx - 1];

  return (
    <article>
      {/* Header */}
      <header style={{
        padding: "80px 56px 48px",
        borderBottom: "1px solid var(--ws-rule)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate({ name: "archive" }); }}
            className="ws-link"
            style={{
              fontFamily: "var(--ws-mono)",
              fontSize: 12,
              color: "var(--ws-dim)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 36,
            }}
          >
            ← archive
          </a>
          <div style={{
            fontFamily: "var(--ws-mono)",
            fontSize: 11,
            color: "var(--ws-accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}>
            {post.category}
          </div>
          <h1 style={{
            fontFamily: "var(--ws-sans)",
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "-0.022em",
            lineHeight: 1.18,
            color: "var(--ws-fg)",
            margin: 0,
            marginBottom: 28,
            textWrap: "balance",
          }}>
            {post.title}
          </h1>
          <div style={{
            display: "flex",
            gap: 28,
            fontFamily: "var(--ws-mono)",
            fontSize: 12,
            color: "var(--ws-dim)",
            paddingTop: 8,
          }}>
            <span><span style={{ opacity: 0.6 }}>by</span> {post.author}</span>
            <span>{post.date}</span>
            <span>{post.reading} min read</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: "56px 56px 0" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <PostBody blocks={POST_BODY} />
        </div>
      </div>

      {/* Prev / Next */}
      <div style={{ padding: "64px 56px 0" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            paddingTop: 40,
            borderTop: "1px solid var(--ws-rule)",
          }}>
            <PrevNext label="← previous" post={prev} navigate={navigate} align="left" />
            <PrevNext label="next →" post={next} navigate={navigate} align="right" />
          </div>

          {/* Subscribe prompt */}
          <div style={{
            marginTop: 80,
            padding: "40px 0",
            borderTop: "1px solid var(--ws-rule)",
            borderBottom: "1px solid var(--ws-rule)",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--ws-mono)",
              fontSize: 11,
              color: "var(--ws-accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}>
              // subscribe
            </div>
            <div style={{
              fontFamily: "var(--ws-sans)",
              fontSize: 18,
              color: "var(--ws-fg)",
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}>
              One short email when something new lands.
            </div>
            <div style={{
              fontFamily: "var(--ws-sans)",
              fontSize: 14,
              color: "var(--ws-dim)",
              marginBottom: 24,
            }}>
              No tracking, no list-rental, unsubscribe with one click.
            </div>
            <SubscribeInline />
          </div>
        </div>
      </div>
    </article>
  );
}

function PrevNext({ label, post, navigate, align }) {
  if (!post) {
    return <div style={{ textAlign: align }}>
      <span style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", opacity: 0.4 }}>
        — end of archive —
      </span>
    </div>;
  }
  const [hover, setHover] = useStateP(false);
  return (
    <a href="#"
       onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: post.slug }); }}
       onMouseEnter={() => setHover(true)}
       onMouseLeave={() => setHover(false)}
       style={{
         textDecoration: "none",
         textAlign: align,
         display: "block",
       }}>
      <div style={{
        fontFamily: "var(--ws-mono)",
        fontSize: 11,
        color: "var(--ws-dim)",
        marginBottom: 8,
        letterSpacing: "0.04em",
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--ws-sans)",
        fontSize: 15,
        color: hover ? "var(--ws-accent)" : "var(--ws-fg)",
        lineHeight: 1.4,
        letterSpacing: "-0.005em",
        transition: "color 200ms ease",
      }}>{post.title}</div>
    </a>
  );
}

function SubscribeInline() {
  const [v, setV] = useStateP("");
  const [done, setDone] = useStateP(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (v.includes("@")) setDone(true); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            border: "1px solid var(--ws-rule)",
            padding: "0 14px",
            borderRadius: 2,
            background: "rgba(255,255,255,0.01)",
            minWidth: 360,
          }}>
      <span style={{ color: "var(--ws-accent)", fontFamily: "var(--ws-mono)", fontSize: 13 }}>{">"}</span>
      <input type="email"
             placeholder={done ? "subscribed." : "you@domain.tld"}
             value={done ? "" : v}
             onChange={(e) => setV(e.target.value)}
             disabled={done}
             style={{
               flex: 1,
               background: "transparent",
               border: "none",
               outline: "none",
               color: "var(--ws-fg)",
               fontFamily: "var(--ws-mono)",
               fontSize: 13,
               padding: "12px 12px",
             }}/>
      <button type="submit" style={{
        background: "transparent",
        border: "none",
        color: "var(--ws-dim)",
        fontFamily: "var(--ws-mono)",
        fontSize: 12,
        padding: "12px 0 12px 12px",
        cursor: "pointer",
        borderLeft: "1px solid var(--ws-rule)",
        marginLeft: 12,
        paddingLeft: 14,
      }}>{done ? "✓ done" : "subscribe →"}</button>
    </form>
  );
}

Object.assign(window, { PostPage, PostBody, CodeBlock, Callout, Blockquote });
