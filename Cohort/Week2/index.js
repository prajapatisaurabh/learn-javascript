class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field; // Extra context beyond just the message
  }
}

class NetworkError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

function validateAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("age", "Age must be a number");
  }
  if (age < 0 || age > 150) {
    throw new ValidationError("age", `Age ${age} is out of valid range`);
  }
  return true;
}

// Catch block can now branch by error type
try {
  validateAge("thirty");
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(
      `Validation failed on field '${error.field}': ${error.message}`,
    );
    // Output: Validation failed on field 'age': Age must be a number
  } else {
    throw error; // Re-throw anything unexpected
  }
}
