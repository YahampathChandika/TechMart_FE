// components/common/LoadingSpinner.js
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({
  size = "default",
  className = "",
  text = "Loading...",
}) => {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-muted border-t-foreground",
            sizes[size]
          )}
        />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
};

// Full page loading spinner
export const PageLoadingSpinner = ({ text = "Loading page..." }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

// Inline loading spinner (for buttons, etc.)
export const InlineLoadingSpinner = ({ className = "" }) => (
  <div
    className={cn(
      "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
      className
    )}
  />
);
