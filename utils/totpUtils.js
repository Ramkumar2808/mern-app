import speakeasy from "speakeasy";

// Function to generate TOTP code
export const generateTOTP = (secret) => {
  // Generate the TOTP code using the secret
  const token = speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
  return token;
};

// Function to validate TOTP code
export const validateTOTP = (secret, token) => {
  // Validate the TOTP code against the secret
  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 1, // Allow for a 1-time step size in either direction (30-second window)
  });
  return isValid;
};
