/**
 * Normalize a URL for comparison.
 * - Strips query string and hash
 * - Removes trailing slash
 * - Lowercases the hostname
 *
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    const path = u.pathname.replace(/\/$/, "");
    return `${u.protocol}//${u.host}${path}`.toLowerCase();
  } catch (e) {
    return url;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { normalizeUrl };
}
