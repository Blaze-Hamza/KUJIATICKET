import { BrowserRouter,Route,Routes,useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import { useToast } from "./context/ToastContext.jsx";
import useReveal from "./hooks/useReveal.js";
import HomePage from "./pages/HomePage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import OrganizerPage from "./pages/OrganizerPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./index.css";
import "./motion.css";

function RouteShell(){const location=useLocation();useReveal();const {toast}=useToast();return <div className="app-shell"><Navbar/><main key={location.pathname} className="route-enter"><Routes><Route path="/" element={<HomePage/>}/><Route path="/events" element={<EventsPage/>}/><Route path="/events/:id" element={<EventDetailsPage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/my-tickets" element={<MyTicketsPage/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/organizer" element={<OrganizerPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></main><Footer/><Toast toast={toast}/></div>}
export default function App(){return <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/,"")||"/"} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><RouteShell/></BrowserRouter>}
