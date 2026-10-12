import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export default function NotFoundPage(){return <section className="notfound"><div><span className="eyebrow">Wrong turn, right continent</span><h1>404</h1><p>There’s no event at this address. The good ones are just around the corner.</p><Link className="btn" to="/events">Find the good stuff <ArrowRight size={16}/></Link></div></section>}
