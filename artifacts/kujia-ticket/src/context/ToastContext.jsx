import { createContext,useContext,useState } from "react";
const ToastContext=createContext(null);
export function ToastProvider({children}){const [toast,setToast]=useState(null);const notify=(message,type="success")=>{setToast({message,type,id:Date.now()});setTimeout(()=>setToast(null),3400)};return <ToastContext.Provider value={{toast,notify}}>{children}</ToastContext.Provider>}
export const useToast=()=>useContext(ToastContext);
