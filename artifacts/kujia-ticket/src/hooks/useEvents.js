import { useEffect,useState } from "react";
import { getEvents } from "../services/api.js";
export default function useEvents(){const [items,setItems]=useState(null);const [error,setError]=useState("");const reload=()=>getEvents().then(setItems).catch(()=>setError("Couldn’t load the events just now."));useEffect(()=>{let active=true;getEvents().then(data=>active&&setItems(data)).catch(()=>active&&setError("Couldn’t load the events just now."));return()=>{active=false}},[]);return{items,error,reload}}
