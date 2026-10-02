import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-6 py-2.5 rounded-lg gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary:
      'bg-amber-500 text-black hover:bg-amber-400 font-semibold shadow-sm hover:shadow-amber-500/20 shadow-amber-500/10',
    secondary:
      'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700/80',
    outline:
      'bg-transparent text-gray-200 border border-gray-700 hover:border-amber-500/60 hover:text-white hover:bg-gray-800/40',
    danger:
      'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60 hover:text-white',
    ghost:
      'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800/50'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
