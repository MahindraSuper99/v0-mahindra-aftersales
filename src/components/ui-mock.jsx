import React from 'react';
import { cn } from '@lib/utils';

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
);
export const CardHeader = ({ className, ...props }) => <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
export const CardTitle = ({ className, ...props }) => <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
export const CardDescription = ({ className, ...props }) => <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
export const CardContent = ({ className, ...props }) => <div className={cn("p-6 pt-0", className)} {...props} />;

export const Button = ({ className, variant, size, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      variant === "outline" ? "border border-input bg-background hover:bg-accent" : "bg-[#b81d24] text-white hover:bg-[#901318]",
      size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 py-2",
      className
    )}
    {...props}
  />
);

export const Input = ({ className, ...props }) => (
  <input className={cn("flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", className)} {...props} />
);

export const Label = ({ className, ...props }) => <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;

export const Textarea = ({ className, ...props }) => (
  <textarea className={cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", className)} {...props} />
);

export const Checkbox = ({ checked, onCheckedChange, className, ...props }) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className={cn("h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary", className)} {...props} />
);
