import React from 'react';
import {
  BASE_CLASSES,
  VARIANT_CLASSES,
  SIZE_CLASSES,
  BUTTON_TONE,
} from '../../resources/types';
import Icon, { LucideIconName } from './Icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'primary' | 'secondary' | 'danger' | 'warning';
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: LucideIconName;
  rightIcon?: LucideIconName;
  children: React.ReactNode;
};

const Button = (props: ButtonProps) => {
  const {
    tone = 'primary',
    variant = 'solid',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...rest // Only HTML button attributes
  } = props;

  const classes = `${BASE_CLASSES} ${BUTTON_TONE[tone]} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...rest}>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <Icon name={leftIcon} className="w-4 h-4 mr-2" />
      ) : null}
      {children}
      {rightIcon && !isLoading && (
        <Icon name={rightIcon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

export default Button;
