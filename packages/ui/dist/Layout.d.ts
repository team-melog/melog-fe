import { ReactNode } from "react";
interface LayoutProps {
    children: ReactNode;
    className?: string;
    showTabBar?: boolean;
}
export default function Layout({ children, className, showTabBar, }: LayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
