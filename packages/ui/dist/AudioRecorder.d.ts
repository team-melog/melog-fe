interface AudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  maxDuration?: number;
  className?: string;
}
export default function AudioRecorder({
  onTranscriptionComplete,
  onError,
  maxDuration,
  className,
}: AudioRecorderProps): import('react/jsx-runtime').JSX.Element;
export {};
