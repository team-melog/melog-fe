import { jsx as _jsx } from "react/jsx-runtime";
export default function FeedIcon({ className = '', isActive = false, }) {
    const color = isActive ? '#13273A' : '#CCD3DA';
    return (_jsx("svg", { width: "30", height: "30", viewBox: "0 0 30 30", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: _jsx("path", { d: "M16.2969 26H9.88379C6.6343 26 4 23.3657 4 20.1162V9.88379C4 6.6343 6.6343 4 9.88379 4H16.2969V26ZM26 20.1162C26 23.3657 23.3657 26 20.1162 26H17.7969V17.7969H26V20.1162ZM20.1162 4C23.3657 4 26 6.6343 26 9.88379V16.2969H17.7969V4H20.1162Z", fill: color }) }));
}
