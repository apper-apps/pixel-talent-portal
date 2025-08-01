import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] shadow-md hover:shadow-lg focus-visible:ring-primary-500",
    secondary: "bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 active:scale-[0.98] shadow-sm hover:shadow-md focus-visible:ring-primary-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 active:scale-[0.98] shadow-sm hover:shadow-md focus-visible:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] focus-visible:ring-gray-500"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;