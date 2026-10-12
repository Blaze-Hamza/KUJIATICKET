export default function Badge({children,tone="acacia",className=""}){return <span className={`tag badge-${tone} ${className}`}>{children}</span>}
