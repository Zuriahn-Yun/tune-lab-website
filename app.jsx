// app.jsx — LLM Tune Lab three-page site
// Pages: home, archive, post. Client routing via useState.

const { useState, useEffect, useRef, useMemo } = React;

// Consistent centered page column used across all sections
const CENTER = { maxWidth: 1100, margin: "0 auto", padding: "0 40px" };

// ─────────────────────────────────────────────────────────────
// Wordmark — LLM Tune Lab logo + wordmark
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
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, fontFamily: "var(--ws-sans)" }}>
        <span className="ll-grad-text" style={{ fontSize: size, fontWeight: 600, letterSpacing: "-0.02em" }}>LLM</span>
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: size - 3, color: "var(--ws-dim)", letterSpacing: "0.04em" }}>tune lab</span>
        {caret && <span className="ws-caret" style={{
          display: "inline-block", width: "0.5em", height: "0.95em",
          background: "var(--ws-accent)", marginLeft: 2, transform: "translateY(0.1em)", opacity: 0.85,
        }} />}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function Header({ route, navigate }) {
  const NavLink = ({ to, label }) => {
    const active = route.name === to || (to === "archive" && route.name === "post");
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: to }); }}
        className="ws-link ws-navlink"
        style={{
          color: active ? "var(--ws-fg)" : "var(--ws-dim)",
          fontFamily: "var(--ws-mono)",
          fontSize: 13,
          textDecoration: "none",
          padding: "4px 0",
        }}
      >
        {label}
      </a>
    );
  };
  return (
    <header style={{ borderBottom: "1px solid var(--ws-rule)" }}>
      <div style={{ ...CENTER, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "home" }); }} style={{ textDecoration: "none" }}>
          <Wordmark size={15} caret={true} withMark={true} />
        </a>
        <nav style={{ display: "flex", gap: 28 }}>
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
    <footer style={{ borderTop: "1px solid var(--ws-rule)", marginTop: 96 }}>
      <div style={{
        ...CENTER,
        padding: "48px 40px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "start",
        fontFamily: "var(--ws-mono)",
        fontSize: 12,
        color: "var(--ws-dim)",
      }}>
        <div>
          <div style={{ marginBottom: 14 }}>
            <Wordmark size={13} caret={false} withMark={true} />
          </div>
          {/* ADD: Your site tagline (1–2 lines shown in the footer) */}
          <div style={{ lineHeight: 1.7, maxWidth: 320 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 18 }}>
            <a className="ws-link" href="#" style={{ color: "var(--ws-dim)" }}>rss</a>
            <a className="ws-link" href="#" style={{ color: "var(--ws-dim)" }}>github</a>
            <a className="ws-link" href="#" style={{ color: "var(--ws-dim)" }}>archive</a>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 14, color: "var(--ws-fg)" }}>// subscribe</div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (val.includes("@")) setSubmitted(true); }}
            style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid var(--ws-rule)", maxWidth: 360 }}
          >
            <span style={{ color: "var(--ws-accent)", paddingRight: 10, alignSelf: "center" }}>{">"}</span>
            <input
              type="email"
              placeholder={submitted ? "subscribed." : "you@domain.tld"}
              value={submitted ? "" : val}
              onChange={(e) => setVal(e.target.value)}
              disabled={submitted}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "var(--ws-fg)", fontFamily: "var(--ws-mono)", fontSize: 13, padding: "10px 0",
              }}
            />
            <button type="submit" className="ws-link" style={{
              background: "transparent", border: "none", color: "var(--ws-dim)",
              fontFamily: "var(--ws-mono)", fontSize: 12, padding: "10px 0 10px 16px", cursor: "pointer",
            }}>
              {submitted ? "✓" : "send →"}
            </button>
          </form>
          <div style={{ marginTop: 14, fontSize: 11, opacity: 0.6 }}>
            One short email per post. No tracking, no list-rental, unsubscribe with one click.
          </div>
        </div>
        <div style={{
          gridColumn: "1 / -1",
          marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--ws-rule)",
          display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.55,
        }}>
          {/* ADD: Update the year and name below */}
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
      {/* Hero */}
      <section style={{ padding: "100px 0 96px", borderBottom: "1px solid var(--ws-rule)", position: "relative", overflow: "hidden" }}>
        {/* Background motif — decorative SVG, mirrors the logo */}
        <svg aria-hidden="true" width="780" height="380" viewBox="0 0 780 380" style={{
          position: "absolute", right: -80, top: 40, opacity: 0.22, pointerEvents: "none",
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
          <g stroke="url(#hero-grad)" strokeWidth="1.2" opacity="0.85">
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
          <div style={{ maxWidth: 720 }}>
            {/* ADD: Status badge — short one-liner above the headline */}
            <div style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)", marginBottom: 32, letterSpacing: "0.04em" }}>
              <span style={{ color: "var(--ws-accent)" }}>●</span> &nbsp; Lorem ipsum · est. 2025
            </div>

            {/*
              ADD: Hero headline.
              Wrap the key phrase in <span className="ll-grad-text">…</span>
              to apply the indigo → violet gradient. Example:
                Your site is about <span className="ll-grad-text">something<br/>important</span>.
            */}
            <h1 style={{
              fontFamily: "var(--ws-sans)", fontSize: 44, lineHeight: 1.18,
              fontWeight: 500, letterSpacing: "-0.02em", margin: 0,
              color: "var(--ws-fg)", textWrap: "balance",
            }}>
              Lorem ipsum dolor sit amet, <span className="ll-grad-text">consectetur<br/>adipiscing</span> elit.
            </h1>

            {/* ADD: Hero subheading — 1–3 sentences describing what this site publishes */}
            <p style={{
              fontFamily: "var(--ws-sans)", fontSize: 16, lineHeight: 1.65,
              color: "var(--ws-dim)", marginTop: 28, maxWidth: 560,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
            </p>

            {/* CTA links — "read latest" is hidden until at least one post exists */}
            <div style={{ marginTop: 44, display: "flex", gap: 28, alignItems: "center", fontFamily: "var(--ws-mono)", fontSize: 13 }}>
              {recent.length > 0 && (
                <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: recent[0].slug }); }}
                   className="ws-link" style={{ color: "var(--ws-fg)" }}>
                  read latest →
                </a>
              )}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "archive" }); }}
                 className="ws-link" style={{ color: "var(--ws-dim)" }}>
                browse archive
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section style={{ padding: "72px 0 0" }}>
        <div style={CENTER}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)",
              fontWeight: 400, margin: 0, letterSpacing: "0.06em", textTransform: "lowercase",
            }}>
              // recent
            </h2>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate({ name: "archive" }); }}
               className="ws-link"
               style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)" }}>
              all posts ({POSTS.length}) →
            </a>
          </div>
          {/* Posts come from the POSTS array in content.jsx */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recent.length > 0 ? (
              recent.map((p, i) => <PostRow key={p.slug} post={p} navigate={navigate} first={i === 0} />)
            ) : (
              <li style={{
                padding: "40px 4px",
                borderTop: "1px solid var(--ws-rule)",
                borderBottom: "1px solid var(--ws-rule)",
                fontFamily: "var(--ws-mono)", fontSize: 13, color: "var(--ws-dim)",
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
// PostRow — list item used on Home (recent posts)
// ─────────────────────────────────────────────────────────────
function PostRow({ post, navigate, first }) {
  const [hover, setHover] = useState(false);
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ borderTop: first ? "1px solid var(--ws-rule)" : "none", borderBottom: "1px solid var(--ws-rule)" }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: post.slug }); }}
        style={{
          display: "grid", gridTemplateColumns: "120px 1fr auto",
          gap: 36, padding: "26px 4px", alignItems: "baseline",
          textDecoration: "none", color: "inherit",
          transition: "background 200ms ease",
          background: hover ? "rgba(255,255,255,0.015)" : "transparent",
        }}
      >
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)", letterSpacing: "0.02em" }}>
          {fmtDateShort(post.date)}
        </span>
        <div>
          <div style={{
            fontFamily: "var(--ws-sans)", fontSize: 19, color: "var(--ws-fg)",
            fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 8,
          }}>
            <span style={{
              borderBottom: hover ? "1px solid var(--ws-accent)" : "1px solid transparent",
              transition: "border-color 200ms ease", paddingBottom: 2,
            }}>
              {post.title}
            </span>
          </div>
          <div style={{ fontFamily: "var(--ws-sans)", fontSize: 14, color: "var(--ws-dim)", lineHeight: 1.55, maxWidth: 620 }}>
            {post.excerpt}
          </div>
        </div>
        {/* Tags + read time — populated from content.jsx */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)" }}>
          {(post.tags || []).map(tag => (
            <span key={tag} style={{ border: "1px solid var(--ws-rule)", padding: "2px 8px", borderRadius: 2, color: "var(--ws-dim2)" }}>
              {tag}
            </span>
          ))}
          <span style={{ opacity: 0.7 }}>{calcReadTime(post.body)} min</span>
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
  // Filter by tag — a post matches if any of its tags equals the selected tag
  const filtered = filter === "All" ? POSTS : POSTS.filter(p => (p.tags || []).includes(filter));
  const allTags = getAllTags(); // derived from POSTS in content.jsx

  // Group by year
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
    <div style={{ padding: "72px 0 0" }}>
      <div style={{ ...CENTER, maxWidth: 960, margin: "0 auto" }}>

        <div style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)", marginBottom: 16, letterSpacing: "0.04em" }}>
          // archive
        </div>

        {/* ADD: Archive page headline */}
        <h1 style={{
          fontFamily: "var(--ws-sans)", fontSize: 32, fontWeight: 500,
          letterSpacing: "-0.02em", color: "var(--ws-fg)", margin: 0, marginBottom: 12,
        }}>
          Lorem ipsum dolor sit amet.
        </h1>

        {/* Post count updates automatically as you add posts to content.jsx */}
        <p style={{
          fontFamily: "var(--ws-sans)", fontSize: 15, color: "var(--ws-dim)",
          lineHeight: 1.6, margin: 0, marginBottom: 40, maxWidth: 540,
        }}>
          {POSTS.length > 0
            ? `${POSTS.length} post${POSTS.length === 1 ? "" : "s"} · sorted newest first.`
            : "No posts yet — add your first entry to content.jsx."}
        </p>

        {/* Filter chips — tags are auto-derived from posts in content.jsx */}
        {allTags.length > 1 && (
          <div style={{
            display: "flex", gap: 8, marginBottom: 56, paddingBottom: 24,
            borderBottom: "1px solid var(--ws-rule)", flexWrap: "wrap",
          }}>
            {allTags.map(tag => {
              const active = filter === tag;
              const count = tag === "All" ? POSTS.length : POSTS.filter(p => (p.tags || []).includes(tag)).length;
              return (
                <button key={tag} onClick={() => setFilter(tag)} style={{
                  fontFamily: "var(--ws-mono)", fontSize: 12, padding: "6px 12px",
                  border: `1px solid ${active ? "var(--ws-fg)" : "var(--ws-rule)"}`,
                  background: active ? "var(--ws-fg)" : "transparent",
                  color: active ? "var(--ws-bg)" : "var(--ws-dim)",
                  borderRadius: 2, cursor: "pointer", transition: "all 150ms ease", letterSpacing: "0.02em",
                }}>
                  {tag.toLowerCase()} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grouped list — auto-groups by year as you add posts */}
        {years.length === 0 && (
          <div style={{
            padding: "48px 0", fontFamily: "var(--ws-mono)", fontSize: 13, color: "var(--ws-dim)",
            borderTop: allTags.length <= 1 ? "1px solid var(--ws-rule)" : "none",
          }}>
            no posts yet — add your first entry to <code style={{ color: "var(--ws-accent)" }}>content.jsx</code>
          </div>
        )}
        {years.map(year => (
          <section key={year} style={{ marginBottom: 64 }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 36, marginBottom: 8, alignItems: "baseline" }}>
              <h2 style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)", fontWeight: 400, margin: 0, letterSpacing: "0.04em" }}>
                {year} <span style={{ opacity: 0.5 }}>·</span> <span style={{ opacity: 0.7 }}>{byYear[year].length}</span>
              </h2>
              <div style={{ borderTop: "1px solid var(--ws-rule)" }} />
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
      style={{ borderBottom: "1px solid var(--ws-rule)" }}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate({ name: "post", slug: post.slug }); }}
        style={{
          display: "grid", gridTemplateColumns: "120px 1fr auto 60px",
          gap: 36, padding: "20px 4px", alignItems: "baseline",
          textDecoration: "none", color: "inherit",
          transition: "background 200ms ease",
          background: hover ? "rgba(255,255,255,0.015)" : "transparent",
        }}
      >
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 12, color: "var(--ws-dim)" }}>
          {post.date.slice(5)}
        </span>
        <div>
          <div style={{ fontFamily: "var(--ws-sans)", fontSize: 16, color: "var(--ws-fg)", fontWeight: 500, letterSpacing: "-0.005em", marginBottom: 4 }}>
            <span style={{
              borderBottom: hover ? "1px solid var(--ws-accent)" : "1px solid transparent",
              transition: "border-color 200ms ease", paddingBottom: 2,
            }}>
              {post.title}
            </span>
          </div>
          <div style={{ fontFamily: "var(--ws-sans)", fontSize: 13, color: "var(--ws-dim)", lineHeight: 1.5 }}>
            {post.excerpt}
          </div>
        </div>
        {/* Tags — from post.tags in content.jsx */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {(post.tags || []).map(tag => (
            <span key={tag} style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim2)" }}>
              {tag.toLowerCase()}
            </span>
          ))}
        </div>
        <span style={{ fontFamily: "var(--ws-mono)", fontSize: 11, color: "var(--ws-dim)", textAlign: "right", opacity: 0.7 }}>
          {calcReadTime(post.body)}m
        </span>
      </a>
    </li>
  );
}

Object.assign(window, { Wordmark, Header, Footer, HomePage, ArchivePage });
