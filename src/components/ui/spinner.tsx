import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
}

export function Spinner({
  className,
  size = "default",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        {
          "h-4 w-4": size === "default",
          "h-3 w-3": size === "sm",
          "h-6 w-6": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
