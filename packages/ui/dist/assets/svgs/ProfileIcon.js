import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ProfileIcon({ className = '', isActive = false, }) {
    const color = isActive ? '#13273A' : '#CCD3DA';
    return (_jsxs("svg", { width: "30", height: "30", viewBox: "0 0 30 30", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: className, children: [_jsx("circle", { cx: "15", cy: "8.39252", r: "4.49957", fill: color }), _jsx("path", { d: "M8.00171 25.2662C6.89714 25.2662 6.00171 24.3708 6.00171 23.2662L6.00171 21.0173C6.00171 17.1513 9.13572 14.0173 13.0017 14.0173L17 14.0173C20.866 14.0173 24 17.1513 24 21.0173L24 23.2662C24 24.3708 23.1046 25.2662 22 25.2662L8.00171 25.2662Z", fill: color })] }));
}
