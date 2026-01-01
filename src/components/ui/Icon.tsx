import * as Icons from 'lucide-react';

export type LucideIconName = keyof typeof Icons;

export type IconType = {
  name: LucideIconName;
  size?: number;
  color?: string;
  className?: string;
};

const Icon = (props: IconType) => {
  const { name, size = 24, color = 'currentColor', className = '' } = props;
  const LucideIcon = Icons[name] as React.ElementType | undefined;

  if (!LucideIcon) return null;

  return <LucideIcon size={size} color={color} className={className} />;
};

export default Icon;
