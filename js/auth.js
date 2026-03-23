// ─── Nova Accessories — Auth, Session & Maintenance Module ──────────────────
// Ctrl+A on store  → password prompt → toggle maintenance mode
// /admin.html      → lock screen before any content
// Password default : admin123   (SHA-256 hashed in localStorage)

const Auth = (() => {

  // ── Constants ──────────────────────────────────────────────────────────────
  const KEY_HASH        = 'nova_pw_hash';
  const KEY_SESSION     = 'nova_admin_session';
  const KEY_FAILS       = 'nova_fail_count';
  const KEY_LOCKOUT     = 'nova_lockout_until';
  const KEY_MAINTENANCE = 'nova_maintenance';
  const SESSION_TTL     = 2 * 60 * 60 * 1000;   // 2 hours in ms
  const MAX_FAILS       = 3;
  const LOCKOUT_MS      = 30 * 1000;             // 30 seconds
  const DEFAULT_PW      = 'admin123';

  // ── SHA-256 helper (Web Crypto API) ────────────────────────────────────────
  async function sha256(str) {
    const buf    = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ── Init default hash if missing ───────────────────────────────────────────
  async function initHash() {
    if (!localStorage.getItem(KEY_HASH)) {
      const h = await sha256(DEFAULT_PW);
      localStorage.setItem(KEY_HASH, h);
    }
  }

  // ── Session helpers ────────────────────────────────────────────────────────
  function isSessionValid() {
    const s = localStorage.getItem(KEY_SESSION);
    if (!s) return false;
    return Date.now() - parseInt(s, 10) < SESSION_TTL;
  }

  function startSession() {
    localStorage.setItem(KEY_SESSION, Date.now().toString());
    localStorage.setItem(KEY_FAILS, '0');
  }

  function endSession() {
    localStorage.removeItem(KEY_SESSION);
  }

  // ── Lockout helpers ────────────────────────────────────────────────────────
  function isLockedOut() {
    const until = parseInt(localStorage.getItem(KEY_LOCKOUT) || '0', 10);
    return Date.now() < until;
  }

  function getLockoutRemaining() {
    const until = parseInt(localStorage.getItem(KEY_LOCKOUT) || '0', 10);
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  }

  function recordFail() {
    const fails = (parseInt(localStorage.getItem(KEY_FAILS) || '0', 10)) + 1;
    localStorage.setItem(KEY_FAILS, fails.toString());
    if (fails >= MAX_FAILS) {
      localStorage.setItem(KEY_LOCKOUT, (Date.now() + LOCKOUT_MS).toString());
      localStorage.setItem(KEY_FAILS, '0');
    }
    return fails;
  }

  // ── Verify password ────────────────────────────────────────────────────────
  async function verify(password) {
    const stored = localStorage.getItem(KEY_HASH);
    const entered = await sha256(password);
    return stored === entered;
  }

  // ── Change password ────────────────────────────────────────────────────────
  async function changePassword(oldPw, newPw) {
    if (!await verify(oldPw)) return false;
    const h = await sha256(newPw);
    localStorage.setItem(KEY_HASH, h);
    return true;
  }

  // ── Maintenance state ──────────────────────────────────────────────────────
  function getMaintenanceState() {
    const raw = localStorage.getItem(KEY_MAINTENANCE);
    if (!raw) return { active: false, messageAr: 'نعود قريباً ✨', messageEn: 'We\'ll be back soon ✨', backBy: '' };
    return JSON.parse(raw);
  }

  function setMaintenanceState(state) {
    localStorage.setItem(KEY_MAINTENANCE, JSON.stringify(state));
    // Broadcast to other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: KEY_MAINTENANCE }));
  }

  function toggleMaintenance() {
    const s = getMaintenanceState();
    s.active = !s.active;
    setMaintenanceState(s);
    return s.active;
  }

  function isMaintenanceActive() {
    return getMaintenanceState().active;
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    initHash,
    isSessionValid,
    startSession,
    endSession,
    isLockedOut,
    getLockoutRemaining,
    recordFail,
    verify,
    changePassword,
    getMaintenanceState,
    setMaintenanceState,
    toggleMaintenance,
    isMaintenanceActive,
    MAX_FAILS,
  };
})();

// Initialise default password hash on load
Auth.initHash();
