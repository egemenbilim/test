/* ══════════════════════════════════════════════════════
   Eğitim Promptları Deposu — Yardımcı Araçlar (Utils)
   ══════════════════════════════════════════════════════ */

import { TURKISH_RULE } from './templates.js';

export function toast(msg, type) {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast ' + (type || 'err');
  t.innerHTML = (type === 'ok' ? '✅ ' : '⚠️ ') + msg;
  wrap.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, 3200);
}

export function markInvalid(el) {
  if (!el) return;
  el.classList.remove('invalid');
  void el.offsetWidth;
  el.classList.add('invalid');
  el.addEventListener('animationend', () => el.classList.remove('invalid'), { once: true });
}

export function setResult(text) {
  const box = document.getElementById('result-box');
  if (!box) return;

  box.textContent = text.trim() + TURKISH_RULE;
  box.classList.remove('empty');
  box.style.animation = 'none';
  void box.offsetWidth;
  box.style.animation = '';
  box.scrollTop = 0;

  const charEl = document.getElementById('count-chars');
  if (charEl) charEl.textContent = box.textContent.length.toLocaleString('tr-TR');

  const wordEl = document.getElementById('count-words');
  if (wordEl) wordEl.textContent = box.textContent.split(/\s+/).filter(Boolean).length.toLocaleString('tr-TR');

  const chip = document.getElementById('status-chip');
  if (chip) chip.classList.add('ok');

  const statusText = document.getElementById('status-text');
  if (statusText) statusText.textContent = 'Hazır · Türkçe Çıktı';

  const paper = document.getElementById('paper');
  if (paper) {
    paper.classList.remove('pulse');
    void paper.offsetWidth;
    paper.classList.add('pulse');
  }
}

export function tidy(s) {
  return s.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
