import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  TicketCheck,
  X,
} from "lucide-react";
import { categories, events as seedEvents } from "./events.js";
import "./_group.css";

// Router links keep their source href/DOM but do not navigate away from this isolated view.
function Link({ to, children, ...props }) {
  return (
    <a href={to} {...props} onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

function Brand() {
  return <Link to="/" className="brand" aria-label="Kujia Ticket home">KUJIA<span className="brand-dot">•</span>TICKET</Link>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = 0;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <>
    <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/events">Find events</Link>
          <Link to="/#how">How it works</Link>
        </nav>
        <div className="nav-actions">
          <Link className="icon-button desktop-nav cart-nav" to="/cart" aria-label={`Cart, ${count} tickets`}>
            <ShoppingBag size={19} /><span className="cart-count">{count}</span>
          </Link>
          <Link className="icon-button desktop-nav" to="/my-tickets" aria-label="My tickets"><Ticket size={19} /></Link>
          <Link className="desktop-nav" to="/login" style={{ fontWeight: 700, fontSize: 13 }}>Log in</Link>
          <Link className="btn btn-dark btn-small desktop-nav" to="/register">Join KUJIA</Link>
          <button className="icon-button nav-mobile" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
    <nav className={`mobile-drawer ${open ? "open" : ""}`} aria-label="Mobile navigation">
      <Link to="/events">Find events</Link>
      <Link to="/cart">Your cart ({count})</Link>
      <Link to="/my-tickets">My tickets</Link>
      <Link to="/login">Log in</Link>
      <Link to="/register">Join KUJIA</Link>
    </nav>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div className="wrap">
    <div className="footer-main">
      <div><Brand /><p style={{ color: "#b7ac9e", maxWidth: 270, fontSize: 13, marginTop: 18 }}>Good nights, good people, and the places that bring us together.</p></div>
      <div className="footer-links">
        <div><b>Explore</b><Link to="/events">All events</Link><Link to="/events?category=Music">Music</Link><Link to="/events?category=Culture">Culture</Link></div>
        <div><b>For organisers</b><Link to="/organizer">Studio</Link><Link to="/register">Start listing</Link></div>
        <div><b>Need a hand?</b><a href="mailto:hello@kujiaticket.africa">Contact us</a><Link to="/my-tickets">Your tickets</Link></div>
      </div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} KUJIA•TICKET · East Africa, together.</span><span>Made for the moments worth leaving home for.</span></div>
  </div></footer>;
}

function SearchBar({ value, onChange, onSubmit, placeholder = "Search events…", buttonText = "Search" }) {
  return <form className="searchbar" onSubmit={onSubmit}>
    <Search size={19} style={{ marginLeft: 13, alignSelf: "center" }} />
    <input value={value} onChange={onChange} placeholder={placeholder} aria-label="Search events" />
    <button className="btn" type="submit">{buttonText} <ArrowRight size={17} /></button>
  </form>;
}

function SectionHeading({ eyebrow, title, description, action, className = "" }) {
  return <div className={`section-head ${className}`}>
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
    {description && <p>{description}</p>}
    {action}
  </div>;
}

function Badge({ children, tone = "acacia", className = "" }) {
  return <span className={`tag badge-${tone} ${className}`}>{children}</span>;
}

const currency = (event) => {
  const code = { Uganda: "UGX", Tanzania: "TZS", Rwanda: "RWF" }[event.country];
  const rate = { UGX: 28, TZS: 19, RWF: 9.8 }[code];
  return code ? `~${code} ${Math.round(event.price * rate).toLocaleString()}` : `KES ${Number(event.price).toLocaleString()}`;
};

function EventCard({ event, layout = "grid" }) {
  const date = new Date(event.date);
  const day = Number.isNaN(date.getTime()) ? event.date.slice(-2) : date.getDate();
  const month = Number.isNaN(date.getTime()) ? "DATE" : date.toLocaleString("en", { month: "short" }).toUpperCase();
  return <article className={`event-card ${layout === "list" ? "event-card-list" : ""}`}>
    <Link to={`/events/${event.id}`} aria-label={`View ${event.title}`}>
      <div className="event-image">
        <img src={event.image} alt={`${event.title} event`} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/kuj${event.id}/1200/800`; }} />
        <div className="event-date-badge"><strong>{day}</strong>{month}</div>
        {event.trending && <Badge tone="ember" className="event-trending">On a roll</Badge>}
      </div>
      <div className="event-card-body">
        <span className="eyebrow muted">{event.category} · {event.country}</span>
        <h3>{event.title}</h3>
        <div className="event-location"><MapPin size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />{event.city} · {event.venue}</div>
        <div className="event-card-foot"><span className="event-price">From {currency(event)}</span><span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
      </div>
    </Link>
  </article>;
}

function EmptyState({ title, description }) {
  return <div className="empty-state"><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

const trust = [["Secure M-Pesa checkout", ShieldCheck], ["Real tickets, no screenshots", TicketCheck], ["Local events, thoughtfully picked", Heart], ["Four countries, one good time", MapPin]];

function HomePage() {
  // The original useEvents hook calls the app API. For this isolated snapshot,
  // its successful response is represented by the exact bundled seed events.
  const items = seedEvents;
  const error = "";
  const [query, setQuery] = useState("");
  const featured = items?.find((event) => event.featured) || seedEvents[0];
  const week = (items || []).slice(0, 3);
  const search = (e) => e.preventDefault();
  return <>
    <section className="hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <span className="eyebrow" style={{ color: "var(--savanna)" }}>The East African way out</span>
        <h1>Go where<br />the <em>good</em><br />stories are.</h1>
        <p>Find the nights, sounds, flavours and people that make this side of the world feel like nowhere else.</p>
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onSubmit={search} placeholder="A city, a sound, a feeling…" buttonText="Find your night" />
        <div className="hero-meta"><span><MapPin size={13} /> NAIROBI · KAMPALA · DAR · KIGALI</span><span>001 / GOOD THINGS AHEAD</span></div>
      </div>
      <div className="hero-art"><div className="hero-photo"><img src={featured.image} alt={`${featured.title} event`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/kuj${featured.id}/1200/800`; }} /></div><div className="hero-stamp">YOUR PEOPLE<br />ARE OUT<br />THERE</div><span className="hero-index">EAST AFRICA · 2026</span></div>
    </div></section>
    <div className="marquee"><div className="marquee-track">{[0, 1].map((n) => <span key={n}>GOOD PEOPLE <b>·</b> LOUD MUSIC <b>·</b> LONG NIGHTS <b>·</b> EAST AFRICA IN MOTION <b>·</b> GOOD PEOPLE <b>·</b></span>)}</div></div>
    <section className="section wrap reveal"><SectionHeading eyebrow="Your next few days" title={<>Coming up<br />this week.</>} action={<Link className="btn btn-outline" to="/events">All events <ArrowRight size={16} /></Link>} />{error ? <EmptyState title="Couldn’t get the listings" description={error} /> : items ? <div className="event-grid">{week.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="event-grid">{[0, 1, 2].map((i) => <div className="skeleton" key={i} />)}</div>}</section>
    <section className="section" style={{ paddingTop: 0 }}><div className="wrap reveal"><SectionHeading eyebrow="Pick your pace" title={<>What are you<br />in the mood for?</>} description="From the front row to the long table. Your kind of night is in here." /><div className="categories">{categories.map((cat, i) => <Link className="category-tile" to={`/events?category=${encodeURIComponent(cat)}`} key={cat}><span className="eyebrow">0{i + 1} / EAST AFRICA</span><h3>{cat}</h3><ArrowUpRight size={20} /></Link>)}</div></div></section>
    {featured && <section className="section wrap reveal" style={{ paddingTop: 0 }}><div className="spotlight"><div className="spotlight-image"><img src={featured.image} alt={`${featured.title} event`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/kuj${featured.id}/1200/800`; }} /></div><div className="spotlight-copy"><span className="eyebrow" style={{ color: "var(--savanna)" }}>Worth the group chat</span><h2>{featured.title}</h2><p>{featured.description}</p><div style={{ display: "flex", gap: 14, alignItems: "center", margin: "14px 0 23px", fontSize: 13 }}><span><CalendarDays size={14} /> {featured.date}</span><span><MapPin size={14} /> {featured.city}</span></div><Link className="btn" to={`/events/${featured.id}`} style={{ background: "var(--savanna)", color: "var(--ink)" }}>Get in on it <ArrowRight size={16} /></Link></div></div></section>}
    <section className="section wrap reveal" id="how"><SectionHeading eyebrow="No long story" title={<>Three steps.<br />One good night.</>} /><div className="how-grid">{["Find your thing", "Pay your way", "Show up"].map((title, i) => <div className="how-step" key={title}><span className="step-no">0{i + 1} — HOW IT WORKS</span><h3>{title}</h3><p>{["Browse the best of what’s on across the region. Filter by city, category or instinct.", "Secure your spot with M-Pesa. Your ticket and QR pass land straight in your account.", "Walk in, show your pass, and leave the planning to us. The night is yours."][i]}</p></div>)}</div></section>
    <div className="trust-strip"><div className="wrap trust-inner">{trust.map(([text, Icon]) => <div className="trust-item" key={text}><Icon size={19} color="var(--acacia)" />{text}</div>)}</div></div>
    <section className="organizer-cta"><div className="wrap organizer-inner"><div><span className="eyebrow">For the ones putting it together</span><h2>Make your next<br />one a full house.</h2><p>List your event, reach the region and keep your night moving. We’ll handle the tickets.</p></div><Link className="btn btn-dark" to="/register">Meet your people <ArrowRight size={17} /></Link></div></section>
  </>;
}

export default function Current() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <div className="app-shell"><Navbar /><main className="route-enter"><HomePage /></main><Footer /></div>;
}
