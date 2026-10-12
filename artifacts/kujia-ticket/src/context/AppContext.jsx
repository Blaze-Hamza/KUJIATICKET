import { AuthProvider,useAuth } from "./AuthContext.jsx";
import { CartProvider,useCart } from "./CartContext.jsx";
import { ToastProvider,useToast } from "./ToastContext.jsx";
export function AppProvider({children}){return <AuthProvider><CartProvider><ToastProvider>{children}</ToastProvider></CartProvider></AuthProvider>}
export function useApp(){return {...useAuth(),...useCart(),...useToast()}}
