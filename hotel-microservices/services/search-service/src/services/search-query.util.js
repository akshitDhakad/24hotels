/**
 * Escape user input for safe use inside RegExp.
 * @param {string} s
 */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize query for stable cache keys (sorted keys + sorted amenities).
 * @param {object} q
 */
function isEmptyValue(v) {
  if (v === undefined || v === null || v === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function normalizeForCacheKey(q) {
  const base = { ...q };
  if (Array.isArray(base.amenities)) {
    base.amenities = [...base.amenities].map((a) => String(a).trim().toLowerCase()).filter(Boolean).sort();
  }
  const keys = Object.keys(base).filter((k) => !isEmptyValue(base[k])).sort();
  const normalized = {};
  keys.forEach((k) => {
    normalized[k] = base[k];
  });
  return normalized;
}

module.exports = { escapeRegex, normalizeForCacheKey };
