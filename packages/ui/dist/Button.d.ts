import { ButtonHTMLAttributes, ReactNode } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}
export default function Button({ children, className, variant, size, isLoading, disabled, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
