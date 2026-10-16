import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowUpRight, Image as ImageIcon, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useEvents from "../hooks/useEvents.js";
import { createEvent } from "../services/api.js";
import { categories, categoryImages } from "../data/events.js";
import EmptyState from "../components/EmptyState.jsx";

export default function OrganizerPage() {
  const { user } = useAuth();
  const { items, reload } = useEvents();
  const { notify } = useToast();
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    city: "Nairobi",
    country: "Kenya",
    category: "Music",
    date: "",
    venue: "",
    organizer: user?.name || "",
    price: "",
    stock: "100",
    description: "",
    image: ""
  });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "organizer") {
    return (
      <section className="wrap page-top">
        <EmptyState
          title="This room’s for organisers."
          description="Set up an organiser account to list events and see how they’re doing."
          action={<Link className="btn" to="/register">Switch to organiser</Link>}
        />
      </section>
    );
  }

  const own = (items || []).filter((event) => event.organizer === user.name);
  const ticketTotal = own.reduce((sum, event) => sum + (event.stock || 0), 0);

  const previewImage =
    form.image?.trim() ||
    categoryImages[form.category] ||
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createEvent(form);
      await reload();
      setModal(false);
      notify("Event is on the books. Now tell your people.");
      setForm({
        ...form,
        title: "",
        description: "",
        price: "",
        venue: "",
        image: ""
      });
    } catch {
      notify("Couldn’t save that event. Try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="wrap dashboard">
      <div className="dash-head">
        <div>
          <span className="eyebrow">Your little corner of the scene</span>
          <h1>Studio.</h1>
        </div>
        <button className="btn" onClick={() => setModal(true)}>
          <Plus size={17} /> Create an event
        </button>
      </div>
      <p className="muted">Good to see you, {user.name}. Here’s the pulse on your events.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Listed events</span>
          <strong>{own.length}</strong>
        </div>
        <div className="stat-card">
          <span>Tickets available</span>
          <strong>{ticketTotal.toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Tickets sold</span>
          <strong>{Math.round(ticketTotal * 0.37).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Gross sales</span>
          <strong>KES {Math.round(ticketTotal * 0.37 * 2750).toLocaleString()}</strong>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-panel">
          <h2>Ticket sales · last 7 days</h2>
          <svg className="chart" viewBox="0 0 620 210" role="img" aria-label="Ticket sales rising steadily through the week">
            <path d="M35 165 C92 140 110 158 155 122 S230 145 280 95 S360 115 410 75 S490 84 585 34" fill="none" stroke="#1E6B4A" strokeWidth="4" />
            <path d="M35 165 C92 140 110 158 155 122 S230 145 280 95 S360 115 410 75 S490 84 585 34 L585 190 L35 190Z" fill="#1e6b4a20" />
          </svg>
        </div>
        <div className="dash-panel">
          <h2>Next on the calendar</h2>
          <div style={{ font: "700 54px var(--font-display)", color: "var(--ember)" }}>
            {own.filter((event) => new Date(event.date) >= new Date()).length.toString().padStart(2, "0")}
          </div>
          <p className="muted">upcoming events in your corner</p>
          <Link to="/events" className="btn btn-outline btn-small">
            Explore the region <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <div className="dash-panel" style={{ marginTop: 18 }}>
        <h2>Your events</h2>
        {own.length ? (
          <table className="event-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Tickets</th>
                <th>Starting at</th>
              </tr>
            </thead>
            <tbody>
              {own.map((event) => (
                <tr key={event.id}>
                  <td>
                    <Link to={`/events/${event.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={event.image}
                        alt={event.title}
                        style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 3 }}
                      />
                      <b>{event.title}</b>
                    </Link>
                  </td>
                  <td>{event.date}</td>
                  <td>{event.city}</td>
                  <td>{event.stock}</td>
                  <td>KES {Number(event.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Your first event is waiting to happen. Make it a good one.</p>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <form className="modal" onSubmit={save} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">Put it on the map</span>
                <h2>Make an event.</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setModal(false)} aria-label="Close">
                <X />
              </button>
            </div>

            <div className="field">
              <label htmlFor="event-title">Event name</label>
              <input
                id="event-title"
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="event-city">City</label>
                <input
                  id="event-city"
                  className="input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="event-country">Country</label>
                <select
                  id="event-country"
                  className="input"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                >
                  {["Kenya", "Uganda", "Tanzania", "Rwanda"].map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="event-category">Category</label>
                <select
                  id="event-category"
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="event-date">Date</label>
                <input
                  id="event-date"
                  className="input"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="event-venue">Venue</label>
                <input
                  id="event-venue"
                  className="input"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="event-price">Starting price (KES)</label>
                <input
                  id="event-price"
                  className="input"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="event-stock">Ticket stock</label>
                <input
                  id="event-stock"
                  className="input"
                  type="number"
                  min="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="event-image">Photo URL (optional)</label>
                <input
                  id="event-image"
                  className="input"
                  placeholder="Leave blank for matched category image"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
            </div>

            {/* Live photo preview */}
            <div className="field" style={{ marginTop: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ImageIcon size={14} /> Photo preview
              </label>
              <div
                style={{
                  height: 140,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #d5cbb9",
                  background: "var(--ink)",
                  position: "relative"
                }}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    background: "rgba(13,11,9,0.75)",
                    color: "var(--bone)",
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  {form.image?.trim() ? "Custom image" : `${form.category} preset cover`}
                </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="event-description">Tell people what to expect</label>
              <textarea
                id="event-description"
                className="input"
                style={{ padding: 12, height: 90, resize: "vertical" }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <button className="btn" disabled={busy}>
              {busy ? "Getting it ready…" : "Publish event"} <ArrowUpRight size={16} />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
