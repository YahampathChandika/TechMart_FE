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

  // Handle Laravel validation errors with specific structure
  if (result.validationErrors) {
    Object.keys(result.validationErrors).forEach((fieldName) => {
      const fieldErrors = result.validationErrors[fieldName];
      if (fieldErrors && fieldErrors.length > 0) {
        setFieldError(fieldName, {
          type: "manual",
          message: fieldErrors[0], // Show first error for each field
        });
      }
    });
    return true;
  }

  // Try to parse error string as JSON (Laravel validation response)
  if (result.error && typeof result.error === "string") {
    try {
      const errorData = JSON.parse(result.error);

      if (errorData.errors) {
        Object.keys(errorData.errors).forEach((fieldName) => {
          const fieldErrors = errorData.errors[fieldName];
          if (fieldErrors && fieldErrors.length > 0) {
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
    }
  }

  // Handle common validation patterns
  const errorMessage = result.error || result.message || "";

  if (errorMessage.includes("email") && errorMessage.includes("taken")) {
    setFieldError("email", {
      type: "manual",
      message: "This email address is already registered",
    });
    return true;
  }

  if (errorMessage.includes("email") && errorMessage.includes("not found")) {
    setFieldError("email", {
      type: "manual",
      message: "No account found with this email address",
    });
    return true;
  }

  if (
    errorMessage.includes("credentials") ||
    errorMessage.includes("password")
  ) {
    setFieldError("password", {
      type: "manual",
      message: "Incorrect password",
    });
    return true;
  }

  if (
    errorMessage.includes("deactivated") ||
    errorMessage.includes("inactive")
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

  // Try to parse JSON error
  if (result.error && typeof result.error === "string") {
    try {
      const errorData = JSON.parse(result.error);
      if (errorData.message) return errorData.message;
    } catch (e) {
      // Continue to other handling
    }
  }

  return result.error || result.message || "An unexpected error occurred";
};
