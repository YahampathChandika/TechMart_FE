// lib/formErrorUtils.js

/**
 * Handle Laravel validation errors and apply them to react-hook-form
 * @param {Object} result - API response result
 * @param {Function} setFieldError - react-hook-form setError function
 * @param {Function} setGeneralError - Function to set general error message
 * @returns {boolean} - Returns true if errors were handled, false otherwise
 */
export const handleValidationErrors = (
  result,
  setFieldError,
  setGeneralError
) => {
  if (!result || result.success) return false;

  console.log("Handling validation errors:", result); // Debug log

  // FIXED: Handle Laravel validation errors with correct structure
  // Backend sends: { success: false, errors: { email: ["Error message"] } }
  if (result.errors && typeof result.errors === "object") {
    let hasFieldErrors = false;

    Object.keys(result.errors).forEach((fieldName) => {
      const fieldErrors = result.errors[fieldName];
      if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        setFieldError(fieldName, {
          type: "manual",
          message: fieldErrors[0], // Show first error for each field
        });
        hasFieldErrors = true;
      }
    });

    // FIXED: Don't show generic errors when we have specific field errors
    // Only show general error if it's meaningful and not a generic validation message
    if (hasFieldErrors) {
      // Clear any general error since we're showing field-specific errors
      setGeneralError("");
      return true;
    }
  }

  // LEGACY: Handle old validationErrors format (if still used somewhere)
  if (result.validationErrors && typeof result.validationErrors === "object") {
    Object.keys(result.validationErrors).forEach((fieldName) => {
      const fieldErrors = result.validationErrors[fieldName];
      if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        setFieldError(fieldName, {
          type: "manual",
          message: fieldErrors[0],
        });
      }
    });
    return true;
  }

  // Handle error messages that might contain JSON
  if (result.error && typeof result.error === "string") {
    try {
      const errorData = JSON.parse(result.error);

      if (errorData.errors && typeof errorData.errors === "object") {
        Object.keys(errorData.errors).forEach((fieldName) => {
          const fieldErrors = errorData.errors[fieldName];
          if (
            fieldErrors &&
            Array.isArray(fieldErrors) &&
            fieldErrors.length > 0
          ) {
            setFieldError(fieldName, {
              type: "manual",
              message: fieldErrors[0],
            });
          }
        });
        return true;
      }

      if (errorData.message) {
        setGeneralError(errorData.message);
        return true;
      }
    } catch (parseError) {
      // Not JSON, continue to other handling
      console.log("Error parsing JSON error:", parseError);
    }
  }

  // Handle specific common validation patterns in error messages
  const errorMessage = result.error || result.message || "";

  if (
    errorMessage.includes("email") &&
    errorMessage.toLowerCase().includes("taken")
  ) {
    setFieldError("email", {
      type: "manual",
      message: "This email address is already registered",
    });
    return true;
  }

  if (
    errorMessage.includes("email") &&
    errorMessage.toLowerCase().includes("not found")
  ) {
    setFieldError("email", {
      type: "manual",
      message: "No account found with this email address",
    });
    return true;
  }

  if (
    errorMessage.toLowerCase().includes("credentials") ||
    errorMessage.toLowerCase().includes("invalid login")
  ) {
    setFieldError("password", {
      type: "manual",
      message: "Incorrect email or password",
    });
    return true;
  }

  if (errorMessage.toLowerCase().includes("password")) {
    setFieldError("password", {
      type: "manual",
      message: "Incorrect password",
    });
    return true;
  }

  if (
    errorMessage.toLowerCase().includes("deactivated") ||
    errorMessage.toLowerCase().includes("inactive")
  ) {
    setGeneralError(
      "Your account has been deactivated. Please contact support."
    );
    return true;
  }

  // Fallback to general error
  setGeneralError(errorMessage || "An error occurred. Please try again.");
  return true;
};

/**
 * Clear all form errors
 * @param {Function} clearErrors - react-hook-form clearErrors function
 * @param {Function} setGeneralError - Function to set general error message
 */
export const clearAllErrors = (clearErrors, setGeneralError) => {
  clearErrors();
  setGeneralError("");
};

/**
 * Extract user-friendly error message from API response
 * @param {Object} result - API response result
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (result) => {
  if (!result || result.success) return "";

  // Handle validation errors by extracting field messages
  if (result.errors && typeof result.errors === "object") {
    const firstFieldErrors = Object.values(result.errors)[0];
    if (
      firstFieldErrors &&
      Array.isArray(firstFieldErrors) &&
      firstFieldErrors.length > 0
    ) {
      return firstFieldErrors[0];
    }
  }

  // Try to parse JSON error
  if (result.error && typeof result.error === "string") {
    try {
      const errorData = JSON.parse(result.error);
      if (errorData.message) return errorData.message;

      // Handle nested errors
      if (errorData.errors) {
        const firstFieldErrors = Object.values(errorData.errors)[0];
        if (
          firstFieldErrors &&
          Array.isArray(firstFieldErrors) &&
          firstFieldErrors.length > 0
        ) {
          return firstFieldErrors[0];
        }
      }
    } catch (e) {
      // Continue to other handling
    }
  }

  return result.error || result.message || "An unexpected error occurred";
};

/**
 * Format Laravel validation errors for display
 * @param {Object} errors - Laravel validation errors object
 * @returns {Array} - Array of formatted error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") return [];

  const formattedErrors = [];

  Object.keys(errors).forEach((fieldName) => {
    const fieldErrors = errors[fieldName];
    if (fieldErrors && Array.isArray(fieldErrors)) {
      fieldErrors.forEach((error) => {
        formattedErrors.push({
          field: fieldName,
          message: error,
        });
      });
    }
  });

  return formattedErrors;
};

/**
 * Check if result contains validation errors
 * @param {Object} result - API response result
 * @returns {boolean} - True if validation errors exist
 */
export const hasValidationErrors = (result) => {
  return (
    result &&
    !result.success &&
    result.errors &&
    typeof result.errors === "object" &&
    Object.keys(result.errors).length > 0
  );
};

/**
 * Get a user-friendly summary of validation errors
 * @param {Object} errors - Form errors object from react-hook-form
 * @returns {string} - Summary message
 */
export const getValidationErrorSummary = (errors) => {
  const errorCount = Object.keys(errors).length;
  if (errorCount === 0) return "";
  if (errorCount === 1) return "Please fix the error below.";
  return `Please fix the ${errorCount} errors below.`;
};
