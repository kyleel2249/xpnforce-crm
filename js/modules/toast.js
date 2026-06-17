// /js/modules/toast.js
export class ToastManager {
  show(msg, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span class="flex-1 text-white">${msg}</span>
      <button onclick="this.parentElement.remove()" class="text-slate hover:text-white ml-2">✕</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.style.animation = 'toastIn 0.3s ease reverse', duration - 300);
    setTimeout(() => toast.remove(), duration);
  }
}
