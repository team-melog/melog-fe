import type { EmotionSelection } from '@melog/shared';
interface EmotionSelectorProps {
    onSelectionChange?: (selection: EmotionSelection | null) => void;
    className?: string;
}
export default function EmotionSelector({ onSelectionChange, className }: EmotionSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
