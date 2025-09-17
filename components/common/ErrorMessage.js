// components/common/ErrorMessage.js
"use client";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ErrorMessage = ({
  title = "Error",
  message,
  variant = "default",
  className = "",
  onRetry = null,
  onDismiss = null,
  retryText = "Try Again",
  extraActions = null, 
}) => {
  const variants = {
    default:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/10 dark:text-red-400",
    destructive:
      "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/10 dark:text-destructive",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-400",
  };

  return (
    <div className={cn("rounded-lg border p-4", variants[variant], className)}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}

          {(onRetry || onDismiss || extraActions) && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="h-8"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {retryText}
                </Button>
              )}
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="h-8"
                >
                  Dismiss
                </Button>
              )}
              {extraActions}
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 flex-shrink-0 p-1 hover:bg-black/5 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Specialized error components
export const FormFieldError = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <p className={cn("text-sm text-destructive mt-1", className)}>{message}</p>
  );
};

export const NetworkError = ({ onRetry, className = "" }) => (
  <ErrorMessage
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection."
    variant="warning"
    onRetry={onRetry}
    className={className}
  />
);

export const NotFoundError = ({
  title = "Not Found",
  message = "The requested item could not be found.",
  className = "",
}) => (
  <ErrorMessage
    title={title}
    message={message}
    variant="default"
    className={className}
  />
);

export const UnauthorizedError = ({ onLogin = null, className = "" }) => {
  const router = useRouter();

  return (
    <ErrorMessage
      title="Access Denied"
      message="You don't have permission to access this resource."
      variant="destructive"
      onRetry={onLogin}
      retryText="Login"
      className={className}
      extraActions={
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      }
    />
  );
};
