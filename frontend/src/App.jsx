import { useEffect, useMemo, useRef, useState } from "react";
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
    "From ₹1,499",
  ],
  [
    "◒",
    "Aari Work",
    "Traditional and contemporary Aari patterns finished with fine handcrafted detail.",
    "From ₹999",
  ],
  [
    "♢",
    "Embroidery Work",
    "Elegant thread, bead and motif embroidery designed around your blouse and occasion.",
    "From ₹1,199",
  ],
  [
    "⌁",
    "Custom Dresses",
    "Bring a reference or let our designers create something only for you.",
    "From ₹1,999",
  ],
];
const designs = [
  ["The Mayura Blouse", "Aari Collection", "Bestseller"],
  ["Saffron Drape", "Festive Edit", "New"],
  ["Noor Bridal Set", "Bridal Couture", "Signature"],
  ["Aadhira Maxi", "Evening Edit", "New"],
  ["Varnam Lehenga", "Celebration Edit", "Limited"],
  ["Meera Kurti", "Everyday Luxe", "Atelier Pick"],
];
const seedOrders = [
  {
    id: "ZV-1048",
    customer: "Priya R",
    item: "Bridal blouse",
    date: "Sep 05",
    amount: "₹8,500",
    status: "Stitching",
  },
  {
    id: "ZV-1047",
    customer: "Nandhini S",
    item: "Churidar set",
    date: "Sep 03",
    amount: "₹3,200",
    status: "Trial",
  },
  {
    id: "ZV-1046",
    customer: "Meena K",
    item: "Saree fall & pico",
    date: "Today",
    amount: "₹650",
    status: "Ready",
  },
  {
    id: "ZV-1045",
    customer: "Aishwarya P",
    item: "Designer gown",
    date: "Sep 08",
    amount: "₹5,900",
    status: "Cutting",
  },
];
const nav = [
  "Overview",
  "Orders",
  "Customers",
  "Enquiries",
  "Appointments",
  "Designs",
  "Services",
];

function Logo({ light = false }) {
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
      email: "",
      service: "Designer Blouse",
      preferredDate: "",
      preferredTime: "Morning",
      city: "",
      budget: "",
      message: "",
      referenceImageName: "",
    }),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [collectionModal, setCollectionModal] = useState(null),
    [menu, setMenu] = useState(false),
    [tilt, setTilt] = useState({ x: 0, y: 0 }),
    [loading, setLoading] = useState(
      () => !sessionStorage.getItem("zivara-intro-seen"),
    ),
    cursorRef = useRef(null),
    progressRef = useRef(null),
    spotRef = useRef(null);
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
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw Error();
    } catch {
      localStorage.setItem(
        "zivara-last-enquiry",
        JSON.stringify({ ...form, createdAt: new Date() }),
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
  return (
    <div
      className={`store theme-banner ${loading ? "is-loading" : ""}`}
      onMouseMove={moveCursor}
    >
      <div className="scroll-progress" ref={progressRef} />
      <div className="ambient-spot" ref={spotRef} />
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
      <div className="luxury-cursor" ref={cursorRef}>
        <span />
      </div>
      <div className="announcement">
        Have a design in mind? Get it stitched to your perfect fit.{" "}
        <a href="#contact">
          <span>Book a free consultation →</span>
        </a>
      </div>
      <header className="site-header wrap">
        <Logo />
        <button
          className="menu"
          aria-label="Open navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          ☰
        </button>
        <nav className={menu ? "open" : ""}>
          <a href="#home" onClick={() => setMenu(false)}>
            Home
          </a>
          <a href="#services" onClick={() => setMenu(false)}>
            Services
          </a>
          <a href="#designs" onClick={() => setMenu(false)}>
            Collections
          </a>
          <a href="#process" onClick={() => setMenu(false)}>
            Our process
          </a>
          <a href="#atelier" onClick={() => setMenu(false)}>
            Atelier
          </a>
          <a href="#journal" onClick={() => setMenu(false)}>
            Journal
          </a>
          <a href="#contact" onClick={() => setMenu(false)}>
            Contact
          </a>
        </nav>
        <div className="header-actions">
          <a className="pill dark" href="#contact">
            Book a fitting
          </a>
        </div>
      </header>
      <main>
        <section
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
                Custom blouses, maxi dresses, bridal wear and
                alterations—beautifully designed to your measurements and
                delivered on time.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="pill gold">
                  Book a consultation
                </a>
                <a href="#designs">View our designs ↗</a>
              </div>
              <div className="proof">
                <div>
                  <b>12+</b>
                  <span>Years of tailoring</span>
                </div>
                <i />
                <div>
                  <b>4.9/5</b>
                  <span>Customer rating</span>
                </div>
                <i />
                <div>
                  <b>2,400+</b>
                  <span>Outfits completed</span>
                </div>
              </div>
            </div>
            <div
              className="hero-art"
              style={{
                "--rx": `${-tilt.y * 6}deg`,
                "--ry": `${tilt.x * 7}deg`,
              }}
            >
              <div className="ring" />
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
        <section id="services" className="section wrap">
          <Heading
            eyebrow="WHAT WE CREATE"
            title="Tailoring, elevated."
            text="From an everyday alteration to once-in-a-lifetime couture, every piece receives the same attention."
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
                  <b>{s[3]}</b>
                  <button type="button" onClick={() => setCollectionModal(s[1])}>
                    Explore →
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>
        <section className="atelier-story">
          <div className="atelier-visual">
            <div className="atelier-frame">
              <div className="artisan">
                <span />
                <i />
                <b />
              </div>
              <small>
                THE HANDS BEHIND
                <br />
                EVERY DETAIL
              </small>
            </div>
            <div className="seal">
              <span>Z</span>
              <small>EST. 2014</small>
            </div>
          </div>
          <div className="atelier-copy">
            <div className="eyebrow">INSIDE OUR ATELIER</div>
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
              <span>Anitha</span>
              <small>FOUNDER &amp; HEAD DESIGNER</small>
            </div>
            <a href="#contact">
              Meet your designer <b>↗</b>
            </a>
          </div>
        </section>
        <section id="designs" className="collection">
          <div className="collection-marquee">
            <div>
              TIMELESS CRAFT ✦ MODERN SILHOUETTES ✦ MADE FOR YOU ✦ TIMELESS
              CRAFT ✦ MODERN SILHOUETTES ✦ MADE FOR YOU ✦
            </div>
          </div>
          <div className="wrap">
            <Heading
              eyebrow="THE ZIVARA EDIT"
              title="Designed to be remembered."
            />
            <div className="design-grid">
              {designs.map((d, i) => (
                <article key={d[0]} style={{ "--stagger": `${i * 130}ms` }}>
                  <div className={"design-art art" + i}>
                    <span>{d[2]}</span>
                    <div className="model">
                      <i />
                      <b />
                    </div>
                    <div className="design-number">0{i + 1}</div>
                  </div>
                  <small>{d[1]}</small>
                  <div>
                    <h3>{d[0]}</h3>
                    <button>↗</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
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
                Curated fabrics selected for their drape, comfort and character.
                Touch and compare them during your private consultation.
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
              <span>✦</span> Fabric sourcing available for custom and bridal
              orders <a href="#contact">Ask our designer →</a>
            </div>
          </div>
        </section>
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
            <a href="#contact" className="pill dark">
              Book consultation
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
        <CoutureShowcase />
        <FitComparison />
        <TransformationStories />
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
                [
                  "⌖",
                  "Visit the studio",
                  "NO. 49, Solai Pudhur, Bypass Road, Thoothukudi 628101",
                ],
                ["☎", "Call or WhatsApp", "+91 98765 43210"],
                ["◷", "Studio hours", "Mon–Sat · 10:00 AM–8:00 PM"],
              ].map((x) => (
                <div className="detail" key={x[1]}>
                  <span>{x[0]}</span>
                  <p>
                    <b>{x[1]}</b>
                    {x[2]}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={submit}>
              {sent ? (
                <div className="success">
                  <span>✓</span>
                  <h3>Thank you, {form.name}!</h3>
                  <p>
                    Your enquiry is saved. Our designer will contact you
                    shortly.
                  </p>
                  <button
                    type="button"
                    className="pill dark"
                    onClick={() => setSent(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-head">
                    <div>
                      <small>DESIGN CONSULTATION</small>
                      <h3>Request a callback</h3>
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
                  <Field label="I'm interested in">
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                    >
                      <option>Designer Blouse</option>
                      <option>Bridal Couture</option>
                      <option>Custom Dress</option>
                      <option>Alteration</option>
                    </select>
                  </Field>
                  <Field label="Preferred date">
                    <input
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) =>
                        setForm({ ...form, preferredDate: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Tell us a little more">
                    <textarea
                      rows="3"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </Field>
                  <button disabled={busy} className="pill gold submit">
                    {busy ? "Saving…" : "Request consultation →"}
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
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <Logo light />
          <p>
            Beautifully made. Honestly fitted.
            <br />
            Made in Thoothukudi.
          </p>
          <div>
            <a href="#services">Services</a>
            <a href="#designs">Collections</a>
            <a href="#contact">Contact</a>
          </div>
          <div>Instagram · Facebook · WhatsApp</div>
        </div>
        <div className="wrap copyright">
          © 2026 Zivara Design Studio <span>Privacy · Terms</span>
        </div>
      </footer>
      <nav className="mobile-dock">
        <a href="#services">
          <span>✦</span>Services
        </a>
        <a href="#designs">
          <span>♢</span>Designs
        </a>
        <a href="#contact" className="dock-main">
          <span>＋</span>Book
        </a>
        <a href="tel:+919876543210">
          <span>☎</span>Call
        </a>
        <a href="https://wa.me/919876543210">
          <span>◉</span>Chat
        </a>
      </nav>
      <a className="whatsapp" href="https://wa.me/919876543210">
        ◉
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
  const [active, setActive] = useState("Overview"),
    [orders, setOrders] = useState(seedOrders),
    [q, setQ] = useState(""),
    [side, setSide] = useState(false);
  const filtered = useMemo(
    () =>
      orders.filter((o) =>
        JSON.stringify(o).toLowerCase().includes(q.toLowerCase()),
      ),
    [orders, q],
  );
  const advance = (id) =>
    setOrders((x) =>
      x.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                {
                  Cutting: "Stitching",
                  Stitching: "Trial",
                  Trial: "Ready",
                  Ready: "Delivered",
                }[o.status] || "Delivered",
            }
          : o,
      ),
    );
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
              <span>{["⌂", "◇", "♙", "✉", "◷", "✦", "▦"][i]}</span>
              {n}
              {n === "Enquiries" && <b>4</b>}
            </button>
          ))}
        </nav>
        <small>BUSINESS</small>
        <nav>
          <button>▤ Payments</button>
          <button>⚙ Settings</button>
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
            <label>
              ⌕{" "}
              <input
                placeholder={`Search ${active.toLowerCase()}...`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <a href="/">View store ↗</a>
            <button onClick={logout}>Log out</button>
          </div>
        </header>
        <main>
          {active === "Overview" ? (
            <Overview orders={filtered} advance={advance} go={setActive} />
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
              <span>{["⌂", "◇", "♙", "✉", "◷"][i]}</span>
              {n === "Overview" ? "Home" : n}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
function Overview({ orders, advance, go }) {
  return (
    <>
      <section className="welcome">
        <small>GOOD MORNING, ANITHA</small>
        <h2>
          Here's what needs your
          <br />
          attention today.
        </h2>
        <p>3 deliveries due and 4 new enquiries waiting.</p>
        <i>✦</i>
        <button>View today's schedule →</button>
      </section>
      <section className="metrics">
        {[
          ["₹48,650", "Revenue this month", "+12.4%"],
          ["28", "Active orders", "6 due this week"],
          ["342", "Total customers", "+18 this month"],
          ["4", "New enquiries", "Needs response"],
        ].map((m, i) => (
          <article key={m[1]}>
            <span>{["↗", "◇", "♙", "✉"][i]}</span>
            <small>{m[1]}</small>
            <strong>{m[0]}</strong>
            <em>{m[2]}</em>
          </article>
        ))}
      </section>
      <div className="dash-grid">
        <Panel
          title="Recent orders"
          sub="Track production and delivery"
          action={() => go("Orders")}
        >
          <OrderTable orders={orders} advance={advance} />
        </Panel>
        <Panel title="Today's schedule" sub="September 01">
          {[
            ["10:30", "Measurement", "Sangeetha R"],
            ["12:00", "Trial fitting", "Nandhini S"],
            ["03:30", "Consultation", "Lavanya M"],
            ["06:00", "Collection", "Meena K"],
          ].map((x) => (
            <div className="schedule" key={x[0]}>
              <b>{x[0]}</b>
              <i />
              <div>
                <strong>{x[1]}</strong>
                <small>{x[2]}</small>
              </div>
              <span>⋮</span>
            </div>
          ))}
        </Panel>
      </div>
      <div className="dash-grid lower">
        <Panel title="Order progress" sub="Current production pipeline">
          {[
            ["New orders", 8, 42],
            ["Cutting", 5, 30],
            ["Stitching", 9, 63],
            ["Trial", 4, 24],
            ["Ready", 6, 38],
          ].map((x, i) => (
            <div className="bar" key={x[0]}>
              <span>{x[0]}</span>
              <div>
                <i style={{ width: x[2] + "%" }} className={"b" + i} />
              </div>
              <b>{x[1]}</b>
            </div>
          ))}
        </Panel>
        <Panel title="Quick actions" sub="Common studio tasks">
          <div className="quick">
            {[
              ["＋", "New order"],
              ["♙", "Add customer"],
              ["◷", "Book fitting"],
              ["✉", "Send update"],
            ].map((x) => (
              <button key={x[1]}>
                <span>{x[0]}</span>
                {x[1]}
              </button>
            ))}
          </div>
        </Panel>
      </div>
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
      ...measurements
        .slice(1)
        .map((x) => [
          `measurements.${x}`,
          x.replace(/([A-Z])/g, " $1"),
          "number",
        ]),
    ],
  },
  Enquiries: {
    endpoint: "enquiries",
    title: "Enquiry",
    columns: [
      ["name", "Customer"],
      ["phone", "Phone"],
      ["service", "Service"],
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
    [modal, setModal] = useState(null),
    [form, setForm] = useState({}),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [customers, setCustomers] = useState([]),
    [toast, setToast] = useState(""),
    token = sessionStorage.getItem("zivara-admin-token");
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
        `${config.endpoint}?deleted=${deleted}&search=${encodeURIComponent(search)}`,
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
  }, [name, search, deleted]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (name === "Orders")
      request("customers?limit=100")
        .then((x) => setCustomers(x.data))
        .catch(() => {});
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps
  const openCreate = () => {
      setForm({});
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
        change={(value) => setForm(setPath(form, field[0], value))}
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
                <tr key={row._id}>
                  {config.columns.map((c) => (
                    <td key={c[0]}>
                      <span className={c[0] === "status" ? "data-status" : ""}>
                        {pretty(getPath(row, c[0]))}
                      </span>
                    </td>
                  ))}
                  <td>
                    <div className="row-actions">
                      {deleted ? (
                        <button onClick={() => restore(row)}>↻ Restore</button>
                      ) : (
                        <>
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
      {modal && (
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
              <aside className="modal-guide">
                <div className="guide-art">
                  <span>
                    {name === "Orders"
                      ? "◇"
                      : name === "Customers"
                        ? "♙"
                        : name === "Appointments"
                          ? "◷"
                          : "✦"}
                  </span>
                </div>
                <small>ZIVARA STUDIO</small>
                <h4>{config.title} details</h4>
                <p>
                  Complete the information carefully. You can edit this record
                  anytime.
                </p>
                <div className="guide-steps">
                  <span className="active">
                    <i>1</i>Basic details
                  </span>
                  {commercialFields.length > 0 && (
                    <span>
                      <i>2</i>Order & payment
                    </span>
                  )}
                  {measurementFields.length > 0 && (
                    <span>
                      <i>{commercialFields.length ? 3 : 2}</i>Measurements
                    </span>
                  )}
                </div>
                {name === "Orders" && (
                  <div className="order-balance">
                    <small>BALANCE DUE</small>
                    <b>
                      ₹
                      {Math.max(
                        (Number(form.amount) || 0) -
                          (Number(form.advancePaid) || 0),
                        0,
                      ).toLocaleString("en-IN")}
                    </b>
                  </div>
                )}
              </aside>
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
                    description="All measurements are recorded in inches"
                    measurement
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
        </div>
      )}
      {toast && <div className="crud-toast">✓ {toast}</div>}
    </section>
  );
}
function FormGroup({ title, description, children, measurement = false }) {
  return (
    <section
      className={"form-group " + (measurement ? "measurement-group" : "")}
    >
      <header>
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        {measurement && <span>UNIT · INCHES</span>}
      </header>
      <div className="group-fields">{children}</div>
    </section>
  );
}
function CrudField({ field, value, change, customers }) {
  const [key, label, type, options] = field,
    required = field[3] === true,
    placeholder = type === "number" ? "0.0" : `Enter ${label.toLowerCase()}`;
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
  if (type === "select" || type === "customer") {
    const items =
      type === "customer"
        ? customers.map((c) => [c._id, `${c.name} · ${c.phone}`])
        : options.map((x) => [x, x]);
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
