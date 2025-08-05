interface AIAnalysisData {
  summary: string;
  suggestions: string[];
  emotionScore: number;
}
interface AIAnalysisResultProps {
  analysis: AIAnalysisData;
  isLoading?: boolean;
  onRetry?: () => void;
  className?: string;
}
export default function AIAnalysisResult({
  analysis,
  isLoading,
  onRetry,
  className,
}: AIAnalysisResultProps): import('react/jsx-runtime').JSX.Element;
export {};
