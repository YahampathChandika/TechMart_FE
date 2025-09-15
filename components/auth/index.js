// components/auth/index.js

// Export all auth components for easy importing
export { LoginForm } from "./LoginForm";
export { RegisterForm } from "./RegisterForm";
export {
  AuthGuard,
  AdminGuard,
  CustomerGuard,
  GuestGuard,
  useAuthGuard,
} from "./AuthGuard";
