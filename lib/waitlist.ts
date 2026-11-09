// Shared between the waitlist form and the /api/waitlist route so both sides
// agree on what a valid username and email look like.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;

const USERNAME_PATTERN = /^[a-z0-9._]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lowercase, drop a leading "@", and strip anything outside a-z 0-9 . _
export function normalizeUsername(value: string) {
  return value
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, USERNAME_MAX);
}

export function isValidUsername(value: string) {
  return (
    value.length >= USERNAME_MIN &&
    value.length <= USERNAME_MAX &&
    USERNAME_PATTERN.test(value)
  );
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}
