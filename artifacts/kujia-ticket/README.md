# KUJIA•TICKET

A front-end-only event discovery and ticketing experience for Kenya, Uganda, Tanzania and Rwanda. Built with React 18, Vite, JavaScript, React Router v6, lucide-react, qrcode.react and hand-written responsive CSS.

## Run locally

```sh
pnpm install
pnpm --filter @workspace/kujia-ticket dev
```

The managed Vite setup expects `PORT` and `BASE_PATH` from the workspace runtime. Build with `pnpm --filter @workspace/kujia-ticket build`.

## Phase 1 interactions

- Browse, search and filter sixteen seeded regional events by category, country, price, date and sort order; switch grid/list views.
- View event detail, lineup, FAQ, four stock-aware ticket tiers and a persistent cart.
- Complete a three-step mock M-Pesa checkout, then view the QR ticket in My Tickets.
- Create attendee or organiser accounts and sign in on the current device.
- Use the organiser studio to publish mock events and review seeded dashboard metrics.

## Frontend structure

- `src/App.jsx`: Router v6 route table, route shell and global providers.
- `src/pages/`: `HomePage`, `EventsPage`, `EventDetailsPage`, `CartPage`, `CheckoutPage`, `MyTicketsPage`, `AuthPage`, `OrganizerPage`, `NotFoundPage`.
- `src/components/`: `Button`, `Input`, `Select`, `Badge`, `Modal`, `Skeleton`, `Toast`, `EventCard`, `TicketTierCard`, `QuantityStepper`, `SectionHeading`, `Navbar`, `Footer`, `SearchBar`, `FilterChips`, `Stepper`, `TicketPass`, `EmptyState`, `Reveal`, and the event image helper.
- `src/context/`: independent `AuthContext`, `CartContext`, `ToastContext`, composed by `AppContext`.
- `src/hooks/`: `useEvents` and `useReveal`.
- `src/data/events.js`, `src/services/api.js`, `src/index.css`, and `src/motion.css`: seeded event data, replaceable mock-service boundary and the plain-CSS design system.

## Phase 2 backend extension plan

Suggested Express endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/events`, `GET /api/v1/events/:eventId`, `POST /api/v1/events`, `POST /api/v1/orders`, and `GET /api/v1/me/tickets`. Suggested Mongo collections/models: `User` (role and contact), `Event` (organizer, venue, location, date, copy and category), embedded `TicketTier` inventory, `Order` (buyer, line items, total and status), and `Payment` (provider, reference and STK state). Replace `src/services/api.js` internals with authenticated HTTP calls while retaining the existing page/service contracts. Add server-side inventory reservations and payment callbacks before accepting real transactions.

## Mock service layer

`src/services/api.js` exports asynchronous event, order, ticket, auth and event-creation operations. Each applies an artificial delay and uses localStorage for mutable state. Event seed records live in `src/data/events.js`. This boundary is designed so the service implementations can later call Express/Mongo endpoints without changing page components.

This demo does not process real payments, verify passwords against a server, or provide multi-device persistence. All account, event and order state is local to the browser.
