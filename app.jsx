// app.jsx — LLM Tune Lab

const { useState, useEffect, useRef, useMemo } = React;

// Centered column used across all sections
const CENTER = { maxWidth: 1080, margin: "0 auto", padding: "0 40px" };

// ─────────────────────────────────────────────────────────────
// Logo mark — inline SVG (network graph + waveforms)
// ─────────────────────────────────────────────────────────────
function LogoMark({ size = 22 }) {
  const w = size * 1.75;
  return (
    <svg width={w} height={size} viewBox="0 0 56 32" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`mg-${size}`} x1="0" y1="16" x2="56" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3D5BD9"/>
          <stop offset="0.55" stopColor="#7B5BC9"/>
          <stop offset="1" stopColor="#9B4DC9"/>
        </linearGradient>
        <radialGradient id={`mn-${size}`} cx="0" cy="0" r="1" gradientTransform="scale(4)">
          <stop offset="0" stopColor="#9DD5F2"/>
          <stop offset="0.6" stopColor="#3D5BD9"/>
          <stop offset="1" stopColor="#1E2A78"/>
        </radialGradient>
      </defs>
      <g stroke={`url(#mg-${size})`} strokeWidth="0.8" fill="none" opacity="0.55">
        <path d="M2 16 Q 8 6 14 16 T 26 16"/>
        <path d="M2 16 Q 8 4 14 16 T 26 16" opacity="0.7"/>
        <path d="M2 16 Q 8 10 14 16 T 26 16"/>
      </g>
      <g stroke={`url(#mg-${size})`} strokeWidth="0.9" opacity="0.95">
        <line x1="20" y1="16" x2="32" y2="6"/>
        <line x1="20" y1="16" x2="32" y2="26"/>
        <line x1="32" y1="6" x2="44" y2="16"/>
        <line x1="32" y1="26" x2="44" y2="16"/>
        <line x1="32" y1="6" x2="32" y2="26"/>
      </g>
      <circle cx="20" cy="16" r="2" fill={`url(#mn-${size})`}/>
      <circle cx="32" cy="6" r="2" fill={`url(#mn-${size})`}/>
      <circle cx="32" cy="26" r="2" fill={`url(#mn-${size})`}/>
      <circle cx="44" cy="16" r="2" fill={`url(#mn-${size})`}/>
      <g stroke={`url(#mg-${size})`} strokeWidth="0.8" fill="none" opacity="0.55">
        <path d="M36 16 Q 42 6 48 16 T 54 16"/>
        <path d="M36 16 Q 42 4 48 16 T 54 16" opacity="0.7"/>
      </g>
    </svg>
  );
}

function Wordmark({ size = 15, caret = true, withMark = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--ws-fg)" }}>
      {withMark && <LogoMark size={size + 7} />}
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
        <span className="ll-grad-text" style={{
          fontFamily: "var(--ws-display)",
          fontSize: size + 1,
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}>LLM</span>
        <span style={{
          fontFamily: "var(--ws-mono)",
          fontSize: size - 3,
          color: "var(--ws-dim)",
          letterSpacing: "0.06em",
        }}>tune lab</span>
        {caret && <span className="ws-caret" style={{
          display: "inline-block", width: "0.45em", height: "0.9em",
          background: "var(--ws-accent)", marginLeft: 2, transform: "translateY(0.1em)", opacity: 0.8,
        }} />}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Header — sticky glass
// ─────────────────────────────────────────────────────────────
function Header({ route, navigate }) {
  const NavLink = ({ to, label }) => {
    const active = route.name === to || (to === "archive" && route.name === "post");
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: to }); }}
        className="ws-link"
        style={{
          color: active ? "var(--ws-fg)" : "var(--ws-dim)",
          fontFamily: "var(--ws-mono)",
          fontSize: 12,
          letterSpacing: "0.04em",
          textDecoration: "none",
          padding: "4px 0",
          transition: "color 150ms ease",
        }}
      >
        {label}
      </a>
    );
  };
  return (
    <header className="ws-header">
      <div style={{ ...CENTER, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "home" }); }} style={{ textDecoration: "none" }}>
          <Wordmark size={15} caret={true} withMark={true} />
        </a>
        <nav style={{ display: "flex", gap: 32 }}>
          <NavLink to="home" label="index" />
          <NavLink to="archive" label="archive" />
          <NavLink to="about" label="about" />
          <NavLink to="rss" label="rss" />
        </nav>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  const [val, setVal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <footer style={{ borderTop: "1px solid var(--ws-rule)", marginTop: 112 }}>
      <div style={{
        ...CENTER,
        padding: "56px 40px 44px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "start",
      }}>
        <div>
          <div style={{ marginBottom: 16 }}>
            <Wordmark size={13} caret={false} withMark={true} />
          </div>
          {/* ADD: Your site tagline (1–2 lines shown in the footer) */}
          <div style={{ fontFamily: "var(--ws-sans)", fontSize: 13, lineHeight: 1.75, color: "var(--ws-dim)", maxWidth: 300 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 20 }}>
            {["rss", "github", "archive"].map(l => (
              <a key={l} className="ws-link" href="#" style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.04em" }}>{l}</a>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", marginBottom: 16, letterSpacing: "0.06em" }}>// subscribe</div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (val.includes("@")) setSubmitted(true); }}
            style={{
              display: "flex", alignItems: "stretch",
              borderBottom: "1px solid var(--ws-rule-strong)", maxWidth: 340,
            }}
          >
            <span style={{ color: "var(--ws-accent)", paddingRight: 10, alignSelf: "center", fontFamily: "var(--ws-mono)", fontSize: 13 }}>{">"}</span>
            <input
              type="email"
              placeholder={submitted ? "subscribed." : "you@domain.tld"}
              value={submitted ? "" : val}
              onChange={(e) => setVal(e.target.value)}
              disabled={submitted}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "var(--ws-fg)", fontFamily: "var(--ws-mono)", fontSize: 13, padding: "12px 0",
              }}
            />
            <button type="submit" style={{
              background: "transparent", border: "none", color: "var(--ws-dim)",
              fontFamily: "var(--ws-mono)", fontSize: 11, letterSpacing: "0.04em",
              padding: "12px 0 12px 16px", cursor: "pointer",
              transition: "color 150ms ease",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--ws-fg)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--ws-dim)"}
            >
              {submitted ? "✓" : "send →"}
            </button>
          </form>
          <div style={{ marginTop: 12, fontFamily: "var(--ws-mono)", fontSize: 10, letterSpacing: "0.03em", color: "var(--ws-dim)", opacity: 0.6 }}>
            One short email per post. No tracking, unsubscribe anytime.
          </div>
        </div>

        <div style={{
          gridColumn: "1 / -1", marginTop: 32, paddingTop: 20,
          borderTop: "1px solid var(--ws-rule)",
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--ws-mono)", fontSize: 10, letterSpacing: "0.04em",
          color: "var(--ws-dim)", opacity: 0.45,
        }}>
          {/* ADD: Update year and name */}
          <span>© {new Date().getFullYear()} LLM Tune Lab</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const recent = POSTS.slice(0, 3);
  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding: "108px 0 100px", borderBottom: "1px solid var(--ws-rule)", position: "relative", overflow: "hidden" }}>

        {/* Ambient glow behind headline */}
        <div style={{
          position: "absolute", top: "50%", left: "8%",
          transform: "translateY(-50%)",
          width: 680, height: 480,
          background: "radial-gradient(ellipse at 35% 50%, rgba(61,91,217,0.09) 0%, rgba(123,91,201,0.07) 45%, transparent 72%)",
          pointerEvents: "none",
        }} />

        {/* Decorative SVG motif */}
        <svg aria-hidden="true" width="720" height="360" viewBox="0 0 780 380" style={{
          position: "absolute", right: -60, top: 50, opacity: 0.18, pointerEvents: "none",
        }}>
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="190" x2="780" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1E2A78"/>
              <stop offset="0.45" stopColor="#3D5BD9"/>
              <stop offset="0.75" stopColor="#7B5BC9"/>
              <stop offset="1" stopColor="#9B4DC9"/>
            </linearGradient>
            <radialGradient id="hero-node" cx="0" cy="0" r="1" gradientTransform="scale(20)">
              <stop offset="0" stopColor="#9DD5F2"/>
              <stop offset="0.5" stopColor="#3D5BD9"/>
              <stop offset="1" stopColor="#1E2A78"/>
            </radialGradient>
          </defs>
          {[0,1,2,3,4,5,6,7].map(i => (
            <path key={`wl${i}`} d={`M0 190 Q 80 ${190-70-i*8} 160 190 T 320 190`}
              stroke="url(#hero-grad)" strokeWidth="0.7" fill="none" opacity={0.7-i*0.07}/>
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <path key={`wl2${i}`} d={`M0 190 Q 80 ${190+70+i*8} 160 190 T 320 190`}
              stroke="url(#hero-grad)" strokeWidth="0.7" fill="none" opacity={0.7-i*0.07}/>
          ))}
          <g stroke="url(#hero-grad)" strokeWidth="1.2" opacity="0.9">
            <line x1="280" y1="190" x2="380" y2="110"/>
            <line x1="280" y1="190" x2="380" y2="270"/>
            <line x1="380" y1="110" x2="480" y2="190"/>
            <line x1="380" y1="270" x2="480" y2="190"/>
            <line x1="380" y1="110" x2="380" y2="270"/>
            <line x1="280" y1="190" x2="480" y2="190"/>
          </g>
          {[[280,190],[380,110],[380,270],[480,190]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="9" fill="url(#hero-node)"/>
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <path key={`wr${i}`} d={`M460 190 Q 540 ${190-70-i*8} 620 190 T 780 190`}
              stroke="url(#hero-grad)" strokeWidth="0.7" fill="none" opacity={0.7-i*0.07}/>
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <path key={`wr2${i}`} d={`M460 190 Q 540 ${190+70+i*8} 620 190 T 780 190`}
              stroke="url(#hero-grad)" strokeWidth="0.7" fill="none" opacity={0.7-i*0.07}/>
          ))}
        </svg>

        <div style={{ ...CENTER, position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            {/* ADD: Status badge — short one-liner above the headline */}
            <div style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", marginBottom: 36, letterSpacing: "0.07em" }}>
              <span style={{ color: "var(--ws-accent)", marginRight: 10 }}>●</span>Lorem ipsum · est. 2025
            </div>

            {/*
              ADD: Hero headline.
              Wrap the key phrase in <span className="ll-grad-text">…</span>
              for the indigo → violet gradient effect.
            */}
            <h1 style={{
              fontFamily: "var(--ws-display)",
              fontWeight: 300,
              fontSize: 56,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ws-fg)",
              textWrap: "balance",
            }}>
              Lorem ipsum dolor sit amet, <span className="ll-grad-text">consectetur<br/>adipiscing</span> elit.
            </h1>

            {/* ADD: Hero subheading — 1–3 sentences about what this site publishes */}
            <p style={{
              fontFamily: "var(--ws-sans)",
              fontWeight: 300,
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--ws-dim)",
              marginTop: 28,
              maxWidth: 520,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {/* CTAs — "read latest" hidden until at least one post exists */}
            <div style={{ marginTop: 48, display: "flex", gap: 32, alignItems: "center" }}>
              {recent.length > 0 && (
                <a href="#"
                   onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: recent[0].slug }); }}
                   style={{
                     fontFamily: "var(--ws-mono)", fontSize: 12, letterSpacing: "0.05em",
                     color: "var(--ws-fg)", textDecoration: "none",
                     padding: "10px 20px",
                     background: "linear-gradient(var(--ws-bg), var(--ws-bg)) padding-box, var(--ws-accent-grad) border-box",
                     border: "1px solid transparent",
                     borderRadius: 3,
                     transition: "opacity 150ms ease",
                   }}
                   onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                   onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  read latest →
                </a>
              )}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "archive" }); }}
                 className="ws-link"
                 style={{ fontFamily: "var(--ws-mono)", fontSize: 12, letterSpacing: "0.05em", color: "var(--ws-dim)" }}>
                browse archive
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent posts ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={CENTER}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.08em" }}>
              // recent
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "archive" }); }}
               className="ws-link"
               style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.04em" }}>
              all posts ({POSTS.length}) →
            </a>
          </div>

          {/* Posts come from the POSTS array in content.jsx */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recent.length > 0 ? (
              recent.map((p, i) => <PostRow key={p.slug} post={p} navigate={navigate} first={i === 0} />)
            ) : (
              <li style={{
                padding: "40px 0",
                borderTop: "1px solid var(--ws-rule)",
                borderBottom: "1px solid var(--ws-rule)",
                fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)", letterSpacing: "0.03em",
              }}>
                no posts yet — add your first entry to <code style={{ color: "var(--ws-accent)" }}>content.jsx</code>
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PostRow — list item used on Home
// ─────────────────────────────────────────────────────────────
function PostRow({ post, navigate, first }) {
  const [hover, setHover] = useState(false);
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderTop: first ? "1px solid var(--ws-rule)" : "none",
        borderBottom: "1px solid var(--ws-rule)",
        transition: "box-shadow 200ms ease",
        boxShadow: hover ? "inset 3px 0 0 var(--ws-accent)" : "inset 3px 0 0 transparent",
      }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: post.slug }); }}
        style={{
          display: "grid", gridTemplateColumns: "110px 1fr auto",
          gap: 32, padding: "28px 4px 28px 16px", alignItems: "start",
          textDecoration: "none", color: "inherit",
          transition: "background 200ms ease",
          background: hover ? "rgba(123,91,201,0.03)" : "transparent",
        }}
      >
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.03em", paddingTop: 4 }}>
          {fmtDateShort(post.date)}
        </span>
        <div>
          <div style={{
            fontFamily: "var(--ws-display)", fontWeight: 300,
            fontSize: 22, color: "var(--ws-fg)",
            letterSpacing: "-0.015em", lineHeight: 1.25, marginBottom: 10,
            transition: "color 180ms ease",
          }}>
            <span style={{
              borderBottom: hover ? "1px solid rgba(123,91,201,0.5)" : "1px solid transparent",
              transition: "border-color 200ms ease", paddingBottom: 2,
            }}>
              {post.title}
            </span>
          </div>
          <div style={{ fontFamily: "var(--ws-sans)", fontWeight: 300, fontSize: 14, color: "var(--ws-dim)", lineHeight: 1.6, maxWidth: 580 }}>
            {post.excerpt}
          </div>
        </div>
        {/* Tags + read time */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, paddingTop: 4 }}>
          {(post.tags || []).map(tag => (
            <span key={tag} className="ws-tag">{tag}</span>
          ))}
          <span style={{ fontFamily: "var(--ws-mono)", fontSize: 10, color: "var(--ws-dim)", opacity: 0.6, marginTop: 2 }}>
            {calcReadTime(post.body)} min
          </span>
        </div>
      </a>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────
// Archive
// ─────────────────────────────────────────────────────────────
function ArchivePage({ navigate }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? POSTS : POSTS.filter(p => (p.tags || []).includes(filter));
  const allTags = getAllTags(); // derived from posts in content.jsx

  const byYear = useMemo(() => {
    const m = {};
    filtered.forEach(p => {
      const y = p.date.slice(0, 4);
      (m[y] ||= []).push(p);
    });
    return m;
  }, [filtered]);
  const years = Object.keys(byYear).sort().reverse();

  return (
    <div style={{ padding: "80px 0 0" }}>
      <div style={{ ...CENTER, maxWidth: 960, margin: "0 auto" }}>

        <div style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", marginBottom: 20, letterSpacing: "0.08em" }}>
          // archive
        </div>

        {/* ADD: Archive page headline */}
        <h1 style={{
          fontFamily: "var(--ws-display)", fontWeight: 300,
          fontSize: 38, letterSpacing: "-0.02em",
          color: "var(--ws-fg)", margin: 0, marginBottom: 14,
        }}>
          Lorem ipsum dolor sit amet.
        </h1>

        {/* Auto-updated as posts are added */}
        <p style={{
          fontFamily: "var(--ws-sans)", fontWeight: 300, fontSize: 15,
          color: "var(--ws-dim)", lineHeight: 1.6, margin: 0, marginBottom: 44,
        }}>
          {POSTS.length > 0
            ? `${POSTS.length} post${POSTS.length === 1 ? "" : "s"} · sorted newest first.`
            : "No posts yet — add your first entry to content.jsx."}
        </p>

        {/* Filter chips — auto-derived from post tags */}
        {allTags.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 56, paddingBottom: 28, borderBottom: "1px solid var(--ws-rule)", flexWrap: "wrap" }}>
            {allTags.map(tag => {
              const active = filter === tag;
              const count = tag === "All" ? POSTS.length : POSTS.filter(p => (p.tags || []).includes(tag)).length;
              return (
                <button key={tag} onClick={() => setFilter(tag)} style={{
                  fontFamily: "var(--ws-mono)", fontSize: 11, letterSpacing: "0.05em",
                  padding: "6px 14px", borderRadius: 3, cursor: "pointer",
                  transition: "all 140ms ease",
                  ...(active ? {
                    background: "var(--ws-accent-grad)",
                    border: "1px solid transparent",
                    color: "#fff",
                  } : {
                    background: "transparent",
                    border: "1px solid var(--ws-rule-strong)",
                    color: "var(--ws-dim)",
                  }),
                }}>
                  {tag.toLowerCase()} <span style={{ opacity: 0.55, marginLeft: 5 }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grouped by year — auto-populates from content.jsx */}
        {years.length === 0 && (
          <div style={{
            padding: "52px 0", fontFamily: "var(--ws-mono)", fontSize: 12,
            letterSpacing: "0.03em", color: "var(--ws-dim)",
            borderTop: allTags.length <= 1 ? "1px solid var(--ws-rule)" : "none",
          }}>
            no posts yet — add your first entry to <code style={{ color: "var(--ws-accent)" }}>content.jsx</code>
          </div>
        )}

        {years.map(year => (
          <section key={year} style={{ marginBottom: 72 }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 28, marginBottom: 4, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.05em" }}>
                {year} <span style={{ opacity: 0.4 }}>·</span> <span style={{ opacity: 0.6 }}>{byYear[year].length}</span>
              </span>
              <div style={{ height: 1, background: "linear-gradient(90deg, var(--ws-rule-strong), transparent)" }} />
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {byYear[year].map(p => <ArchiveRow key={p.slug} post={p} navigate={navigate} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function ArchiveRow({ post, navigate }) {
  const [hover, setHover] = useState(false);
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: "1px solid var(--ws-rule)",
        boxShadow: hover ? "inset 3px 0 0 var(--ws-accent)" : "inset 3px 0 0 transparent",
        transition: "box-shadow 200ms ease",
      }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: post.slug }); }}
        style={{
          display: "grid", gridTemplateColumns: "80px 1fr auto 52px",
          gap: 28, padding: "18px 4px 18px 16px", alignItems: "baseline",
          textDecoration: "none", color: "inherit",
          background: hover ? "rgba(123,91,201,0.03)" : "transparent",
          transition: "background 200ms ease",
        }}
      >
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", letterSpacing: "0.02em" }}>
          {post.date.slice(5)}
        </span>
        <div>
          <div style={{
            fontFamily: "var(--ws-display)", fontWeight: 300, fontSize: 17,
            color: "var(--ws-fg)", letterSpacing: "-0.01em", marginBottom: 4,
          }}>
            <span style={{
              borderBottom: hover ? "1px solid rgba(123,91,201,0.4)" : "1px solid transparent",
              transition: "border-color 200ms ease", paddingBottom: 1,
            }}>
              {post.title}
            </span>
          </div>
          <div style={{ fontFamily: "var(--ws-sans)", fontWeight: 300, fontSize: 13, color: "var(--ws-dim)", lineHeight: 1.5 }}>
            {post.excerpt}
          </div>
        </div>
        {/* Tags — from post.tags in content.jsx */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(post.tags || []).map(tag => (
            <span key={tag} className="ws-tag">{tag}</span>
          ))}
        </div>
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 10, color: "var(--ws-dim)", textAlign: "right", opacity: 0.55 }}>
          {calcReadTime(post.body)}m
        </span>
      </a>
    </li>
  );
}

Object.assign(window, { Wordmark, Header, Footer, HomePage, ArchivePage });
