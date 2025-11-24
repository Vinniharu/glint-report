import * as React from "react";
import { cn } from "@/lib/utils";

// Note: I didn't install class-variance-authority or radix-ui/react-slot in the plan.
// I should probably stick to simple props or install them.
// The plan said "Install lucide-react clsx tailwind-merge".
// I will implement a simpler version without cva/slot to avoid extra deps not in plan, 
// or I can just use standard props.
// Let's stick to standard props and clsx/tailwind-merge for now to match the plan strictly 
// unless I want to add cva. CVA is great. I'll add it if I can, but I didn't ask for it.
// I'll write a non-CVA version to be safe and self-contained, or just use a simple switch/map.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
            ghost: "hover:bg-gray-100 hover:text-gray-900",
            outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
