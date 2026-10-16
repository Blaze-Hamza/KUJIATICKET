import { events as seedEvents, categoryImages } from "../data/events.js";

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);

    // Auto-migrate legacy picsum placeholders in localStorage to the matching high-res photos
    if (key === "kujia.events" && Array.isArray(data)) {
      let changed = false;
      const updated = data.map((ev) => {
        const seed = seedEvents.find((s) => s.id === ev.id);
        if (seed && (!ev.image || ev.image.includes("picsum.photos"))) {
          changed = true;
          return { ...ev, image: seed.image };
        }
        if (!ev.image || ev.image.includes("picsum.photos")) {
          changed = true;
          return {
            ...ev,
            image: categoryImages[ev.category] || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
          };
        }
        return ev;
      });
      if (changed) {
        localStorage.setItem(key, JSON.stringify(updated));
      }
      return updated;
    }

    return data ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export async function getEvents() {
  await wait(300);
  return [...read("kujia.events", seedEvents)];
}

export async function getEventById(id) {
  await wait(250);
  return [...read("kujia.events", seedEvents)].find((event) => event.id === id) || null;
}

export async function createOrder(payload) {
  await wait(500);
  const order = {
    ...payload,
    id: `KJ-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "confirmed"
  };
  const orders = read("kujia.orders", []);
  orders.unshift(order);
  write("kujia.orders", orders);

  if (payload.eventId) {
    const events = read("kujia.events", seedEvents);
    write(
      "kujia.events",
      events.map((event) =>
        event.id !== payload.eventId
          ? event
          : {
              ...event,
              tiers: event.tiers.map((tier) => {
                const purchased = payload.quantities.find((line) => line.tier === tier.name)?.quantity || 0;
                return { ...tier, stock: Math.max(0, tier.stock - purchased) };
              })
            }
      )
    );
    write(
      "kujia.cart",
      read("kujia.cart", []).filter((item) => item.event.id !== payload.eventId)
    );
    window.dispatchEvent(new Event("kujia:cart-updated"));
  }
  return order;
}

export async function getMyTickets() {
  await wait(300);
  return read("kujia.orders", []);
}

export async function login(email, password) {
  await wait(350);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
    throw new Error("Enter a valid email and a password of at least 6 characters.");
  }
  const users = read("kujia.users", []);
  let user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: `u-${Date.now()}`,
      name: email.split("@")[0].replace(/[._-]/g, " "),
      email,
      role: "attendee"
    };
    users.push(user);
    write("kujia.users", users);
  }
  write("kujia.user", user);
  return user;
}

export async function register(payload) {
  await wait(350);
  const users = read("kujia.users", []);
  if (users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("An account with that email already exists.");
  }
  const user = { id: `u-${Date.now()}`, ...payload };
  users.push(user);
  write("kujia.users", users);
  write("kujia.user", user);
  return user;
}

export async function createEvent(payload) {
  await wait(450);
  const list = read("kujia.events", seedEvents);
  const basePrice = Number(payload.price) || 0;
  const stock = Number(payload.stock) || 100;
  const fallbackImage = categoryImages[payload.category] || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

  const event = {
    ...payload,
    id: `local-${Date.now()}`,
    image: payload.image?.trim() || fallbackImage,
    stock,
    maxPrice: basePrice * 4,
    tiers: [
      { name: "Early Bird", price: basePrice, stock: Math.ceil(stock * 0.2), description: "Limited release · mobile ticket" },
      { name: "Regular", price: Math.round(basePrice * 1.5), stock: Math.ceil(stock * 0.55), description: "Standard admission" },
      { name: "VIP", price: Math.round(basePrice * 3), stock: Math.ceil(stock * 0.15), description: "Priority entry + reserved area" },
      { name: "Group of 4", price: Math.round(basePrice * 1.5 * 3.6), stock: Math.floor((stock * 0.1) / 4), description: "Four entries in one booking" }
    ],
    lineup: payload.lineup || [],
    tags: [payload.category, payload.city],
    featured: false,
    trending: true
  };

  list.unshift(event);
  write("kujia.events", list);
  return event;
}

export const getCurrentUser = () => read("kujia.user", null);
export const logout = () => localStorage.removeItem("kujia.user");
