import { QRCodeSVG } from "qrcode.react";

export default function TicketPass({ ticket }) {
  const quantity = ticket.quantities?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <article className={`ticket-pass ${ticket.eventImage ? "has-image" : ""}`}>
      {ticket.eventImage && (
        <div className="ticket-pass-image">
          <img src={ticket.eventImage} alt={ticket.eventTitle} loading="lazy" />
        </div>
      )}
      <div className="ticket-pass-main">
        <span className="eyebrow">{ticket.eventDate} · {ticket.eventCity}</span>
        <h3>{ticket.eventTitle}</h3>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {ticket.buyer?.name} · {quantity} ticket{quantity === 1 ? "" : "s"}
        </span>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
          Order {ticket.id} · {ticket.venue}
        </p>
      </div>
      <div className="ticket-qr">
        <QRCodeSVG value={ticket.id} size={90} level="H" />
      </div>
    </article>
  );
}
