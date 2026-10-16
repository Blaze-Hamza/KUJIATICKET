import { categoryImages } from "../data/events.js";

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

export default function EventPhoto({ event, ...props }) {
  const fallback = (event?.category && categoryImages[event.category]) || DEFAULT_FALLBACK;
  const src = event?.image || fallback;

  return (
    <img
      src={src}
      alt={`${event?.title || "Event"} cover`}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
      {...props}
    />
  );
}
