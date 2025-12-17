
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-sm font-black uppercase tracking-widest transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-[2px]";
  
  const variants = {
    primary: "bg-[#e10600] border-[#b00500] text-white hover:bg-[#ff0700]",
    secondary: "bg-[#333333] border-[#111111] text-gray-200 hover:bg-[#444444]",
    danger: "bg-red-800 border-red-950 text-red-100 hover:bg-red-700",
    success: "bg-emerald-700 border-emerald-900 text-emerald-50 text-white hover:bg-emerald-600",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-30 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4`} {...props}>
      {children}
    </button>
  );
};
