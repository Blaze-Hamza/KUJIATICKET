import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarDays, Heart, MapPin, ShieldCheck, TicketCheck } from "lucide-react";
import EventCard from "../components/EventCard.jsx";
import EventPhoto from "../components/EventPhoto.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import useEvents from "../hooks/useEvents.js";
import { categories, categoryImages, events as seedEvents } from "../data/events.js";
import EmptyState from "../components/EmptyState.jsx";

const trust = [
  ["Secure M-Pesa checkout", ShieldCheck],
  ["Real tickets, no screenshots", TicketCheck],
  ["Local events, thoughtfully picked", Heart],
  ["Four countries, one good time", MapPin]
];

export default function HomePage() {
  const { items, error } = useEvents();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const featured = items?.find((event) => event.featured) || seedEvents[0];
  const week = (items || []).slice(0, 3);

  const search = (e) => {
    e.preventDefault();
    navigate(`/events?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow" style={{ color: "var(--savanna)" }}>
              The East African way out
            </span>
            <h1>
              Go where<br />
              the <em>good</em><br />
              stories are.
            </h1>
            <p>
              Find the nights, sounds, flavours and people that make this side of the world feel like nowhere else.
            </p>
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSubmit={search}
              placeholder="A city, a sound, a feeling…"
              buttonText="Find your night"
            />
            <div className="hero-meta">
              <span><MapPin size={13} /> NAIROBI · KAMPALA · DAR · KIGALI</span>
              <span>001 / GOOD THINGS AHEAD</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-photo">
              <EventPhoto event={featured} />
            </div>
            <div className="hero-stamp">
              YOUR PEOPLE<br />ARE OUT<br />THERE
            </div>
            <span className="hero-index">EAST AFRICA · 2026</span>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>
              GOOD PEOPLE <b>·</b> LOUD MUSIC <b>·</b> LONG NIGHTS <b>·</b> EAST AFRICA IN MOTION <b>·</b> GOOD PEOPLE <b>·</b>
            </span>
          ))}
        </div>
      </div>

      <section className="section wrap reveal">
        <SectionHeading
          eyebrow="Your next few days"
          title={<>Coming up<br />this week.</>}
          action={<Link className="btn btn-outline" to="/events">All events <ArrowRight size={16} /></Link>}
        />
        {error ? (
          <EmptyState title="Couldn’t get the listings" description={error} />
        ) : items ? (
          <div className="event-grid">
            {week.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="event-grid">
            {[0, 1, 2].map((i) => (
              <div className="skeleton" key={i} />
            ))}
          </div>
        )}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap reveal">
          <SectionHeading
            eyebrow="Pick your pace"
            title={<>What are you<br />in the mood for?</>}
            description="From the front row to the long table. Your kind of night is in here."
          />
          <div className="categories">
            {categories.map((cat, i) => (
              <Link
                className="category-tile"
                to={`/events?category=${encodeURIComponent(cat)}`}
                key={cat}
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.5) 55%, rgba(13,11,9,0.25) 100%), url(${categoryImages[cat]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <span className="eyebrow" style={{ color: "var(--savanna)" }}>0{i + 1} / EAST AFRICA</span>
                <h3>{cat}</h3>
                <span className="category-tile-arrow"><ArrowUpRight size={20} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="section wrap reveal" style={{ paddingTop: 0 }}>
          <div className="spotlight">
            <div className="spotlight-image">
              <EventPhoto event={featured} />
            </div>
            <div className="spotlight-copy">
              <span className="eyebrow" style={{ color: "var(--savanna)" }}>
                Worth the group chat
              </span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", margin: "14px 0 23px", fontSize: 13 }}>
                <span><CalendarDays size={14} /> {featured.date}</span>
                <span><MapPin size={14} /> {featured.city}</span>
              </div>
              <Link
                className="btn"
                to={`/events/${featured.id}`}
                style={{ background: "var(--savanna)", color: "var(--ink)" }}
              >
                Get in on it <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section wrap reveal" id="how">
        <SectionHeading eyebrow="No long story" title={<>Three steps.<br />One good night.</>} />
        <div className="how-grid">
          {["Find your thing", "Pay your way", "Show up"].map((title, i) => (
            <div className="how-step" key={title}>
              <span className="step-no">0{i + 1} — HOW IT WORKS</span>
              <h3>{title}</h3>
              <p>
                {[
                  "Browse the best of what’s on across the region. Filter by city, category or instinct.",
                  "Secure your spot with M-Pesa. Your ticket and QR pass land straight in your account.",
                  "Walk in, show your pass, and leave the planning to us. The night is yours."
                ][i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="trust-strip">
        <div className="wrap trust-inner">
          {trust.map(([text, Icon]) => (
            <div className="trust-item" key={text}>
              <Icon size={19} color="var(--acacia)" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <section className="organizer-cta">
        <div className="wrap organizer-inner">
          <div>
            <span className="eyebrow">For the ones putting it together</span>
            <h2>Make your next<br />one a full house.</h2>
            <p>List your event, reach the region and keep your night moving. We’ll handle the tickets.</p>
          </div>
          <Link className="btn btn-dark" to="/register">
            Meet your people <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
