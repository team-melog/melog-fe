import { ReactNode } from 'react';
interface LayoutProps {
    children: ReactNode;
    className?: string;
    showTabBar?: boolean;
    nickname?: string | null;
}
export default function Layout({ children, className, showTabBar, nickname, }: LayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
