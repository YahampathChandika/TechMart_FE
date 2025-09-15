// components/common/index.js

// Export all common components for easy importing
export {
  LoadingSpinner,
  PageLoadingSpinner,
  InlineLoadingSpinner,
} from "./LoadingSpinner";
export {
  ErrorMessage,
  FormFieldError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
} from "./ErrorMessage";
export { ThemeToggle, ThemeSelector } from "./ThemeToggle";
export {
  ConfirmDialog,
  DeleteConfirmDialog,
  DeactivateConfirmDialog,
  RemoveUserConfirmDialog,
  useConfirmDialog,
} from "./ConfirmDialog";
export { Header } from "./Header";
export { Footer } from "./Footer";
