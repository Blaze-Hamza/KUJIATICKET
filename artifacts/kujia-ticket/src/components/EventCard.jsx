import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import Badge from "./Badge.jsx";
import EventPhoto from "./EventPhoto.jsx";

const currency = (event) => {
  const code = { Uganda: "UGX", Tanzania: "TZS", Rwanda: "RWF" }[event.country];
  const rate = { UGX: 28, TZS: 19, RWF: 9.8 }[code];
  return code ? `~${code} ${Math.round(event.price * rate).toLocaleString()}` : `KES ${Number(event.price).toLocaleString()}`;
};

export default function EventCard({ event, layout = "grid" }) {
  const date = new Date(event.date);
  const day = Number.isNaN(date.getTime()) ? event.date.slice(-2) : date.getDate();
  const month = Number.isNaN(date.getTime()) ? "DATE" : date.toLocaleString("en", { month: "short" }).toUpperCase();

  return (
    <article className={`event-card ${layout === "list" ? "event-card-list" : ""}`}>
      <Link to={`/events/${event.id}`} aria-label={`View ${event.title}`}>
        <div className="event-image">
          <EventPhoto event={event} />
          <div className="event-date-badge">
            <strong>{day}</strong>
            {month}
          </div>
          {event.trending && <Badge tone="ember" className="event-trending">On a roll</Badge>}
        </div>
        <div className="event-card-body">
          <span className="eyebrow muted">{event.category} · {event.country}</span>
          <h3>{event.title}</h3>
          <div className="event-location">
            <MapPin size={13} style={{ verticalAlign: "-2px", marginRight: 3 }} />
            {event.city} · {event.venue}
          </div>
          <div className="event-card-foot">
            <span className="event-price">From {currency(event)}</span>
            <span aria-hidden="true"><ArrowUpRight size={18} /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
