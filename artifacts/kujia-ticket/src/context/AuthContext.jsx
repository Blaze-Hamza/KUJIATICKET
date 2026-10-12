import { createContext, useContext, useState } from "react";
import { getCurrentUser, logout } from "../services/api.js";
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(getCurrentUser);const setSession=(next)=>setUser(next);const signOut=()=>{logout();setUser(null)};return <AuthContext.Provider value={{user,setSession,signOut}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
