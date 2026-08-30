// Shared client-side validation patterns.
// The consultation proxy keeps its own copy (server/consultation-proxy.mjs) so
// server validation never depends on the client bundle.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
