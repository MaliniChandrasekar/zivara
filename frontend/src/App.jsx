import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import {
  CoutureShowcase,
  FitComparison,
  JournalAndFaq,
  ServiceCollectionModal,
  TestimonialCarousel,
  TransformationStories,
} from "./components/store/ExperienceSections";

const services = [
  [
    "✦",
    "Designer Blouses",
    "Bridal, aari, maggam and contemporary cuts made to your measurements.",
  ],
  [
    "◒",
    "Aari Work",
    "Traditional and contemporary Aari patterns finished with fine handcrafted detail.",
  ],
  [
    "♢",
    "Embroidery Work",
    "Elegant thread, bead and motif embroidery designed around your blouse and occasion.",
  ],
  [
    "⌁",
    "Chudi & Maxi",
    "Custom-stitched churidars and maxi dresses designed to your measurements.",
  ],
];
const designs = [
  { name: "Floral Tiered Maxi", category: "Maxi Dress", tag: "New", imageUrl: "/api/design-assets/studio-edit-maxi-4d597b5d.webp" },
  { name: "Grand Birthday Gown", category: "Baby Dresses", tag: "Atelier Pick", imageUrl: "/api/design-assets/studio-edit-babygown-706f239f.webp" },
  { name: "Mom & Daughter Maxi Combo", category: "Matching Sets", tag: "New", imageUrl: "/api/design-assets/studio-edit-mom-daughter-47775fdc.webp" },
  { name: "Keyhole Back Blouse", category: "Pattern Blouse", tag: "Signature", imageUrl: "/api/design-assets/blouse-08-1-8bd814ab.webp" },
  { name: "Bridal Aari Blouse", category: "Aari Work", tag: "Bestseller", imageUrl: "/api/design-assets/studio-edit-aari-b4d27c0f.webp" },
  { name: "Wine Embroidered Blouse", category: "Embroidery Work", tag: "Signature", imageUrl: "/api/design-assets/studio-edit-emb-c178e55c.webp" },
];
const showFabricSection = false;
const showStoriesSection = false;
const showCoutureSection = false;
const showTestimonialSection = false;
const showProcessSection = false;
const nav = [
  "Overview",
  "Orders",
  "Customers",
  "Enquiries",
  "Feedback",
];

function Logo({ light = false, compact = false }) {
  if (compact) {
    return (
      <a className="logo logo-inline" href="/" aria-label="Zivara Design Studio home">
        <img className="logo-mark" src="/zivara-mark.webp" alt="" />
        <div>
          <b>Zivara</b>
          <small>Design Studio</small>
        </div>
      </a>
    );
  }
  return (
    <a
      className={"logo brand-logo " + (light ? "light" : "")}
      href="/"
      aria-label="Zivara Design Studio home"
    >
      <img
        src="/zivara-official-logo.webp"
        alt="Zivara Design Studio Ladies Boutique"
      />
    </a>
  );
}

function Store() {
  const [form, setForm] = useState({
      name: "",
      phone: "",
      rating: 5,
      message: "",
    }),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [collectionModal, setCollectionModal] = useState(null),
    [menu, setMenu] = useState(false),
    [tilt, setTilt] = useState({ x: 0, y: 0 }),
    [loading, setLoading] = useState(
      () => !sessionStorage.getItem("zivara-intro-seen"),
    ),
    [shopInfo, setShopInfo] = useState({
      address: "No. 41 K, Salai Pudur, Bypass Rd, Thikathir, Madurai, Tamil Nadu 625018",
      phone: "+91 82203 64840",
      hours: "Mon–Sat · 10:00 AM–8:00 PM",
    }),
    progressRef = useRef(null),
    spotRef = useRef(null),
    cursorRef = useRef(null);
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((body) => body.success && setShopInfo(body.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const items = document.querySelectorAll(
      ".section,.collection,.testimonial,.contact,.atelier-story,.promise-strip",
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("in-view"),
        ),
      { threshold: 0.08 },
    );
    items.forEach((x) => observer.observe(x));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("zivara-intro-seen", "1");
    }, 2450);
    return () => clearTimeout(timer);
  }, [loading]);
  useEffect(() => {
    const scroll = () => {
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight) || 0})`;
    };
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name,
      phone: form.phone,
      service: "Feedback",
      rating: form.rating,
      message: form.message,
      source: "Feedback Widget",
    };
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw Error();
    } catch {
      localStorage.setItem(
        "zivara-last-feedback",
        JSON.stringify({ ...payload, createdAt: new Date() }),
      );
    }
    setBusy(false);
    setSent(true);
  };
  const moveCursor = (e) => {
    const el = cursorRef.current;
    if (el) {
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      el.classList.toggle(
        "active",
        Boolean(e.target.closest("a,button,.design-art,.service-grid article")),
      );
    }
    if (spotRef.current)
      spotRef.current.style.transform = `translate3d(${e.clientX - 220}px,${e.clientY - 220}px,0)`;
  };
  const scrollToSection = (id, e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      className={`store theme-banner ${loading ? "is-loading" : ""}`}
      onMouseMove={moveCursor}
    >
      <div className="scroll-progress" ref={progressRef} />
      <div className="ambient-spot" ref={spotRef} />
      <div className="luxury-cursor" ref={cursorRef}>
        <span />
      </div>
      {loading && (
        <div className="premium-loader">
          <div className="loader-thread">
            <i />
            <b />
          </div>
          <div className="loader-brand">
            <img src="/zivara-official-logo.webp" alt="Zivara Design Studio" />
          </div>
          <div className="loader-progress">
            <i />
          </div>
          <p>CRAFTING YOUR EXPERIENCE</p>
        </div>
      )}
      <header className={"site-header wrap" + (menu ? " nav-open" : "")}>
        <Logo compact />
        <button
          className="menu"
          aria-label="Open navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          ☰
        </button>
        <nav className={menu ? "open" : ""}>
          <a href="#home" onClick={(e) => { scrollToSection("home", e); setMenu(false); }}>
            Home
          </a>
          <a href="#designs" onClick={(e) => { scrollToSection("designs", e); setMenu(false); }}>
            Our Work
          </a>
          <a href="#services" onClick={(e) => { scrollToSection("services", e); setMenu(false); }}>
            Designs
          </a>
          <a href="#atelier" onClick={(e) => { scrollToSection("atelier", e); setMenu(false); }}>
            About Us
          </a>
          <a href="#journal" onClick={(e) => { scrollToSection("journal", e); setMenu(false); }}>
            FAQ
          </a>
          <a href="#contact" onClick={(e) => { scrollToSection("contact", e); setMenu(false); }}>
            Contact
          </a>
        </nav>
        <div className="header-actions">
          <a
            className="pill dark"
            href="https://www.google.com/maps/place/Zivara+Design+Studio/@9.9439657,78.0996304,17z/data=!4m6!3m5!1s0x3b00cf60ad5dd237:0xb7440d08286f3d6e!8m2!3d9.9439657!4d78.0996304!16s%2Fg%2F11zdhwn9yd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Our Shop
          </a>
        </div>
      </header>
      <main>
        <section
          id="home"
          className="hero"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({
              x: (e.clientX - r.left - r.width / 2) / r.width,
              y: (e.clientY - r.top - r.height / 2) / r.height,
            });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div className="grain" />
          <div className="orb one" />
          <div className="orb two" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">— DESIGNED &amp; STITCHED FOR YOU</div>
              <h1>
                Your style.
                <br />
                <em>Your perfect fit.</em>
              </h1>
              <p>
                Blouses, maxi dresses, chudis, baby dresses, Aari work and
                embroidery—every piece crafted to your measurements with the
                detail it deserves.
              </p>
            </div>
            <div
              className="hero-art"
              style={{
                "--rx": `${-tilt.y * 6}deg`,
                "--ry": `${tilt.x * 7}deg`,
              }}
            >
              <div className="arch model-arch">
                <img
                  className="maxi-model"
                  src="/zivara-maxi-hero.png"
                  alt="Woman wearing a custom multicolour maxi dress by Zivara Design Studio"
                />
                <span className="note n1">✦ CUSTOM DESIGNED</span>
                <span className="note n2">PERFECT FIT</span>
              </div>
            </div>
          </div>
        </section>
        <section id="designs" className="collection">
          <div className="wrap">
            <Heading
              eyebrow="OUR SPECIALTIES"
              title="Everything we craft, in one place."
            />
            <div className="design-grid">
              {designs.map((d, i) => (
                <article key={d.name + i} style={{ "--stagger": `${i * 130}ms` }}>
                  <div className={"design-art art" + (i % 3)}>
                    {d.tag && <span>{d.tag}</span>}
                    <img src={d.imageUrl} alt={d.name} loading="lazy" />
                    <div className="design-number">0{i + 1}</div>
                  </div>
                  <small>{d.category}</small>
                  <div>
                    <h3>{d.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="services" className="section wrap">
          <Heading
            eyebrow="OUR DESIGN COLLECTIONS"
            title="Designs, made to fit you."
            text="Browse our blouse, Aari, embroidery and chudi & maxi collections, then let us tailor your favourite to your exact measurements."
          />
          <div className="service-grid">
            {services.map((s, i) => (
              <article className={i === 2 ? "featured" : ""} key={s[1]}>
                <div>
                  <span>{s[0]}</span>
                  <small>0{i + 1}</small>
                </div>
                <h3>{s[1]}</h3>
                <p>{s[2]}</p>
                <footer>
                  <button type="button" onClick={() => setCollectionModal(s[1])}>
                    View Designs →
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>
        <section id="atelier" className="atelier-story">
          <div className="atelier-visual">
            <div className="atelier-frame">
              <img src="/zivara-shop-interior.webp" alt="Zivara Design Studio shop interior" />
              <small>
                THE HANDS BEHIND
                <br />
                EVERY DETAIL
              </small>
            </div>
            <div className="seal">
              <span>Z</span>
              <small>EST. 2025</small>
            </div>
            <div className="atelier-accent">
              <img
                src="/zivara-atelier-accent.webp"
                alt="Zivara tailors at work in the studio"
              />
            </div>
          </div>
          <div className="atelier-copy">
            <h2>
              Where patience
              <br />
              becomes <em>beauty.</em>
            </h2>
            <p>
              Every Zivara piece passes through the hands of skilled
              artisans—from the first chalk line to the final hand-finished
              stitch.
            </p>
            <blockquote>
              “We don't simply stitch a garment. We study how you move, how you
              celebrate and how you want to feel.”
            </blockquote>
            <div className="signature">
              <span>Zivara</span>
              <small>OUR TAILORING TEAM</small>
            </div>
          </div>
        </section>
        {showFabricSection && (
          <section className="material-section section">
            <div className="wrap">
              <div className="material-head">
                <div>
                  <div className="eyebrow">A WORLD OF TEXTURE</div>
                  <h2>
                    Begin with the
                    <br />
                    <em>perfect canvas.</em>
                  </h2>
                </div>
                <p>
                  Curated fabrics selected for their drape, comfort and
                  character. Touch and compare them when you visit us.
                </p>
              </div>
              <div className="swatch-grid">
                {[
                  ["K", "Kanchipuram Silk", "Heritage · Lustrous", "silk"],
                  ["V", "Velvet", "Evening · Rich", "velvet"],
                  ["O", "Organza", "Airy · Sculptural", "organza"],
                  ["L", "Pure Linen", "Natural · Timeless", "linen"],
                ].map((x, i) => (
                  <article key={x[1]}>
                    <div className={"swatch " + x[3]}>
                      <span>{x[0]}</span>
                      <i>0{i + 1}</i>
                    </div>
                    <h3>{x[1]}</h3>
                    <p>{x[2]}</p>
                  </article>
                ))}
              </div>
              <div className="material-note">
                <span>✦</span> Fabric sourcing available for custom and
                bridal orders <a href="#contact" onClick={(e) => scrollToSection("contact", e)}>Ask our designer →</a>
              </div>
            </div>
          </section>
        )}
        {showProcessSection && (
          <section id="process" className="section wrap process">
            <div>
              <div className="eyebrow">HOW IT WORKS</div>
              <h2>
                Your perfect fit,
                <br />
                <em>without the fuss.</em>
              </h2>
              <p>
                Clear updates from consultation to collection. You always know
                what happens next.
              </p>
              <a
                href="https://www.google.com/maps/place/Zivara+Design+Studio/@9.9439657,78.0996304,17z/data=!4m6!3m5!1s0x3b00cf60ad5dd237:0xb7440d08286f3d6e!8m2!3d9.9439657!4d78.0996304!16s%2Fg%2F11zdhwn9yd"
                target="_blank"
                rel="noopener noreferrer"
                className="pill dark"
              >
                Visit Our Shop
              </a>
            </div>
            <div className="steps">
              {[
                ["Share your idea", "Send a reference or tell us the occasion."],
                ["Measure & design", "Precise measurements and fabric guidance."],
                [
                  "Trial & refine",
                  "A dedicated fitting ensures comfort and balance.",
                ],
                [
                  "Collect & shine",
                  "Quality-checked and ready on the promised date.",
                ],
              ].map((x, i) => (
                <article key={x[0]}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{x[0]}</h3>
                    <p>{x[1]}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {showCoutureSection && <CoutureShowcase />}
        <FitComparison />
        {showStoriesSection && <TransformationStories />}
        {showTestimonialSection && (
          <>
            <TestimonialCarousel />
            <section className="promise-strip">
              <div className="wrap">
                {[
                  ["01", "Private consultation"],
                  ["02", "Personal measurements"],
                  ["03", "Transparent timelines"],
                  ["04", "One perfect fit"],
                ].map((x) => (
                  <div key={x[0]}>
                    <small>{x[0]}</small>
                    <span>{x[1]}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        <JournalAndFaq />
        <section id="contact" className="contact">
          <div className="wrap contact-grid">
            <div className="contact-copy">
              <div className="eyebrow">LET'S CREATE TOGETHER</div>
              <h2>Tell us what you're dreaming of.</h2>
              <p>
                Share a few details. Our designer will call within one business
                day.
              </p>
              {[
                ["⌖", "Visit our shop", shopInfo.address],
                ["☎", "Call or WhatsApp", shopInfo.phone],
                ["◷", "Shop hours", shopInfo.hours],
              ].map((x) => (
                <div className="detail" key={x[1]}>
                  <span>{x[0]}</span>
                  <p>
                    <b>{x[1]}</b>
                    {x[2]}
                  </p>
                </div>
              ))}
              <div className="contact-map">
                <iframe
                  title="Zivara Design Studio location"
                  src="https://www.google.com/maps?q=9.9439657,78.0996304&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <form onSubmit={submit}>
              {sent ? (
                <div className="success">
                  <span>✓</span>
                  <h3>Thank you, {form.name}!</h3>
                  <p>We really appreciate you taking the time to share your feedback.</p>
                  <button
                    type="button"
                    className="pill dark"
                    onClick={() => setSent(false)}
                  >
                    Share more feedback
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-head">
                    <div>
                      <small>SHARE YOUR EXPERIENCE</small>
                      <h3>Leave us feedback</h3>
                    </div>
                    <span>✦</span>
                  </div>
                  <div className="form-row">
                    <Field label="Your name">
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Phone number">
                    <input
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      pattern="[0-9+() ]{10,}"
                      title="Enter at least 10 digits; spaces, + and brackets are allowed"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Your rating">
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          className={n <= form.rating ? "active" : ""}
                          onClick={() => setForm({ ...form, rating: n })}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Tell us about your experience">
                    <textarea
                      required
                      rows="3"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </Field>
                  <button disabled={busy} className="pill gold submit">
                    {busy ? "Saving…" : "Submit feedback →"}
                  </button>
                  <small className="privacy">
                    Your details stay private with Zivara.
                  </small>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <nav className="mobile-dock">
        <a href="#services" onClick={(e) => scrollToSection("services", e)}>
          <span>✦</span>Services
        </a>
        <a href="#designs" onClick={(e) => scrollToSection("designs", e)}>
          <span>♢</span>Designs
        </a>
        <a href="#contact" className="dock-main" onClick={(e) => scrollToSection("contact", e)}>
          <span>＋</span>Book
        </a>
        <a href="tel:+918220364840">
          <span>☎</span>Call
        </a>
        <a href="https://wa.me/918220364840">
          <span>◉</span>Chat
        </a>
      </nav>
      <a
        className="whatsapp instagram-float"
        href="https://www.instagram.com/zivara_design_studio_/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zivara Design Studio on Instagram"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47a4.9 4.9 0 0 0-1.77 1.15A4.9 4.9 0 0 0 2.53 5.45c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43a4.9 4.9 0 0 0 1.15 1.77 4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77A4.9 4.9 0 0 0 18.55 2.53c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.85.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.13.35.3.87.34 1.85.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.21 1.5-.34 1.85-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.35.13-.87.3-1.85.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.21-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.13-.35-.3-.87-.34-1.85-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.21-1.5.34-1.85.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.35-.13.87-.3 1.85-.34C9.01 3.81 9.33 3.8 12 3.8zm0 3.06a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28zm0 8.48a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68zm6.54-8.68a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
        </svg>
      </a>
      <a
        className="whatsapp"
        href="https://wa.me/918220364840"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Zivara Design Studio on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12.01 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38A9.96 9.96 0 0 0 12.01 22C17.52 22 22 17.52 22 12S17.52 2 12.01 2zm0 18.13c-1.62 0-3.13-.44-4.43-1.2l-.32-.19-3.12.82.83-3.04-.2-.31a8.1 8.1 0 0 1-1.25-4.31c0-4.5 3.66-8.15 8.16-8.15 4.49 0 8.14 3.66 8.14 8.15s-3.65 8.23-8.11 8.23zm4.47-6.1c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
        </svg>
      </a>
      <ServiceCollectionModal
        key={collectionModal || "closed"}
        service={collectionModal}
        onClose={() => setCollectionModal(null)}
      />
    </div>
  );
}
function Heading({ eyebrow, title, text }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}

function Admin({ logout }) {
  const [active, setActiveRaw] = useState(
      () => sessionStorage.getItem("zivara-admin-active") || "Overview",
    ),
    setActive = (tab) => {
      sessionStorage.setItem("zivara-admin-active", tab);
      setActiveRaw(tab);
    },
    [q, setQ] = useState(""),
    [side, setSide] = useState(false),
    [newEnquiryCount, setNewEnquiryCount] = useState(0);
  useEffect(() => {
    const token = sessionStorage.getItem("zivara-admin-token");
    fetch("/api/enquiries?status=New&serviceNot=Feedback&limit=1", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((body) => body.success && setNewEnquiryCount(body.total))
      .catch(() => {});
  }, [active]);
  return (
    <div className="admin">
      <aside className={side ? "show" : ""}>
        <Logo light />
        <button className="side-close" onClick={() => setSide(false)}>
          ×
        </button>
        <div className="workspace">
          <span>ZS</span>
          <div>
            <b>Zivara Studio</b>
            <small>Business workspace</small>
          </div>
        </div>
        <small>WORKSPACE</small>
        <nav>
          {nav.map((n, i) => (
            <button
              className={active === n ? "active" : ""}
              onClick={() => {
                setActive(n);
                setSide(false);
              }}
              key={n}
            >
              <span>{["⌂", "◇", "♙", "✉", "★"][i]}</span>
              {n}
              {n === "Enquiries" && newEnquiryCount > 0 && <b>{newEnquiryCount}</b>}
            </button>
          ))}
        </nav>
        <small>BUSINESS</small>
        <nav>
          <button
            className={active === "Payments" ? "active" : ""}
            onClick={() => {
              setActive("Payments");
              setSide(false);
            }}
          >
            ▤ Payments
          </button>
          <button
            className={active === "Settings" ? "active" : ""}
            onClick={() => {
              setActive("Settings");
              setSide(false);
            }}
          >
            ⚙ Settings
          </button>
        </nav>
        <div className="profile">
          <span>AK</span>
          <div>
            <b>Anitha Kumar</b>
            <small>Administrator</small>
          </div>
        </div>
      </aside>
      <div className="admin-main">
        <header>
          <button className="side-open" onClick={() => setSide(true)}>
            ☰
          </button>
          <div>
            <h1>{active}</h1>
            <p>Studio operations centre</p>
          </div>
          <div className="admin-actions">
            {active !== "Payments" && active !== "Settings" && (
              <label>
                ⌕{" "}
                <input
                  placeholder={`Search ${active.toLowerCase()}...`}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </label>
            )}
            <a href="/">View store ↗</a>
            <button onClick={logout}>Log out</button>
          </div>
        </header>
        <main>
          {active === "Overview" ? (
            <Overview go={setActive} />
          ) : active === "Payments" ? (
            <Payments />
          ) : active === "Settings" ? (
            <Settings />
          ) : (
            <Manager name={active} search={q} />
          )}
        </main>
        <nav className="admin-mobile-nav">
          {nav.slice(0, 5).map((n, i) => (
            <button
              className={active === n ? "active" : ""}
              onClick={() => setActive(n)}
              key={n}
            >
              <span>{["⌂", "◇", "♙", "✉", "★"][i]}</span>
              {n === "Overview" ? "Home" : n}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
function Overview({ go }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    token = sessionStorage.getItem("zivara-admin-token");
  const load = () => {
    fetch("/api/overview/summary", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((body) => {
        if (!body.success) throw Error(body.message);
        setData(body.data);
      })
      .catch((e) => setError(e.message || "Failed to load overview"));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps
  const advanceOrder = async (orderNumber) => {
    const order = data.recentOrders.find((o) => o.id === orderNumber);
    const next = { New: "Cutting", Cutting: "Stitching", Stitching: "Trial", Trial: "Ready", Ready: "Delivered" }[order.status] || "Delivered";
    await fetch(`/api/orders?search=${encodeURIComponent(orderNumber)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((body) => body.data?.[0] && fetch(`/api/orders/${body.data[0]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: next }),
      }))
      .then(load)
      .catch(() => {});
  };
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  if (error) return <div className="crud-error">⚠ {error}</div>;
  if (!data) return <div className="crud-loading"><span /><p>Loading overview…</p></div>;
  const maxProgress = Math.max(1, ...data.progress.map((p) => p.count));
  return (
    <>
      <section className="welcome">
        <small>GOOD MORNING, ANITHA</small>
        <h2>
          Here's what needs your
          <br />
          attention today.
        </h2>
        <p>{data.dueThisWeek} deliveries due this week and {data.newEnquiries} new enquiries waiting.</p>
        <i>✦</i>
        <button onClick={() => go("Orders")}>View orders →</button>
      </section>
      <section className="metrics">
        <article>
          <span>↗</span>
          <small>Revenue this month</small>
          <strong>{money(data.revenueThisMonth)}</strong>
          <em>{data.revenueChangePercent == null ? "—" : `${data.revenueChangePercent > 0 ? "+" : ""}${data.revenueChangePercent}%`}</em>
        </article>
        <article>
          <span>◇</span>
          <small>Active orders</small>
          <strong>{data.activeOrdersCount}</strong>
          <em>{data.dueThisWeek} due this week</em>
        </article>
        <article>
          <span>♙</span>
          <small>Total customers</small>
          <strong>{data.totalCustomers}</strong>
          <em>+{data.customersThisMonth} this month</em>
        </article>
        <article>
          <span>✉</span>
          <small>New enquiries</small>
          <strong>{data.newEnquiries}</strong>
          <em>{data.newEnquiries ? "Needs response" : "All caught up"}</em>
        </article>
      </section>
      <div className="dash-grid">
        <Panel
          title="Recent orders"
          sub="Track production and delivery"
          action={() => go("Orders")}
        >
          {data.recentOrders.length ? (
            <OrderTable orders={data.recentOrders} advance={advanceOrder} />
          ) : (
            <div className="empty">
              <span>✦</span>
              <h3>No orders yet</h3>
              <p>Orders you create will show up here.</p>
            </div>
          )}
        </Panel>
        <Panel title="Order progress" sub="Current production pipeline">
          {data.progress.map((p, i) => (
            <div className="bar" key={p.status}>
              <span>{p.status}</span>
              <div>
                <i style={{ width: (p.count / maxProgress) * 100 + "%" }} className={"b" + i} />
              </div>
              <b>{p.count}</b>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Quick actions" sub="Common studio tasks">
        <div className="quick">
          <button onClick={() => go("Orders")}>
            <span>＋</span>New order
          </button>
          <button onClick={() => go("Customers")}>
            <span>♙</span>Add customer
          </button>
        </div>
      </Panel>
    </>
  );
}
function Panel({ title, sub, children, action }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p>{sub}</p>
        </div>
        {action && <button onClick={action}>View all →</button>}
      </div>
      {children}
    </section>
  );
}
function OrderTable({ orders, advance }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ORDER</th>
            <th>CUSTOMER</th>
            <th>ITEM</th>
            <th>DUE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <b>{o.id}</b>
              </td>
              <td>
                <span className="avatar">{o.customer[0]}</span>
                {o.customer}
              </td>
              <td>{o.item}</td>
              <td>{o.date}</td>
              <td>
                <b>{o.amount}</b>
              </td>
              <td>
                <button
                  className={"status " + o.status.toLowerCase()}
                  onClick={() => advance(o.id)}
                >
                  {o.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Payments() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [range, setRange] = useState({ from: "", to: "" }),
    token = sessionStorage.getItem("zivara-admin-token");
  useEffect(() => {
    const params = new URLSearchParams();
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
    fetch(`/api/payments/summary?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((body) => {
        if (!body.success) throw Error(body.message);
        setData(body.data);
      })
      .catch((e) => setError(e.message || "Failed to load payments"));
  }, [range.from, range.to]); // eslint-disable-line react-hooks/exhaustive-deps
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  if (error)
    return (
      <div className="crud-error">
        ⚠ {error}
      </div>
    );
  return (
    <>
      <section className="payments-filter">
        <label>
          <small>Due date from</small>
          <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
        </label>
        <label>
          <small>Due date to</small>
          <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
        </label>
        {(range.from || range.to) && (
          <button type="button" onClick={() => setRange({ from: "", to: "" })}>
            Clear filter
          </button>
        )}
      </section>
      {!data ? (
        <div className="crud-loading"><span /><p>Loading payments…</p></div>
      ) : (
        <>
          <section className="metrics">
            <article>
              <span>◇</span>
              <small>Total order value</small>
              <strong>{money(data.totalAmount)}</strong>
            </article>
            <article>
              <span>↗</span>
              <small>Collected</small>
              <strong>{money(data.totalCollected)}</strong>
            </article>
            <article>
              <span>✉</span>
              <small>Pending dues</small>
              <strong>{money(data.totalPending)}</strong>
            </article>
          </section>
          <Panel title="Orders with dues" sub="Sorted by due date, soonest first">
        {data.orders.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>GARMENT</th>
                  <th>DUE DATE</th>
                  <th>AMOUNT</th>
                  <th>ADVANCE</th>
                  <th>DUE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.orderNumber}>
                    <td><b>{o.orderNumber}</b></td>
                    <td>{o.customer}</td>
                    <td>{o.garment}</td>
                    <td>{o.dueDate ? new Date(o.dueDate).toLocaleDateString("en-IN") : "—"}</td>
                    <td>{money(o.amount)}</td>
                    <td>{money(o.advancePaid)}</td>
                    <td><b>{money(o.due)}</b></td>
                    <td>
                      <span className="data-status">{o.paymentStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span>✦</span>
            <h3>No pending dues</h3>
            <p>Every active order is fully paid.</p>
          </div>
        )}
          </Panel>
        </>
      )}
    </>
  );
}
function Settings() {
  const token = sessionStorage.getItem("zivara-admin-token"),
    [form, setForm] = useState({ address: "", phone: "", hours: "" }),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [toast, setToast] = useState(""),
    [error, setError] = useState(""),
    [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" }),
    [pwSaving, setPwSaving] = useState(false),
    [pwError, setPwError] = useState(""),
    [pwModalOpen, setPwModalOpen] = useState(false);
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((body) => body.success && setForm(body.data))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);
  const saveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const body = await r.json();
      if (!r.ok) throw Error(body.message);
      setToast("Business info updated");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };
  const changePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pw.newPassword !== pw.confirm) return setPwError("New passwords don't match");
    setPwSaving(true);
    try {
      const r = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pw),
      });
      const body = await r.json();
      if (!r.ok) throw Error(body.message);
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwModalOpen(false);
      setToast("Password updated");
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwSaving(false);
    }
  };
  if (loading) return <div className="crud-loading"><span /><p>Loading settings…</p></div>;
  return (
    <>
      <form onSubmit={saveInfo}>
        <FormGroup title="Business info" description="Shown on the public store's Contact section">
          <label>
            <FieldLabel label="Shop address" />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label>
            <FieldLabel label="Phone" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            <FieldLabel label="Shop hours" />
            <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
          </label>
        </FormGroup>
        {error && (
          <div className="crud-error">
            ⚠ {error}
          </div>
        )}
        <button className="primary" disabled={saving}>
          {saving ? "Saving…" : "Save business info"}
        </button>
      </form>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Change password</h3>
            <p>Used to sign in to this admin dashboard</p>
          </div>
          <button className="primary" onClick={() => setPwModalOpen(true)}>
            Change password
          </button>
        </div>
      </section>
      {pwModalOpen &&
        createPortal(
          <div className="mini-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setPwModalOpen(false)}>
            <form className="mini-modal" onSubmit={changePassword}>
              <div className="mini-modal-head">
                <h3>Change password</h3>
                <button type="button" onClick={() => setPwModalOpen(false)}>×</button>
              </div>
              <div className="group-fields">
                <label>
                  <FieldLabel label="Current password" />
                  <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
                </label>
                <label>
                  <FieldLabel label="New password" />
                  <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={6} />
                </label>
                <label>
                  <FieldLabel label="Confirm new password" />
                  <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required minLength={6} />
                </label>
              </div>
              {pwError && (
                <div className="crud-error">
                  ⚠ {pwError}
                </div>
              )}
              <div className="mini-modal-foot">
                <button type="button" onClick={() => setPwModalOpen(false)}>
                  Cancel
                </button>
                <button className="primary" disabled={pwSaving}>
                  {pwSaving ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </div>,
          document.body,
        )}
      {toast && <div className="crud-toast">✓ {toast}</div>}
    </>
  );
}
const measurements = [
  "size",
  "bust",
  "underBust",
  "waist",
  "hip",
  "shoulder",
  "armhole",
  "neckFront",
  "neckBack",
  "length",
  "sleeve",
  "sleeveRound",
];
const configs = {
  Customers: {
    endpoint: "customers",
    title: "Customer",
    columns: [
      ["name", "Customer"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["measurements.size", "Size"],
      ["totalOrders", "Orders"],
      ["createdAt", "Joined"],
    ],
    fields: [
      ["name", "Full name", "text", true],
      ["phone", "Phone", "tel", true],
      ["email", "Email", "email"],
      [
        "measurements.size",
        "Standard size",
        "select",
        ["XS", "S", "M", "L", "XL", "XXL", "Custom"],
      ],
      ["address", "Address", "textarea"],
      ["notes", "Notes", "textarea"],
      ...measurements
        .slice(1)
        .map((x) => [
          `measurements.${x}`,
          x.replace(/([A-Z])/g, " $1"),
          "number",
        ]),
    ],
  },
  Orders: {
    endpoint: "orders",
    title: "Order",
    columns: [
      ["orderNumber", "Order"],
      ["customer.name", "Customer"],
      ["garment", "Garment"],
      ["size", "Size"],
      ["dueDate", "Due date"],
      ["amount", "Amount"],
      ["status", "Status"],
    ],
    fields: [
      ["orderNumber", "Order number", "text", true],
      ["customer", "Customer", "customer", true],
      ["garment", "Garment", "text", true],
      [
        "size",
        "Standard size",
        "select",
        ["XS", "S", "M", "L", "XL", "XXL", "Custom"],
      ],
      ["quantity", "Quantity", "number"],
      ["fabric", "Fabric", "text"],
      ["color", "Colour", "text"],
      ["dueDate", "Due date", "date", true],
      ["amount", "Total amount", "number"],
      ["advancePaid", "Advance paid", "number"],
      [
        "status",
        "Production status",
        "select",
        [
          "New",
          "Cutting",
          "Stitching",
          "Trial",
          "Ready",
          "Delivered",
          "Cancelled",
        ],
      ],
      [
        "paymentStatus",
        "Payment status",
        "select",
        ["Pending", "Partial", "Paid"],
      ],
      ["designNotes", "Design notes", "textarea"],
      ["alterationNotes", "Alteration notes", "textarea"],
    ],
  },
  Enquiries: {
    endpoint: "enquiries",
    extraQuery: "serviceNot=Feedback",
    title: "Enquiry",
    columns: [
      ["name", "Customer"],
      ["phone", "Phone"],
      ["service", "Service"],
      ["createdAt", "Received"],
      ["preferredDate", "Preferred"],
      ["source", "Source"],
      ["status", "Status"],
    ],
    fields: [
      ["name", "Name", "text", true],
      ["phone", "Phone", "tel", true],
      ["service", "Service", "text", true],
      ["preferredDate", "Preferred date", "date"],
      [
        "source",
        "Source",
        "select",
        ["Website", "Walk-in", "WhatsApp", "Phone", "Referral"],
      ],
      [
        "status",
        "Status",
        "select",
        ["New", "Contacted", "Converted", "Closed"],
      ],
      ["message", "Message", "textarea"],
    ],
  },
  Appointments: {
    endpoint: "appointments",
    title: "Appointment",
    columns: [
      ["customerName", "Customer"],
      ["phone", "Phone"],
      ["type", "Type"],
      ["scheduledAt", "Schedule"],
      ["status", "Status"],
    ],
    fields: [
      ["customerName", "Customer name", "text", true],
      ["phone", "Phone", "tel", true],
      [
        "type",
        "Appointment type",
        "select",
        ["Consultation", "Measurement", "Trial", "Collection"],
      ],
      ["scheduledAt", "Date & time", "datetime-local", true],
      [
        "status",
        "Status",
        "select",
        ["Scheduled", "Completed", "Cancelled", "No show"],
      ],
      ["notes", "Notes", "textarea"],
    ],
  },
  Designs: {
    endpoint: "designs",
    title: "Design",
    columns: [
      ["code", "Code"],
      ["name", "Design"],
      ["category", "Category"],
      ["basePrice", "Base price"],
      ["featured", "Featured"],
      ["status", "Status"],
    ],
    fields: [
      ["code", "Design code", "text", true],
      ["name", "Design name", "text", true],
      ["category", "Category", "select", ["Pattern Blouse", "Aari Work", "Embroidery Work", "Custom Dresses"]],
      ["basePrice", "Base price", "number"],
      ["imageUrl", "Image URL", "url"],
      ["featured", "Featured", "checkbox"],
      ["status", "Status", "select", ["Draft", "Published", "Archived"]],
      ["description", "Description", "textarea"],
    ],
  },
  Services: {
    endpoint: "services",
    title: "Service",
    columns: [
      ["name", "Service"],
      ["category", "Category"],
      ["startingPrice", "Starting price"],
      ["durationDays", "Days"],
      ["active", "Active"],
    ],
    fields: [
      ["name", "Service name", "text", true],
      ["category", "Category", "text", true],
      ["startingPrice", "Starting price", "number"],
      ["durationDays", "Delivery days", "number"],
      ["active", "Available", "checkbox"],
      ["description", "Description", "textarea"],
    ],
  },
  Feedback: {
    endpoint: "enquiries",
    extraQuery: "service=Feedback",
    title: "Feedback",
    defaultForm: { service: "Feedback" },
    columns: [
      ["name", "Customer"],
      ["phone", "Phone"],
      ["rating", "Rating"],
      ["message", "Notes"],
      ["createdAt", "Received"],
    ],
    fields: [
      ["name", "Name", "text", true],
      ["phone", "Phone", "tel", true],
      ["message", "Notes", "textarea", true],
    ],
  },
};
const getPath = (obj, path) =>
  path.split(".").reduce((value, key) => value?.[key], obj);
const setPath = (obj, path, value) => {
  const keys = path.split("."),
    copy = { ...obj };
  let node = copy;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) node[key] = value;
    else ((node[key] = { ...(node[key] || {}) }), (node = node[key]));
  });
  return copy;
};
const pretty = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value == null || value === "") return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value))
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  return value;
};

function Manager({ name, search }) {
  const config = configs[name],
    [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [deleted, setDeleted] = useState(false),
    [dateRange, setDateRange] = useState({ from: "", to: "" }),
    [modal, setModal] = useState(null),
    [form, setForm] = useState({}),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [customers, setCustomers] = useState([]),
    [toast, setToast] = useState(""),
    token = sessionStorage.getItem("zivara-admin-token");
  const waLink = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    return `https://wa.me/${digits.length === 10 ? "91" + digits : digits}`;
  };
  const request = async (path, options = {}) => {
    const response = await fetch(`/api/${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }),
      body = await response.json();
    if (!response.ok) throw Error(body.message || "Request failed");
    return body;
  };
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const body = await request(
        `${config.endpoint}?deleted=${deleted}&search=${encodeURIComponent(search)}${config.extraQuery ? `&${config.extraQuery}` : ""}${dateRange.from ? `&from=${dateRange.from}` : ""}${dateRange.to ? `&to=${dateRange.to}` : ""}`,
      );
      setRows(body.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [name, search, deleted, dateRange.from, dateRange.to]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (name === "Orders")
      request("customers?limit=100")
        .then((x) => setCustomers(x.data))
        .catch(() => {});
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps
  const openCreate = () => {
      setForm(config.defaultForm || {});
      setModal("create");
    },
    openEdit = (row) => {
      setForm(row);
      setModal("edit");
    };
  const uploadDesignImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/designs/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const body = await response.json();
      if (!response.ok) throw Error(body.message || "Image upload failed");
      setForm((current) => ({ ...current, imageUrl: body.imageUrl }));
      setToast("Design image uploaded");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };
  const uploadCustomerPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/customers/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const body = await response.json();
      if (!response.ok) throw Error(body.message || "Photo upload failed");
      setForm((current) => ({ ...current, measurementPhotoUrl: body.imageUrl }));
      setToast("Photo uploaded");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      await request(
        modal === "edit" ? `${config.endpoint}/${form._id}` : config.endpoint,
        {
          method: modal === "edit" ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
      setModal(null);
      setToast(
        modal === "edit" ? "Updated successfully" : "Created successfully",
      );
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (row) => {
    if (!confirm(`Move this ${config.title.toLowerCase()} to trash?`)) return;
    try {
      await request(`${config.endpoint}/${row._id}`, { method: "DELETE" });
      setToast("Moved to trash");
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  const restore = async (row) => {
    try {
      await request(`${config.endpoint}/${row._id}/restore`, {
        method: "PATCH",
      });
      setToast("Record restored");
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (e) => e.key === "Escape" && setModal(null);
    addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      removeEventListener("keydown", close);
    };
  }, [modal]);
  const measurementFields = config.fields.filter((f) =>
      f[0].startsWith("measurements."),
    ),
    mainFields = config.fields.filter((f) => !f[0].startsWith("measurements.")),
    commercialKeys = [
      "dueDate",
      "amount",
      "advancePaid",
      "status",
      "paymentStatus",
      "designNotes",
      "alterationNotes",
    ],
    commercialFields = mainFields.filter((f) => commercialKeys.includes(f[0])),
    detailFields = mainFields.filter((f) => !commercialKeys.includes(f[0]));
  const renderFields = (fields) =>
    fields.map((field) => (
      <CrudField
        key={field[0]}
        field={field}
        value={getPath(form, field[0])}
        customers={customers}
        change={(value) => setForm((current) => setPath(current, field[0], value))}
      />
    ));
  return (
    <section className="panel manager crud-manager">
      <div className="crud-header">
        <div>
          <span className="record-count">{rows.length} RECORDS</span>
          <h2>{name}</h2>
          <p>
            Manage your studio {name.toLowerCase()} and complete record history.
          </p>
        </div>
        <div className="crud-actions">
          <button
            className={deleted ? "" : "active"}
            onClick={() => setDeleted(false)}
          >
            Active
          </button>
          <button
            className={deleted ? "active" : ""}
            onClick={() => setDeleted(true)}
          >
            Trash
          </button>
          {!deleted && (
            <button className="primary" onClick={openCreate}>
              ＋ Add {config.title}
            </button>
          )}
        </div>
      </div>
      {(name === "Customers" || name === "Orders") && (
        <section className="payments-filter">
          <label>
            <small>Created from</small>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </label>
          <label>
            <small>Created to</small>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </label>
          {(dateRange.from || dateRange.to) && (
            <button type="button" onClick={() => setDateRange({ from: "", to: "" })}>
              Clear filter
            </button>
          )}
        </section>
      )}
      {error && (
        <div className="crud-error">
          ⚠ {error}
          <button onClick={load}>Retry</button>
        </div>
      )}
      {loading ? (
        <div className="crud-loading">
          <span />
          <p>Loading {name.toLowerCase()}…</p>
        </div>
      ) : rows.length ? (
        <div className="crud-table">
          <table>
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c[0]}>{c[1]}</th>
                ))}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row._id}
                  className={
                    name === "Enquiries" && row.status === "New" ? "unseen" : ""
                  }
                >
                  {config.columns.map((c) => (
                    <td key={c[0]}>
                      {c[0] === "rating" ? (
                        <span className="rating-stars-display">
                          {getPath(row, c[0])
                            ? "★".repeat(getPath(row, c[0])) + "☆".repeat(5 - getPath(row, c[0]))
                            : "—"}
                        </span>
                      ) : (
                        <span className={c[0] === "status" ? "data-status" : ""}>
                          {pretty(getPath(row, c[0]))}
                        </span>
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="row-actions">
                      {deleted ? (
                        <button onClick={() => restore(row)}>↻ Restore</button>
                      ) : (
                        <>
                          {name === "Enquiries" && row.phone && (
                            <a
                              className="whatsapp-action"
                              href={waLink(row.phone)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                if (row.status === "New")
                                  request(`enquiries/${row._id}`, {
                                    method: "PUT",
                                    body: JSON.stringify({ status: "Contacted" }),
                                  })
                                    .then(load)
                                    .catch(() => {});
                              }}
                            >
                              ◉ WhatsApp
                            </a>
                          )}
                          <button onClick={() => openEdit(row)}>✎ Edit</button>
                          <button
                            className="danger"
                            onClick={() => remove(row)}
                          >
                            ⌫
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <span>{deleted ? "♲" : "✦"}</span>
          <h3>{deleted ? "Trash is empty" : `No ${name.toLowerCase()} yet`}</h3>
          <p>
            {deleted
              ? "Soft-deleted records will appear here."
              : `Create your first ${config.title.toLowerCase()} to get started.`}
          </p>
          {!deleted && (
            <button className="primary" onClick={openCreate}>
              ＋ Create {config.title}
            </button>
          )}
        </div>
      )}
      {modal && createPortal(
        <div
          className="modal-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <form className="crud-modal designed-modal" onSubmit={save}>
            <div className="modal-head">
              <div className="modal-title-mark">
                <span>{config.title[0]}</span>
                <div>
                  <small>
                    {modal === "edit"
                      ? "UPDATE EXISTING RECORD"
                      : "CREATE A NEW RECORD"}
                  </small>
                  <h3>
                    {modal === "edit"
                      ? `Edit ${config.title}`
                      : `New ${config.title}`}
                  </h3>
                </div>
              </div>
              <button type="button" onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-scroll">
                {name === "Designs" && (
                  <section className="design-upload-panel">
                    <div className="design-upload-preview">
                      {form.imageUrl ? (
                        <img src={form.imageUrl} alt="Design preview" />
                      ) : (
                        <span>✦</span>
                      )}
                    </div>
                    <div>
                      <small>DESIGN IMAGE</small>
                      <h4>{form.imageUrl ? "Image ready" : "Add a design photograph"}</h4>
                      <p>JPG, PNG or WebP · Automatically optimized for the website.</p>
                      <label className="design-upload-button">
                        {uploading ? "Optimizing…" : form.imageUrl ? "Replace image" : "Choose image"}
                        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(e) => uploadDesignImage(e.target.files?.[0])} />
                      </label>
                    </div>
                  </section>
                )}
                <FormGroup
                  title={
                    name === "Orders"
                      ? "Garment & customer"
                      : "Basic information"
                  }
                  description={`Primary ${config.title.toLowerCase()} information`}
                >
                  {renderFields(detailFields)}
                </FormGroup>
                {commercialFields.length > 0 && (
                  <FormGroup
                    title="Order & payment"
                    description="Timeline, pricing and workflow status"
                  >
                    {renderFields(commercialFields)}
                  </FormGroup>
                )}
                {measurementFields.length > 0 && (
                  <FormGroup
                    title="Body measurements"
                    description="All measurements are optional — fill what you have, or upload a photo instead"
                    measurement
                    headerExtra={
                      name === "Customers" && (
                        <label className="design-upload-button compact">
                          {uploading ? "Optimizing…" : form.measurementPhotoUrl ? "Replace photo" : "Upload photo"}
                          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(e) => uploadCustomerPhoto(e.target.files?.[0])} />
                        </label>
                      )
                    }
                  >
                    {renderFields(measurementFields)}
                  </FormGroup>
                )}
              </div>
            </div>
            <div className="modal-foot">
              <span>
                <i>●</i> Changes are securely saved to the studio database
              </span>
              <div>
                <button type="button" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button className="primary" disabled={saving}>
                  {saving
                    ? "Saving…"
                    : modal === "edit"
                      ? "Save changes"
                      : "Create record"}
                </button>
              </div>
            </div>
          </form>
        </div>,
        document.body,
      )}
      {toast && <div className="crud-toast">✓ {toast}</div>}
    </section>
  );
}
function FormGroup({ title, description, children, measurement = false, headerExtra }) {
  return (
    <section
      className={"form-group " + (measurement ? "measurement-group" : "")}
    >
      <header>
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        {headerExtra || (measurement && <span>UNIT · INCHES</span>)}
      </header>
      <div className="group-fields">{children}</div>
    </section>
  );
}
function CrudField({ field, value, change, customers }) {
  const [key, label, type, options] = field,
    required = field[3] === true,
    placeholder = type === "number" ? "0.0" : `Enter ${label.toLowerCase()}`,
    [customerSearch, setCustomerSearch] = useState(""),
    [comboOpen, setComboOpen] = useState(false);
  if (type === "textarea")
    return (
      <label className="wide">
        <FieldLabel label={label} required={required} />
        <textarea
          rows="3"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => change(e.target.value)}
        />
      </label>
    );
  if (type === "checkbox")
    return (
      <label className="check-field">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => change(e.target.checked)}
        />
        <span>
          <b>{label}</b>
          <small>Show this option as enabled</small>
        </span>
      </label>
    );
  if (type === "customer") {
    const items = customers.map((c) => [c._id, `${c.name} · ${c.phone}`]),
      selectedId = value?._id || value || "",
      selectedLabel = items.find((x) => x[0] === selectedId)?.[1] || "",
      displayValue = comboOpen ? customerSearch : selectedLabel,
      filtered = customerSearch
        ? items.filter((x) =>
            x[1].toLowerCase().includes(customerSearch.toLowerCase()),
          )
        : items;
    return (
      <label className="combo-field">
        <FieldLabel label={label} required={required} />
        <input
          type="text"
          placeholder="Search customer by name or phone…"
          value={displayValue}
          onFocus={() => {
            setCustomerSearch("");
            setComboOpen(true);
          }}
          onChange={(e) => setCustomerSearch(e.target.value)}
          onBlur={() => setTimeout(() => setComboOpen(false), 150)}
        />
        {comboOpen && (
          <div className="combo-options">
            {filtered.length === 0 && (
              <div className="combo-empty">No customers found</div>
            )}
            {filtered.map((x) => (
              <div
                className="combo-option"
                key={x[0]}
                onMouseDown={() => {
                  change(x[0]);
                  setComboOpen(false);
                }}
              >
                {x[1]}
              </div>
            ))}
          </div>
        )}
      </label>
    );
  }
  if (type === "select") {
    const items = options.map((x) => [x, x]);
    return (
      <label>
        <FieldLabel label={label} required={required} />
        <select
          required={required}
          value={value?._id || value || ""}
          onChange={(e) => change(e.target.value)}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {items.map((x) => (
            <option value={x[0]} key={x[0]}>
              {x[1]}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className={key.startsWith("measurements.") ? "measure-field" : ""}>
      <FieldLabel label={label} required={required} />
      <div className="input-shell">
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={
            type.includes("date") && value
              ? String(value).slice(0, type === "date" ? 10 : 16)
              : value || ""
          }
          onChange={(e) =>
            change(
              type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value,
            )
          }
        />
        {key.startsWith("measurements.") && <span>in</span>}
      </div>
    </label>
  );
}
function FieldLabel({ label, required }) {
  return (
    <span className="field-label">
      {label}
      {required && <b>*</b>}
    </span>
  );
}
function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
        body = await r.json();
      if (!r.ok) throw Error(body.message);
      sessionStorage.setItem("zivara-admin-token", body.token);
      onLogin(body.token);
    } catch (e) {
      setError(e.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="login-page">
      <div className="login-visual">
        <Logo light />
        <div className="login-quote">
          <div className="eyebrow">THE STUDIO DESK</div>
          <h1>
            Every beautiful piece
            <br />
            begins with <em>order.</em>
          </h1>
          <p>
            Customers, measurements and craftsmanship—thoughtfully managed in
            one place.
          </p>
        </div>
        <span>Private access · Zivara Design Studio</span>
      </div>
      <section className="login-card">
        <a href="/" className="back-store">
          ← Back to store
        </a>
        <div className="login-inner">
          <span className="login-mark">Z</span>
          <small>SECURE ADMIN PORTAL</small>
          <h2>Welcome back</h2>
          <p>Sign in to manage your studio.</p>
          <form onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="admin@zivara.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Password
              <div className="password">
                <input
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            {error && <div className="login-error">⚠ {error}</div>}
            <button className="login-submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in securely →"}
            </button>
          </form>
          <div className="secure-note">
            ◇ Protected with signed, expiring sessions
          </div>
        </div>
      </section>
    </main>
  );
}
function App() {
  const isAdmin = location.pathname.replace(/\/$/, "") === "/admin";
  const [token, setToken] = useState(() =>
      sessionStorage.getItem("zivara-admin-token"),
    ),
    [checking, setChecking] = useState(() => Boolean(isAdmin && token));
  useEffect(() => {
    if (!isAdmin || !token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw Error();
      })
      .catch(() => {
        sessionStorage.removeItem("zivara-admin-token");
        setToken(null);
      })
      .finally(() => setChecking(false));
  }, [isAdmin, token]);
  if (!isAdmin) return <Store />;
  if (checking)
    return (
      <div className="auth-loading">
        <Logo />
        <span />
      </div>
    );
  return token ? (
    <Admin
      logout={() => {
        sessionStorage.removeItem("zivara-admin-token");
        setToken(null);
      }}
    />
  ) : (
    <Login onLogin={setToken} />
  );
}
export default App;
