import { LoaderCircle } from "lucide-react";
export default function Button({children,variant="primary",loading=false,className="",...props}){return <button className={`btn ${variant==="primary"?"":`btn-${variant}`} ${className}`} disabled={loading||props.disabled} {...props}>{loading&&<LoaderCircle className="button-loader" size={16}/ >}{children}</button>}
