// components/common/ConfirmDialog.js
"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, Power, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InlineLoadingSpinner } from "./LoadingSpinner";

// Since we don't have Dialog components installed yet,
// I'll create a simple modal that you can replace with shadcn Dialog later
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  icon = null,
  loading = false,
  className = "",
}) => {
  const variants = {
    destructive: {
      icon: Trash2,
      iconClass: "text-red-500",
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      icon: AlertTriangle,
      iconClass: "text-yellow-500",
      confirmClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    default: {
      icon: AlertTriangle,
      iconClass: "text-blue-500",
      confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const config = variants[variant];
  const IconComponent = icon || config.icon;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div
          className={cn(
            "w-full max-w-md bg-background border rounded-lg shadow-lg p-6",
            className
          )}
        >
          <div className="flex items-start space-x-4">
            {IconComponent && (
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  variant === "destructive"
                    ? "bg-red-100 dark:bg-red-900/20"
                    : variant === "warning"
                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                    : "bg-blue-100 dark:bg-blue-900/20"
                )}
              >
                <IconComponent className={cn("w-5 h-5", config.iconClass)} />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {description}
              </p>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className={config.confirmClass}
                >
                  {loading ? (
                    <>
                      <InlineLoadingSpinner className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Specialized confirm dialogs for common actions
export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  itemName = "this item",
  itemType = "item",
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    loading={loading}
    title={`Delete ${itemType}`}
    description={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
    confirmText="Delete"
    variant="destructive"
    icon={Trash2}
  />
);

export const DeactivateConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  itemName = "this item",
  itemType = "item",
  isActive = true,
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    loading={loading}
    title={`${isActive ? "Deactivate" : "Activate"} ${itemType}`}
    description={`Are you sure you want to ${
      isActive ? "deactivate" : "activate"
    } ${itemName}?`}
    confirmText={isActive ? "Deactivate" : "Activate"}
    variant={isActive ? "warning" : "default"}
    icon={Power}
  />
);

export const RemoveUserConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userName = "this user",
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    loading={loading}
    title="Remove User"
    description={`Are you sure you want to remove ${userName}? They will lose access to the system.`}
    confirmText="Remove User"
    variant="destructive"
    icon={UserX}
  />
);

// Hook for managing confirm dialog state
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openDialog = (action) => {
    setPendingAction(() => action);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setPendingAction(null);
    setLoading(false);
  };

  const confirmAction = async () => {
    if (pendingAction) {
      setLoading(true);
      try {
        await pendingAction();
        closeDialog();
      } catch (error) {
        console.error("Confirm action failed:", error);
        setLoading(false);
      }
    }
  };

  return {
    isOpen,
    loading,
    openDialog,
    closeDialog,
    confirmAction,
  };
};
