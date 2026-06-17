// /js/utils/eventbus.js
export class EventBus {
  constructor() { this._listeners = {}; }
  on(event, fn)  { (this._listeners[event] = this._listeners[event] || []).push(fn); return this; }
  off(event, fn) { if (this._listeners[event]) this._listeners[event] = this._listeners[event].filter(f => f !== fn); }
  emit(event, data) { (this._listeners[event] || []).forEach(fn => fn(data)); }
  once(event, fn) {
    const wrapper = (data) => { fn(data); this.off(event, wrapper); };
    this.on(event, wrapper);
  }
}
