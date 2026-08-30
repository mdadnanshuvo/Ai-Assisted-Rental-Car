/**
 * Lightweight unique id generator — avoids pulling in a cuid/uuid
 * dependency for what's otherwise a one-line need. Not cryptographically
 * sensitive; only used as a primary key.
 */
export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}
