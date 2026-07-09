import {
  GitFork,
  Target,
  Workflow,
  Waves,
  Zap,
  Network,
  Cpu,
  Layers,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Circle,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  GitFork,
  Target,
  Workflow,
  Waves,
  Zap,
  Network,
  Cpu,
  Layers,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Sparkles,
};

export function TopicIcon({
  name,
  className,
  size = 16,
  style,
}: {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const Icon = MAP[name] ?? Circle;
  return <Icon size={size} className={className} style={style} strokeWidth={2} />;
}
