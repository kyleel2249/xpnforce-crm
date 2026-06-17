// /js/modules/auth.js
export class AuthManager {
  constructor() {
    this._readyCb  = null;
    this._user     = null;
    this._useDemoMode = false;

    this._bindUI();
    this._watchAuthState();
  }

  _bindUI() {
    document.getElementById('btn-login').addEventListener('click', () => this._login());
    document.getElementById('btn-demo').addEventListener('click',  () => this._demoLogin());
    document.getElementById('auth-password').addEventListener('keydown', e => {
      if (e.key === 'Enter') this._login();
    });
  }

  async _login() {
    const email = document.getElementById('auth-email').value.trim();
    const pass  = document.getElementById('auth-password').value;
    const errEl = document.getElementById('auth-error');
    errEl.classList.add('hidden');

    if (!email || !pass) {
      errEl.textContent = 'Please enter email and password.';
      errEl.classList.remove('hidden');
      return;
    }

    const btn = document.getElementById('btn-login');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    try {
      if (window.__firebase) {
        const { auth, signInWithEmailAndPassword } = window.__firebase;
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        this._resolveUser(cred.user);
      } else {
        // Fallback demo
        this._demoLogin();
      }
    } catch (err) {
      errEl.textContent = this._friendlyError(err.code);
      errEl.classList.remove('hidden');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  }

  _demoLogin() {
    this._useDemoMode = true;
    const demoUser = {
      uid: 'demo-user-001',
      email: 'demo@xpnforce.com',
      displayName: 'Demo User',
      photoURL: null,
    };
    this._resolveUser(demoUser);
  }

  _resolveUser(user) {
    this._user = user;
    document.getElementById('user-name').textContent   = user.displayName || user.email || 'User';
    document.getElementById('user-role').textContent   = 'Super Admin';
    const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
    document.getElementById('user-avatar').textContent = initial;
    if (this._readyCb) this._readyCb(user);
  }

  _watchAuthState() {
    if (window.__firebase) {
      const { auth, onAuthStateChanged } = window.__firebase;
      onAuthStateChanged(auth, user => {
        if (user && !this._user) this._resolveUser(user);
      });
    }
  }

  onReady(cb) { this._readyCb = cb; }

  async signOut() {
    if (window.__firebase && !this._useDemoMode) {
      const { auth, signOut } = window.__firebase;
      await signOut(auth);
    }
    location.reload();
  }

  getUser() { return this._user; }

  _friendlyError(code) {
    const map = {
      'auth/user-not-found':    'No account found with this email.',
      'auth/wrong-password':    'Incorrect password.',
      'auth/invalid-email':     'Invalid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
    };
    return map[code] || 'Authentication failed. Try demo mode.';
  }
}
