/**
 * Egemen's Testmaker — Offline / file:// & Web Standalone Bundle
 * Otomatik oluşturulmuş tek dosya dağıtım paketi.
 * Hem yerel dosya sisteminden (file://) doğrudan çift tıklamayla
 * hem de HTTP/HTTPS sunuculardan CORS kısıtlaması olmadan çalışır.
 */
(function() {
  'use strict';
  const __modules = {};
  const __cache = {};

  function __define(id, fn) {
    __modules[id] = fn;
  }

  function __require(id) {
    if (__cache[id]) return __cache[id];
    if (!__modules[id]) {
      throw new Error('Modül bulunamadı: ' + id);
    }
    const module = { exports: {} };
    __cache[id] = module.exports;
    __modules[id](module.exports, function(dep) {
      return __require(dep);
    }, module);
    __cache[id] = module.exports;
    return module.exports;
  }


__define('state.js', function(__exports, __require, __module) {
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const MAX = 100;

const S = {
  testType: 'yazili',
  groups: 1,
  columns: 2,
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 5,
  spacing: false,
  spacingValue: 10,
  smartLayout: false,
  watermark: '',
  watermarkAngle: 45,
  watermarkSize: 44,
  watermarkDivider: false,
  themeColor: '#1d4ed8',
  optic: false,
  showAnswerKey: true,
  konuKapsami: '',
  denemeNo: '',
  template: 'none',
  mebYear: '2026 - 2027 Eğitim - Öğretim Yılı',
  mebSchool: '',
  mebDate: '',
  mebLesson: '',
  mebGrade: '',
  mebExam: '',
  mebNameLbl: 'Adı-Soyadı:',
  mebClassLbl: 'Sınıfı:',
  mebNoLbl: 'Okul No.:',
  mebScoreLbl: 'Puan:',
  mebLogo: true,
  logoChoice: 'meb',
  logoW: 22,
  logoH: 22,
  logoX: null,
  logoY: null,
  mebPos: null,
  title: '',
  school: '',
  lesson: '2025-2026 EĞİTİM ÖĞRETİM YILI',
  description: 'Aşağıdaki soruları dikkatlice okuyunuz. Her soru 10 Puan olmakla birlikte sınav süreniz 40 dakikadır.',
  // Yeni özellik durumları
  customTemplateId: null,
  showQuestionAreaGuide: false,
  activeBankId: null
};

const PRESET_COLORS = [
  { name: 'MEB Bordo', hex: '#b91c1c' },
  { name: 'Resmî Lacivert', hex: '#1e3a8a' },
  { name: 'Zümrüt Yeşili', hex: '#0f766e' },
  { name: 'Canlandırıcı Turuncu', hex: '#ea580c' },
  { name: 'Kurşunî Antrasit', hex: '#334155' }
];

const questions = [];

function setQuestions(newArr) {
  questions.length = 0;
  if (Array.isArray(newArr)) {
    questions.push(...newArr);
  }
}

function clearQuestions() {
  questions.length = 0;
}


// Module Exports
__exports['LETTERS'] = LETTERS;
__exports['MAX'] = MAX;
__exports['S'] = S;
__exports['PRESET_COLORS'] = PRESET_COLORS;
__exports['questions'] = questions;
__exports['setQuestions'] = setQuestions;
__exports['clearQuestions'] = clearQuestions;

});

__define('utils.js', function(__exports, __require, __module) {
const $ = (id) => document.getElementById(id);

const uid = () => 'q' + Math.random().toString(36).slice(2, 10);

function esc(s) {
  return String(s || '')
    .replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
    .replace(/\n/g, '<br>');
}

function slugForFile(s) {
  const map = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
  };
  return String(s || '')
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (m) => map[m] || m)
    .replace(/[^a-zA-Z0-9 _-]+/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function defaultBaseName(cleanTitle, S) {
  const base = slugForFile(cleanTitle);
  if (base) return base;
  if (S && S.template === 'meb') {
    const combo = slugForFile([S.mebSchool, S.mebLesson, S.mebGrade, S.mebExam].filter(Boolean).join(' - '));
    if (combo) return combo;
  }
  return 'Sinav';
}

function todayStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function parseTags(title) {
  const tags = (title.match(/\[[A-Z_]+\]/g) || []);
  return {
    clean: title.replace(/\[[A-Z_]+\]/g, '').trim(),
    noPageNumber: tags.includes('[NO_PAGENUMBER]'),
    noDescription: tags.includes('[NO_DESCRIPTION]'),
    noUppercase: tags.includes('[NO_UPPERCASE]'),
    centerDescription: tags.includes('[CENTER_DESCRIPTION]'),
    hideVersion: tags.includes('[HIDE_VERSION]'),
    negativeAngle: tags.includes('[NEGATIVE_WATERMARK_ANGLE]')
  };
}

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toBlocks(qs) {
  const seen = new Set(), out = [];
  qs.forEach(q => {
    if (seen.has(q.id)) return;
    if (q.groupId) {
      const g = qs.filter(x => x.groupId === q.groupId);
      g.forEach(x => seen.add(x.id));
      out.push(g);
    } else {
      seen.add(q.id);
      out.push([q]);
    }
  });
  return out;
}

function booklet(qs, i) {
  const b = toBlocks(qs);
  return i === 0 ? b.flat() : shuffle(b).map(g => g.length > 1 ? shuffle(g) : g).flat();
}

function jpegBytes(dataURL) {
  const b = atob(dataURL.split(',')[1]);
  const a = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
  return a;
}

function openModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('flex');
}

function closeModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.add('hidden');
  el.classList.remove('flex', 'above');
}

function warnText(msg) {
  const w = $('txtWarn');
  if (w) {
    w.textContent = msg;
    w.classList.remove('on');
    void w.offsetWidth;
    w.classList.add('on');
  }
  try { window.alert(msg); } catch (e) {}
}

function clearWarn() {
  const w = $('txtWarn');
  if (w) {
    w.classList.remove('on');
    w.textContent = '';
  }
}

function setProgress(d, t) {
  const p = $('progress');
  if (!p) return;
  if (t === null) {
    p.classList.add('hidden');
    return;
  }
  p.classList.remove('hidden');
  p.innerHTML = `Yükleniyor ${d} / ${t}<div class="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-white/20"><div class="h-1 rounded-full bg-white transition-all" style="width:${d / t * 100}%"></div></div>`;
}


// Module Exports
__exports['$'] = $;
__exports['uid'] = uid;
__exports['esc'] = esc;
__exports['slugForFile'] = slugForFile;
__exports['defaultBaseName'] = defaultBaseName;
__exports['todayStr'] = todayStr;
__exports['parseTags'] = parseTags;
__exports['shuffle'] = shuffle;
__exports['toBlocks'] = toBlocks;
__exports['booklet'] = booklet;
__exports['jpegBytes'] = jpegBytes;
__exports['openModal'] = openModal;
__exports['closeModal'] = closeModal;
__exports['warnText'] = warnText;
__exports['clearWarn'] = clearWarn;
__exports['setProgress'] = setProgress;

});

__define('modules/customTemplate.js', function(__exports, __require, __module) {
const { S } = __require('state.js');
const { $, uid, esc, openModal, closeModal } = __require('utils.js');

const TPL_STORAGE_KEY = 'testmaker_custom_templates_v1';

let customTemplates = [];
let editingTplId = null;
let onTemplateChangeCallback = null;

function setOnTemplateChangeCallback(fn) {
  onTemplateChangeCallback = fn;
}

function loadCustomTemplates() {
  try {
    const raw = localStorage.getItem(TPL_STORAGE_KEY);
    customTemplates = raw ? JSON.parse(raw) : [];
  } catch (e) {
    customTemplates = [];
  }
  if (!customTemplates.length) {
    customTemplates = [
      {
        id: 'tpl_default_custom',
        name: 'Kurumsal Kutulu Şablon',
        school: 'Özel Bilim Eğitim Kurumları',
        subHeader: 'Fen Bilimleri Zümresi · 2026-2027 Eğitim Öğretim Yılı',
        examTitle: '1. Dönem 2. Ortak Yazılı Sınavı',
        headerStyle: 'boxed', // 'boxed', 'double_line', 'minimal'
        logoPosition: 'left', // 'left', 'right', 'none'
        logoSrc: null,
        showName: true,
        showClass: true,
        showNo: true,
        showScore: true,
        showDate: true,
        instruction: 'Sınav süresi 40 dakikadır. Yanlış cevaplar doğru cevapları etkilememektedir.'
      }
    ];
    saveCustomTemplates();
  }
  return customTemplates;
}

function saveCustomTemplates() {
  try {
    localStorage.setItem(TPL_STORAGE_KEY, JSON.stringify(customTemplates));
  } catch (e) {}
  if (typeof onTemplateChangeCallback === 'function') {
    onTemplateChangeCallback();
  }
}

function getCustomTemplates() {
  return customTemplates;
}

function getActiveCustomTemplate() {
  if (S.template !== 'custom') return null;
  return customTemplates.find(t => t.id === S.customTemplateId) || customTemplates[0] || null;
}

function openCustomTemplateModal(tplId = null) {
  editingTplId = tplId;
  const tpl = tplId ? customTemplates.find(t => t.id === tplId) : null;
  
  if ($('customTplModalTitle')) {
    $('customTplModalTitle').textContent = tpl ? 'Sınav Şablonunu Düzenle' : 'Yeni Sınav Şablonu Oluştur';
  }

  if ($('ctplName')) $('ctplName').value = tpl ? tpl.name : 'Yeni Kurumsal Şablon';
  if ($('ctplSchool')) $('ctplSchool').value = tpl ? tpl.school : (S.school || 'Anadolu Lisesi Müdürlüğü');
  if ($('ctplSubHeader')) $('ctplSubHeader').value = tpl ? tpl.subHeader : '2026-2027 Eğitim - Öğretim Yılı';
  if ($('ctplExamTitle')) $('ctplExamTitle').value = tpl ? tpl.examTitle : 'Dönem Sonu Değerlendirme Sınavı';
  if ($('ctplStyle')) $('ctplStyle').value = tpl ? tpl.headerStyle : 'boxed';
  if ($('ctplLogoPos')) $('ctplLogoPos').value = tpl ? tpl.logoPosition : 'left';
  if ($('ctplInstruction')) $('ctplInstruction').value = tpl ? tpl.instruction : (S.description || '');

  if ($('ctplShowName')) $('ctplShowName').checked = tpl ? tpl.showName : true;
  if ($('ctplShowClass')) $('ctplShowClass').checked = tpl ? tpl.showClass : true;
  if ($('ctplShowNo')) $('ctplShowNo').checked = tpl ? tpl.showNo : true;
  if ($('ctplShowScore')) $('ctplShowScore').checked = tpl ? tpl.showScore : true;
  if ($('ctplShowDate')) $('ctplShowDate').checked = tpl ? tpl.showDate : true;

  renderCustomTemplateList();
  openModal('customTplModal');
}

function renderCustomTemplateList() {
  const container = $('customTplCardsList');
  if (!container) return;

  container.innerHTML = customTemplates.map(t => {
    const isCurrentActive = S.template === 'custom' && S.customTemplateId === t.id;
    return `
      <div class="flex items-center justify-between rounded-xl border p-3 transition ${isCurrentActive ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[13px] font-semibold text-slate-800 dark:text-slate-100">${esc(t.name)}</span>
            ${isCurrentActive ? '<span class="rounded bg-slate-900 px-1.5 py-0.2 text-[9px] font-semibold text-white dark:bg-white dark:text-slate-900">Aktif Şablon</span>' : ''}
          </div>
          <p class="mt-0.5 text-[11px] text-slate-400">${esc(t.school || 'Kurum')} · ${esc(t.headerStyle === 'boxed' ? 'Kutulu Çerçeve' : (t.headerStyle === 'double_line' ? 'Çift Çizgili' : 'Minimalist'))}</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" class="ctpl-select-btn rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" data-select-id="${t.id}">Seç</button>
          <button type="button" class="ctpl-edit-btn rounded-lg p-1 text-[12px] text-slate-400 hover:text-slate-700" data-edit-id="${t.id}" title="Düzenle">✎</button>
          ${customTemplates.length > 1 ? `<button type="button" class="ctpl-del-btn rounded-lg p-1 text-[12px] text-slate-400 hover:text-rose-600" data-del-id="${t.id}" title="Sil">✕</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Draw Custom Exam Header on PDF canvas
function drawCustomHeader(ctx, PW, PH, M, t, version, first, templateObj) {
  const tpl = templateObj || getActiveCustomTemplate();
  if (!tpl) return M + 10;

  const SCALE = 72 / 25.4;
  const PX = (mm) => mm * SCALE;
  const PT = (pt) => pt * (SCALE / (96 / 72));
  const setFont = (options) => {
    let font = '';
    if (options.italic) font += 'italic ';
    if (options.bold) font += 'bold ';
    font += `${options.size || 10}px 'Noto Sans', system-ui, sans-serif`;
    ctx.font = font;
  };

  const L = M + 2;
  const R = PW - M - 2;
  const W = PW - 2 * M;
  const midX = (L + R) / 2;

  let headerHeight = 24;
  if (tpl.headerStyle === 'boxed') {
    headerHeight = 26;
    ctx.strokeStyle = S.themeColor || '#0f172a';
    ctx.lineWidth = Math.max(1.2, 0.5 * SCALE);
    ctx.strokeRect(PX(M), PX(M), PX(W), PX(headerHeight));

    // Divider line between titles and student info
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(M + 16));
    ctx.lineTo(PX(PW - M), PX(M + 16));
    ctx.stroke();

    // School Name
    setFont({ size: PT(10.5), bold: true });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tpl.school || '', PX(midX), PX(M + 4.5));

    // Subheader
    setFont({ size: PT(8.5), bold: false });
    ctx.fillStyle = '#475569';
    ctx.fillText(tpl.subHeader || '', PX(midX), PX(M + 9));

    // Exam Title
    setFont({ size: PT(9.5), bold: true });
    ctx.fillStyle = S.themeColor || '#0f172a';
    ctx.fillText((tpl.examTitle || 'ORTAK YAZILI SINAVI').toLocaleUpperCase('tr-TR'), PX(midX), PX(M + 13));

    // Student Info Row
    setFont({ size: PT(8.5), bold: false });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('Adı Soyadı: .......................................', PX(L), PX(M + 21));
    ctx.fillText('Sınıf / Şube: ..........', PX(L + W * 0.45), PX(M + 21));
    ctx.fillText('No: ..........', PX(L + W * 0.68), PX(M + 21));
    ctx.fillText('Puan: ..........', PX(L + W * 0.85), PX(M + 21));

    if (S.groups > 1) {
      setFont({ size: PT(8.5), bold: true });
      ctx.textAlign = 'right';
      ctx.fillText('Kitapçık: ' + version, PX(R), PX(M + 5));
    }
  } else if (tpl.headerStyle === 'double_line') {
    headerHeight = 28;
    // School & Subheader
    setFont({ size: PT(12), bold: true });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tpl.school || '', PX(midX), PX(M + 4));

    setFont({ size: PT(9.5), bold: false });
    ctx.fillStyle = '#475569';
    ctx.fillText(tpl.subHeader || '', PX(midX), PX(M + 9.5));

    setFont({ size: PT(11), bold: true });
    ctx.fillStyle = S.themeColor || '#0f172a';
    ctx.fillText((tpl.examTitle || '').toLocaleUpperCase('tr-TR'), PX(midX), PX(M + 15));

    // Student Info
    setFont({ size: PT(9), bold: false });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('Adı-Soyadı: ........................................', PX(L), PX(M + 22));
    ctx.fillText('Sınıfı: ..........', PX(L + W * 0.46), PX(M + 22));
    ctx.fillText('Okul No: ..........', PX(L + W * 0.68), PX(M + 22));
    ctx.fillText('Puan: ..........', PX(L + W * 0.86), PX(M + 22));

    // Double lines
    ctx.strokeStyle = S.themeColor || '#0f172a';
    ctx.lineWidth = Math.max(1.4, 0.6 * SCALE);
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(M + 26));
    ctx.lineTo(PX(PW - M), PX(M + 26));
    ctx.stroke();

    ctx.lineWidth = Math.max(0.6, 0.25 * SCALE);
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(M + 27.5));
    ctx.lineTo(PX(PW - M), PX(M + 27.5));
    ctx.stroke();
  } else {
    // Minimalist single line
    headerHeight = 24;
    setFont({ size: PT(11.5), bold: true });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tpl.school || '', PX(midX), PX(M + 4));

    setFont({ size: PT(9), bold: false });
    ctx.fillStyle = '#475569';
    ctx.fillText((tpl.subHeader ? tpl.subHeader + ' · ' : '') + tpl.examTitle, PX(midX), PX(M + 10));

    setFont({ size: PT(9), bold: false });
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('Ad Soyad: .....................................', PX(L), PX(M + 18));
    ctx.fillText('Sınıf/No: .................', PX(L + W * 0.5), PX(M + 18));
    ctx.fillText('Not: ...........', PX(L + W * 0.85), PX(M + 18));

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = Math.max(1, 0.4 * SCALE);
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(M + 22.5));
    ctx.lineTo(PX(PW - M), PX(M + 22.5));
    ctx.stroke();
  }

  let y = M + headerHeight + 2;
  if (tpl.instruction) {
    setFont({ size: PT(7.5), italic: true });
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(tpl.instruction, PX(L), PX(y + 2));
    y += 5.5;
  }

  return y;
}

function initCustomTemplateManager() {
  loadCustomTemplates();

  // Open modal from sidebar
  const openBtn = $('openCustomTplModal');
  if (openBtn) openBtn.onclick = () => openCustomTemplateModal();

  // Close modal
  const closeBtn = $('customTplClose');
  if (closeBtn) closeBtn.onclick = () => closeModal('customTplModal');

  // Save template form
  const saveBtn = $('customTplSaveBtn');
  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = ($('ctplName').value || '').trim();
      if (!name) return alert('Lütfen şablon adını girin.');

      const data = {
        name,
        school: $('ctplSchool').value.trim(),
        subHeader: $('ctplSubHeader').value.trim(),
        examTitle: $('ctplExamTitle').value.trim(),
        headerStyle: $('ctplStyle').value,
        logoPosition: $('ctplLogoPos').value,
        instruction: $('ctplInstruction').value.trim(),
        showName: $('ctplShowName').checked,
        showClass: $('ctplShowClass').checked,
        showNo: $('ctplShowNo').checked,
        showScore: $('ctplShowScore').checked,
        showDate: $('ctplShowDate').checked,
      };

      if (editingTplId) {
        const idx = customTemplates.findIndex(t => t.id === editingTplId);
        if (idx >= 0) {
          customTemplates[idx] = { ...customTemplates[idx], ...data };
        }
      } else {
        const newTpl = { id: uid(), ...data };
        customTemplates.push(newTpl);
        S.template = 'custom';
        S.customTemplateId = newTpl.id;
      }

      saveCustomTemplates();
      closeModal('customTplModal');
      alert(`"${name}" sınav şablonu başarıyla kaydedildi!`);
    };
  }

  // Template cards list click delegation
  const listContainer = $('customTplCardsList');
  if (listContainer) {
    listContainer.onclick = (e) => {
      const target = e.target;
      const selectBtn = target.closest('.ctpl-select-btn');
      if (selectBtn) {
        const id = selectBtn.dataset.selectId;
        S.template = 'custom';
        S.customTemplateId = id;
        saveCustomTemplates();
        closeModal('customTplModal');
        return;
      }
      const editBtn = target.closest('.ctpl-edit-btn');
      if (editBtn) {
        const id = editBtn.dataset.editId;
        openCustomTemplateModal(id);
        return;
      }
      const delBtn = target.closest('.ctpl-del-btn');
      if (delBtn) {
        const id = delBtn.dataset.delId;
        if (confirm('Bu şablonu silmek istediğinize emin misiniz?')) {
          customTemplates = customTemplates.filter(t => t.id !== id);
          if (S.customTemplateId === id) {
            S.customTemplateId = customTemplates[0] ? customTemplates[0].id : null;
            if (!customTemplates.length) S.template = 'none';
          }
          saveCustomTemplates();
          renderCustomTemplateList();
        }
        return;
      }
    };
  }
}


// Module Exports
__exports['setOnTemplateChangeCallback'] = setOnTemplateChangeCallback;
__exports['loadCustomTemplates'] = loadCustomTemplates;
__exports['saveCustomTemplates'] = saveCustomTemplates;
__exports['getCustomTemplates'] = getCustomTemplates;
__exports['getActiveCustomTemplate'] = getActiveCustomTemplate;
__exports['openCustomTemplateModal'] = openCustomTemplateModal;
__exports['renderCustomTemplateList'] = renderCustomTemplateList;
__exports['drawCustomHeader'] = drawCustomHeader;
__exports['initCustomTemplateManager'] = initCustomTemplateManager;

});

__define('modules/pdfEngine.js', function(__exports, __require, __module) {
const { questions, S, LETTERS } = __require('state.js');
const { $, parseTags, booklet, jpegBytes, defaultBaseName, todayStr } = __require('utils.js');
const { drawCustomHeader, getActiveCustomTemplate } = __require('modules/customTemplate.js');

const SCALE = 6;
const FONT = "'Noto Sans', 'DejaVu Sans', Arial, sans-serif";
const PX = (mm) => mm * SCALE;
const PT = (pt) => (pt * 25.4 / 72) * SCALE;
const LH_MM = 5.2;

const TR_FONT_SAMPLE = 'AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpRrSsŞşTtUuÜüVvWwXxYyZz0123456789 —–…!?.,:;()[]«»°·•×÷+−=%&$#@_<>*/';

let fontReady = null;
async function ensureFont() {
  if (fontReady) return fontReady;
  fontReady = (async () => {
    try {
      if (document.fonts && document.fonts.load) {
        await Promise.all([
          document.fonts.load("400 16px 'Noto Sans'", TR_FONT_SAMPLE),
          document.fonts.load("700 16px 'Noto Sans'", TR_FONT_SAMPLE),
          document.fonts.load("italic 400 16px 'Noto Sans'", TR_FONT_SAMPLE),
          document.fonts.load("italic 700 16px 'Noto Sans'", TR_FONT_SAMPLE),
        ]);
        await document.fonts.ready;
      }
    } catch (e) {}
    try { await ensureMebLogo(); } catch (e) {}
  })();
  return fontReady;
}

function pageSizeMM() {
  const s = { a4: [210, 297], a5: [148, 210], letter: [216, 279] }[S.pageSize] || [210, 297];
  return S.orientation === 'landscape' ? [s[1], s[0]] : s;
}

function createPage(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(4, Math.round(w * SCALE));
  c.height = Math.max(4, Math.round(h * SCALE));
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
  return { w, h, canvas: c, ctx };
}

function setFont(ctx, o = {}) {
  const size = o.size || PT(10);
  ctx.font = (o.italic ? 'italic ' : 'normal ') + (o.bold ? '700 ' : '400 ') + size + 'px ' + FONT;
  return size;
}

const LATEX_SYMS = {
  '\\times':'×', '\\cdot':'·', '\\div':'÷', '\\pm':'±', '\\mp':'∓',
  '\\leq':'≤', '\\le':'≤', '\\geq':'≥', '\\ge':'≥', '\\neq':'≠', '\\ne':'≠',
  '\\approx':'≈', '\\equiv':'≡', '\\sim':'∼', '\\propto':'∝',
  '\\infty':'∞', '\\partial':'∂', '\\nabla':'∇', '\\forall':'∀', '\\exists':'∃',
  '\\in':'∈', '\\notin':'∉', '\\ni':'∋', '\\subset':'⊂', '\\subseteq':'⊆',
  '\\supset':'⊃', '\\supseteq':'⊇', '\\cup':'∪', '\\cap':'∩', '\\setminus':'∖',
  '\\emptyset':'∅', '\\varnothing':'∅', '\\complement':'∁',
  '\\to':'→', '\\rightarrow':'→', '\\leftarrow':'←', '\\leftrightarrow':'↔',
  '\\Rightarrow':'⇒', '\\Leftarrow':'⇐', '\\Leftrightarrow':'⇔',
  '\\circ':'°', '\\degree':'°', '\\perp':'⊥', '\\parallel':'∥', '\\angle':'∠',
  '\\triangle':'△', '\\therefore':'∴', '\\because':'∵',
  '\\alpha':'α', '\\beta':'β', '\\gamma':'γ', '\\delta':'δ', '\\epsilon':'ε',
  '\\varepsilon':'ε', '\\zeta':'ζ', '\\eta':'η', '\\theta':'θ', '\\vartheta':'ϑ',
  '\\iota':'ι', '\\kappa':'κ', '\\lambda':'λ', '\\mu':'μ', '\\nu':'ν', '\\xi':'ξ',
  '\\pi':'π', '\\rho':'ρ', '\\sigma':'σ', '\\tau':'τ', '\\upsilon':'υ',
  '\\phi':'φ', '\\varphi':'φ', '\\chi':'χ', '\\psi':'ψ', '\\omega':'ω',
  '\\Gamma':'Γ', '\\Delta':'Δ', '\\Theta':'Θ', '\\Lambda':'Λ', '\\Xi':'Ξ',
  '\\Pi':'Π', '\\Sigma':'Σ', '\\Phi':'Φ', '\\Psi':'Ψ', '\\Omega':'Ω',
  '\\ldots':'…', '\\dots':'…', '\\cdots':'⋯', '\\vdots':'⋮', '\\ddots':'⋱',
  '\\quad':'  ', '\\qquad':'    ', '\\,':' ', '\\;':' ', '\\:':' ', '\\ ':' ',
  '\\%':'%', '\\_':'_', '\\&':'&', '\\#':'#',
};

function latexParse(src) {
  let i = 0;
  const n = src.length;
  function peek() { return src[i]; }
  function readCommand() {
    let j = i + 1;
    if (j < n && !/[a-zA-Z]/.test(src[j])) { i = j + 1; return '\\' + src[j - 1]; }
    let cmd = '';
    while (j < n && /[a-zA-Z]/.test(src[j])) { cmd += src[j]; j++; }
    i = j;
    return '\\' + cmd;
  }
  function readGroup() {
    if (peek() === '{') {
      i++;
      const node = readRow('}');
      if (peek() === '}') i++;
      return node;
    }
    if (peek() === '\\') {
      const cmd = readCommand();
      return atomFromCommand(cmd);
    }
    const ch = peek();
    i++;
    return { type: 'text', value: ch || '' };
  }
  function atomFromCommand(cmd) {
    if (LATEX_SYMS[cmd] !== undefined) return { type: 'text', value: LATEX_SYMS[cmd] };
    if (cmd === '\\frac') {
      const num = readGroup();
      const den = readGroup();
      return { type: 'frac', num, den };
    }
    if (cmd === '\\sqrt') {
      let idx = null;
      if (peek() === '[') {
        i++;
        let s = '';
        while (i < n && peek() !== ']') { s += src[i]; i++; }
        if (peek() === ']') i++;
        idx = s;
      }
      const rad = readGroup();
      return { type: 'sqrt', idx, rad };
    }
    if (cmd === '\\left') {
      let delim = '';
      if (peek()) { delim = peek(); i++; }
      const inner = readRow('\\right');
      if (src.slice(i, i + 6) === '\\right') {
        i += 6;
        let rdelim = '';
        if (peek()) { rdelim = peek(); i++; }
        return { type: 'delim', l: delim, r: rdelim, inner };
      }
      return { type: 'delim', l: delim, r: '', inner };
    }
    if (cmd === '\\vec') return { type: 'vec', body: readGroup() };
    if (cmd === '\\overline' || cmd === '\\bar') return { type: 'overline', body: readGroup() };
    if (cmd === '\\hat') return { type: 'hat', body: readGroup() };
    if (cmd === '\\sum' || cmd === '\\int' || cmd === '\\prod' || cmd === '\\oint' || cmd === '\\lim') {
      const glyph = { '\\sum': 'Σ', '\\int': '∫', '\\prod': 'Π', '\\oint': '∮', '\\lim': 'lim' }[cmd];
      return { type: 'bigop', glyph, isLim: cmd === '\\lim' };
    }
    if (cmd === '\\log' || cmd === '\\ln' || cmd === '\\sin' || cmd === '\\cos' || cmd === '\\tan' ||
        cmd === '\\cot' || cmd === '\\sec' || cmd === '\\csc' || cmd === '\\arcsin' || cmd === '\\arccos' ||
        cmd === '\\arctan' || cmd === '\\min' || cmd === '\\max' || cmd === '\\det' || cmd === '\\gcd') {
      return { type: 'func', name: cmd.slice(1) };
    }
    if (cmd === '\\begin') {
      let env = '';
      if (peek() === '{') { i++; while (i < n && peek() !== '}') { env += src[i]; i++; } if (peek() === '}') i++; }
      const rows = [];
      let curRow = [];
      const endTag = '\\end{' + env + '}';
      while (i < n && src.slice(i, i + endTag.length) !== endTag) {
        if (src.slice(i, i + 2) === '\\\\') { rows.push(curRow); curRow = []; i += 2; continue; }
        if (peek() === '&') { curRow.push({ type: 'text', value: '   ' }); i++; continue; }
        curRow.push(readAtom());
      }
      if (curRow.length) rows.push(curRow);
      if (src.slice(i, i + endTag.length) === endTag) i += endTag.length;
      return { type: 'env', env, rows };
    }
    return { type: 'text', value: cmd.replace('\\', '') };
  }
  function readAtom() {
    if (peek() === '^') { i++; const g = readGroup(); return { type: '_sup_pending', g }; }
    if (peek() === '_') { i++; const g = readGroup(); return { type: '_sub_pending', g }; }
    if (peek() === '{') return readGroup();
    if (peek() === '\\') return atomFromCommand(readCommand());
    if (peek() === "'") { i++; return { type: 'text', value: '′' }; }
    const ch = peek();
    i++;
    return { type: 'text', value: ch === undefined ? '' : ch };
  }
  function readRow(stopStr) {
    const atoms = [];
    while (i < n) {
      if (stopStr === '}' && peek() === '}') break;
      if (stopStr === '\\right' && src.slice(i, i + 6) === '\\right') break;
      let atom = readAtom();
      if (atom.type === '_sup_pending') {
        const base = atoms.pop() || { type: 'text', value: '' };
        atoms.push({ type: 'sup', base, sup: atom.g });
      } else if (atom.type === '_sub_pending') {
        const base = atoms.pop() || { type: 'text', value: '' };
        atoms.push({ type: 'sub', base, sub: atom.g });
      } else {
        atoms.push(atom);
      }
    }
    return { type: 'row', atoms };
  }
  try {
    return readRow(null);
  } catch (e) {
    return { type: 'row', atoms: [{ type: 'text', value: src }] };
  }
}

function measureLatexNode(ctx, node, size) {
  const savedFont = ctx.font;
  const fs = size;
  ctx.font = fs + 'px ' + FONT;
  let res;
  switch (node.type) {
    case 'text': {
      const w = ctx.measureText(node.value).width;
      res = { w, asc: fs * 0.72, desc: fs * 0.22 };
      break;
    }
    case 'row': {
      let w = 0, asc = fs * 0.72, desc = fs * 0.22;
      node.atoms.forEach((a) => {
        const m = measureLatexNode(ctx, a, size);
        w += m.w;
        asc = Math.max(asc, m.asc); desc = Math.max(desc, m.desc);
      });
      res = { w, asc, desc };
      break;
    }
    case 'frac': {
      const subSize = size;
      const mn = measureLatexNode(ctx, node.num, subSize * 0.92);
      const md = measureLatexNode(ctx, node.den, subSize * 0.92);
      const w = Math.max(mn.w, md.w) + fs * 0.28;
      const asc = mn.asc + mn.desc + fs * 0.14;
      const desc = md.asc + md.desc + fs * 0.14;
      res = { w, asc, desc };
      break;
    }
    case 'sqrt': {
      const mi = node.idx ? (() => { ctx.font = (fs * 0.55) + 'px ' + FONT; return ctx.measureText(node.idx).width; })() : 0;
      const mr = measureLatexNode(ctx, node.rad, size * 0.95);
      const w = mi + fs * 0.55 + mr.w + fs * 0.12;
      const asc = mr.asc + fs * 0.22;
      const desc = mr.desc;
      res = { w, asc, desc };
      break;
    }
    case 'sup': {
      const mb = measureLatexNode(ctx, node.base, size);
      const ms = measureLatexNode(ctx, node.sup, size * 0.62);
      const w = mb.w + ms.w + fs * 0.06;
      const asc = mb.asc + ms.asc * 0.85 + fs * 0.06;
      res = { w, asc, desc: mb.desc };
      break;
    }
    case 'sub': {
      const mb = measureLatexNode(ctx, node.base, size);
      const ms = measureLatexNode(ctx, node.sub, size * 0.62);
      const w = mb.w + ms.w + fs * 0.06;
      const desc = mb.desc + ms.asc * 0.7 + fs * 0.06;
      res = { w, asc: mb.asc, desc: Math.max(mb.desc, desc) };
      break;
    }
    case 'delim': {
      const mi = measureLatexNode(ctx, node.inner, size);
      const dw = fs * 0.32;
      res = { w: mi.w + dw * (node.l ? 1 : 0) + dw * (node.r ? 1 : 0), asc: mi.asc, desc: mi.desc };
      break;
    }
    case 'vec': case 'overline': case 'hat': {
      const mb = measureLatexNode(ctx, node.body, size);
      res = { w: mb.w, asc: mb.asc + fs * 0.16, desc: mb.desc };
      break;
    }
    case 'bigop': {
      ctx.font = (fs * 1.35) + 'px ' + FONT;
      const w = ctx.measureText(node.glyph).width + fs * 0.14;
      res = { w, asc: fs * 0.85, desc: fs * 0.35 };
      break;
    }
    case 'func': {
      ctx.font = fs + 'px ' + FONT;
      const w = ctx.measureText(node.name).width + fs * 0.1;
      res = { w, asc: fs * 0.72, desc: fs * 0.22 };
      break;
    }
    case 'env': {
      let maxW = 0, totalH = 0;
      const rowH = size * 1.35;
      node.rows.forEach((r) => {
        let rw = 0;
        r.forEach((a) => { rw += measureLatexNode(ctx, a, size * 0.92).w; });
        maxW = Math.max(maxW, rw);
        totalH += rowH;
      });
      const bracketW = node.env === 'cases' ? fs * 0.45 : fs * 0.5;
      res = { w: maxW + bracketW, asc: totalH / 2 + rowH / 2, desc: totalH / 2 - rowH / 2 + size * 0.2, rowH, isEnv: true };
      break;
    }
    default:
      res = { w: 0, asc: fs * 0.72, desc: fs * 0.22 };
  }
  ctx.font = savedFont;
  return res;
}

function drawLatexNode(ctx, node, x, y, size, color) {
  const fs = size;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  switch (node.type) {
    case 'text': {
      ctx.font = fs + 'px ' + FONT;
      ctx.fillText(node.value, x, y);
      return x + ctx.measureText(node.value).width;
    }
    case 'row': {
      let cx = x;
      node.atoms.forEach((a) => { cx = drawLatexNode(ctx, a, cx, y, size, color); });
      return cx;
    }
    case 'frac': {
      const subSize = size * 0.92;
      const mn = measureLatexNode(ctx, node.num, subSize);
      const md = measureLatexNode(ctx, node.den, subSize);
      const w = Math.max(mn.w, md.w) + fs * 0.28;
      const cx = x + w / 2;
      const barY = y - fs * 0.32;
      drawLatexNode(ctx, node.num, cx - mn.w / 2, barY - fs * 0.14 - mn.desc, subSize, color);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, fs * 0.045);
      ctx.beginPath();
      ctx.moveTo(x + fs * 0.06, barY);
      ctx.lineTo(x + w - fs * 0.06, barY);
      ctx.stroke();
      drawLatexNode(ctx, node.den, cx - md.w / 2, barY + fs * 0.14 + md.asc, subSize, color);
      return x + w;
    }
    case 'sqrt': {
      const radSize = size * 0.95;
      const mr = measureLatexNode(ctx, node.rad, radSize);
      const stemW = fs * 0.55;
      const h = mr.asc + mr.desc + fs * 0.22;
      const topY = y - mr.asc - fs * 0.22;
      const botY = y + mr.desc;
      let ix = x;
      if (node.idx) {
        ctx.font = (fs * 0.55) + 'px ' + FONT;
        ctx.fillText(node.idx, ix, topY + fs * 0.3);
        ix += ctx.measureText(node.idx).width + fs * 0.05;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, fs * 0.045);
      ctx.beginPath();
      ctx.moveTo(ix, y - h * 0.32);
      ctx.lineTo(ix + stemW * 0.28, botY);
      ctx.lineTo(ix + stemW * 0.5, topY);
      ctx.lineTo(ix + stemW + mr.w + fs * 0.1, topY);
      ctx.stroke();
      drawLatexNode(ctx, node.rad, ix + stemW, y, radSize, color);
      return ix + stemW + mr.w + fs * 0.1;
    }
    case 'sup': {
      const mb = measureLatexNode(ctx, node.base, size);
      const supSize = size * 0.62;
      const bx = drawLatexNode(ctx, node.base, x, y, size, color);
      drawLatexNode(ctx, node.sup, bx + fs * 0.03, y - mb.asc * 0.55, supSize, color);
      const ms = measureLatexNode(ctx, node.sup, supSize);
      return bx + ms.w + fs * 0.06;
    }
    case 'sub': {
      const bx = drawLatexNode(ctx, node.base, x, y, size, color);
      const subSize = size * 0.62;
      drawLatexNode(ctx, node.sub, bx + fs * 0.03, y + fs * 0.28, subSize, color);
      const ms = measureLatexNode(ctx, node.sub, subSize);
      return bx + ms.w + fs * 0.06;
    }
    case 'delim': {
      const mi = measureLatexNode(ctx, node.inner, size);
      const dw = fs * 0.32;
      let cx = x;
      ctx.font = (fs * 1.05) + 'px ' + FONT;
      if (node.l) { ctx.fillText(delimGlyph(node.l), cx, y + mi.desc * 0.3); cx += dw; }
      cx = drawLatexNode(ctx, node.inner, cx, y, size, color);
      if (node.r) { ctx.font = (fs * 1.05) + 'px ' + FONT; ctx.fillText(delimGlyph(node.r), cx, y + mi.desc * 0.3); cx += dw; }
      return cx;
    }
    case 'vec': {
      const mb = measureLatexNode(ctx, node.body, size);
      const bx = drawLatexNode(ctx, node.body, x, y, size, color);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, fs * 0.04);
      const ay = y - mb.asc - fs * 0.1;
      ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(x + mb.w, ay); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + mb.w - fs * 0.08, ay - fs * 0.06); ctx.lineTo(x + mb.w, ay); ctx.lineTo(x + mb.w - fs * 0.08, ay + fs * 0.06); ctx.stroke();
      return bx;
    }
    case 'overline': {
      const mb = measureLatexNode(ctx, node.body, size);
      const bx = drawLatexNode(ctx, node.body, x, y, size, color);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, fs * 0.04);
      const ay = y - mb.asc - fs * 0.08;
      ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(x + mb.w, ay); ctx.stroke();
      return bx;
    }
    case 'hat': {
      const mb = measureLatexNode(ctx, node.body, size);
      const bx = drawLatexNode(ctx, node.body, x, y, size, color);
      ctx.font = (fs * 0.7) + 'px ' + FONT;
      ctx.fillText('^', x + mb.w / 2 - fs * 0.12, y - mb.asc - fs * 0.02);
      return bx;
    }
    case 'bigop': {
      if (node.isLim) {
        ctx.font = 'italic ' + fs + 'px ' + FONT;
        ctx.fillText('lim', x, y);
        return x + ctx.measureText('lim').width + fs * 0.1;
      }
      ctx.font = (fs * 1.35) + 'px ' + FONT;
      ctx.fillText(node.glyph, x, y + fs * 0.1);
      return x + ctx.measureText(node.glyph).width + fs * 0.14;
    }
    case 'func': {
      ctx.font = 'normal ' + fs + 'px ' + FONT;
      ctx.fillText(node.name, x, y);
      return x + ctx.measureText(node.name).width + fs * 0.1;
    }
    case 'env': {
      const rowH = size * 1.35 * 0.92;
      const totalH = node.rows.length * rowH;
      let topY = y - totalH / 2 + rowH * 0.7;
      const bracketW = fs * (node.env === 'cases' ? 0.45 : 0.5);
      if (node.env === 'cases') {
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, fs * 0.045);
        ctx.beginPath();
        ctx.moveTo(x + bracketW * 0.7, y - totalH / 2);
        ctx.quadraticCurveTo(x, y - totalH / 2, x, y - rowH * 0.3);
        ctx.quadraticCurveTo(x, y, x - fs * 0.08, y);
        ctx.quadraticCurveTo(x, y, x, y + rowH * 0.3);
        ctx.quadraticCurveTo(x, y + totalH / 2, x + bracketW * 0.7, y + totalH / 2);
        ctx.stroke();
      }
      let cx = x + bracketW;
      node.rows.forEach((r) => {
        let rx = cx;
        r.forEach((a) => { rx = drawLatexNode(ctx, a, rx, topY, size * 0.92, color); });
        topY += rowH;
      });
      return x + bracketW + (measureLatexNode(ctx, node, size).w - bracketW);
    }
    default:
      return x;
  }
}

function delimGlyph(d) {
  const map = { '|': '|', '(': '(', ')': ')', '[': '[', ']': ']', '\\{': '{', '\\}': '}', '.': '' };
  return map[d] !== undefined ? map[d] : d;
}

function tokenizeLatexSegments(text) {
  const raw = String(text || '');
  const parts = raw.split(/(\$[^$]+\$)/g);
  const segs = [];
  parts.forEach((p) => {
    if (!p) return;
    if (/^\$[^$]+\$$/.test(p)) {
      segs.push({ latex: true, src: p.slice(1, -1) });
    } else {
      segs.push({ latex: false, src: p });
    }
  });
  return segs.length ? segs : [{ latex: false, src: '' }];
}

function wrapRichText(ctx, text, maxW) {
  const paras = String(text || '').split(/\n/);
  const lines = [];
  for (const para of paras) {
    if (!para.trim()) { lines.push([]); continue; }
    const segs = tokenizeLatexSegments(para);
    let cur = [];
    let curW = 0;
    const pushLine = () => { lines.push(cur); cur = []; curW = 0; };
    segs.forEach((seg) => {
      if (seg.latex) {
        const node = latexParse(seg.src);
        const savedFont = ctx.font;
        const m = measureLatexNode(ctx, node, parseFloat(ctx.font) || PT(9.5));
        ctx.font = savedFont;
        if (curW + m.w > maxW && cur.length) pushLine();
        cur.push({ latex: true, node, w: m.w, asc: m.asc, desc: m.desc });
        curW += m.w;
      } else {
        const words = seg.src.split(/(\s+)/);
        words.forEach((w) => {
          if (!w) return;
          const ww = ctx.measureText(w).width;
          if (curW + ww > maxW && curW > 0 && !/^\s+$/.test(w)) pushLine();
          if (!/^\s+$/.test(w) || curW > 0) { cur.push({ latex: false, text: w, w: ww }); curW += ww; }
        });
      }
    });
    pushLine();
  }
  return lines.length ? lines : [[]];
}

function drawRichLine(ctx, tokens, x, y, fontSize, color, fontSpec) {
  let cx = x;
  tokens.forEach((tok) => {
    if (tok.latex) {
      cx = drawLatexNode(ctx, tok.node, cx, y, fontSize, color);
    } else {
      ctx.font = fontSpec;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(tok.text, cx, y);
      cx += tok.w;
    }
  });
}

function wrapText(ctx, text, maxW) {
  const paras = String(text || '').split(/\n/);
  const lines = [];
  for (const para of paras) {
    if (!para.trim()) { lines.push(''); continue; }
    const words = para.split(/\s+/);
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    }
    if (cur) lines.push(cur);
  }
  return lines.length ? lines : [''];
}

function drawText(ctx, str, x, y, o = {}) {
  const size = setFont(ctx, o);
  const lh = o.lineH || size * 1.45;
  ctx.fillStyle = o.color || '#111111';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = o.align || 'left';
  const maxW = o.maxW != null ? o.maxW : null;
  const hasLatex = /\$[^$]+\$/.test(String(str || ''));
  if (hasLatex) {
    const fontSpec = ctx.font;
    const lines = wrapRichText(ctx, str, maxW != null ? maxW : 1e6);
    lines.forEach((tokens, i) => {
      let lineW = 0;
      tokens.forEach((t) => (lineW += t.w));
      let lx = x * SCALE;
      if (o.align === 'center') lx = x * SCALE - lineW / 2;
      else if (o.align === 'right') lx = x * SCALE - lineW;
      const prevAlign = ctx.textAlign;
      ctx.textAlign = 'left';
      drawRichLine(ctx, tokens, lx, y * SCALE + i * lh, size, o.color || '#111111', fontSpec);
      ctx.textAlign = prevAlign;
    });
    ctx.font = fontSpec;
    return (lines.length * lh) / SCALE;
  }
  const lines = maxW != null ? wrapText(ctx, str, maxW) : [String(str)];
  lines.forEach((l, i) => { ctx.fillText(l, x * SCALE, y * SCALE + i * lh); });
  return (lines.length * lh) / SCALE;
}

const imgCache = {};
function getImg(q) {
  return new Promise((res) => {
    if (imgCache[q.id]) return res(imgCache[q.id]);
    const src = q.imgSrc || q.src;
    if (!src) return res(null);
    const im = new Image();
    im.onload = () => { imgCache[q.id] = im; res(im); };
    im.onerror = () => res(null);
    im.src = src;
  });
}

const MEB_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Milli_E%C4%9Fitim_Bakanl%C4%B1%C4%9F%C4%B1_Logo.svg/500px-Milli_E%C4%9Fitim_Bakanl%C4%B1%C4%9F%C4%B1_Logo.svg.png';
let mebLogoImg = null, mebLogoReady = null;
let customLogoSrc = null, customLogoImg = null;

function setCustomLogo(src, img) {
  customLogoSrc = src;
  customLogoImg = img;
}

function ensureMebLogo() {
  if (mebLogoReady) return mebLogoReady;
  mebLogoReady = new Promise((resolve) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => { mebLogoImg = im; resolve(); };
    im.onerror = () => { mebLogoImg = null; resolve(); };
    im.src = MEB_LOGO_URL;
  });
  return mebLogoReady;
}

function mebLogoVisible() {
  const choice = S.logoChoice || 'meb';
  return choice !== 'none' && (choice === 'meb' || (choice === 'custom' && customLogoImg));
}

function getMebLogoBox(M) {
  const defaultX = M + 2;
  const defaultY = M + 2;
  return {
    show: mebLogoVisible(),
    x: S.logoX != null ? S.logoX : defaultX,
    y: S.logoY != null ? S.logoY : defaultY,
    w: S.logoW || 22,
    h: S.logoH || 22
  };
}

function activeLogoAspect() {
  const choice = S.logoChoice || 'meb';
  if (choice === 'custom' && customLogoImg && customLogoImg.naturalWidth && customLogoImg.naturalHeight) {
    return customLogoImg.naturalWidth / customLogoImg.naturalHeight;
  }
  return 1;
}

function fixLogoAspect(refreshFn) {
  const ar = activeLogoAspect();
  let h = S.logoH || 26;
  let w = h * ar;
  const maxW = 60;
  if (w > maxW) { w = maxW; h = w / ar; }
  S.logoW = Math.max(8, w);
  S.logoH = Math.max(8, h);
  if (refreshFn) refreshFn();
}

function trimLogoImage(src, cb) {
  const im = new Image();
  im.onload = () => {
    const w = im.naturalWidth, h = im.naturalHeight;
    if (!w || !h) return cb(src);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(im, 0, 0);
    let data;
    try { data = ctx.getImageData(0, 0, w, h).data; } catch (e) { return cb(src); }
    const isBlank = (i) => {
      const a = data[i + 3];
      if (a < 12) return true;
      return data[i] > 244 && data[i + 1] > 244 && data[i + 2] > 244;
    };
    let top = 0, bottom = h - 1, left = 0, right = w - 1;
    const rowBlank = (y) => { for (let x = 0; x < w; x++) if (!isBlank((y * w + x) * 4)) return false; return true; };
    const colBlank = (x) => { for (let y = top; y <= bottom; y++) if (!isBlank((y * w + x) * 4)) return false; return true; };
    while (top < bottom && rowBlank(top)) top++;
    while (bottom > top && rowBlank(bottom)) bottom--;
    while (left < right && colBlank(left)) left++;
    while (right > left && colBlank(right)) right--;
    const pad = 1;
    top = Math.max(0, top - pad); left = Math.max(0, left - pad);
    bottom = Math.min(h - 1, bottom + pad); right = Math.min(w - 1, right + pad);
    const nw = right - left + 1, nh = bottom - top + 1;
    if (nw < 4 || nh < 4 || (nw === w && nh === h)) return cb(src);
    const o = document.createElement('canvas');
    o.width = nw; o.height = nh;
    o.getContext('2d').drawImage(c, left, top, nw, nh, 0, 0, nw, nh);
    cb(o.toDataURL('image/png'));
  };
  im.onerror = () => cb(src);
  im.src = src;
}

function drawMEBLogo(ctx, x, y, w, h) {
  const choice = S.logoChoice || 'meb';
  if (choice === 'none') return;
  if (choice === 'custom' && customLogoImg) {
    ctx.drawImage(customLogoImg, PX(x), PX(y), PX(w), PX(h));
    return;
  }
  if (mebLogoImg) {
    ctx.drawImage(mebLogoImg, PX(x), PX(y), PX(w), PX(h));
    return;
  }
  drawMEBLogoVector(ctx, x + w / 2, y + h / 2, Math.min(w, h) / 2);
}

function drawMEBLogoVector(ctx, cx, cy, r) {
  const RED = '#d32b2b';
  const X = PX(cx), Y = PX(cy), R = PX(r);
  ctx.save();
  ctx.translate(X, Y);
  ctx.strokeStyle = RED; ctx.fillStyle = RED;
  ctx.lineWidth = Math.max(1, R * 0.035);
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = Math.max(1, R * 0.02);
  ctx.beginPath(); ctx.arc(0, 0, R * 0.93, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = Math.max(0.6, R * 0.026);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, rr1 = R * 0.945, rr2 = R * 0.995, sk = 0.05;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * rr1, Math.sin(a) * rr1);
    ctx.lineTo(Math.cos(a + sk) * rr2, Math.sin(a + sk) * rr2);
    ctx.stroke();
  }
  ctx.lineWidth = Math.max(1, R * 0.022);
  ctx.beginPath(); ctx.arc(0, 0, R * 0.7, 0, Math.PI * 2); ctx.stroke();
  const ring = (text, radius, startA, endA, size, flip) => {
    setFont(ctx, { size, bold: true });
    ctx.fillStyle = RED; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const n = text.length; if (!n) return;
    for (let i = 0; i < n; i++) {
      const p = n === 1 ? 0.5 : i / (n - 1);
      const a = startA + (endA - startA) * p;
      ctx.save();
      ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius);
      ctx.rotate(a + (flip ? -Math.PI / 2 : Math.PI / 2));
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };
  ring('TÜRKİYE CUMHURİYETİ MİLLİ EĞİTİM BAKANLIĞI', R * 0.82, Math.PI * 0.86, Math.PI * 0.14, R * 0.115, true);
  const star = (a, sr) => {
    const px = Math.cos(a) * R * 0.82, py = Math.sin(a) * R * 0.82;
    ctx.save(); ctx.translate(px, py); ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const oa = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
      const ia = oa + Math.PI / 5;
      ctx.lineTo(Math.cos(oa) * sr, Math.sin(oa) * sr);
      ctx.lineTo(Math.cos(ia) * sr * 0.42, Math.sin(ia) * sr * 0.42);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  [0.24, 0.36, 0.5, 0.64, 0.76].forEach((f) => star(Math.PI * f, R * 0.075));
  ctx.lineWidth = Math.max(1, R * 0.03);
  ctx.beginPath();
  ctx.moveTo(-R * 0.42, R * 0.3); ctx.quadraticCurveTo(-R * 0.2, R * 0.18, 0, R * 0.3);
  ctx.quadraticCurveTo(R * 0.2, R * 0.18, R * 0.42, R * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-R * 0.42, R * 0.3); ctx.lineTo(-R * 0.42, R * 0.44);
  ctx.quadraticCurveTo(-R * 0.2, R * 0.32, 0, R * 0.44);
  ctx.quadraticCurveTo(R * 0.2, R * 0.32, R * 0.42, R * 0.44);
  ctx.lineTo(R * 0.42, R * 0.3);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, R * 0.3); ctx.lineTo(0, R * 0.44); ctx.stroke();
  ctx.lineWidth = Math.max(1, R * 0.05);
  ctx.beginPath(); ctx.moveTo(0, R * 0.28); ctx.lineTo(0, -R * 0.05); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -R * 0.05);
  ctx.bezierCurveTo(-R * 0.22, -R * 0.16, -R * 0.14, -R * 0.4, 0, -R * 0.5);
  ctx.bezierCurveTo(R * 0.14, -R * 0.4, R * 0.22, -R * 0.16, 0, -R * 0.05);
  ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, -R * 0.28, R * 0.115, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = RED;
  ctx.beginPath(); ctx.arc(R * 0.035, -R * 0.28, R * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.restore();
}

function getMEBHeaderItems(ctx, PW, PH, M, t, version) {
  const L = M + 2, R = PW - M - 2;
  const logoBox = getMebLogoBox(M);
  const showLogo = logoBox.show;
  // Başlık metinleri logodan tamamen bağımsız olarak sayfa genişliğinin tam ortasına hizalanır:
  const textCx = (L + R) / 2;
  let y = M + 3.5;
  ctx.save();

  setFont(ctx, { size: PT(12), bold: true });
  const wYear = ctx.measureText(S.mebYear || '').width / SCALE;
  const defYear = { x: textCx - wYear / 2, y: y, w: wYear, h: 4.8 };
  y += 6.5;

  setFont(ctx, { size: PT(12), bold: true });
  const wSchool = ctx.measureText(S.mebSchool || '').width / SCALE;
  const defSchool = { x: textCx - wSchool / 2, y: y, w: wSchool, h: 4.8 };
  y += 6.5;

  const dash = (v) => (v && String(v).trim() ? String(v).trim() : '...............');
  const lessonText = dash(S.mebLesson);
  const gradeText = dash(S.mebGrade) + ' Sınıf';
  const examOnly = S.mebExam && String(S.mebExam).trim() ? String(S.mebExam).trim() : '............... Sınavı';
  const examText = gradeText + ' ' + examOnly;

  setFont(ctx, { size: PT(11), bold: true });
  const gapMM = 2.5;
  const wLesson = ctx.measureText(lessonText).width / SCALE;
  const wExam = ctx.measureText(examText).width / SCALE;
  const totalW = wLesson + gapMM + wExam;
  const rowStartX = textCx - totalW / 2;
  const defLesson = { x: rowStartX, y, w: wLesson, h: 4.8 };
  const defExam = { x: rowStartX + wLesson + gapMM, y, w: wExam, h: 4.8 };

  const dateStr = (S.mebDate || '').trim();
  setFont(ctx, { size: PT(10.5), bold: true });
  const wDate = dateStr ? ctx.measureText(dateStr).width / SCALE : 18;
  const defDate = { x: R - wDate, y, w: wDate, h: 4.4 };

  // Öğrenci kimlik satırı logonun ASLA üstüne gelmeyecek şekilde logonun bitişinin altına yerleştirilir:
  const minStudentY = showLogo ? (logoBox.y + logoBox.h + 3.5) : (M + 22);
  y = Math.max(y + 6.5, minStudentY);

  setFont(ctx, { size: PT(10.5), bold: true });
  const wName = S.mebNameLbl ? ctx.measureText(S.mebNameLbl).width / SCALE : 20;
  const wClass = S.mebClassLbl ? ctx.measureText(S.mebClassLbl).width / SCALE : 12;
  const wNo = S.mebNoLbl ? ctx.measureText(S.mebNoLbl).width / SCALE : 16;
  const wScore = S.mebScoreLbl ? ctx.measureText(S.mebScoreLbl).width / SCALE : 10;
  const defName = { x: L, y, w: wName, h: 4.4 };
  const defClass = { x: L + (PW - 2 * M) * 0.36, y, w: wClass, h: 4.4 };
  const defNo = { x: L + (PW - 2 * M) * 0.55, y, w: wNo, h: 4.4 };
  const defScore = { x: L + (PW - 2 * M) * 0.78, y, w: wScore, h: 4.4 };
  ctx.restore();

  const p = S.mebPos || {};
  const make = (id, text, size, bold, def) => ({ id, text, size, bold, align: 'left', x: p[id]?.x != null ? p[id].x : def.x, y: p[id]?.y != null ? p[id].y : def.y, w: def.w, h: def.h });
  return {
    mebYear: make('mebYear', S.mebYear, 12, true, defYear),
    mebSchool: make('mebSchool', S.mebSchool, 12, true, defSchool),
    mebLesson: make('mebLesson', lessonText, 12, true, defLesson),
    mebExam: make('mebExam', examText, 12, true, defExam),
    mebDate: make('mebDate', dateStr, 10.5, true, defDate),
    mebNameLbl: make('mebNameLbl', S.mebNameLbl || 'Adı-Soyadı:', 10.5, true, defName),
    mebClassLbl: make('mebClassLbl', S.mebClassLbl || 'Sınıfı:', 10.5, true, defClass),
    mebNoLbl: make('mebNoLbl', S.mebNoLbl || 'Okul No.:', 10.5, true, defNo),
    mebScoreLbl: make('mebScoreLbl', S.mebScoreLbl || 'Puan:', 10.5, true, defScore),
  };
}

function drawMEBHeader(ctx, PW, PH, M, t, version, first) {
  const logoBox = getMebLogoBox(M);
  if (logoBox.show) drawMEBLogo(ctx, logoBox.x, logoBox.y, logoBox.w, logoBox.h);
  const items = getMEBHeaderItems(ctx, PW, PH, M, t, version);

  ['mebYear', 'mebSchool', 'mebLesson', 'mebExam', 'mebDate', 'mebNameLbl', 'mebClassLbl', 'mebNoLbl', 'mebScoreLbl'].forEach((key) => {
    const it = items[key];
    if (!it || !it.text) return;
    drawText(ctx, it.text, it.x, it.y + (it.size >= 12 ? 3.8 : 3.5), { size: PT(it.size), bold: it.bold });
  });

  const labelY = Math.max(items.mebNameLbl.y, items.mebClassLbl.y, items.mebNoLbl.y, items.mebScoreLbl.y);
  let y = labelY + 4.5;
  if (!t.hideVersion && S.groups > 1) {
    drawText(ctx, 'Kitapçık: ' + version, PW - M - 2, y - 6.2, { size: PT(9), bold: true, align: 'right' });
  }
  ctx.strokeStyle = '#111';
  ctx.lineWidth = Math.max(1, 0.4 * SCALE);
  ctx.beginPath();
  ctx.moveTo(PX(M), PX(y));
  ctx.lineTo(PX(PW - M), PX(y));
  ctx.stroke();
  y += 3.5;
  if (!t.noDescription && S.description) {
    y += drawText(ctx, S.description, M + 1, y, {
      size: PT(7.5), italic: true, color: '#475569', maxW: PX(PW - 2 * M - 2),
    }) + 1.5;
  }
  return y + 1;
}

function drawHeader(ctx, PW, PH, M, t, version, title, first) {
  if (S.watermark && !S.watermarkDivider) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#505050';
    setFont(ctx, { size: PT(S.watermarkSize || 44), bold: true });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate((PW / 2) * SCALE, (PH / 2) * SCALE);
    const wmAngle = t.negativeAngle ? -Math.abs(S.watermarkAngle ?? 45) : (S.watermarkAngle ?? 45);
    ctx.rotate((wmAngle * Math.PI) / 180);
    ctx.fillText(S.watermark, 0, 0);
    ctx.restore();
  }
  if (S.template === 'meb') {
    if (!first) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = Math.max(1, 0.3 * SCALE);
      ctx.beginPath();
      ctx.moveTo(PX(M), PX(M + 5));
      ctx.lineTo(PX(PW - M), PX(M + 5));
      ctx.stroke();
      drawText(ctx, S.mebSchool || S.school || '', M, M + 4, { size: PT(7.5), color: '#475569' });
      const dash2 = (v) => (v && String(v).trim() ? String(v).trim() : '');
      const mid = [dash2(S.mebLesson), dash2(S.mebGrade), dash2(S.mebExam)].filter(Boolean).join(' · ');
      if (mid) drawText(ctx, mid, PW / 2, M + 4, { size: PT(8), bold: true, align: 'center' });
      if (!t.hideVersion && S.groups > 1) drawText(ctx, 'Kitapçık: ' + version, PW - M, M + 4, { size: PT(7.5), align: 'right' });
      return M + 8;
    }
    return drawMEBHeader(ctx, PW, PH, M, t, version, first);
  }
  if (S.template === 'custom') {
    if (!first) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = Math.max(1, 0.3 * SCALE);
      ctx.beginPath();
      ctx.moveTo(PX(M), PX(M + 5));
      ctx.lineTo(PX(PW - M), PX(M + 5));
      ctx.stroke();
      const tpl = getActiveCustomTemplate();
      drawText(ctx, (tpl ? tpl.school : S.school) || '', M, M + 4, { size: PT(7.5), color: '#475569' });
      const mid = (tpl ? tpl.examTitle : S.title) || 'Sınav';
      drawText(ctx, mid, PW / 2, M + 4, { size: PT(8), bold: true, align: 'center' });
      if (!t.hideVersion && S.groups > 1) drawText(ctx, 'Kitapçık: ' + version, PW - M, M + 4, { size: PT(7.5), align: 'right' });
      return M + 8;
    }
    return drawCustomHeader(ctx, PW, PH, M, t, version, first);
  }
  if (S.testType === 'yazili') {
    if (!first) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = Math.max(1, 0.3 * SCALE);
      ctx.beginPath();
      ctx.moveTo(PX(M), PX(M + 5));
      ctx.lineTo(PX(PW - M), PX(M + 5));
      ctx.stroke();
      drawText(ctx, S.school, M, M + 4, { size: PT(7.5), color: '#475569' });
      drawText(ctx, title + ' YAZILI SINAVI', PW / 2, M + 4, { size: PT(8), bold: true, align: 'center' });
      if (!t.hideVersion && S.groups > 1) drawText(ctx, 'Kitapçık: ' + version, PW - M, M + 4, { size: PT(7.5), align: 'right' });
      return M + 8;
    }
    const boxH = 15;
    ctx.strokeStyle = S.themeColor || '#1e293b';
    ctx.lineWidth = Math.max(1.2, 0.5 * SCALE);
    ctx.strokeRect(PX(M), PX(M), PX(PW - 2 * M), PX(boxH));
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(M + 7.5));
    ctx.lineTo(PX(PW - M), PX(M + 7.5));
    ctx.stroke();
    const topText = (S.school ? S.school.toLocaleUpperCase('tr-TR') + ' • ' : '') + (S.lesson ? S.lesson + ' • ' : '') + title + ' YAZILI SINAVI';
    drawText(ctx, topText, PW / 2, M + 5.2, { size: PT(8.5), bold: true, align: 'center', color: '#0f172a' });
    if (!t.hideVersion && S.groups > 1) drawText(ctx, 'Kitapçık: ' + version, PW - M - 2.5, M + 5.2, { size: PT(8.5), bold: true, align: 'right' });
    drawText(ctx, 'Adı Soyadı: .......................................', M + 2.5, M + 12.2, { size: PT(8.2) });
    drawText(ctx, 'Sınıfı / Şubesi: .........', PW / 2 - 12, M + 12.2, { size: PT(8.2) });
    drawText(ctx, 'No: .........', PW / 2 + 28, M + 12.2, { size: PT(8.2) });
    drawText(ctx, 'Puan: .........', PW - M - 2.5, M + 12.2, { size: PT(8.5), bold: true, align: 'right' });
    let y = M + boxH + 2.5;
    if (!t.noDescription && S.description) {
      y += drawText(ctx, S.description, t.centerDescription ? PW / 2 : M + 1, y, {
        size: PT(8), italic: true, color: '#475569', maxW: PX(PW - 2 * M - 2), align: t.centerDescription ? 'center' : 'left',
      }) + 1.5;
    }
    return y;
  }
  if (S.testType === 'yaprak') {
    const headerTop = first ? M : M + 3;
    drawText(ctx, (S.school || 'BİLİM AKADEMİ').toLocaleUpperCase('tr-TR'), M, headerTop + 4, { size: PT(14), bold: true, color: '#2c3e50' });
    drawText(ctx, title.toLocaleUpperCase('tr-TR'), PW - M, headerTop + 4, { size: PT(16), bold: true, align: 'right', color: '#000' });
    if (!t.hideVersion && S.groups > 1) {
      drawText(ctx, version + ' KİTAPÇIĞI', PW - M, headerTop + 10, { size: PT(7), bold: true, align: 'right', color: '#555' });
    }
    ctx.strokeStyle = '#333';
    ctx.lineWidth = Math.max(1.5, 0.5 * SCALE);
    ctx.beginPath();
    ctx.moveTo(PX(M), PX(headerTop + 13));
    ctx.lineTo(PX(PW - M), PX(headerTop + 13));
    ctx.stroke();
    let currentY = headerTop + 18;
    if (first && S.konuKapsami) {
      const topics = S.konuKapsami.split(',').map((s) => s.trim()).filter(Boolean);
      if (topics.length) {
        const topicText = '> ' + topics.join(' > ');
        ctx.fillStyle = '#f1f3f5';
        ctx.fillRect(PX(M), PX(currentY), PX(PW - 2 * M), PX(8));
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = Math.max(1, 0.25 * SCALE);
        ctx.strokeRect(PX(M), PX(currentY), PX(PW - 2 * M), PX(8));
        drawText(ctx, topicText, PW / 2, currentY + 5, { size: PT(9), bold: true, align: 'center', color: '#333' });
        currentY += 12;
      }
    }
    if (first && !t.noDescription && S.description) {
      currentY += drawText(ctx, S.description, M + 1, currentY, { size: PT(8), italic: true, color: '#475569', maxW: PX(PW - 2 * M - 2) }) + 1.5;
    }
    return currentY + 2;
  }
  return M + 8;
}

function splitBlanks(text) {
  const parts = String(text || '').split(/(\.{3,}|_{2,})/g);
  return parts.map((p) => ({ text: p, isBlank: /^(\.{3,}|_{2,})$/.test(p) }));
}

function wrapBlankSegments(ctx, text, maxW, blankW) {
  const segs = splitBlanks(text);
  const lines = [];
  let cur = [];
  let curW = 0;
  const pushLine = () => { if (cur.length) lines.push(cur); cur = []; curW = 0; };
  segs.forEach((seg) => {
    if (seg.isBlank) {
      if (curW + blankW > maxW) pushLine();
      cur.push({ blank: true, w: blankW });
      curW += blankW;
      return;
    }
    const words = seg.text.split(/(\s+)/);
    words.forEach((w) => {
      if (!w) return;
      const ww = ctx.measureText(w).width;
      if (curW + ww > maxW && curW > 0) pushLine();
      if (!/^\s+$/.test(w) || curW > 0) { cur.push({ blank: false, text: w, w: ww }); curW += ww; }
    });
  });
  pushLine();
  return lines.length ? lines : [[]];
}

function wrapAuto(ctx, text, maxW) {
  if (/\$[^$]+\$/.test(String(text || ''))) return wrapRichText(ctx, text, maxW);
  return wrapText(ctx, text, maxW);
}

function drawAutoLine(ctx, line, x, y, fontSize, color, fontSpec) {
  if (Array.isArray(line)) {
    drawRichLine(ctx, line, x, y, fontSize, color, fontSpec);
    return;
  }
  ctx.font = fontSpec;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(line, x, y);
}

function prepText(it, ctx) {
  const q = it.q;
  const contentW = it.w * SCALE - PX(7);
  if (q.kind === 'bosluk') {
    setFont(ctx, { size: PT(9.5), bold: false });
    it.blankLines = wrapBlankSegments(ctx, q.blankText || '', contentW, PX(22));
    let h = it.blankLines.length * LH_MM + 2;
    it.imgHeight = 0;
    if (q.imgSrc && imgCache[q.id]) {
      const im = imgCache[q.id];
      it.imgHeight = Math.min((im.height / Math.max(1, im.width)) * (contentW / SCALE), 45);
      h += it.imgHeight + 2;
    }
    if ((q.wordBank || []).length && !q.bankShared) {
      setFont(ctx, { size: PT(8.5) });
      it.bankLines = wrapText(ctx, '( ' + q.wordBank.join('  /  ') + ' )', contentW);
      h += it.bankLines.length * 4.4 + 2.5;
    } else it.bankLines = [];
    it.h = Math.max(h + 1, 8);
    return;
  }
  setFont(ctx, { size: PT(9.5) });
  it.preambleLines = q.text ? wrapAuto(ctx, q.text, contentW) : [];
  setFont(ctx, { size: PT(9.5), bold: true });
  it.rootLines = q.root ? wrapAuto(ctx, q.root, contentW) : [];
  if (!it.rootLines.length && it.preambleLines.length) { it.rootLines = it.preambleLines; it.preambleLines = []; }
  const opts = (q.options || []).filter(Boolean);
  setFont(ctx, { size: PT(9) });
  it.optLines = opts.map((o, k) => ({
    letter: LETTERS[k] + ')',
    lines: wrapAuto(ctx, o, q.layout === 'h' ? (it.w / Math.max(1, opts.length) - 4) * SCALE : contentW - PX(5)),
  }));
  it.imgHeight = 0;
  if (q.imgSrc && imgCache[q.id]) {
    const im = imgCache[q.id];
    it.imgHeight = Math.min((im.height / Math.max(1, im.width)) * (contentW / SCALE), 45);
  }
  let h = 0;
  if (it.imgHeight) h += it.imgHeight + 2;
  if (it.preambleLines.length) h += it.preambleLines.length * LH_MM;
  if (it.preambleLines.length && it.rootLines.length) h += 1.2;
  if (it.rootLines.length) h += it.rootLines.length * LH_MM;
  if ((it.preambleLines.length || it.rootLines.length) && it.optLines.length) h += 1.5;
  if (it.optLines.length) {
    if (q.layout === 'h') h += Math.max(...it.optLines.map((o) => o.lines.length), 1) * 4.4 + 1;
    else it.optLines.forEach((o) => (h += o.lines.length * 4.4 + 0.8));
  }
  if (q.blank) h += q.blank + 2;
  it.h = Math.max(h + 1, 8);
}

function drawQ(ctx, it, x, y) {
  const q = it.q;
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, { size: PT(10), bold: true });
  ctx.fillText(it.num + '.', PX(x + 0.5), PX(y + 4.2));

  if (q.type === 'text' && q.kind === 'bosluk') {
    let ty = y + 4.2;
    const textX = x + 6.5;
    if (q.imgSrc && imgCache[q.id]) {
      const im = imgCache[q.id];
      const imgW = it.w - 6;
      const imgH = it.imgHeight || Math.min((im.height / Math.max(1, im.width)) * imgW, 45);
      ctx.drawImage(im, PX(textX), PX(ty), PX(imgW), PX(imgH));
      ty += imgH + 2;
    }
    setFont(ctx, { size: PT(9.5) });
    ctx.fillStyle = '#1e293b';
    (it.blankLines || []).forEach((line) => {
      let lx = PX(textX);
      line.forEach((seg) => {
        if (seg.blank) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = Math.max(1, 0.3 * SCALE);
          ctx.beginPath();
          ctx.moveTo(lx + PX(1), PX(ty + 0.8));
          ctx.lineTo(lx + seg.w - PX(1), PX(ty + 0.8));
          ctx.stroke();
        } else {
          setFont(ctx, { size: PT(9.5) });
          ctx.fillStyle = '#1e293b';
          ctx.fillText(seg.text, lx, PX(ty));
        }
        lx += seg.w;
      });
      ty += LH_MM;
    });
    if ((it.bankLines || []).length) {
      ty += 1.5;
      setFont(ctx, { size: PT(8.5), italic: true });
      ctx.fillStyle = '#92400e';
      it.bankLines.forEach((l) => { ctx.fillText(l, PX(textX), PX(ty)); ty += 4.4; });
    }
    return;
  }

  if (q.type === 'text') {
    let ty = y + 4.2;
    const textX = x + 6.5;
    const imgW = it.w - 6;
    if (q.imgSrc && imgCache[q.id]) {
      const im = imgCache[q.id];
      const imgH = it.imgHeight || Math.min((im.height / Math.max(1, im.width)) * imgW, 45);
      ctx.drawImage(im, PX(textX), PX(ty), PX(imgW), PX(imgH));
      ty += imgH + 2;
    }
    if (it.preambleLines && it.preambleLines.length) {
      const fSize = PT(9.5);
      const fSpec = setFont(ctx, { size: fSize }) && ctx.font;
      it.preambleLines.forEach((l) => { drawAutoLine(ctx, l, PX(textX), PX(ty), fSize, '#1e293b', fSpec); ty += LH_MM; });
      if (it.rootLines && it.rootLines.length) ty += 1.2;
    }
    if (it.rootLines && it.rootLines.length) {
      const fSize = PT(9.5);
      setFont(ctx, { size: fSize, bold: true });
      const fSpec = ctx.font;
      it.rootLines.forEach((l) => { drawAutoLine(ctx, l, PX(textX), PX(ty), fSize, '#0f172a', fSpec); ty += LH_MM; });
      ty += 1.5;
    }
    if (it.optLines && it.optLines.length) {
      if (q.layout === 'h') {
        const cw = it.w / Math.max(1, it.optLines.length);
        let maxL = 1;
        it.optLines.forEach((o, k) => {
          const colX = x + 5.5 + k * cw;
          setFont(ctx, { size: PT(9), bold: true });
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'left';
          ctx.fillText(o.letter, PX(colX), PX(ty));
          const fSize = PT(9);
          setFont(ctx, { size: fSize });
          const fSpec = ctx.font;
          o.lines.forEach((l, j) => { drawAutoLine(ctx, l, PX(colX + 5), PX(ty + j * 4.4), fSize, '#334155', fSpec); });
          maxL = Math.max(maxL, o.lines.length);
        });
        ty += maxL * 4.4 + 1;
      } else {
        it.optLines.forEach((o) => {
          setFont(ctx, { size: PT(9), bold: true });
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'left';
          ctx.fillText(o.letter, PX(x + 6.5), PX(ty));
          const fSize = PT(9);
          setFont(ctx, { size: fSize });
          const fSpec = ctx.font;
          o.lines.forEach((l, j) => { drawAutoLine(ctx, l, PX(x + 12), PX(ty + j * 4.4), fSize, '#334155', fSpec); });
          ty += o.lines.length * 4.4 + 0.8;
        });
      }
    }
    if (q.blank) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = Math.max(1, 0.25 * SCALE);
      for (let ly = ty + 4; ly < ty + q.blank; ly += 6) {
        ctx.beginPath();
        ctx.moveTo(PX(textX), PX(ly));
        ctx.lineTo(PX(x + it.w), PX(ly));
        ctx.stroke();
      }
    }
  } else {
    const im = imgCache[q.id];
    if (im) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, PX(x + 6), PX(y), PX(it.w), PX(it.h));
    }
  }
}

function drawStemBox(ctx, stem, x, y, w) {
  setFont(ctx, { size: PT(8.5), bold: true });
  const lines = wrapAuto(ctx, stem, w * SCALE - PX(4));
  const boxH = lines.length * 4.2 + 2;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(PX(x), PX(y), PX(w), PX(boxH));
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(PX(x), PX(y), PX(1.5), PX(boxH));
  const fSize = PT(8.5);
  setFont(ctx, { size: fSize, bold: true, italic: true });
  const fSpec = ctx.font;
  lines.forEach((l, i) => { drawAutoLine(ctx, l, PX(x + 3), PX(y + 3.8 + i * 4.2), fSize, '#1e293b', fSpec); });
  return boxH + 2;
}

function finishPage(page, PW, PH, M, pageNo, isFirst, contentTop, subTop, bottom, isWritten) {
  const ctx = page.ctx;
  if (S.columns === 2) {
    const midX = PW / 2;
    const topY = isFirst ? contentTop : subTop;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = Math.max(1, 0.3 * SCALE);
    ctx.beginPath();
    ctx.moveTo(PX(midX), PX(topY));
    ctx.lineTo(PX(midX), PX(bottom));
    ctx.stroke();
    if (S.watermark && S.watermarkDivider) {
      ctx.save();
      ctx.globalAlpha = 0.09;
      ctx.fillStyle = '#64748b';
      setFont(ctx, { size: PT(S.watermarkSize || 12), bold: true });
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(PX(midX), PX((topY + bottom) / 2));
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(S.watermark, 0, 0);
      ctx.restore();
    }
  }
  const t = parseTags(S.title);
  if (!t.noPageNumber) {
    if (S.template !== 'meb' && S.testType === 'yaprak') {
      const footerY = PH - M + 3;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = Math.max(1.5, 0.5 * SCALE);
      ctx.beginPath();
      ctx.moveTo(PX(M), PX(footerY - 4));
      ctx.lineTo(PX(PW - M), PX(footerY - 4));
      ctx.stroke();
      drawText(ctx, (S.school || 'BİLİM AKADEMİ').toLocaleUpperCase('tr-TR'), M, footerY, { size: PT(9), bold: true, color: '#000' });
      drawText(ctx, String(pageNo), PW - M, footerY, { size: PT(9), bold: true, align: 'right', color: '#000' });
    } else {
      drawText(ctx, '— ' + pageNo + ' —', PW / 2, PH - M + 3, { size: PT(8), align: 'center', color: '#64748b' });
      if (isWritten && pageNo === 1) {
        drawText(ctx, 'Başarılar dileriz.', PW - M, PH - M + 3, { size: PT(7.5), italic: true, align: 'right', color: '#64748b' });
      }
    }
  }
}

function drawOptic(ctx, PW, count, title, version, answers) {
  const isKey = Array.isArray(answers);
  drawText(ctx, isKey ? 'OPTİK CEVAP FORMU — CEVAP ANAHTARI' : 'OPTİK CEVAP FORMU', PW / 2, 18, { size: PT(14), bold: true, align: 'center' });
  drawText(ctx, title, PW / 2, 25, { size: PT(10), align: 'center', color: '#334155' });
  if (isKey) drawText(ctx, 'Kitapçık: ' + version + '  ·  Doğru şıklar işaretlenmiştir', 15, 33, { size: PT(9), color: '#334155' });
  else drawText(ctx, 'Adı Soyadı: .............................   No: ........   Kitapçık: ' + version, 15, 33, { size: PT(9) });
  const perCol = 25;
  const cols = Math.max(1, Math.ceil(count / perCol));
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = Math.max(1, 0.35 * SCALE);
  for (let i = 0; i < count; i++) {
    const c = Math.floor(i / perCol), r = i % perCol;
    const x = 16 + c * ((PW - 32) / cols), y = 44 + r * 8.5;
    drawText(ctx, String(i + 1).padStart(2, '0'), x, y + 1.8, { size: PT(8), bold: true });
    const correct = isKey ? answers[i] : null;
    for (let k = 0; k < 5; k++) {
      const cx = x + 10 + k * 6.5;
      const isCorrect = correct && LETTERS[k] === correct;
      ctx.beginPath();
      ctx.arc(PX(cx), PX(y), PX(2.3), 0, Math.PI * 2);
      if (isCorrect) {
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        drawText(ctx, LETTERS[k], cx, y + 1, { size: PT(6.5), align: 'center', color: '#ffffff', bold: true });
      } else {
        ctx.stroke();
        drawText(ctx, LETTERS[k], cx, y + 1, { size: PT(6.5), align: 'center' });
      }
    }
  }
}

function smartItemTotalH(it, ctx, colW) {
  let th = it.h;
  if (it.q && it.q.stem && ctx) {
    setFont(ctx, { size: PT(8.5), bold: true });
    th += wrapAuto(ctx, it.q.stem, colW * SCALE - PX(4)).length * 4.2 + 4;
  }
  return th;
}

function smartOrder(items, colH, gap, ctx, colW) {
  const pool = items.map((it) => ({ it, th: smartItemTotalH(it, ctx, colW) }));
  const out = [];
  let rem = colH;
  let fresh = true;
  while (pool.length) {
    let pickI = -1, bestLeft = Infinity;
    for (let i = 0; i < pool.length; i++) {
      if (pool[i].th <= rem) {
        const left = rem - pool[i].th;
        if (left < bestLeft) { bestLeft = left; pickI = i; }
      }
    }
    if (pickI === -1) {
      if (fresh) {
        pool.sort((a, b) => b.th - a.th);
        pickI = 0;
      } else {
        rem = colH;
        fresh = true;
        continue;
      }
    }
    const pick = pool.splice(pickI, 1)[0];
    out.push(pick.it);
    rem -= pick.th + gap;
    fresh = false;
  }
  return out;
}

function imgItem(q, w, maxH) {
  const ar0 = q.h / Math.max(1, q.w);
  const custom = (q.scale != null && q.scale !== 1) || q.aspect != null;
  if (!custom) {
    let h = ar0 * w;
    if (h > maxH) h = maxH;
    return { q, w, h };
  }
  let iw = w * (q.scale || 1);
  if (iw > w) iw = w;
  if (iw < 8) iw = 8;
  let ih = (q.aspect != null ? q.aspect : ar0) * iw;
  if (ih > maxH) ih = maxH;
  return { q, w: iw, h: ih };
}

function buildPDF(pages) {
  const ptPerPx = 72 / (SCALE * 25.4);
  const W = +(pages[0].canvas.width * ptPerPx).toFixed(2);
  const H = +(pages[0].canvas.height * ptPerPx).toFixed(2);
  const enc = (s) => {
    const a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 0xff;
    return a;
  };
  const parts = [];
  let offset = 0;
  const write = (data) => {
    const bytes = typeof data === 'string' ? enc(data) : data;
    parts.push(bytes);
    offset += bytes.length;
  };
  const offsets = [0];
  write('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  offsets[1] = offset;
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  const pageObjNums = pages.map((_, i) => 3 + i * 3);
  offsets[2] = offset;
  write('2 0 obj\n<< /Type /Pages /Kids [' + pageObjNums.map((n) => n + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>\nendobj\n');
  pages.forEach((pg, i) => {
    const pageNo = 3 + i * 3, imgNo = pageNo + 1, contentNo = pageNo + 2;
    const content = 'q\n' + W + ' 0 0 ' + H + ' 0 0 cm\n/Im0 Do\nQ\n';
    offsets[pageNo] = offset;
    write(pageNo + ' 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 ' + imgNo + ' 0 R >> >> /Contents ' + contentNo + ' 0 R >>\nendobj\n');
    offsets[imgNo] = offset;
    write(imgNo + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + pg.canvas.width + ' /Height ' + pg.canvas.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + pg.bytes.length + ' >>\nstream\n');
    write(pg.bytes);
    write('\nendstream\nendobj\n');
    offsets[contentNo] = offset;
    write(contentNo + ' 0 obj\n<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream\nendobj\n');
  });
  const xrefStart = offset;
  const totalObjs = 2 + pages.length * 3;
  let xref = 'xref\n0 ' + (totalObjs + 1) + '\n0000000000 65535 f \n';
  for (let i = 1; i <= totalObjs; i++) xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  xref += 'trailer\n<< /Size ' + (totalObjs + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF\n';
  write(xref);
  return new Blob(parts, { type: 'application/pdf' });
}

async function renderPaperToBlob(idx) {
  await ensureFont();
  const t = parseTags(S.title);
  const [PW, PH] = pageSizeMM();
  const M = S.margin || 10;
  const version = LETTERS[idx];
  const gap = S.spacing ? Math.max(5, S.spacingValue) : 7;
  const ordered = booklet(questions, idx);
  const title = t.noUppercase ? t.clean : t.clean.toLocaleUpperCase('tr-TR');
  const pages = [createPage(PW, PH)];
  let page = pages[0];
  const contentTop = drawHeader(page.ctx, PW, PH, M, t, version, title, true);
  const isMeb = S.template === 'meb';
  const footerH = t.noPageNumber ? 0 : (!isMeb && S.testType === 'yaprak' ? 10 : 5);
  const subTop = !isMeb && S.testType === 'yaprak' ? M + 16 : M + 8;
  const wantsFooterNote = isMeb || S.testType === 'yazili';
  const bottomAdj = PH - M - footerH;
  const usableH = bottomAdj - contentTop;
  const maxH = Math.max(20, usableH * 0.88);
  const numCols = S.columns || 2;
  const colGap = 8;
  const colW = (PW - 2 * M - colGap * (numCols - 1)) / numCols;
  await Promise.all(ordered.filter((q) => q.type !== 'text' || q.imgSrc).map(getImg));
  const sharedBank = [];
  ordered.forEach((q) => { if (q.kind === 'bosluk' && q.bankShared) (q.wordBank || []).forEach((w) => { if (!sharedBank.includes(w)) sharedBank.push(w); }); });
  let sharedBankDrawn = false;
  const yStart = contentTop;
  let items = ordered.map((q) => {
    const w = colW - 6;
    if (q.type === 'text') { const it = { q, w, h: maxH }; prepText(it, page.ctx); it.h = Math.min(it.h, maxH); return it; }
    return imgItem(q, w, maxH);
  });
  if (S.smartLayout && numCols > 1) items = smartOrder(items, bottomAdj - yStart, gap, page.ctx, colW).map((it, i) => ({ ...it, num: i + 1 }));
  let c = 0, y = yStart, firstPage = true, pageIndex = 1, placedThisPage = 0;
  for (let n = 0; n < items.length; n++) {
    const it = items[n]; if (it.num === undefined) it.num = n + 1;
    let stemH = 0;
    if (it.q.stem) { setFont(page.ctx, { size: PT(8.5), bold: true }); stemH = wrapAuto(page.ctx, it.q.stem, colW * SCALE - PX(4)).length * 4.2 + 4; }
    if (y + stemH + it.h > bottomAdj && placedThisPage > 0) {
      c++;
      if (c >= numCols) {
        finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
        pageIndex++; page = createPage(PW, PH); pages.push(page); firstPage = false;
        drawHeader(page.ctx, PW, PH, M, t, version, title, false); c = 0; placedThisPage = 0;
      }
      y = firstPage ? yStart : subTop;
    }
    const x = M + c * (colW + colGap);
    if (!sharedBankDrawn && sharedBank.length && it.q.kind === 'bosluk') {
      setFont(page.ctx, { size: PT(8.5) });
      const bankLines = wrapText(page.ctx, sharedBank.join('   •   '), (colW - 6) * SCALE);
      const bankBoxH = bankLines.length * 4.6 + 8;
      if (y + bankBoxH + it.h > bottomAdj && placedThisPage > 0) {
        c++;
        if (c >= numCols) {
          finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
          pageIndex++; page = createPage(PW, PH); pages.push(page); firstPage = false;
          drawHeader(page.ctx, PW, PH, M, t, version, title, false); c = 0; placedThisPage = 0;
        }
        y = firstPage ? yStart : subTop;
      }
      const bx = M + c * (colW + colGap);
      page.ctx.fillStyle = '#fffbeb'; page.ctx.fillRect(PX(bx), PX(y), PX(colW), PX(bankBoxH));
      page.ctx.strokeStyle = '#f59e0b'; page.ctx.lineWidth = Math.max(1, 0.35 * SCALE);
      page.ctx.strokeRect(PX(bx), PX(y), PX(colW), PX(bankBoxH));
      drawText(page.ctx, 'KELİME HAVUZU', bx + 3, y + 4.5, { size: PT(8), bold: true, color: '#92400e' });
      bankLines.forEach((l, i) => { drawText(page.ctx, l, bx + 3, y + 9.5 + i * 4.6, { size: PT(8.5), color: '#78350f' }); });
      y += bankBoxH + 3; sharedBankDrawn = true;
    }
    if (it.q.stem) y += drawStemBox(page.ctx, it.q.stem, x, y, colW);
    drawQ(page.ctx, it, x, y);
    y += it.h + gap;
    placedThisPage++;
  }
  finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
  if (S.optic) { const op = createPage(PW, PH); drawOptic(op.ctx, PW, items.length, title, version); pages.push(op); }
  pages.forEach((p) => { p.bytes = jpegBytes(p.canvas.toDataURL('image/jpeg', 0.93)); });
  return { blob: buildPDF(pages), order: items.map((i) => i.q.id) };
}

async function renderAnswerKeyBlob(orders) {
  await ensureFont();
  const t = parseTags(S.title);
  const [PW, PH] = pageSizeMM();
  const pages = [createPage(PW, PH)];
  let page = pages[0]; let y = 40;
  drawText(page.ctx, 'CEVAP ANAHTARI', PW / 2, 22, { size: PT(16), bold: true, align: 'center' });
  drawText(page.ctx, t.clean, PW / 2, 30, { size: PT(12), align: 'center' });
  orders.forEach((order, bi) => {
    if (y > 250) { page = createPage(PW, PH); pages.push(page); y = 22; }
    y += drawText(page.ctx, LETTERS[bi] + ' Kitapçığı', 15, y, { size: PT(11), bold: true }) + 6;
    const rowH = 7.5, perRow = 5;
    order.forEach((id, i) => {
      const q = questions.find((x) => x.id === id);
      const col = i % perRow, row = Math.floor(i / perRow), cellW = (PW - 30) / perRow;
      drawText(page.ctx, (i + 1) + ') ' + (q && q.answer ? String(q.answer) : '-'), 15 + col * cellW, y + row * rowH, { size: PT(9), maxW: PX(cellW - 3) });
    });
    y += Math.ceil(order.length / perRow) * rowH + 6;
    if (bi > 0) {
      const map = order.map((id, i) => (i + 1) + '\u2190A' + (questions.findIndex((q) => q.id === id) + 1)).join('   ');
      y += drawText(page.ctx, 'A kitapçığı eşleşmesi: ' + map, 15, y, { size: PT(8), maxW: PX(PW - 30) }) + 6;
    }
    if (S.optic) {
      const opticPage = createPage(PW, PH); pages.push(opticPage);
      const answers = order.map((id) => { const q = questions.find((x) => x.id === id); return q && q.answer && /^[A-E]$/i.test(q.answer) ? q.answer.toUpperCase() : null; });
      drawOptic(opticPage.ctx, PW, order.length, t.clean, LETTERS[bi], answers);
    }
  });
  pages.forEach((p) => { p.bytes = jpegBytes(p.canvas.toDataURL('image/jpeg', 0.92)); });
  return buildPDF(pages);
}

function showResult(files) {
  const list = $('resultList');
  list.innerHTML = '';
  files.forEach((f) => {
    const url = URL.createObjectURL(f.blob);
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 dark:border-slate-700';
    row.innerHTML = '<span class="flex-1 truncate text-[13px] font-medium text-slate-700 dark:text-slate-300">' + f.name + '</span>' +
      '<a href="' + url + '" download="' + f.name + '" class="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700">İndir</a>' +
      '<button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-900 dark:border-slate-700 dark:text-slate-300">Önizle</button>';
    row.querySelector('button').onclick = () => window.open(url, '_blank');
    list.appendChild(row);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  $('resultModal').classList.replace('hidden', 'flex');
}

async function buildPreviewPages() {
  await ensureFont();
  const t = parseTags(S.title);
  const [PW, PH] = pageSizeMM();
  const M = S.margin || 10;
  const version = LETTERS[0];
  const gap = S.spacing ? Math.max(5, S.spacingValue) : 7;
  const ordered = booklet(questions, 0);
  const title = t.noUppercase ? t.clean : t.clean.toLocaleUpperCase('tr-TR');
  const pages = [createPage(PW, PH)];
  pages[0].items = [];

  if (S.template === 'meb') {
    const lb = getMebLogoBox(M);
    if (lb.show) pages[0].logoBox = lb;
    const tempCanvas = createPage(PW, PH).canvas;
    const tempCtx = tempCanvas.getContext('2d');
    pages[0].mebHeaderItems = getMEBHeaderItems(tempCtx, PW, PH, M, t, version);
  }

  let page = pages[0];
  const contentTop = drawHeader(page.ctx, PW, PH, M, t, version, title, true);
  const isMeb = S.template === 'meb';
  const footerH = t.noPageNumber ? 0 : (!isMeb && S.testType === 'yaprak' ? 10 : 5);
  const subTop = !isMeb && S.testType === 'yaprak' ? M + 16 : M + 8;
  const wantsFooterNote = isMeb || S.testType === 'yazili';
  const bottomAdj = PH - M - footerH;
  const usableH = bottomAdj - contentTop;
  const maxH = Math.max(20, usableH * 0.88);
  const numCols = S.columns || 2;
  const colGap = 8;
  const colW = (PW - 2 * M - colGap * (numCols - 1)) / numCols;
  await Promise.all(ordered.filter((q) => q.type !== 'text' || q.imgSrc).map(getImg));
  const sharedBank = [];
  ordered.forEach((q) => { if (q.kind === 'bosluk' && q.bankShared) (q.wordBank || []).forEach((w) => { if (!sharedBank.includes(w)) sharedBank.push(w); }); });
  let sharedBankDrawn = false;
  const yStart = contentTop;
  let items = ordered.map((q) => {
    const w = colW - 6;
    if (q.type === 'text') { const it = { q, w, h: maxH }; prepText(it, page.ctx); it.h = Math.min(it.h, maxH); return it; }
    return imgItem(q, w, maxH);
  });
  if (S.smartLayout && numCols > 1) items = smartOrder(items, bottomAdj - yStart, gap, page.ctx, colW).map((it, i) => ({ ...it, num: i + 1 }));
  let c = 0, y = yStart, firstPage = true, pageIndex = 1, placedThisPage = 0;
  for (let n = 0; n < items.length; n++) {
    const it = items[n]; if (it.num === undefined) it.num = n + 1;
    let stemH = 0;
    if (it.q.stem) { setFont(page.ctx, { size: PT(8.5), bold: true }); stemH = wrapAuto(page.ctx, it.q.stem, colW * SCALE - PX(4)).length * 4.2 + 4; }
    if (y + stemH + it.h > bottomAdj && placedThisPage > 0) {
      c++;
      if (c >= numCols) {
        finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
        pageIndex++; page = createPage(PW, PH); pages.push(page); firstPage = false;
        drawHeader(page.ctx, PW, PH, M, t, version, title, false); c = 0; placedThisPage = 0;
      }
      y = firstPage ? yStart : subTop;
    }
    const x = M + c * (colW + colGap);
    if (!sharedBankDrawn && sharedBank.length && it.q.kind === 'bosluk') {
      setFont(page.ctx, { size: PT(8.5) });
      const bankLines = wrapText(page.ctx, sharedBank.join('   •   '), (colW - 6) * SCALE);
      const bankBoxH = bankLines.length * 4.6 + 8;
      if (y + bankBoxH + it.h > bottomAdj && placedThisPage > 0) {
        c++;
        if (c >= numCols) {
          finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
          pageIndex++; page = createPage(PW, PH); pages.push(page); firstPage = false;
          drawHeader(page.ctx, PW, PH, M, t, version, title, false); c = 0; placedThisPage = 0;
        }
        y = firstPage ? yStart : subTop;
      }
      const bx = M + c * (colW + colGap);
      page.ctx.fillStyle = '#fffbeb'; page.ctx.fillRect(PX(bx), PX(y), PX(colW), PX(bankBoxH));
      page.ctx.strokeStyle = '#f59e0b'; page.ctx.lineWidth = Math.max(1, 0.35 * SCALE);
      page.ctx.strokeRect(PX(bx), PX(y), PX(colW), PX(bankBoxH));
      drawText(page.ctx, 'KELİME HAVUZU', bx + 3, y + 4.5, { size: PT(8), bold: true, color: '#92400e' });
      bankLines.forEach((l, i) => { drawText(page.ctx, l, bx + 3, y + 9.5 + i * 4.6, { size: PT(8.5), color: '#78350f' }); });
      y += bankBoxH + 3; sharedBankDrawn = true;
    }
    if (it.q.stem) y += drawStemBox(page.ctx, it.q.stem, x, y, colW);
    drawQ(page.ctx, it, x, y);
    if (!page.items) page.items = [];
    page.items.push({ q: it.q, x, y, w: it.w, h: it.h, num: it.num, p: pageIndex });
    y += it.h + gap;
    placedThisPage++;
  }
  finishPage(page, PW, PH, M, pageIndex, firstPage, yStart, subTop, bottomAdj, wantsFooterNote);
  if (S.optic) { const op = createPage(PW, PH); drawOptic(op.ctx, PW, items.length, title, version); pages.push(op); }
  return pages;
}

function initMakePdfButton(collectFn) {
  const MAKE_BTN_DEFAULT_HTML = '<span class="pvMakeSpark">✨</span> Sınav Kağıdını Oluştur';
  const makeBtn = $('makeBtn');
  if (!makeBtn) return;

  makeBtn.onclick = async () => {
    if (typeof collectFn === 'function') collectFn();
    if (!questions.length) return alert('Önce soru yükleyin.');
    makeBtn.disabled = true;
    makeBtn.innerHTML = '⏳ Hazırlanıyor...';
    try {
      await ensureFont();
      const count = S.groups;
      const files = [];
      const orders = [];
      const tParsed = parseTags(S.title);
      const baseName = defaultBaseName(tParsed.clean, S);
      const dateStr = todayStr();
      for (let i = 0; i < count; i++) {
        const r = await renderPaperToBlob(i);
        orders.push(r.order);
        const suffix = count > 1 ? ' (' + LETTERS[i] + ' Kitapçığı)' : '';
        files.push({ name: baseName + ' - ' + dateStr + suffix + '.pdf', blob: r.blob });
      }
      if (S.showAnswerKey && questions.some((q) => q.answer)) {
        files.push({ name: baseName + ' - ' + dateStr + ' - Cevap Anahtarı.pdf', blob: await renderAnswerKeyBlob(orders) });
      }
      showResult(files);
    } catch (e) {
      alert('PDF oluşturulurken hata oluştu: ' + (e && e.message ? e.message : e));
      console.error(e);
    }
    makeBtn.disabled = false;
    makeBtn.innerHTML = MAKE_BTN_DEFAULT_HTML;
  };

  $('resultClose').onclick = () => $('resultModal').classList.replace('flex', 'hidden');
}

function calculateQuestionBounds() {
  const [PW, PH] = pageSizeMM();
  const M = S.margin || 10;
  const t = parseTags(S.title || '');
  const title = t.noUppercase ? t.clean : t.clean.toLocaleUpperCase('tr-TR');
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = PX(PW);
  tempCanvas.height = PX(PH);
  const tempCtx = tempCanvas.getContext('2d');
  const contentTop = drawHeader(tempCtx, PW, PH, M, t, LETTERS[0], title, true);
  const isMeb = S.template === 'meb';
  const footerH = t.noPageNumber ? 0 : (!isMeb && S.testType === 'yaprak' ? 10 : 5);
  const bottomAdj = PH - M - footerH;
  const usableH = Math.max(20, bottomAdj - contentTop);
  const numCols = S.columns || 2;
  const colGap = 8;
  const colW = (PW - 2 * M - colGap * (numCols - 1)) / numCols;
  return {
    PW, PH, M, contentTop, bottomAdj, usableH, numCols, colGap, colW,
    left: M,
    right: PW - M,
    width: PW - 2 * M
  };
}


// Module Exports
__exports['SCALE'] = SCALE;
__exports['FONT'] = FONT;
__exports['PX'] = PX;
__exports['PT'] = PT;
__exports['LH_MM'] = LH_MM;
__exports['TR_FONT_SAMPLE'] = TR_FONT_SAMPLE;
__exports['LATEX_SYMS'] = LATEX_SYMS;
__exports['imgCache'] = imgCache;
__exports['MEB_LOGO_URL'] = MEB_LOGO_URL;
__exports['ensureFont'] = ensureFont;
__exports['pageSizeMM'] = pageSizeMM;
__exports['createPage'] = createPage;
__exports['setFont'] = setFont;
__exports['latexParse'] = latexParse;
__exports['measureLatexNode'] = measureLatexNode;
__exports['drawLatexNode'] = drawLatexNode;
__exports['delimGlyph'] = delimGlyph;
__exports['tokenizeLatexSegments'] = tokenizeLatexSegments;
__exports['wrapRichText'] = wrapRichText;
__exports['drawRichLine'] = drawRichLine;
__exports['wrapText'] = wrapText;
__exports['drawText'] = drawText;
__exports['getImg'] = getImg;
__exports['setCustomLogo'] = setCustomLogo;
__exports['ensureMebLogo'] = ensureMebLogo;
__exports['mebLogoVisible'] = mebLogoVisible;
__exports['getMebLogoBox'] = getMebLogoBox;
__exports['activeLogoAspect'] = activeLogoAspect;
__exports['fixLogoAspect'] = fixLogoAspect;
__exports['trimLogoImage'] = trimLogoImage;
__exports['drawMEBLogo'] = drawMEBLogo;
__exports['drawMEBLogoVector'] = drawMEBLogoVector;
__exports['getMEBHeaderItems'] = getMEBHeaderItems;
__exports['drawMEBHeader'] = drawMEBHeader;
__exports['drawHeader'] = drawHeader;
__exports['splitBlanks'] = splitBlanks;
__exports['wrapBlankSegments'] = wrapBlankSegments;
__exports['wrapAuto'] = wrapAuto;
__exports['drawAutoLine'] = drawAutoLine;
__exports['prepText'] = prepText;
__exports['drawQ'] = drawQ;
__exports['drawStemBox'] = drawStemBox;
__exports['finishPage'] = finishPage;
__exports['drawOptic'] = drawOptic;
__exports['smartItemTotalH'] = smartItemTotalH;
__exports['smartOrder'] = smartOrder;
__exports['imgItem'] = imgItem;
__exports['buildPDF'] = buildPDF;
__exports['renderPaperToBlob'] = renderPaperToBlob;
__exports['renderAnswerKeyBlob'] = renderAnswerKeyBlob;
__exports['showResult'] = showResult;
__exports['buildPreviewPages'] = buildPreviewPages;
__exports['initMakePdfButton'] = initMakePdfButton;
__exports['calculateQuestionBounds'] = calculateQuestionBounds;
Object.defineProperty(__exports, 'mebLogoImg', { get: () => mebLogoImg, set: (v) => { mebLogoImg = v; }, enumerable: true, configurable: true });
Object.defineProperty(__exports, 'customLogoSrc', { get: () => customLogoSrc, set: (v) => { customLogoSrc = v; }, enumerable: true, configurable: true });

});

__define('modules/geometryDrawer.js', function(__exports, __require, __module) {
const { $, openModal, closeModal } = __require('utils.js');

/**
 * Vektörel Geometri Çizim Aracı ve KaTeX Denklem Tuvali
 * - 'Şekil Çiz' (Otomatik Açı Tespiti & $90^\circ$ Diklik Sembolü)
 * - Açı Yazılarını Açma / Kapatma (Sadece Yay Gösterme Modu)
 * - Şekil Üstüne Çizim & Manyetik Köşe/Kenar Yakalama (Vertex Snap)
 * - KaTeX Formül Tuvali & 2x Retina PNG Export
 */

let fabricCanvas = null;
let onInsertCallback = null;
let activeTool = 'select';

// Çizim & Stil Durumu
const currentStyle = {
  strokeColor: '#0f172a',
  fillColor: 'transparent',
  baseFillColor: 'transparent',
  fillOpacity: 0.35,
  strokeWidth: 2,
  isDashed: false,
  fontSize: 20,
  angleDisplayMode: 'all' // 'all' | 'arc_only' | 'hidden'
};

function hexToRgba(hex, alpha = 1) {
  if (!hex || hex === 'transparent') return 'transparent';
  if (hex.startsWith('rgba')) {
    return hex.replace(/rgba?\(([^)]+)\)/, (match, val) => {
      const parts = val.split(',').map(s => s.trim());
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    });
  }
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

let gridEnabled = true;
let snapEnabled = true;
let zoomLevel = 100;

// Geri Al / İleri Al Yığını
const historyStack = [];
let historyIndex = -1;
let isHistoryUpdating = false;

// Şekil Çiz (Shape / Polygon) Durumu
let shapePoints = [];
let shapeTempLine = null;
let shapeMarkers = [];
let shapeSegments = [];

// Doğru Çizim Durumu
let drawingLine = null;
let isDrawingLine = false;

// Manyetik Kilitlenme Göstergesi
let snapIndicator = null;

// Renk Paletleri
const STROKE_COLORS = [
  '#0f172a', '#475569', '#94a3b8', '#1e3a8a',
  '#2563eb', '#0284c7', '#16a34a', '#059669',
  '#ca8a04', '#ea580c', '#dc2626', '#7c3aed'
];

const FILL_COLORS = [
  'transparent', '#ffffff', '#f8fafc', '#fef3c7',
  '#dbeafe', '#dcfce7', '#fee2e2', '#f3e8ff',
  '#ffedd5', '#cffafe', '#f1f5f9', '#e2e8f0'
];

// KaTeX Formül Sekmeleri
const FORMULA_TABS = {
  basic: [
    { latex: '\\sqrt{x}', display: '√x' },
    { latex: '\\sqrt[n]{x}', display: 'ⁿ√x' },
    { latex: '\\frac{a}{b}', display: 'a/b' },
    { latex: 'x^{2}', display: 'x²' },
    { latex: 'x_{1}', display: 'x₁' },
    { latex: 'x^{n}', display: 'xⁿ' },
    { latex: '\\pm', display: '±' },
    { latex: '\\cdot', display: '·' },
    { latex: '2\\sqrt{3}', display: '2√3' },
    { latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}', display: 'Kök Formülü' }
  ],
  symbols: [
    { latex: '\\pi', display: 'π' },
    { latex: '\\alpha', display: 'α' },
    { latex: '\\beta', display: 'β' },
    { latex: '\\theta', display: 'θ' },
    { latex: '\\Delta', display: 'Δ' },
    { latex: '60^\\circ', display: '60°' },
    { latex: '90^\\circ', display: '90°' },
    { latex: '\\perp', display: '⊥' },
    { latex: '\\parallel', display: '∥' },
    { latex: '\\le', display: '≤' },
    { latex: '\\ge', display: '≥' },
    { latex: '\\ne', display: '≠' },
    { latex: '\\approx', display: '≈' },
    { latex: '\\infty', display: '∞' }
  ],
  placeholders: [
    { latex: '\\vec{v}', display: 'v⃗' },
    { latex: '|x|', display: '|x|' },
    { latex: '\\overline{AB}', display: 'AB̄' },
    { latex: '\\widehat{ABC}', display: 'ABĈ' },
    { latex: '\\left( \\frac{a}{b} \\right)', display: '(a/b)' }
  ],
  calculus: [
    { latex: '\\int f(x) dx', display: '∫ f(x)dx' },
    { latex: '\\int_{a}^{b} f(x) dx', display: '∫ₐᵇ f(x)dx' },
    { latex: '\\sum_{i=1}^{n} x_i', display: '∑ xᵢ' },
    { latex: '\\lim_{x \\to \\infty}', display: 'lim x→∞' },
    { latex: '\\frac{dy}{dx}', display: 'dy/dx' }
  ]
};

let activeFormulaTab = 'basic';
let formulaColor = '#0f172a';
let formulaSize = 26;

// ============================================================================
// MODAL AÇILIŞ VE DIŞA AKTARIM FONKSİYONLARI
// ============================================================================

function setOnGeometryInsertCallback(fn) {
  onInsertCallback = fn;
}

function openGeometryModal(callback) {
  if (typeof callback === 'function') {
    onInsertCallback = callback;
  }
  // Yazılı soru ekle modalı açıksa tuval etkileşimini engellememesi için kapat
  closeModal('textModal');
  openModal('geoModal');

  setTimeout(() => {
    initFabricCanvasIfNeeded();
    resetToolState();
    if (fabricCanvas) {
      fabricCanvas.calcOffset();
      fabricCanvas.renderAll();
    }
  }, 60);
}

function syncControlsFromState() {}

// ============================================================================
// FABRIC.JS TUVAL BAŞLATMA VE YÖNETİMİ
// ============================================================================

function initFabricCanvasIfNeeded() {
  const canvasEl = $('geoFabricCanvas');
  if (!canvasEl) return;

  const fabric = window.fabric;
  if (!fabric) {
    console.error('Fabric.js kütüphanesi yüklenemedi!');
    return;
  }

  if (fabricCanvas) {
    fabricCanvas.calcOffset();
    return;
  }

  fabricCanvas = new fabric.Canvas('geoFabricCanvas', {
    width: 760,
    height: 490,
    selection: true,
    preserveObjectStacking: true,
    fireRightClick: true,
    stopContextMenu: true
  });

  updateGridBackground(gridEnabled);
  saveHistoryState();

  // Seçim Olayları
  fabricCanvas.on('selection:created', (e) => onObjectSelected(e.selected ? e.selected[0] : null));
  fabricCanvas.on('selection:updated', (e) => onObjectSelected(e.selected ? e.selected[0] : null));
  fabricCanvas.on('selection:cleared', () => onObjectSelected(null));
  fabricCanvas.on('object:modified', () => {
    onObjectSelected(fabricCanvas.getActiveObject());
    saveHistoryState();
  });

  // Fare Olayları
  fabricCanvas.on('mouse:down', onCanvasMouseDown);
  fabricCanvas.on('mouse:move', onCanvasMouseMove);
  fabricCanvas.on('mouse:up', onCanvasMouseUp);
  fabricCanvas.on('mouse:dblclick', () => {
    if (activeTool === 'shape' && shapePoints.length >= 3) {
      finishShape();
    }
  });

  window.addEventListener('keydown', onGlobalKeyDown);
}

function updateGridBackground(enabled) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  if (!fabric) return;

  if (!enabled) {
    fabricCanvas.setBackgroundColor('#ffffff', fabricCanvas.renderAll.bind(fabricCanvas));
    return;
  }

  const gridSize = 20;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = gridSize;
  patternCanvas.height = gridSize;
  const pctx = patternCanvas.getContext('2d');
  if (pctx) {
    pctx.strokeStyle = '#e2e8f0';
    pctx.lineWidth = 0.8;
    pctx.beginPath();
    pctx.moveTo(gridSize, 0);
    pctx.lineTo(gridSize, gridSize);
    pctx.lineTo(0, gridSize);
    pctx.stroke();
  }

  const pattern = new fabric.Pattern({
    source: patternCanvas,
    repeat: 'repeat'
  });
  fabricCanvas.setBackgroundColor(pattern, fabricCanvas.renderAll.bind(fabricCanvas));
}

// ============================================================================
// MANYETİK KÖŞE / TEPE YAKALAMA (VERTEX SNAPPING)
// ============================================================================

function getAllCanvasVertices() {
  if (!fabricCanvas) return [];
  const fabric = window.fabric;
  const vertices = [];

  fabricCanvas.forEachObject((obj) => {
    if (obj.isHelper || obj === snapIndicator) return;

    if (obj.type === 'polygon' && Array.isArray(obj.points)) {
      const matrix = obj.calcTransformMatrix();
      obj.points.forEach((pt) => {
        const trans = fabric.util.transformPoint(
          new fabric.Point(pt.x - obj.pathOffset.x, pt.y - obj.pathOffset.y),
          matrix
        );
        vertices.push({ x: trans.x, y: trans.y });
      });
    } else if (obj.type === 'group' && Array.isArray(obj._objects)) {
      // Grup içindeki poligonları bul
      obj._objects.forEach((sub) => {
        if (sub.type === 'polygon' && Array.isArray(sub.points)) {
          const subMatrix = sub.calcTransformMatrix();
          sub.points.forEach((pt) => {
            const trans = fabric.util.transformPoint(
              new fabric.Point(pt.x - sub.pathOffset.x, pt.y - sub.pathOffset.y),
              subMatrix
            );
            vertices.push({ x: trans.x, y: trans.y });
          });
        }
      });
    } else if (obj.type === 'line') {
      vertices.push({ x: obj.x1, y: obj.y1 });
      vertices.push({ x: obj.x2, y: obj.y2 });
    }
  });

  return vertices;
}

function getSnappedPoint(rawPt, threshold = 16) {
  let pt = {
    x: snapEnabled ? Math.round(rawPt.x / 10) * 10 : rawPt.x,
    y: snapEnabled ? Math.round(rawPt.y / 10) * 10 : rawPt.y
  };

  if (!snapEnabled) return pt;

  // Mevcut şekillerin köşelerine bak
  const vertices = getAllCanvasVertices();
  let minDist = threshold;
  let snapped = null;

  for (const v of vertices) {
    const d = Math.hypot(rawPt.x - v.x, rawPt.y - v.y);
    if (d < minDist) {
      minDist = d;
      snapped = { x: v.x, y: v.y };
    }
  }

  if (snapped) {
    showSnapIndicator(snapped.x, snapped.y);
    return snapped;
  } else {
    hideSnapIndicator();
    return pt;
  }
}

function showSnapIndicator(x, y) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  if (!snapIndicator) {
    snapIndicator = new fabric.Circle({
      radius: 6,
      fill: 'rgba(16, 185, 129, 0.3)',
      stroke: '#10b981',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      isHelper: true
    });
    fabricCanvas.add(snapIndicator);
  }
  snapIndicator.set({ left: x, top: y });
  snapIndicator.bringToFront();
}

function hideSnapIndicator() {
  if (snapIndicator && fabricCanvas) {
    fabricCanvas.remove(snapIndicator);
    snapIndicator = null;
  }
}

// ============================================================================
// OTOMATİK AÇI VE DİKLİK HESAPLAMA ÇEKİRDEĞİ
// ============================================================================

function calculatePolygonAngles(points, arcRadius = 26) {
  const n = points.length;
  if (n < 3) return [];

  const results = [];

  for (let i = 0; i < n; i++) {
    const pPrev = points[(i - 1 + n) % n];
    const pCurr = points[i];
    const pNext = points[(i + 1) % n];

    const vPrev = { x: pPrev.x - pCurr.x, y: pPrev.y - pCurr.y };
    const vNext = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };

    const lenPrev = Math.hypot(vPrev.x, vPrev.y);
    const lenNext = Math.hypot(vNext.x, vNext.y);

    if (lenPrev === 0 || lenNext === 0) continue;

    const u1 = { x: vPrev.x / lenPrev, y: vPrev.y / lenPrev };
    const u2 = { x: vNext.x / lenNext, y: vNext.y / lenNext };

    const dot = Math.max(-1.0, Math.min(1.0, u1.x * u2.x + u1.y * u2.y));
    const angleRad = Math.acos(dot);
    const angleDegrees = Math.round((angleRad * 180) / Math.PI);
    const isRightAngle = Math.abs(angleDegrees - 90) <= 2;

    // u1'den u2'ye dönüş yönü (ekran koordinatlarında cross product)
    const cp = u1.x * u2.y - u1.y * u2.x;
    const sweepFlag = cp > 0 ? 1 : 0;

    // Açı ortay birim vektörü (her zaman açının içine doğru yönelir)
    const bRaw = { x: u1.x + u2.x, y: u1.y + u2.y };
    const bLen = Math.hypot(bRaw.x, bRaw.y);
    const uBisector = bLen > 1e-4
      ? { x: bRaw.x / bLen, y: bRaw.y / bLen }
      : { x: -u1.y, y: u1.x };

    const boxSize = 16;
    if (isRightAngle) {
      // 90° Diklik Sembolü: Köşede kare + nokta
      const corner1 = { x: pCurr.x + u1.x * boxSize, y: pCurr.y + u1.y * boxSize };
      const corner2 = {
        x: pCurr.x + (u1.x + u2.x) * boxSize,
        y: pCurr.y + (u1.y + u2.y) * boxSize
      };
      const corner3 = { x: pCurr.x + u2.x * boxSize, y: pCurr.y + u2.y * boxSize };

      const dotPos = {
        x: pCurr.x + (u1.x + u2.x) * (boxSize * 0.5),
        y: pCurr.y + (u1.y + u2.y) * (boxSize * 0.5)
      };

      const labelDist = boxSize + 14;
      const labelPos = {
        x: pCurr.x + uBisector.x * labelDist,
        y: pCurr.y + uBisector.y * labelDist
      };

      results.push({
        vertex: pCurr,
        angleDegrees: 90,
        isRightAngle: true,
        rightAngleBoxPoints: [corner1, corner2, corner3],
        dotPosition: dotPos,
        labelPosition: labelPos
      });
    } else {
      // Standart Açı Yayı ve Derece
      const sX = pCurr.x + u1.x * arcRadius;
      const sY = pCurr.y + u1.y * arcRadius;
      const eX = pCurr.x + u2.x * arcRadius;
      const eY = pCurr.y + u2.y * arcRadius;

      // İç açı her zaman <= 180° olduğundan large-arc-flag 0'dır
      const arcPath = `M ${sX.toFixed(1)} ${sY.toFixed(1)} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${eX.toFixed(1)} ${eY.toFixed(1)}`;

      const labelDist = arcRadius + 14;
      const labelPos = {
        x: pCurr.x + uBisector.x * labelDist,
        y: pCurr.y + uBisector.y * labelDist
      };

      results.push({
        vertex: pCurr,
        angleDegrees,
        isRightAngle: false,
        arcPathString: arcPath,
        labelPosition: labelPos
      });
    }
  }

  return results;
}

// ============================================================================
// ARAÇ YÖNETİMİ & REHBER METİNLERİ
// ============================================================================

function setTool(tool) {
  // 'polygon' isteklerini 'shape' ile eşleştir
  if (tool === 'polygon') tool = 'shape';
  activeTool = tool;

  document.querySelectorAll('[data-tool]').forEach((btn) => {
    const isAct = btn.dataset.tool === tool || (btn.dataset.tool === 'polygon' && tool === 'shape');
    if (isAct) {
      btn.className = 'active flex h-12 w-full flex-col items-center justify-center rounded-xl transition bg-blue-50 text-blue-600 font-bold border border-blue-200 shadow-sm dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400';
    } else {
      btn.className = 'flex h-12 w-full flex-col items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition';
    }
  });

  const guidanceEl = $('geoGuidanceText');
  const shapeFinishBtn = $('geoPolygonFinishBtn');

  if (shapeFinishBtn) {
    shapeFinishBtn.classList.toggle('hidden', tool !== 'shape');
    shapeFinishBtn.classList.toggle('flex', tool === 'shape');
  }

  if (guidanceEl) {
    switch (tool) {
      case 'select':
        guidanceEl.textContent = 'Nesneleri seçmek, taşımak, boyutlandırmak ve açı modunu değiştirmek için tıklayın.';
        break;
      case 'shape':
        guidanceEl.textContent = 'Köşeleri sırayla tıklayarak şekli çizin. Bittiğinde iç açılar (90° diklik kutusu veya yay) otomatik oluşturulur.';
        break;
      case 'line':
        guidanceEl.textContent = 'Yükseklik, açıortay veya doğru çizmek için sürükleyin. Köşelere manyetik kenetlenir.';
        break;
      case 'circle':
        guidanceEl.textContent = 'Merkez noktasını belirleyip dışa sürükleyerek çember oluşturun.';
        break;
      case 'text':
        guidanceEl.textContent = 'Metin veya köşe harfi (A, B, C) eklemek istediğiniz konuma tıklayın.';
        break;
      default:
        guidanceEl.textContent = 'Vektörel çizim aracını kullanmaya hazırsınız.';
    }
  }

  if (fabricCanvas) {
    if (tool === 'select') {
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
      fabricCanvas.forEachObject((obj) => {
        if (!obj.isHelper) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    } else {
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = 'crosshair';
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  }
}

function resetToolState() {
  cleanupShapeDrawing();
  hideSnapIndicator();
  setTool('select');
  hideFloatingToolbar();
}

// ============================================================================
// ÇİZİM ETKİLEŞİMLERİ (CANVAS MOUSE EVENTS)
// ============================================================================

function onCanvasMouseDown(opt) {
  if (!fabricCanvas) return;
  const fabric = window.fabric;
  const pointer = fabricCanvas.getPointer(opt.e);
  const pt = getSnappedPoint(pointer);

  if (activeTool === 'select') {
    let clickedAngleIdx = undefined;
    let angleGroup = null;

    if (opt.subTargets && opt.subTargets.length > 0) {
      const sub = opt.subTargets.find((s) => s.angleIndex !== undefined);
      if (sub) {
        clickedAngleIdx = sub.angleIndex;
        angleGroup = opt.target && opt.target.type === 'group' ? opt.target : sub.group;
      }
    } else if (opt.target && opt.target.angleIndex !== undefined) {
      clickedAngleIdx = opt.target.angleIndex;
      angleGroup = opt.target.group || opt.target;
    }

    if (clickedAngleIdx !== undefined && angleGroup) {
      showQuickAngleEditor(angleGroup, clickedAngleIdx, opt.e.clientX, opt.e.clientY);
    } else {
      hideQuickAngleEditor();
    }
  } else if (activeTool === 'shape') {
    // İlk noktaya yakın tıklandıysa şekli tamamla
    if (shapePoints.length >= 3) {
      const firstPt = shapePoints[0];
      const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
      if (dist < 20) {
        finishShape();
        return;
      }
    }

    shapePoints.push(pt);

    // Kırmızı köşe işareti
    const marker = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 4.5,
      fill: '#ef4444',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      selectable: false,
      isHelper: true
    });
    fabricCanvas.add(marker);
    shapeMarkers.push(marker);

    // Tıklanan noktaları birleştiren canlı kenar çizgisi
    if (shapePoints.length >= 2) {
      const pPrev = shapePoints[shapePoints.length - 2];
      const segment = new fabric.Line([pPrev.x, pPrev.y, pt.x, pt.y], {
        stroke: currentStyle.strokeColor,
        strokeWidth: currentStyle.strokeWidth,
        strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
        selectable: false,
        isHelper: true
      });
      fabricCanvas.add(segment);
      shapeSegments.push(segment);
    }

    // Canlı kauçuk bant çizgi (fareyi takip eden sonraki kenar)
    if (!shapeTempLine) {
      shapeTempLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
        stroke: currentStyle.strokeColor,
        strokeWidth: currentStyle.strokeWidth,
        strokeDashArray: [4, 4],
        selectable: false,
        isHelper: true
      });
      fabricCanvas.add(shapeTempLine);
    } else {
      shapeTempLine.set({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    fabricCanvas.renderAll();
  } else if (activeTool === 'line') {
    isDrawingLine = true;
    drawingLine = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
      stroke: currentStyle.strokeColor,
      strokeWidth: currentStyle.strokeWidth,
      strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });
    fabricCanvas.add(drawingLine);
  } else if (activeTool === 'circle') {
    const circle = new fabric.Circle({
      left: pt.x,
      top: pt.y,
      radius: 45,
      fill: currentStyle.fillColor,
      stroke: currentStyle.strokeColor,
      strokeWidth: currentStyle.strokeWidth,
      originX: 'center',
      originY: 'center',
      selectable: true,
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
  } else if (activeTool === 'text') {
    const text = new fabric.IText('A', {
      left: pt.x,
      top: pt.y,
      fontSize: currentStyle.fontSize,
      fontFamily: 'Noto Sans, sans-serif',
      fontWeight: 'bold',
      fill: currentStyle.strokeColor,
      selectable: true
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
  }
}

function onCanvasMouseMove(opt) {
  if (!fabricCanvas) return;
  const pointer = fabricCanvas.getPointer(opt.e);
  const pt = getSnappedPoint(pointer);

  if (isDrawingLine && drawingLine) {
    drawingLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  } else if (activeTool === 'shape' && shapeTempLine) {
    if (shapePoints.length >= 3) {
      const firstPt = shapePoints[0];
      const dist = Math.hypot(pointer.x - firstPt.x, pointer.y - firstPt.y);
      if (dist < 22) {
        showSnapIndicator(firstPt.x, firstPt.y);
        shapeTempLine.set({ x2: firstPt.x, y2: firstPt.y });
        fabricCanvas.renderAll();
        return;
      }
    }
    shapeTempLine.set({ x2: pt.x, y2: pt.y });
    fabricCanvas.renderAll();
  }
}

function onCanvasMouseUp() {
  hideSnapIndicator();

  if (isDrawingLine && drawingLine) {
    isDrawingLine = false;
    drawingLine.setCoords();
    fabricCanvas.setActiveObject(drawingLine);
    fabricCanvas.renderAll();
    saveHistoryState();
    setTool('select');
    drawingLine = null;
  }
}

// ============================================================================
// ŞEKİL BİTİRME & OTOMATİK AÇI OLUŞTURMA
// ============================================================================

function finishShape() {
  if (!fabricCanvas || shapePoints.length < 3) {
    cleanupShapeDrawing();
    return;
  }

  const fabric = window.fabric;
  const pts = [...shapePoints];
  cleanupShapeDrawing();

  const polyFill = currentStyle.baseFillColor && currentStyle.baseFillColor !== 'transparent' && currentStyle.fillOpacity > 0
    ? hexToRgba(currentStyle.baseFillColor, currentStyle.fillOpacity)
    : (currentStyle.fillColor || 'transparent');

  // 1. Ana Poligon Şekli
  const polygon = new fabric.Polygon(pts, {
    fill: polyFill,
    stroke: currentStyle.strokeColor,
    strokeWidth: currentStyle.strokeWidth,
    strokeDashArray: currentStyle.isDashed ? [6, 6] : null,
    selectable: true
  });

  // 2. Otomatik Açıları Hesapla
  const angles = calculatePolygonAngles(pts, 26);
  const angleElements = [];
  const anglesData = [];

  angles.forEach((ang, idx) => {
    const angleInfo = {
      index: idx,
      vertex: ang.vertex,
      origDegrees: ang.angleDegrees,
      text: ang.isRightAngle ? '' : `${ang.angleDegrees}°`,
      displayMode: 'all',
      isRightAngle: ang.isRightAngle,
      labelPos: ang.labelPosition || ang.dotPosition,
      arcPathString: ang.arcPathString,
      rightAngleBoxPoints: ang.rightAngleBoxPoints,
      dotPosition: ang.dotPosition
    };
    anglesData.push(angleInfo);

    if (ang.isRightAngle && ang.rightAngleBoxPoints && ang.dotPosition) {
      // 90° Diklik Karesi
      const box = new fabric.Polyline(ang.rightAngleBoxPoints, {
        fill: 'transparent',
        stroke: currentStyle.strokeColor,
        strokeWidth: 1.5,
        selectable: false,
        isAngleComponent: true,
        angleIndex: idx
      });

      const dot = new fabric.Circle({
        left: ang.dotPosition.x,
        top: ang.dotPosition.y,
        radius: 2,
        fill: currentStyle.strokeColor,
        originX: 'center',
        originY: 'center',
        selectable: false,
        isAngleComponent: true,
        angleIndex: idx
      });

      const lblPos = ang.labelPosition || ang.dotPosition;
      const lbl = new fabric.IText('', {
        left: lblPos.x,
        top: lblPos.y,
        fontSize: 14,
        fontFamily: 'Noto Sans, sans-serif',
        fontWeight: 'bold',
        fill: currentStyle.strokeColor,
        originX: 'center',
        originY: 'center',
        selectable: false,
        visible: false,
        isAngleComponent: true,
        isAngleLabel: true,
        angleIndex: idx
      });

      angleElements.push(box, dot, lbl);
    } else if (ang.arcPathString) {
      // Açı Yayı
      const arc = new fabric.Path(ang.arcPathString, {
        stroke: currentStyle.strokeColor,
        strokeWidth: 1.5,
        fill: 'transparent',
        selectable: false,
        isAngleComponent: true,
        isAngleArc: true,
        angleIndex: idx
      });

      // Açı Derecesi Metni
      const lbl = new fabric.IText(`${ang.angleDegrees}°`, {
        left: ang.labelPosition.x,
        top: ang.labelPosition.y,
        fontSize: 14,
        fontFamily: 'Noto Sans, sans-serif',
        fontWeight: 'bold',
        fill: currentStyle.strokeColor,
        originX: 'center',
        originY: 'center',
        selectable: false,
        visible: currentStyle.angleDisplayMode === 'all',
        isAngleComponent: true,
        isAngleLabel: true,
        angleIndex: idx
      });

      angleElements.push(arc, lbl);
    }
  });

  // Ana şekil ve açı elemanlarını tek bir grup olarak tuvale ekle
  const group = new fabric.Group([polygon, ...angleElements], {
    selectable: true,
    subTargetCheck: true,
    cornerColor: '#2563eb',
    cornerSize: 8,
    transparentCorners: false,
    hasAutoAngles: true,
    angleDisplayMode: currentStyle.angleDisplayMode || 'all',
    anglesData: anglesData
  });

  fabricCanvas.add(group);
  fabricCanvas.setActiveObject(group);
  fabricCanvas.renderAll();
  saveHistoryState();
  setTool('select');
  onObjectSelected(group);
}

function updateSpecificAngle(group, angleIndex, updates, skipRenderList = false) {
  if (!group || !group.anglesData || !group.anglesData[angleIndex]) return;
  const ang = group.anglesData[angleIndex];

  if (updates.text !== undefined) {
    ang.text = updates.text;
  }
  if (updates.displayMode !== undefined) {
    ang.displayMode = updates.displayMode;
  }

  if (Array.isArray(group._objects)) {
    group._objects.forEach((sub) => {
      if (sub.angleIndex === angleIndex) {
        if (sub.isAngleLabel) {
          if (updates.text !== undefined) {
            sub.set('text', updates.text);
          }
          const shouldShow = (ang.displayMode === 'all') && Boolean(ang.text && ang.text.trim());
          sub.set('visible', shouldShow);
        } else if (sub.isAngleComponent || sub.isAngleArc) {
          const shouldShow = (ang.displayMode !== 'hidden');
          sub.set('visible', shouldShow);
        }
        sub.dirty = true;
      }
    });
    group.dirty = true;
  }

  fabricCanvas.renderAll();
  saveHistoryState();
  if (!skipRenderList) {
    renderIndividualAnglesList(group);
  }
}

function renderIndividualAnglesList(group) {
  const container = $('geoIndividualAnglesList');
  if (!container) return;
  container.innerHTML = '';

  if (!group || !group.anglesData || group.anglesData.length === 0) {
    container.innerHTML = '<div class="text-xs text-slate-400 py-1 text-center">Bu şekilde otomatik açı bulunmuyor.</div>';
    return;
  }

  group.anglesData.forEach((ang, i) => {
    const row = document.createElement('div');
    row.className = 'rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-xs dark:border-slate-800 dark:bg-slate-800/70';

    const currentMode = ang.displayMode || 'all';
    const isModeAll = currentMode === 'all';
    const isModeArc = currentMode === 'arc_only';
    const isModeHidden = currentMode === 'hidden';

    row.innerHTML = `
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-bold text-slate-800 dark:text-slate-200">Açı ${i + 1} <span class="font-normal text-[10px] text-slate-400">(${ang.origDegrees}°)</span></span>
        <div class="flex items-center gap-1">
          <button type="button" data-act-mode="all" data-idx="${i}" class="px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${isModeAll ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'}" title="Yazı ve yay açık">Yazılı</button>
          <button type="button" data-act-mode="arc_only" data-idx="${i}" class="px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${isModeArc ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'}" title="Sadece yay, yazıyı gizle">Yay</button>
          <button type="button" data-act-mode="hidden" data-idx="${i}" class="px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${isModeHidden ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'}" title="Bu açıyı tamamen gizle">Gizle</button>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <input type="text" data-ang-input="${i}" class="flex-1 min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value="${escHtml(ang.text || '')}" placeholder="x, 60°, α">
        <div class="flex items-center gap-0.5 shrink-0">
          <button type="button" data-ang-sym="x" data-idx="${i}" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[10px] font-bold dark:bg-slate-900 dark:border-slate-700">x</button>
          <button type="button" data-ang-sym="α" data-idx="${i}" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[10px] font-bold dark:bg-slate-900 dark:border-slate-700">α</button>
          <button type="button" data-ang-sym="?" data-idx="${i}" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[10px] font-bold dark:bg-slate-900 dark:border-slate-700">?</button>
          <button type="button" data-ang-sym="°" data-idx="${i}" class="px-1.5 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[10px] font-bold dark:bg-slate-900 dark:border-slate-700">°</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });

  // Attach input events
  container.querySelectorAll('[data-ang-input]').forEach((inp) => {
    const idx = +inp.dataset.angInput;
    inp.oninput = () => {
      updateSpecificAngle(group, idx, { text: inp.value }, true);
    };
  });

  // Attach mode buttons
  container.querySelectorAll('[data-act-mode]').forEach((btn) => {
    const idx = +btn.dataset.idx;
    const mode = btn.dataset.actMode;
    btn.onclick = () => {
      updateSpecificAngle(group, idx, { displayMode: mode });
    };
  });

  // Attach symbols
  container.querySelectorAll('[data-ang-sym]').forEach((btn) => {
    const idx = +btn.dataset.idx;
    const sym = btn.dataset.angSym;
    btn.onclick = () => {
      const inp = container.querySelector(`[data-ang-input="${idx}"]`);
      if (inp) {
        inp.value = sym === '°' ? inp.value + '°' : sym;
        updateSpecificAngle(group, idx, { text: inp.value }, false);
      }
    };
  });
}

let currentEditingAngleGroup = null;
let currentEditingAngleIndex = null;

function showQuickAngleEditor(group, angleIndex, screenX, screenY) {
  const editor = $('geoQuickAngleEditor');
  if (!editor || !group || !group.anglesData || !group.anglesData[angleIndex]) return;

  editor.onclick = (e) => e.stopPropagation();
  editor.onmousedown = (e) => e.stopPropagation();

  currentEditingAngleGroup = group;
  currentEditingAngleIndex = angleIndex;
  const ang = group.anglesData[angleIndex];

  const titleEl = $('geoQuickAngleLabelText');
  if (titleEl) titleEl.textContent = `Açı ${angleIndex + 1} (${ang.origDegrees}°)`;

  const inputEl = $('geoQuickAngleInput');
  if (inputEl) {
    inputEl.value = ang.text || '';
    inputEl.oninput = () => {
      updateSpecificAngle(group, angleIndex, { text: inputEl.value }, true);
    };
  }

  const container = $('geoCanvasContainer');
  if (container) {
    const cRect = container.getBoundingClientRect();
    let left = screenX - cRect.left;
    let top = screenY - cRect.top - 80;

    left = Math.max(10, Math.min(left, cRect.width - 270));
    top = Math.max(10, Math.min(top, cRect.height - 180));

    editor.style.left = `${left}px`;
    editor.style.top = `${top}px`;
    editor.classList.remove('hidden');
  }

  const btnAll = $('geoQuickModeAll');
  const btnArc = $('geoQuickModeArc');
  const btnHide = $('geoQuickModeHide');

  const updateModeStyles = () => {
    const mode = ang.displayMode || 'all';
    if (btnAll) btnAll.className = mode === 'all' ? 'flex-1 py-1 rounded-md bg-blue-600 text-white font-bold' : 'flex-1 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold dark:border-slate-700 dark:text-slate-300';
    if (btnArc) btnArc.className = mode === 'arc_only' ? 'flex-1 py-1 rounded-md bg-amber-500 text-white font-bold' : 'flex-1 py-1 rounded-md border border-slate-200 text-amber-700 hover:bg-amber-50 font-semibold dark:border-slate-700 dark:text-amber-400';
    if (btnHide) btnHide.className = mode === 'hidden' ? 'flex-1 py-1 rounded-md bg-rose-500 text-white font-bold' : 'flex-1 py-1 rounded-md border border-slate-200 text-rose-600 hover:bg-rose-50 font-semibold dark:border-slate-700 dark:text-rose-400';
  };
  updateModeStyles();

  if (btnAll) btnAll.onclick = () => { updateSpecificAngle(group, angleIndex, { displayMode: 'all' }); updateModeStyles(); };
  if (btnArc) btnArc.onclick = () => { updateSpecificAngle(group, angleIndex, { displayMode: 'arc_only' }); updateModeStyles(); };
  if (btnHide) btnHide.onclick = () => { updateSpecificAngle(group, angleIndex, { displayMode: 'hidden' }); updateModeStyles(); };

  const symBtns = editor.querySelectorAll('.geo-sym-btn');
  symBtns.forEach((b) => {
    b.onclick = () => {
      const sym = b.dataset.sym;
      if (sym === '°') {
        inputEl.value = inputEl.value + '°';
      } else {
        inputEl.value = sym;
      }
      updateSpecificAngle(group, angleIndex, { text: inputEl.value }, false);
    };
  });

  const closeBtn = $('geoQuickAngleClose');
  if (closeBtn) {
    closeBtn.onclick = () => hideQuickAngleEditor();
  }
}

function hideQuickAngleEditor() {
  const editor = $('geoQuickAngleEditor');
  if (editor) editor.classList.add('hidden');
  currentEditingAngleGroup = null;
  currentEditingAngleIndex = null;
}

function cleanupShapeDrawing() {
  if (!fabricCanvas) return;
  if (shapeTempLine) {
    fabricCanvas.remove(shapeTempLine);
    shapeTempLine = null;
  }
  shapeMarkers.forEach((m) => fabricCanvas.remove(m));
  shapeMarkers = [];
  shapeSegments.forEach((s) => fabricCanvas.remove(s));
  shapeSegments = [];
  shapePoints = [];
  fabricCanvas.renderAll();
}

// ============================================================================
// AÇI GÖSTERİM MODU KONTROLÜ (TÜMÜ / SADECE YAY / GİZLİ)
// ============================================================================

function setAngleDisplayMode(mode) {
  currentStyle.angleDisplayMode = mode;
  if (!fabricCanvas) return;

  const active = fabricCanvas.getActiveObject();
  if (active && active.type === 'group' && Array.isArray(active._objects)) {
    active.angleDisplayMode = mode;

    if (Array.isArray(active.anglesData)) {
      active.anglesData.forEach((a) => {
        a.displayMode = mode;
      });
    }

    active._objects.forEach((obj) => {
      if (obj.isAngleLabel) {
        const ang = active.anglesData?.[obj.angleIndex];
        const hasText = ang ? Boolean(ang.text && ang.text.trim()) : true;
        obj.set('visible', mode === 'all' && hasText);
      } else if (obj.isAngleArc || obj.isAngleComponent) {
        obj.set('visible', mode !== 'hidden');
      }
    });

    fabricCanvas.renderAll();
    saveHistoryState();
    renderIndividualAnglesList(active);
  }

  // Floating toolbar etiketini güncelle
  updateAngleButtonLabel(mode);
}

function updateAngleButtonLabel(mode) {
  const lbl = $('geoFloatAngleLabel');
  if (!lbl) return;

  if (mode === 'all') {
    lbl.textContent = 'Açı: Değerli';
  } else if (mode === 'arc_only') {
    lbl.textContent = 'Açı: Sadece Yay';
  } else {
    lbl.textContent = 'Açı: Gizli';
  }
}

function updateFillPreviewUI(fillColor, baseColor, opacity) {
  const fillPreview = $('geoFloatFillPreview');
  const fillHexLabel = $('geoFloatFillHex');
  const opacityLabel = $('geoFloatOpacityLabel');
  const opacitySlider = $('geoFloatOpacitySlider');

  if (fillPreview) {
    if (!fillColor || fillColor === 'transparent' || opacity === 0) {
      fillPreview.textContent = '✕';
      fillPreview.parentElement.style.backgroundColor = 'transparent';
    } else {
      fillPreview.textContent = '';
      fillPreview.parentElement.style.backgroundColor = fillColor;
    }
  }
  if (fillHexLabel) {
    fillHexLabel.textContent = (!baseColor || baseColor === 'transparent' || opacity === 0) ? 'Şeffaf' : baseColor;
  }
  if (opacityLabel) {
    opacityLabel.textContent = `%${Math.round(opacity * 100)}`;
  }
  if (opacitySlider && document.activeElement !== opacitySlider) {
    opacitySlider.value = Math.round(opacity * 100);
  }
}

// ============================================================================
// KAYAN ŞEKİL BİÇİMLENDİRME ARAÇ ÇUBUĞU (FLOATING TOOLBAR)
// ============================================================================

function onObjectSelected(target) {
  const toolbar = $('geoFloatingToolbar');
  if (!toolbar) return;

  if (!target) {
    hideFloatingToolbar();
    return;
  }

  const bound = target.getBoundingRect(true);
  const container = $('geoCanvasContainer');
  if (!container) return;

  const top = Math.max(10, bound.top - 50);
  const left = Math.max(10, bound.left + bound.width / 2);

  toolbar.style.top = `${top}px`;
  toolbar.style.left = `${left}px`;
  toolbar.style.transform = 'translateX(-50%)';
  toolbar.classList.remove('hidden');
  toolbar.classList.add('flex');

  // Açı kontrol butonunu göster / gizle
  const angleWrapper = $('geoAngleControlWrapper');
  const hasAngles = target.hasAutoAngles || (target.type === 'group' && Array.isArray(target.anglesData) && target.anglesData.length > 0);
  if (angleWrapper) {
    angleWrapper.classList.toggle('hidden', !hasAngles);
    if (hasAngles) {
      const mode = target.angleDisplayMode || 'all';
      updateAngleButtonLabel(mode);
      renderIndividualAnglesList(target);
    }
  }

  // Renk ve kalınlık önizlemeleri
  let strokeColor = target.stroke;
  let fillColor = target.fill;
  let strokeW = target.strokeWidth;
  let isDashed = Array.isArray(target.strokeDashArray) && target.strokeDashArray.length > 0;

  if (target.type === 'group' && Array.isArray(target._objects)) {
    const mainPoly = target._objects.find((o) => o.type === 'polygon' || o.type === 'rect' || o.type === 'circle' || o.type === 'path');
    if (mainPoly) {
      if (mainPoly.stroke) strokeColor = mainPoly.stroke;
      if (mainPoly.fill) fillColor = mainPoly.fill;
      if (mainPoly.strokeWidth) strokeW = mainPoly.strokeWidth;
      if (mainPoly.strokeDashArray) isDashed = Array.isArray(mainPoly.strokeDashArray) && mainPoly.strokeDashArray.length > 0;
    }
  }

  strokeColor = strokeColor || currentStyle.strokeColor;
  fillColor = fillColor !== undefined ? fillColor : currentStyle.fillColor;
  strokeW = strokeW || currentStyle.strokeWidth;

  const strokePreview = $('geoFloatStrokePreview');
  if (strokePreview) strokePreview.style.backgroundColor = strokeColor;

  // Opaklık ve Dolgu Rengini Çözümle
  let objOpacity = currentStyle.fillOpacity;
  let objBaseColor = currentStyle.baseFillColor;

  if (!fillColor || fillColor === 'transparent' || fillColor === 'rgba(0, 0, 0, 0)') {
    objBaseColor = 'transparent';
    objOpacity = 0;
  } else if (typeof fillColor === 'string' && fillColor.startsWith('rgba')) {
    const m = fillColor.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (m) {
      const r = parseInt(m[1], 10);
      const g = parseInt(m[2], 10);
      const b = parseInt(m[3], 10);
      objOpacity = parseFloat(m[4]);
      objBaseColor = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    }
  } else if (typeof fillColor === 'string' && fillColor.startsWith('#')) {
    objBaseColor = fillColor;
    objOpacity = 1;
  }

  currentStyle.fillColor = fillColor || 'transparent';
  currentStyle.baseFillColor = objBaseColor;
  currentStyle.fillOpacity = objOpacity;

  updateFillPreviewUI(fillColor, objBaseColor, objOpacity);

  const widthLabel = $('geoFloatWidthLabel');
  if (widthLabel) widthLabel.textContent = `${strokeW}px`;

  const dashedCheck = $('geoFloatDashed');
  if (dashedCheck) dashedCheck.checked = isDashed;
}

function hideFloatingToolbar() {
  const toolbar = $('geoFloatingToolbar');
  if (toolbar) {
    toolbar.classList.add('hidden');
    toolbar.classList.remove('flex');
  }
  closeAllFloatingPopovers();
  hideQuickAngleEditor();
}

function closeAllFloatingPopovers() {
  const p0 = $('geoFloatAnglePopover');
  const p1 = $('geoFloatStrokePopover');
  const p2 = $('geoFloatFillPopover');
  const p3 = $('geoFloatWidthPopover');
  if (p0) p0.classList.add('hidden');
  if (p1) p1.classList.add('hidden');
  if (p2) p2.classList.add('hidden');
  if (p3) p3.classList.add('hidden');
}

function updateActiveObjectStyle(updates) {
  if (!fabricCanvas) return;
  const activeObjs = fabricCanvas.getActiveObjects();
  if (!activeObjs || activeObjs.length === 0) return;

  activeObjs.forEach((obj) => {
    if (obj.type === 'group' && Array.isArray(obj._objects)) {
      // Grup içindeki ana çokgene stili uygula
      const mainPoly = obj._objects.find((o) => o.type === 'polygon' || o.type === 'rect' || o.type === 'circle' || o.type === 'path');
      if (mainPoly) {
        if (updates.stroke !== undefined) mainPoly.set('stroke', updates.stroke);
        if (updates.fill !== undefined) mainPoly.set('fill', updates.fill);
        if (updates.strokeWidth !== undefined) mainPoly.set('strokeWidth', updates.strokeWidth);
        if (updates.strokeDashArray !== undefined) mainPoly.set('strokeDashArray', updates.strokeDashArray);
        mainPoly.dirty = true;
      }
      obj.dirty = true;
    } else {
      if (updates.stroke !== undefined) obj.set('stroke', updates.stroke);
      if (updates.fill !== undefined) obj.set('fill', updates.fill);
      if (updates.strokeWidth !== undefined) obj.set('strokeWidth', updates.strokeWidth);
      if (updates.strokeDashArray !== undefined) obj.set('strokeDashArray', updates.strokeDashArray);
      obj.dirty = true;
    }
    obj.setCoords();
  });

  fabricCanvas.renderAll();
  saveHistoryState();
}

function duplicateActiveObject() {
  if (!fabricCanvas) return;
  const active = fabricCanvas.getActiveObject();
  if (!active) return;

  active.clone((cloned) => {
    fabricCanvas.discardActiveObject();
    cloned.set({
      left: cloned.left + 20,
      top: cloned.top + 20,
      evented: true
    });
    if (cloned.type === 'activeSelection') {
      cloned.canvas = fabricCanvas;
      cloned.forEachObject((obj) => fabricCanvas.add(obj));
      cloned.setCoords();
    } else {
      fabricCanvas.add(cloned);
    }
    fabricCanvas.setActiveObject(cloned);
    fabricCanvas.renderAll();
    saveHistoryState();
  });
}

function deleteActiveObjects() {
  if (!fabricCanvas) return;
  const activeObjs = fabricCanvas.getActiveObjects();
  if (!activeObjs || activeObjs.length === 0) return;

  activeObjs.forEach((obj) => fabricCanvas.remove(obj));
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();
  saveHistoryState();
  hideFloatingToolbar();
}

// ============================================================================
// HAZIR GEOMETRİ ŞABLONLARI
// ============================================================================

function insertTemplate(tplName) {
  const fabric = window.fabric;
  if (!fabric || !fabricCanvas) return;

  if (tplName === 'dik_ucgen') {
    // 3-4-5 Dik Üçgen (Otomatik Açılı)
    const pts = [
      { x: 260, y: 150 },
      { x: 260, y: 350 },
      { x: 520, y: 350 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'ozel_30_60') {
    // 30-60-90 Üçgeni
    const pts = [
      { x: 280, y: 140 },
      { x: 280, y: 360 },
      { x: 490, y: 360 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'eskenar') {
    // Eşkenar Üçgen (60°-60°-60°)
    const pts = [
      { x: 380, y: 150 },
      { x: 260, y: 358 },
      { x: 500, y: 358 }
    ];
    shapePoints = pts;
    finishShape();
  } else if (tplName === 'oklid') {
    // Öklid Dik Üçgeni + Hipotenüs Dikmesi [AH]
    const pts = [
      { x: 350, y: 150 },
      { x: 220, y: 360 },
      { x: 540, y: 360 }
    ];
    shapePoints = pts;
    finishShape();

    // Dikme h çizgisi ekle
    setTimeout(() => {
      const hLine = new fabric.Line([350, 150, 350, 360], {
        stroke: '#4f46e5',
        strokeWidth: 2,
        strokeDashArray: [4, 4],
        selectable: true
      });
      const hLbl = new fabric.IText('h', {
        left: 360,
        top: 240,
        fontSize: 16,
        fontWeight: 'bold',
        fill: '#4f46e5'
      });
      fabricCanvas.add(hLine, hLbl);
      fabricCanvas.renderAll();
      saveHistoryState();
    }, 50);
  } else if (tplName === 'cember_dilim') {
    const circle = new fabric.Circle({
      left: 380,
      top: 240,
      radius: 90,
      fill: 'transparent',
      stroke: '#0f172a',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const centerPoint = new fabric.Circle({
      left: 380,
      top: 240,
      radius: 3.5,
      fill: '#0f172a',
      originX: 'center',
      originY: 'center'
    });

    const centerLbl = new fabric.IText('O', { left: 365, top: 245, fontSize: 16, fontWeight: 'bold' });
    const rLine1 = new fabric.Line([380, 240, 470, 240], { stroke: '#0f172a', strokeWidth: 1.8 });
    const rLine2 = new fabric.Line([380, 240, 425, 162], { stroke: '#0f172a', strokeWidth: 1.8 });

    const group = new fabric.Group([circle, centerPoint, centerLbl, rLine1, rLine2], {
      left: 280,
      top: 140,
      selectable: true
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    saveHistoryState();
  } else if (tplName === 'dikdortgen') {
    const pts = [
      { x: 240, y: 160 },
      { x: 520, y: 160 },
      { x: 520, y: 320 },
      { x: 240, y: 320 }
    ];
    shapePoints = pts;
    finishShape();
  } else {
    // 3'gen şablonu
    const pts = [
      { x: 380, y: 160 },
      { x: 260, y: 340 },
      { x: 500, y: 340 }
    ];
    shapePoints = pts;
    finishShape();
  }

  $('geoTemplateDrawer')?.classList.add('hidden');
}

// ============================================================================
// KATEX DENKLEM MODÜLÜ ENTEGRASYONU
// ============================================================================

function setupKatexFormulaModule() {
  const tabsContainer = $('geoFormulaTabs');
  const buttonsGrid = $('geoFormulaButtonsGrid');
  const inputEl = $('geoFormulaInput');
  const previewEl = $('geoFormulaPreview');
  const sizeSelect = $('geoFormulaSize');

  if (!tabsContainer || !buttonsGrid || !inputEl || !previewEl) return;

  tabsContainer.querySelectorAll('[data-ftab]').forEach((btn) => {
    btn.onclick = () => {
      activeFormulaTab = btn.dataset.ftab;
      tabsContainer.querySelectorAll('[data-ftab]').forEach((b) => {
        b.className = 'ftab-btn rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800';
      });
      btn.className = 'ftab-btn active rounded-lg px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white shadow-sm';
      renderFormulaButtons();
    };
  });

  function renderFormulaButtons() {
    buttonsGrid.innerHTML = '';
    const items = FORMULA_TABS[activeFormulaTab] || [];
    items.forEach((item) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 px-2 text-xs font-semibold text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800 transition shadow-sm active:scale-95';
      b.textContent = item.display;
      b.onclick = () => {
        const val = inputEl.value;
        inputEl.value = val ? `${val} ${item.latex}` : item.latex;
        updateFormulaPreview();
        inputEl.focus();
      };
      buttonsGrid.appendChild(b);
    });
  }

  function updateFormulaPreview() {
    const latex = inputEl.value.trim() || ' ';
    const katex = window.katex;
    if (katex) {
      try {
        katex.render(latex, previewEl, {
          displayMode: true,
          throwOnError: false
        });
      } catch (err) {
        previewEl.innerText = latex;
      }
    } else {
      previewEl.innerText = latex;
    }
    previewEl.style.color = formulaColor;
  }

  inputEl.oninput = updateFormulaPreview;

  const colorOptions = $('geoFormulaColorOptions');
  if (colorOptions) {
    colorOptions.querySelectorAll('[data-color]').forEach((btn) => {
      btn.onclick = () => {
        formulaColor = btn.dataset.color;
        colorOptions.querySelectorAll('[data-color]').forEach((b) => b.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-1'));
        btn.classList.add('ring-2', 'ring-blue-500', 'ring-offset-1');
        updateFormulaPreview();
      };
    });
  }

  if (sizeSelect) {
    sizeSelect.onchange = (e) => {
      formulaSize = parseInt(e.target.value, 10) || 26;
    };
  }

  const closeBtn = $('geoFormulaClose');
  const cancelBtn = $('geoFormulaCancel');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoFormulaModal');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoFormulaModal');

  const insertBtn = $('geoFormulaInsertBtn');
  if (insertBtn) {
    insertBtn.onclick = async () => {
      const latex = inputEl.value.trim();
      if (!latex) return;
      await addKatexFormulaToCanvas(latex, formulaColor, formulaSize);
      closeModal('geoFormulaModal');
    };
  }

  renderFormulaButtons();
  updateFormulaPreview();
}

async function addKatexFormulaToCanvas(latex, color = '#0f172a', fontSize = 26) {
  const fabric = window.fabric;
  const katex = window.katex;
  if (!fabric || !fabricCanvas || !katex) return;

  try {
    const htmlString = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false
    });

    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.fontSize = `${fontSize}px`;
    wrapper.style.color = color;
    wrapper.style.fontFamily = 'KaTeX_Main, Times New Roman, serif';
    wrapper.style.padding = '8px 12px';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.innerHTML = htmlString;
    document.body.appendChild(wrapper);

    const rect = wrapper.getBoundingClientRect();
    const width = Math.max(Math.ceil(rect.width) + 8, 30);
    const height = Math.max(Math.ceil(rect.height) + 8, 24);
    document.body.removeChild(wrapper);

    const scale = 2;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize}px; color:${color}; font-family: KaTeX_Main, Times New Roman, serif; display:flex; align-items:center; justify-content:center; height:100%;">
            ${htmlString}
          </div>
        </foreignObject>
      </svg>
    `;

    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    const imgEl = new Image();
    imgEl.onload = () => {
      const c = document.createElement('canvas');
      c.width = width * scale;
      c.height = height * scale;
      const ctx = c.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);
      const pngUrl = c.toDataURL('image/png');

      fabric.Image.fromURL(pngUrl, (fImg) => {
        fImg.set({
          left: 380,
          top: 240,
          originX: 'center',
          originY: 'center',
          selectable: true,
          hasControls: true,
          hasBorders: true,
          transparentCorners: false,
          cornerColor: '#2563eb',
          cornerSize: 8,
          scaleX: 0.5,
          scaleY: 0.5
        });
        fabricCanvas.add(fImg);
        fabricCanvas.setActiveObject(fImg);
        fabricCanvas.renderAll();
        saveHistoryState();
        setTool('select');
      });
    };
    imgEl.src = svgDataUrl;
  } catch (err) {
    console.error('KaTeX to Canvas hatası:', err);
  }
}

// ============================================================================
// TARİHÇE VE KLAVYE KISAYOLLARI
// ============================================================================

function saveHistoryState() {
  if (!fabricCanvas || isHistoryUpdating) return;
  const json = JSON.stringify(fabricCanvas.toJSON());
  if (historyIndex < historyStack.length - 1) {
    historyStack.splice(historyIndex + 1);
  }
  historyStack.push(json);
  historyIndex++;
}

function handleUndo() {
  if (!fabricCanvas || historyIndex <= 0) return;
  isHistoryUpdating = true;
  historyIndex--;
  fabricCanvas.loadFromJSON(historyStack[historyIndex], () => {
    fabricCanvas.renderAll();
    isHistoryUpdating = false;
    hideFloatingToolbar();
  });
}

function handleRedo() {
  if (!fabricCanvas || historyIndex >= historyStack.length - 1) return;
  isHistoryUpdating = true;
  historyIndex++;
  fabricCanvas.loadFromJSON(historyStack[historyIndex], () => {
    fabricCanvas.renderAll();
    isHistoryUpdating = false;
    hideFloatingToolbar();
  });
}

function onGlobalKeyDown(e) {
  const modal = $('geoModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if (e.key === 'Escape') {
    resetToolState();
  } else if (e.key === 'Enter' && activeTool === 'shape') {
    if (shapePoints.length >= 3) {
      finishShape();
    }
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteActiveObjects();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) handleRedo();
    else handleUndo();
    e.preventDefault();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    handleRedo();
    e.preventDefault();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    duplicateActiveObject();
    e.preventDefault();
  }
}

// ============================================================================
// DIŞA AKTARMA (2X RETINA PNG EXPORT)
// ============================================================================

function exportGeometryAsPNG() {
  if (!fabricCanvas) return null;
  hideSnapIndicator();
  fabricCanvas.discardActiveObject();

  // Izgara desenini geçici kaldırıp temiz beyaz arka planla dışa aktar
  const prevBg = fabricCanvas.backgroundColor;
  fabricCanvas.setBackgroundColor('#ffffff', () => {});
  fabricCanvas.renderAll();

  const dataUrl = fabricCanvas.toDataURL({
    format: 'png',
    multiplier: 2
  });

  // Izgarayı geri yükle
  if (gridEnabled) {
    updateGridBackground(true);
  } else {
    fabricCanvas.setBackgroundColor(prevBg || '#ffffff', () => {});
    fabricCanvas.renderAll();
  }

  return dataUrl;
}

// ============================================================================
// EVENT LISTENERS KURULUMU
// ============================================================================

function setupGeometryEventListeners() {
  // Araç Butonları
  const toolBtns = [
    { id: 'geoToolSelect', tool: 'select' },
    { id: 'geoToolShape', tool: 'shape' },
    { id: 'geoToolPolygon', tool: 'shape' },
    { id: 'geoToolLine', tool: 'line' },
    { id: 'geoToolCircle', tool: 'circle' },
    { id: 'geoToolText', tool: 'text' }
  ];

  toolBtns.forEach(({ id, tool }) => {
    const btn = $(id);
    if (btn) {
      btn.onclick = () => setTool(tool);
    }
  });

  // Şekli Tamamla Butonu
  const polyFinishBtn = $('geoPolygonFinishBtn');
  if (polyFinishBtn) {
    polyFinishBtn.onclick = () => finishShape();
  }

  // KaTeX Aç Butonu
  const openFormulaBtn = $('geoOpenFormulaBtn');
  if (openFormulaBtn) {
    openFormulaBtn.onclick = () => openModal('geoFormulaModal');
  }

  // Şablon Çekmecesini Aç/Kapat
  const toggleTplBtn = $('geoToggleTplBtn');
  const tplDrawer = $('geoTemplateDrawer');
  const closeDrawerBtn = $('geoCloseDrawerBtn');
  if (toggleTplBtn && tplDrawer) {
    toggleTplBtn.onclick = () => tplDrawer.classList.toggle('hidden');
  }
  if (closeDrawerBtn && tplDrawer) {
    closeDrawerBtn.onclick = () => tplDrawer.classList.add('hidden');
  }

  if (tplDrawer) {
    tplDrawer.querySelectorAll('[data-tpl]').forEach((btn) => {
      btn.onclick = () => insertTemplate(btn.dataset.tpl);
    });
  }

  // Floating Toolbar Kurulumu
  setupFloatingToolbarPalettes();

  // Zoom
  const zoomIn = $('geoZoomIn');
  const zoomOut = $('geoZoomOut');
  const zoomLbl = $('geoZoomLabel');
  if (zoomIn && zoomOut) {
    zoomIn.onclick = () => {
      if (!fabricCanvas) return;
      zoomLevel = Math.min(200, zoomLevel + 10);
      fabricCanvas.setZoom(zoomLevel / 100);
      fabricCanvas.renderAll();
      if (zoomLbl) zoomLbl.textContent = `%${zoomLevel}`;
    };
    zoomOut.onclick = () => {
      if (!fabricCanvas) return;
      zoomLevel = Math.max(50, zoomLevel - 10);
      fabricCanvas.setZoom(zoomLevel / 100);
      fabricCanvas.renderAll();
      if (zoomLbl) zoomLbl.textContent = `%${zoomLevel}`;
    };
  }

  // Izgara & Snap
  const toggleGridBtn = $('geoToggleGrid');
  if (toggleGridBtn) {
    toggleGridBtn.onclick = () => {
      gridEnabled = !gridEnabled;
      updateGridBackground(gridEnabled);
      toggleGridBtn.className = gridEnabled
        ? 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 transition'
        : 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 transition';
    };
  }

  const toggleSnapBtn = $('geoToggleSnap');
  if (toggleSnapBtn) {
    toggleSnapBtn.onclick = () => {
      snapEnabled = !snapEnabled;
      toggleSnapBtn.className = snapEnabled
        ? 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 transition'
        : 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 transition';
    };
  }

  // Geri Al / İleri Al / Temizle
  const undoBtn = $('geoBtnUndo');
  const redoBtn = $('geoBtnRedo');
  const clearBtn = $('geoBtnClear');
  if (undoBtn) undoBtn.onclick = handleUndo;
  if (redoBtn) redoBtn.onclick = handleRedo;
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (!fabricCanvas) return;
      fabricCanvas.clear();
      updateGridBackground(gridEnabled);
      saveHistoryState();
      hideFloatingToolbar();
    };
  }

  // Kapatma & İptal
  const closeBtn = $('geoModalClose');
  const cancelBtn = $('geoModalCancel');
  if (closeBtn) closeBtn.onclick = () => closeModal('geoModal');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('geoModal');

  // Soruya Ekle Butonu
  const insertBtn = $('geoInsertBtn');
  if (insertBtn) {
    insertBtn.onclick = () => {
      const dataUrl = exportGeometryAsPNG();
      if (dataUrl && typeof onInsertCallback === 'function') {
        onInsertCallback(dataUrl);
      }
      closeModal('geoModal');
    };
  }

  setupKatexFormulaModule();
}

function setupFloatingToolbarPalettes() {
  const angleBtn = $('geoFloatAngleBtn');
  const anglePop = $('geoFloatAnglePopover');

  const strokeBtn = $('geoFloatStrokeBtn');
  const strokePop = $('geoFloatStrokePopover');
  const strokeGrid = $('geoStrokeGrid');

  const fillBtn = $('geoFloatFillBtn');
  const fillPop = $('geoFloatFillPopover');
  const fillGrid = $('geoFillGrid');

  const widthBtn = $('geoFloatWidthBtn');
  const widthPop = $('geoFloatWidthPopover');
  const dashedCheck = $('geoFloatDashed');

  const dupBtn = $('geoFloatDupBtn');
  const delBtn = $('geoFloatDelBtn');

  const opacitySlider = $('geoFloatOpacitySlider');
  const opacityLabel = $('geoFloatOpacityLabel');

  // Açı Gösterim Popover
  if (angleBtn && anglePop) {
    angleBtn.onclick = (e) => {
      e.stopPropagation();
      const active = fabricCanvas?.getActiveObject();
      if (active) {
        renderIndividualAnglesList(active);
      }
      anglePop.classList.toggle('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };

    anglePop.querySelectorAll('[data-angle-mode]').forEach((b) => {
      b.onclick = () => {
        setAngleDisplayMode(b.dataset.angleMode);
      };
    });
  }

  // Çizgi Rengi Grid
  if (strokeGrid) {
    strokeGrid.innerHTML = '';
    STROKE_COLORS.forEach((color) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-5 w-5 rounded-full border border-black/10 transition hover:scale-125';
      b.style.backgroundColor = color;
      b.onclick = () => {
        currentStyle.strokeColor = color;
        updateActiveObjectStyle({ stroke: color });
        const strokePreview = $('geoFloatStrokePreview');
        if (strokePreview) strokePreview.style.backgroundColor = color;
        strokePop.classList.add('hidden');
      };
      strokeGrid.appendChild(b);
    });
  }

  // Dolgu Rengi ve Saydamlık Uygulama Fonksiyonu
  function applyFillAndOpacity(baseColor, opacity) {
    currentStyle.baseFillColor = baseColor;
    currentStyle.fillOpacity = opacity;
    let finalFill = 'transparent';
    if (baseColor && baseColor !== 'transparent' && opacity > 0) {
      finalFill = hexToRgba(baseColor, opacity);
    } else {
      finalFill = 'transparent';
    }
    currentStyle.fillColor = finalFill;
    updateActiveObjectStyle({ fill: finalFill });
    updateFillPreviewUI(finalFill, baseColor, opacity);
  }

  // Dolgu Rengi Grid
  if (fillGrid) {
    fillGrid.innerHTML = '';
    FILL_COLORS.forEach((color) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-5 w-5 rounded-full border border-slate-300 transition hover:scale-125 relative flex items-center justify-center';
      b.style.backgroundColor = color === 'transparent' ? '#ffffff' : color;
      if (color === 'transparent') {
        b.innerHTML = '<span class="text-[10px] text-red-500 font-bold">✕</span>';
      }
      b.onclick = (e) => {
        e.stopPropagation();
        if (color === 'transparent') {
          applyFillAndOpacity('transparent', 0);
        } else {
          const op = currentStyle.fillOpacity > 0 ? currentStyle.fillOpacity : 0.35;
          applyFillAndOpacity(color, op);
        }
      };
      fillGrid.appendChild(b);
    });
  }

  // Saydamlık Slider
  if (opacitySlider) {
    opacitySlider.oninput = (e) => {
      e.stopPropagation();
      const op = parseInt(e.target.value, 10) / 100;
      let base = currentStyle.baseFillColor;
      if ((!base || base === 'transparent') && op > 0) {
        base = '#3b82f6';
      }
      applyFillAndOpacity(base, op);
    };
  }

  // Saydamlık Hızlı Butonları (0, 25, 50, 75, 100)
  document.querySelectorAll('.geo-op-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const op = parseFloat(btn.dataset.op);
      let base = currentStyle.baseFillColor;
      if (op === 0) {
        applyFillAndOpacity('transparent', 0);
      } else {
        if (!base || base === 'transparent') base = '#3b82f6';
        applyFillAndOpacity(base, op);
      }
    };
  });

  if (strokeBtn && strokePop) {
    strokeBtn.onclick = (e) => {
      e.stopPropagation();
      strokePop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (fillBtn && fillPop) {
    fillBtn.onclick = (e) => {
      e.stopPropagation();
      fillPop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (widthPop) widthPop.classList.add('hidden');
    };
  }

  if (widthBtn && widthPop) {
    widthBtn.onclick = (e) => {
      e.stopPropagation();
      widthPop.classList.toggle('hidden');
      if (anglePop) anglePop.classList.add('hidden');
      if (strokePop) strokePop.classList.add('hidden');
      if (fillPop) fillPop.classList.add('hidden');
    };
  }

  const widthContainer = $('geoWidthButtons');
  if (widthContainer) {
    widthContainer.querySelectorAll('[data-w]').forEach((btn) => {
      btn.onclick = () => {
        const w = parseInt(btn.dataset.w, 10);
        currentStyle.strokeWidth = w;
        updateActiveObjectStyle({ strokeWidth: w });
        widthContainer.querySelectorAll('[data-w]').forEach((b) => {
          b.className = 'flex-1 rounded-md py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800';
        });
        btn.className = 'flex-1 rounded-md py-1 text-xs font-bold bg-blue-600 text-white';
        const widthLabel = $('geoFloatWidthLabel');
        if (widthLabel) widthLabel.textContent = `${w}px`;
      };
    });
  }

  if (dashedCheck) {
    dashedCheck.onchange = (e) => {
      currentStyle.isDashed = e.target.checked;
      updateActiveObjectStyle({
        strokeDashArray: e.target.checked ? [6, 6] : null
      });
    };
  }

  if (dupBtn) dupBtn.onclick = duplicateActiveObject;
  if (delBtn) delBtn.onclick = deleteActiveObjects;
}

const initGeometryDrawer = setupGeometryEventListeners;


// Module Exports
__exports['initGeometryDrawer'] = initGeometryDrawer;
__exports['setOnGeometryInsertCallback'] = setOnGeometryInsertCallback;
__exports['openGeometryModal'] = openGeometryModal;
__exports['syncControlsFromState'] = syncControlsFromState;
__exports['exportGeometryAsPNG'] = exportGeometryAsPNG;
__exports['setupGeometryEventListeners'] = setupGeometryEventListeners;

});

__define('modules/science/overlayEngine.js', function(__exports, __require, __module) {
/**
 * Egemen's Testmaker — Fen & Coğrafya İnteraktif Tuval ve Katman Motoru
 * Soru içi değişkenler, devre sembolleri (direnç, pil, vb.), KaTeX formülleri,
 * serbest yazı, oklar, pinler ve organel sürükle-bırak yönetim katmanı.
 */

function escSvg(str) {
  return String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

let activeSelectedId = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let currentDragTarget = null; // { type: 'overlay' | 'organelle' | 'mapPin', key: string | number }

function getSelectedOverlayId() {
  return activeSelectedId;
}

function setSelectedOverlayId(id) {
  activeSelectedId = id;
}

// ============================================================================
// 1. SEMBOLLER, FORMÜLLER VE İŞARETLEYİCİLER İÇİN SVG RENDER
// ============================================================================

function renderKaTeXSvg(text, x, y, size = 16, color = '#0f172a', isSelected = false) {
  const safeText = escSvg(text);
  const formatted = formatMathString(safeText);
  const selAttr = isSelected ? 'filter="url(#sciSelectGlow)"' : '';
  const textWidth = Math.max(text.length * (size * 0.58) + 16, 40);
  
  return `
    <g class="sci-draggable sci-overlay-item" data-overlay-id="${escSvg(text)}" data-overlay-type="formula" transform="translate(${x},${y})" ${selAttr}>
      <rect x="-8" y="-${size + 6}" width="${textWidth}" height="${size + 12}" rx="5" fill="#ffffff" fill-opacity="0.95" stroke="${isSelected ? '#2563eb' : '#cbd5e1'}" stroke-width="${isSelected ? '2.5' : '1.2'}" />
      <text x="0" y="0" font-family="'KaTeX_Math', 'Times New Roman', serif" font-size="${size}" font-style="italic" fill="${color}">
        ${formatted}
      </text>
    </g>
  `;
}

function formatMathString(str) {
  return str
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\pi/g, 'π')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\to/g, '→')
    .replace(/\\approx/g, '≈')
    .replace(/_([0-9a-zA-Z]+)/g, '<tspan dy="4" font-size="0.75em">$1</tspan><tspan dy="-4"> </tspan>')
    .replace(/\^([0-9a-zA-Z+-]+)/g, '<tspan dy="-6" font-size="0.75em">$1</tspan><tspan dy="6"> </tspan>');
}

function renderCircuitSymbolSvg(item, isSelected = false) {
  const { id, symbol, x, y, label = '', val = '', rot = 0 } = item;
  const selAttr = isSelected ? 'filter="url(#sciSelectGlow)"' : '';

  let body = '';
  switch (symbol) {
    case 'resistor': // Kutu tip direnç
    default:
      body = `
        <line x1="-36" y1="0" x2="-20" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <rect x="-20" y="-10" width="40" height="20" rx="2" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" />
        <line x1="20" y1="0" x2="36" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'resistor_zigzag': // Zigzag tip direnç
      body = `
        <line x1="-36" y1="0" x2="-24" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <path d="M -24 0 L -18 -10 L -6 10 L 6 -10 L 18 10 L 24 0" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" />
        <line x1="24" y1="0" x2="36" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'battery': // Pil / Üreteç
      body = `
        <line x1="-30" y1="0" x2="-6" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <line x1="-6" y1="-18" x2="-6" y2="18" stroke="#0f172a" stroke-width="3.5" />
        <line x1="6" y1="-10" x2="6" y2="10" stroke="#0f172a" stroke-width="3" />
        <line x1="6" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <text x="-12" y="-14" font-size="11" font-weight="bold" fill="#dc2626">+</text>
        <text x="10" y="-14" font-size="11" font-weight="bold" fill="#0f172a">-</text>
      `;
      break;
    case 'switch_open': // Açık Anahtar
      body = `
        <line x1="-30" y1="0" x2="-12" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="-12" cy="0" r="3" fill="#0f172a" />
        <line x1="-12" y1="0" x2="10" y2="-15" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="12" cy="0" r="3" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
        <line x1="12" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'switch_closed': // Kapalı Anahtar
      body = `
        <line x1="-30" y1="0" x2="-12" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="-12" cy="0" r="3" fill="#0f172a" />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="12" cy="0" r="3" fill="#0f172a" />
        <line x1="12" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'bulb': // Lamba
      body = `
        <line x1="-30" y1="0" x2="-15" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="15" fill="#fef08a" stroke="#0f172a" stroke-width="2.5" />
        <line x1="-10.5" y1="-10.5" x2="10.5" y2="10.5" stroke="#0f172a" stroke-width="2" />
        <line x1="-10.5" y1="10.5" x2="10.5" y2="-10.5" stroke="#0f172a" stroke-width="2" />
        <line x1="15" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'voltmeter': // Voltmetre
      body = `
        <line x1="-30" y1="0" x2="-14" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#2563eb" stroke-width="2.5" />
        <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#2563eb">V</text>
        <line x1="14" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'ammeter': // Ampermetre
      body = `
        <line x1="-30" y1="0" x2="-14" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#059669" stroke-width="2.5" />
        <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#059669">A</text>
        <line x1="14" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
    case 'capacitor': // Sığaç (Kapasitör)
      body = `
        <line x1="-30" y1="0" x2="-6" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <line x1="-6" y1="-15" x2="-6" y2="15" stroke="#0f172a" stroke-width="3" />
        <line x1="6" y1="-15" x2="6" y2="15" stroke="#0f172a" stroke-width="3" />
        <line x1="6" y1="0" x2="30" y2="0" stroke="#0f172a" stroke-width="2.5" />
      `;
      break;
  }

  return `
    <g class="sci-draggable sci-overlay-item" data-overlay-id="${id}" data-overlay-type="symbol" transform="translate(${x},${y}) rotate(${rot})" ${selAttr}>
      ${isSelected ? `<rect x="-40" y="-24" width="80" height="48" rx="6" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,3" />` : ''}
      ${body}
      ${label ? `<text x="0" y="-16" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>` : ''}
      ${val ? `<text x="0" y="24" text-anchor="middle" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(val)}</text>` : ''}
    </g>
  `;
}

function renderArrowSvg(item, isSelected = false) {
  const { id, x1 = 100, y1 = 100, x2 = 200, y2 = 150, label = '', color = '#dc2626' } = item;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 12;
  const hx1 = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const hy1 = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const hx2 = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const hy2 = y2 - headLen * Math.sin(angle + Math.PI / 6);

  return `
    <g class="sci-draggable sci-overlay-item" data-overlay-id="${id}" data-overlay-type="arrow">
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${isSelected ? '3' : '2.4'}" stroke-linecap="round" />
      <polygon points="${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}" fill="${color}" />
      <circle cx="${x1}" cy="${y1}" r="3.5" fill="${color}" />
      ${isSelected ? `<circle cx="${x1}" cy="${y1}" r="6" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="2,2" />` : ''}
      ${isSelected ? `<circle cx="${x2}" cy="${y2}" r="6" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="2,2" />` : ''}
      ${label ? `
        <g transform="translate(${midX},${midY - 10})">
          <rect x="-${label.length * 4 + 6}" y="-10" width="${label.length * 8 + 12}" height="18" rx="4" fill="#ffffff" stroke="${color}" stroke-width="1.2" />
          <text x="0" y="3" text-anchor="middle" font-size="11" font-weight="bold" fill="${color}">${escSvg(label)}</text>
        </g>
      ` : ''}
    </g>
  `;
}

function renderPinSvg(item, isSelected = false) {
  const { id, x, y, label = 'I', text = '', color = '#dc2626' } = item;
  const selGlow = isSelected ? 'filter="url(#sciSelectGlow)"' : '';

  return `
    <g class="sci-draggable sci-overlay-item" data-overlay-id="${id}" data-overlay-type="pin" transform="translate(${x},${y})" ${selGlow}>
      <path d="M 0 0 C -10 -14 -12 -22 -12 -28 A 12 12 0 1 1 12 -28 C 12 -22 10 -14 0 0 Z" fill="${color}" stroke="#ffffff" stroke-width="2" />
      <circle cx="0" cy="-28" r="6.5" fill="#ffffff" />
      <text x="0" y="-24.5" text-anchor="middle" font-size="8.5" font-weight="bold" fill="${color}">${escSvg(label)}</text>
      ${isSelected ? `<circle cx="0" cy="-28" r="14" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,3" />` : ''}
      ${text ? `
        <rect x="14" y="-36" width="${text.length * 7 + 12}" height="20" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${color}" stroke-width="1.2" />
        <text x="${20 + (text.length * 3.5)}" y="-22" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(text)}</text>
      ` : ''}
    </g>
  `;
}

function renderTextAnnotationSvg(item, isSelected = false) {
  const { id, x, y, text = '', size = 14, color = '#0f172a' } = item;
  const selAttr = isSelected ? 'filter="url(#sciSelectGlow)"' : '';

  return `
    <g class="sci-draggable sci-overlay-item" data-overlay-id="${id}" data-overlay-type="text" transform="translate(${x},${y})" ${selAttr}>
      <rect x="-4" y="-${size + 2}" width="${text.length * (size * 0.55) + 12}" height="${size + 8}" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${isSelected ? '#2563eb' : '#cbd5e1'}" stroke-width="${isSelected ? '2' : '1'}" />
      <text x="2" y="0" font-family="'Noto Sans', sans-serif" font-size="${size}" font-weight="bold" fill="${color}">
        ${escSvg(text)}
      </text>
    </g>
  `;
}

// ============================================================================
// 2. TÜM KATMANLARIN SVG'YE ENJEKTE EDİLMESİ
// ============================================================================

function injectOverlaysIntoSvg(svgStr, currentParams) {
  const overlays = currentParams._overlays || [];
  const selectedId = activeSelectedId;

  const defsInjection = `
    <defs>
      <filter id="sciSelectGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#2563eb" flood-opacity="0.7"/>
      </filter>
    </defs>
  `;

  let overlaysSvg = `<g id="sciOverlayLayer">`;

  overlays.forEach(item => {
    const isSel = String(item.id) === String(selectedId);
    if (item.type === 'symbol') {
      overlaysSvg += renderCircuitSymbolSvg(item, isSel);
    } else if (item.type === 'formula') {
      overlaysSvg += renderKaTeXSvg(item.text, item.x, item.y, item.size || 16, item.color || '#0f172a', isSel);
    } else if (item.type === 'arrow') {
      overlaysSvg += renderArrowSvg(item, isSel);
    } else if (item.type === 'pin') {
      overlaysSvg += renderPinSvg(item, isSel);
    } else if (item.type === 'text') {
      overlaysSvg += renderTextAnnotationSvg(item, isSel);
    }
  });

  overlaysSvg += `</g>`;

  const lastIndex = svgStr.lastIndexOf('</svg>');
  if (lastIndex !== -1) {
    return svgStr.slice(0, lastIndex) + defsInjection + overlaysSvg + svgStr.slice(lastIndex);
  }
  return svgStr;
}

// ============================================================================
// 3. İNTERAKTİF SÜRÜKLE-BIRAK VE TIKLAMA YÖNETİCİSİ
// ============================================================================

function setupStageInteractions(stageEl, currentParams, onUpdate, onSelect) {
  if (!stageEl) return;

  stageEl.onpointerdown = (e) => {
    const svgEl = stageEl.querySelector('svg');
    if (!svgEl) return;

    const pt = getSvgCoordinates(svgEl, e.clientX, e.clientY);

    // 1. Organel tutamacı mı?
    const organelleTarget = e.target.closest('[data-organelle-key]');
    if (organelleTarget) {
      const key = organelleTarget.getAttribute('data-organelle-key');
      currentDragTarget = { type: 'organelle', key };
      activeSelectedId = `org_${key}`;
      isDragging = true;
      const org = currentParams.organelles?.[key];
      if (org) {
        dragOffset = { x: pt.x - org.x, y: pt.y - org.y };
      }
      if (typeof onSelect === 'function') onSelect({ type: 'organelle', key, org });
      stageEl.setPointerCapture?.(e.pointerId);
      e.stopPropagation();
      return;
    }

    // 2. Harita pini veya Overlay elemanı mı?
    const overlayTarget = e.target.closest('.sci-overlay-item') || e.target.closest('[data-map-pin-id]');
    if (overlayTarget) {
      const ovId = overlayTarget.getAttribute('data-overlay-id') || overlayTarget.getAttribute('data-map-pin-id');
      const ovType = overlayTarget.getAttribute('data-overlay-type') || 'pin';
      activeSelectedId = ovId;
      isDragging = true;

      if (overlayTarget.hasAttribute('data-map-pin-id')) {
        const pin = (currentParams.pins || []).find(p => String(p.id) === String(ovId));
        if (pin) {
          currentDragTarget = { type: 'mapPin', key: pin.id };
          dragOffset = { x: pt.x - pin.x, y: pt.y - pin.y };
        }
      } else {
        const item = (currentParams._overlays || []).find(o => String(o.id) === String(ovId));
        if (item) {
          currentDragTarget = { type: 'overlay', key: item.id };
          dragOffset = { x: pt.x - item.x, y: pt.y - item.y };
        }
      }

      if (typeof onSelect === 'function') onSelect({ type: ovType, id: ovId });
      stageEl.setPointerCapture?.(e.pointerId);
      e.stopPropagation();
      return;
    }

    activeSelectedId = null;
    currentDragTarget = null;
    if (typeof onSelect === 'function') onSelect(null);
  };

  stageEl.onpointermove = (e) => {
    if (!isDragging || !currentDragTarget) return;
    const svgEl = stageEl.querySelector('svg');
    if (!svgEl) return;

    const pt = getSvgCoordinates(svgEl, e.clientX, e.clientY);
    const newX = Math.round(pt.x - dragOffset.x);
    const newY = Math.round(pt.y - dragOffset.y);

    if (currentDragTarget.type === 'organelle') {
      if (currentParams.organelles && currentParams.organelles[currentDragTarget.key]) {
        currentParams.organelles[currentDragTarget.key].x = Math.max(30, Math.min(500, newX));
        currentParams.organelles[currentDragTarget.key].y = Math.max(40, Math.min(350, newY));
        if (typeof onUpdate === 'function') onUpdate();
      }
    } else if (currentDragTarget.type === 'mapPin') {
      const pin = (currentParams.pins || []).find(p => String(p.id) === String(currentDragTarget.key));
      if (pin) {
        pin.x = Math.max(20, Math.min(580, newX));
        pin.y = Math.max(20, Math.min(320, newY));
        if (typeof onUpdate === 'function') onUpdate();
      }
    } else if (currentDragTarget.type === 'overlay') {
      const item = (currentParams._overlays || []).find(o => String(o.id) === String(currentDragTarget.key));
      if (item) {
        if (item.type === 'arrow') {
          const dx = newX - item.x1;
          const dy = newY - item.y1;
          item.x1 = newX;
          item.y1 = newY;
          item.x2 += dx;
          item.y2 += dy;
        } else {
          item.x = newX;
          item.y = newY;
        }
        if (typeof onUpdate === 'function') onUpdate();
      }
    }
  };

  stageEl.onpointerup = (e) => {
    isDragging = false;
    currentDragTarget = null;
    try { stageEl.releasePointerCapture?.(e.pointerId); } catch (err) {}
  };
}

function getSvgCoordinates(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (ctm) {
    return pt.matrixTransform(ctm.inverse());
  }
  const rect = svg.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

// ============================================================================
// 4. KATMAN ARAÇLARI (EKLE, SİL, SIFIRLA)
// ============================================================================

function addOverlayItem(currentParams, type, customData = {}) {
  if (!currentParams._overlays) currentParams._overlays = [];
  const id = 'ov_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  let newItem = { id, type, x: 260, y: 180, ...customData };
  currentParams._overlays.push(newItem);
  activeSelectedId = id;
  return newItem;
}

function deleteSelectedOverlayItem(currentParams) {
  if (!activeSelectedId) return false;

  if (currentParams._overlays) {
    const idx = currentParams._overlays.findIndex(o => String(o.id) === String(activeSelectedId));
    if (idx !== -1) {
      currentParams._overlays.splice(idx, 1);
      activeSelectedId = null;
      return true;
    }
  }

  if (currentParams.pins) {
    const pIdx = currentParams.pins.findIndex(p => String(p.id) === String(activeSelectedId));
    if (pIdx !== -1) {
      currentParams.pins.splice(pIdx, 1);
      activeSelectedId = null;
      return true;
    }
  }

  return false;
}

function resetAllOverlays(currentParams) {
  currentParams._overlays = [];
  activeSelectedId = null;
}


// Module Exports
__exports['escSvg'] = escSvg;
__exports['getSelectedOverlayId'] = getSelectedOverlayId;
__exports['setSelectedOverlayId'] = setSelectedOverlayId;
__exports['renderKaTeXSvg'] = renderKaTeXSvg;
__exports['renderCircuitSymbolSvg'] = renderCircuitSymbolSvg;
__exports['renderArrowSvg'] = renderArrowSvg;
__exports['renderPinSvg'] = renderPinSvg;
__exports['renderTextAnnotationSvg'] = renderTextAnnotationSvg;
__exports['injectOverlaysIntoSvg'] = injectOverlaysIntoSvg;
__exports['setupStageInteractions'] = setupStageInteractions;
__exports['addOverlayItem'] = addOverlayItem;
__exports['deleteSelectedOverlayItem'] = deleteSelectedOverlayItem;
__exports['resetAllOverlays'] = resetAllOverlays;

});

__define('modules/science/geoTemplates.js', function(__exports, __require, __module) {
const { escSvg } = __require('modules/science/overlayEngine.js');

/**
 * Egemen's Testmaker — Coğrafya Şablon Envanteri (TYT, AYT & KPSS)
 * Türkiye Vektörel Haritası (Genel & Bölgesel Yakınlaştırmalar),
 * Horst-Graben Kırıklı Dağlar, Tombolo & Kıyı Şekilleri, Dünya Haritası,
 * Dünyanın Yıllık Hareketi & Mevsimler, Meridyen / Yerel Saat ve İzohips Haritası.
 */

const GEO_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. TÜRKİYE VEKTÖREL HARİTASI (GENEL & BÖLGESEL YAKINLAŞTIRMA)
  // --------------------------------------------------------------------------
  turkeyMap: {
    id: 'turkeyMap',
    category: 'cografya',
    name: 'Türkiye Vektörel Haritası (Genel & Bölgesel)',
    tags: ['TYT', 'AYT', 'KPSS', 'Türkiye', 'Dilsiz Harita', 'Bölgeler'],
    desc: 'Türkiye genel dilsiz haritası ve bölgesel yakınlaştırmalar (Ege, Marmara, Akdeniz vb.). Nokta koyma ve isimlendirme destekli.',
    defaultParams: {
      title: 'Türkiye Fiziki / Dilsiz Haritası',
      viewRegion: 'all', // 'all' | 'marmara' | 'ege' | 'akdeniz' | 'karadeniz' | 'icanadolu' | 'doguanadolu'
      showGraticule: true,
      showLakes: true,
      showRivers: true,
      pins: [
        { id: 'p1', x: 120, y: 75, label: 'I', text: 'Ergene Havzası', color: '#dc2626' },
        { id: 'p2', x: 95, y: 220, label: 'II', text: 'Menteşe Yöresi', color: '#dc2626' },
        { id: 'p3', x: 335, y: 245, label: 'III', text: 'Çukurova Deltası', color: '#dc2626' },
        { id: 'p4', x: 460, y: 90, label: 'IV', text: 'Doğu Karadeniz', color: '#dc2626' },
        { id: 'p5', x: 550, y: 240, label: 'V', text: 'Hakkari Yöresi', color: '#dc2626' }
      ]
    },
    presets: [
      {
        name: 'ÖSYM TYT Klasik 5 Bölge (I: Ergene, II: Menteşe, III: Çukurova, IV: Rize, V: Hakkari)',
        params: {
          title: 'Haritada Numaralandırılmış 5 Bölge',
          viewRegion: 'all',
          pins: [
            { id: 'p1', x: 120, y: 75, label: 'I', text: 'Ergene Havzası', color: '#dc2626' },
            { id: 'p2', x: 95, y: 220, label: 'II', text: 'Menteşe Yöresi', color: '#dc2626' },
            { id: 'p3', x: 335, y: 245, label: 'III', text: 'Çukurova Deltası', color: '#dc2626' },
            { id: 'p4', x: 460, y: 90, label: 'IV', text: 'Doğu Karadeniz', color: '#dc2626' },
            { id: 'p5', x: 550, y: 240, label: 'V', text: 'Hakkari Yöresi', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Bölgesel Yakınlaştırma: Kıyı Ege & Horst-Grabenler',
        params: {
          title: 'Kıyı Ege Bölümü & Çöküntü Ovaları',
          viewRegion: 'ege',
          pins: [
            { id: 'p1', x: 100, y: 120, label: '1', text: 'Bakırçay Grabeni', color: '#0284c7' },
            { id: 'p2', x: 110, y: 160, label: '2', text: 'Gediz Grabeni', color: '#0284c7' },
            { id: 'p3', x: 125, y: 195, label: '3', text: 'K. Menderes Grabeni', color: '#0284c7' },
            { id: 'p4', x: 135, y: 230, label: '4', text: 'B. Menderes Grabeni', color: '#0284c7' }
          ]
        }
      },
      {
        name: 'Bölgesel Yakınlaştırma: Marmara & Boğazlar',
        params: {
          title: 'Marmara Denizi, Boğazlar & Kapıdağ Tombolosu',
          viewRegion: 'marmara',
          pins: [
            { id: 'p1', x: 80, y: 135, label: 'Ç', text: 'Çanakkale Boğazı', color: '#7c3aed' },
            { id: 'p2', x: 165, y: 90, label: 'İ', text: 'İstanbul Boğazı', color: '#7c3aed' },
            { id: 'p3', x: 115, y: 140, label: 'K', text: 'Kapıdağ Tombolosu', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Türkiye Delta Ovaları (Bafra, Çarşamba, Çukurova, Silifke)',
        params: {
          title: 'Türkiye\'nin Önemli Delta Ovaları',
          viewRegion: 'all',
          pins: [
            { id: 'p1', x: 330, y: 70, label: 'B', text: 'Bafra Deltası', color: '#16a34a' },
            { id: 'p2', x: 360, y: 80, label: 'Ç', text: 'Çarşamba Deltası', color: '#16a34a' },
            { id: 'p3', x: 335, y: 245, label: 'Çu', text: 'Çukurova Deltası', color: '#16a34a' },
            { id: 'p4', x: 280, y: 250, label: 'S', text: 'Silifke Deltası', color: '#16a34a' },
            { id: 'p5', x: 75, y: 165, label: 'M', text: 'Menemen Deltası', color: '#16a34a' }
          ]
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      {
        key: 'viewRegion',
        label: 'Görünüm / Bölgesel Yakınlaştırma',
        type: 'select',
        options: [
          { v: 'all', l: 'Tüm Türkiye (Genel Harita)' },
          { v: 'marmara', l: 'Marmara & Boğazlar' },
          { v: 'ege', l: 'Kıyı Ege & Horst-Grabenler' },
          { v: 'akdeniz', l: 'Akdeniz & Toroslar / Çukurova' },
          { v: 'karadeniz', l: 'Karadeniz Kıyı Kuşağı & Deltalar' },
          { v: 'icanadolu', l: 'İç Anadolu & Tuz Gölü' },
          { v: 'doguanadolu', l: 'Doğu Anadolu & Van Gölü' }
        ]
      },
      { key: 'showGraticule', label: 'Enlem - Boylam Çizgilerini Göster', type: 'checkbox' },
      { key: 'showLakes', label: 'Büyük Gölleri Göster (Van, Tuz)', type: 'checkbox' },
      { key: 'showRivers', label: 'Önemli Akarsuları Çiz', type: 'checkbox' }
    ],
    renderSvg(p) {
      // ViewBox bölgeye göre ayarlanır
      let vb = '0 0 620 340';
      if (p.viewRegion === 'marmara') vb = '30 20 200 170';
      else if (p.viewRegion === 'ege') vb = '20 90 220 180';
      else if (p.viewRegion === 'akdeniz') vb = '80 170 340 150';
      else if (p.viewRegion === 'karadeniz') vb = '140 10 380 150';
      else if (p.viewRegion === 'icanadolu') vb = '160 90 260 170';
      else if (p.viewRegion === 'doguanadolu') vb = '350 70 250 190';

      // Yüksek hassasiyetli Türkiye kıyı ve sınır vektörü
      const turkeyPath = `
        M 105 38
        C 125 35 150 42 165 72
        C 175 62 185 68 200 75
        C 220 72 245 68 260 62
        C 275 60 295 62 315 58
        C 328 35 342 38 350 62
        C 365 75 390 82 410 80
        C 435 80 460 76 480 82
        C 500 85 510 75 518 90
        C 525 110 540 105 550 115
        C 565 125 580 120 590 140
        C 585 160 595 180 580 200
        C 570 215 575 235 560 250
        C 545 255 530 240 515 242
        C 490 245 470 240 445 245
        C 420 248 395 242 375 250
        C 365 270 355 285 348 260
        C 335 255 315 252 300 258
        C 285 265 270 282 250 285
        C 230 270 215 265 195 268
        C 170 255 160 248 140 255
        C 125 245 110 265 95 250
        C 90 230 105 220 95 205
        C 80 200 70 185 85 175
        C 75 160 85 145 75 130
        C 65 120 70 105 60 95
        C 75 90 85 98 92 88
        C 90 75 80 65 90 52
        Z
      `;

      // Marmara Denizi & Boğazlar iç deniz kesimi
      const marmaraSeaPath = `
        M 88 88
        C 105 82 135 85 152 100
        C 145 118 115 125 98 115
        C 90 105 85 95 88 88
        Z
      `;

      // Kapıdağ Tombolosu (Marmara güneyinde saplı ada)
      const kapidagPath = `
        M 112 112
        C 114 105 122 104 125 110
        C 124 116 116 118 112 112
        Z
      `;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Deniz ve Arka Plan -->
        <rect x="-100" y="-100" width="850" height="550" fill="#e0f2fe" />
        
        <!-- Enlem & Boylam Çizgileri -->
        ${p.showGraticule ? `
          <g stroke="#93c5fd" stroke-width="0.75" stroke-dasharray="4,4">
            <line x1="0" y1="65" x2="620" y2="65" />
            <line x1="0" y1="150" x2="620" y2="150" />
            <line x1="0" y1="240" x2="620" y2="240" />
            <line x1="120" y1="0" x2="120" y2="340" />
            <line x1="260" y1="0" x2="260" y2="340" />
            <line x1="400" y1="0" x2="400" y2="340" />
            <line x1="540" y1="0" x2="540" y2="340" />
          </g>
          <g font-size="9" fill="#64748b">
            <text x="5" y="62">42° K</text>
            <text x="5" y="147">39° K</text>
            <text x="5" y="237">36° K</text>
            <text x="122" y="15">30° D</text>
            <text x="262" y="15">35° D</text>
            <text x="402" y="15">40° D</text>
            <text x="542" y="15">45° D</text>
          </g>
        ` : ''}

        <!-- Türkiye Kara Kütlesi -->
        <path d="${turkeyPath}" fill="#f8fafc" stroke="#334155" stroke-width="2.2" stroke-linejoin="round" />
        
        <!-- Marmara Denizi -->
        <path d="${marmaraSeaPath}" fill="#e0f2fe" stroke="#334155" stroke-width="1.6" />
        <!-- Kapıdağ Tombolosu -->
        <path d="${kapidagPath}" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
        <line x1="117" y1="114" x2="119" y2="120" stroke="#334155" stroke-width="2" />

        <!-- Komşu Sınır Çizgileri -->
        <g stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3">
          <line x1="60" y1="95" x2="88" y2="50" />
          <line x1="518" y1="90" x2="550" y2="60" />
          <line x1="580" y1="200" x2="610" y2="210" />
          <line x1="445" y1="245" x2="430" y2="300" />
        </g>
      `;

      // Büyük Göller (Van & Tuz)
      if (p.showLakes) {
        svg += `
          <!-- Van Gölü -->
          <g id="lakeVan" transform="translate(505, 160)">
            <path d="M 0 0 C 8 -12 24 -8 30 2 C 28 15 15 22 2 18 C -6 10 -4 4 0 0 Z" fill="#93c5fd" stroke="#0284c7" stroke-width="1.4" />
            <text x="14" y="8" font-size="8" fill="#0369a1" text-anchor="middle" font-weight="bold">Van G.</text>
          </g>
          <!-- Tuz Gölü -->
          <g id="lakeTuz" transform="translate(245, 145)">
            <ellipse cx="0" cy="0" rx="16" ry="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.4" opacity="0.9" />
            <text x="0" y="3" font-size="7.5" fill="#64748b" text-anchor="middle" font-weight="bold">Tuz G.</text>
          </g>
        `;
      }

      // Akarsular
      if (p.showRivers) {
        svg += `
          <g stroke="#38bdf8" stroke-width="1.4" fill="none" stroke-linecap="round">
            <!-- Kızılırmak Yay Çizimi -->
            <path d="M 370 140 C 330 180 250 170 270 110 C 285 70 330 65 330 62" />
            <!-- Yeşilırmak -->
            <path d="M 400 130 C 380 110 370 95 360 70" />
            <!-- Gediz -->
            <path d="M 130 155 C 100 155 90 162 82 165" />
            <!-- Çukurova Seyhan-Ceyhan -->
            <path d="M 345 200 C 340 220 335 240 336 250" />
            <!-- Fırat -->
            <path d="M 430 150 C 410 180 405 210 395 245" />
          </g>
        `;
      }

      // Harita Pinleri (I, II, III... veya özel etiketli)
      if (p.pins && p.pins.length) {
        p.pins.forEach(pin => {
          svg += `
            <g class="sci-draggable sci-overlay-item" data-map-pin-id="${pin.id}" data-overlay-type="mapPin" transform="translate(${pin.x},${pin.y})">
              <!-- Damla Pin Şekli -->
              <path d="M 0 0 C -9 -12 -11 -18 -11 -24 A 11 11 0 1 1 11 -24 C 11 -18 9 -12 0 0 Z" fill="${pin.color || '#dc2626'}" stroke="#ffffff" stroke-width="1.8" />
              <circle cx="0" cy="-24" r="6" fill="#ffffff" />
              <text x="0" y="-21" text-anchor="middle" font-size="8" font-weight="bold" fill="${pin.color || '#dc2626'}">${escSvg(pin.label)}</text>
              ${pin.text ? `
                <rect x="12" y="-32" width="${pin.text.length * 6.8 + 10}" height="18" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${pin.color || '#dc2626'}" stroke-width="1" />
                <text x="${17 + (pin.text.length * 3.4)}" y="-19" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">${escSvg(pin.text)}</text>
              ` : ''}
            </g>
          `;
        });
      }

      // Başlık ve Ölçek Çubuğu
      if (p.title) {
        svg += `
          <rect x="10" y="10" width="${p.title.length * 7.5 + 24}" height="26" rx="6" fill="#ffffff" fill-opacity="0.9" stroke="#cbd5e1" stroke-width="1" />
          <text x="22" y="27" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>
        `;
      }

      // Kıyı İsimleri / Yön Oku
      svg += `
        <g font-size="11" font-weight="bold" fill="#0284c7" opacity="0.8">
          <text x="320" y="25" text-anchor="middle">KARADENİZ</text>
          <text x="40" y="200" text-anchor="middle" transform="rotate(-90, 40, 200)">EGE DENİZİ</text>
          <text x="280" y="315" text-anchor="middle">AKDENİZ</text>
        </g>
        <!-- Kuzey Oku -->
        <g transform="translate(${vb.split(' ')[0] * 1 + vb.split(' ')[2] * 1 - 35}, ${vb.split(' ')[1] * 1 + 35})">
          <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
          <polygon points="0,-11 4,4 0,1 -4,4" fill="#dc2626" />
          <polygon points="0,1 4,4 0,11 -4,4" fill="#64748b" />
          <text x="0" y="-13" font-size="8" font-weight="bold" text-anchor="middle" fill="#0f172a">K</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. HORST - GRABEN SİSTEMİ & KIRIKLI DAĞLAR
  // --------------------------------------------------------------------------
  horstGraben: {
    id: 'horstGraben',
    category: 'cografya',
    name: 'Horst - Graben Kırık Dağ Sistemi',
    tags: ['TYT', 'AYT', 'Orojenez', 'Ege', 'Fay', 'Jeomorfoloji'],
    desc: 'Tektonik kırılma sonucu yükselen blok (Horst) ve çöken çöküntü hendeği (Graben) 3D kesit modeli.',
    defaultParams: {
      title: 'Horst - Graben Kırıklı Dağ Yapısı (Orojenez)',
      horst1Name: 'Horst (Kırık Dağı)',
      grabenName: 'Graben (Çöküntü Ovası)',
      horst2Name: 'Horst',
      showFaultLines: true,
      showArrows: true,
      showStrata: true,
      labelMode: 'names' // 'names' | 'num' | 'letters'
    },
    presets: [
      {
        name: 'Ege Bölgesi Preseti (Bozdağlar - Küçük Menderes - Aydın Dağları)',
        params: {
          title: 'Ege Kırık Sistemi: Bozdağlar - K. Menderes - Aydın Dağları',
          horst1Name: 'Bozdağlar (Horst)',
          grabenName: 'K. Menderes (Graben)',
          horst2Name: 'Aydın Dağları (Horst)',
          showFaultLines: true,
          showArrows: true,
          showStrata: true,
          labelMode: 'names'
        }
      },
      {
        name: 'TYT Numaralandırılmış Soru Modeli (I: Horst, II: Graben, III: Fay)',
        params: {
          title: 'Yer Kabuğu Kırılma Şeması',
          horst1Name: 'I',
          grabenName: 'II',
          horst2Name: 'I',
          showFaultLines: true,
          showArrows: true,
          showStrata: true,
          labelMode: 'num'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Başlık / Soru Notu', type: 'text' },
      { key: 'horst1Name', label: '1. Yükselen Blok İsmi (Horst)', type: 'text' },
      { key: 'grabenName', label: 'Çöken Blok İsmi (Graben)', type: 'text' },
      { key: 'horst2Name', label: '2. Yükselen Blok İsmi (Horst)', type: 'text' },
      { key: 'showFaultLines', label: 'Fay Düzlemlerini Göster', type: 'checkbox' },
      { key: 'showArrows', label: 'Atım Yönü Oklarını Göster (↑ ↓)', type: 'checkbox' },
      { key: 'showStrata', label: 'Tortul Kayaç Tabakalarını Renklendir', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Gökyüzü -->
        <rect x="0" y="0" width="540" height="350" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- 3D İzo-Blok Katmanları -->
        <g stroke="#1e293b" stroke-width="2" stroke-linejoin="round">
          
          <!-- SOL BLOK (HORST 1) -->
          <path d="M 30 110 L 150 110 L 190 220 L 30 220 Z" fill="#cbd5e1" />
          ${p.showStrata ? `
            <path d="M 30 140 L 160 140 L 170 170 L 30 170 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 30 180 L 175 180 L 185 210 L 30 210 Z" fill="#64748b" opacity="0.4" />
          ` : ''}
          <!-- 3D Üst Yüzey -->
          <polygon points="30,110 90,70 210,70 150,110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2" />
          <!-- 3D Yan Fay Düzlemi -->
          <polygon points="150,110 210,70 250,180 190,220" fill="#94a3b8" stroke="#1e293b" stroke-width="2" />

          <!-- ORTA BLOK (GRABEN - ÇÖKÜNTÜ) -->
          <path d="M 190 220 L 330 220 L 300 290 L 160 290 Z" fill="#e2e8f0" />
          ${p.showStrata ? `
            <path d="M 175 240 L 315 240 L 310 260 L 170 260 Z" fill="#94a3b8" opacity="0.6" />
          ` : ''}
          <!-- Graben Tabanı -->
          <polygon points="190,220 250,180 390,180 330,220" fill="#bbf7d0" stroke="#16a34a" stroke-width="2" />
          <!-- Graben Alüvyon Dolgusu & Akarsu -->
          <path d="M 230 195 Q 280 205 320 195" fill="none" stroke="#0284c7" stroke-width="3" />

          <!-- SAĞ BLOK (HORST 2) -->
          <path d="M 330 110 L 470 110 L 470 220 L 370 220 Z" fill="#cbd5e1" />
          ${p.showStrata ? `
            <path d="M 345 140 L 470 140 L 470 170 L 355 170 Z" fill="#94a3b8" opacity="0.6" />
            <path d="M 360 180 L 470 180 L 470 210 L 368 210 Z" fill="#64748b" opacity="0.4" />
          ` : ''}
          <polygon points="330,110 390,70 510,70 470,110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2" />
          <!-- Sağ Blok Fay Aynası -->
          <polygon points="330,110 390,70 390,180 330,220" fill="#cbd5e1" stroke="#1e293b" stroke-width="2" />
        </g>
      `;

      // Fay Hatları (Kırmızı kesikli)
      if (p.showFaultLines) {
        svg += `
          <g stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6,4">
            <line x1="210" y1="70" x2="160" y2="290" />
            <line x1="390" y1="70" x2="330" y2="290" />
          </g>
          <text x="180" y="275" font-size="10" font-weight="bold" fill="#dc2626">Fay Hattı</text>
          <text x="365" y="275" font-size="10" font-weight="bold" fill="#dc2626">Fay Hattı</text>
        `;
      }

      // Atım Okları (Yükselme ve Çökme Vektörleri)
      if (p.showArrows) {
        svg += `
          <!-- Sol Horst Yukarı Oku -->
          <g transform="translate(100, 160)">
            <line x1="0" y1="25" x2="0" y2="-20" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,-26 -6,-14 6,-14" fill="#2563eb" />
          </g>
          <!-- Graben Aşağı Oku -->
          <g transform="translate(290, 230)">
            <line x1="0" y1="-20" x2="0" y2="25" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,31 -6,19 6,19" fill="#dc2626" />
          </g>
          <!-- Sağ Horst Yukarı Oku -->
          <g transform="translate(420, 160)">
            <line x1="0" y1="25" x2="0" y2="-20" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
            <polygon points="0,-26 -6,-14 6,-14" fill="#2563eb" />
          </g>
        `;
      }

      // İsimlendirme Kutucukları
      svg += `
        <!-- Horst 1 -->
        <g transform="translate(110, 85)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.horst1Name)}</text>
        </g>
        <!-- Graben -->
        <g transform="translate(290, 175)">
          <rect x="-65" y="-12" width="130" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.grabenName)}</text>
        </g>
        <!-- Horst 2 -->
        <g transform="translate(430, 85)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.horst2Name)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. TOMBOLO (SAPLI ADA) & KIYI BİRİKTİRME ŞEKİLLERİ
  // --------------------------------------------------------------------------
  tomboloCoastal: {
    id: 'tomboloCoastal',
    category: 'cografya',
    name: 'Tombolo (Saplı Ada) & Lagün Kıyı Şekli',
    tags: ['TYT', 'Dalga Biriktirmesi', 'Sinop', 'Kapıdağ', 'Lagün', 'Kıyı'],
    desc: 'Açık denizdeki adanın dalga ve akıntıların biriktirdiği kıyı oku (bağlama seti) ile karaya bağlanması şeması.',
    defaultParams: {
      title: 'Tombolo (Saplı Ada) Oluşumu',
      mainlandLabel: 'Anakara (Kıta)',
      islandLabel: 'Ada (Eski Ada)',
      tomboloLabel: 'Tombolo (Bağlama Seti)',
      lagoonLabel: 'Lagün (Kıyı Set Gölü)',
      showWaves: true,
      showDepthLines: true,
      showWindArrow: true
    },
    presets: [
      {
        name: 'Sinop Boztepe Tombolosu Örneği',
        params: {
          title: 'Türkiye Kıyı Şekilleri: Sinop Boztepe Tombolosu',
          mainlandLabel: 'Sinop Anakara',
          islandLabel: 'Boztepe (Saplı Ada)',
          tomboloLabel: 'Bağlama Kordonu',
          lagoonLabel: 'Sığ Kıyı',
          showWaves: true,
          showDepthLines: true,
          showWindArrow: true
        }
      },
      {
        name: 'Kapıdağ Yarımadası (Erdek / Balıkesir)',
        params: {
          title: 'Marmara Denizi: Kapıdağ Tombolosu (Dalga Biriktirmesi)',
          mainlandLabel: 'Erdek / Balıkesir Kıyısı',
          islandLabel: 'Kapıdağ Kütlesi',
          tomboloLabel: 'Çift Kıyı Oku (Tombolo)',
          lagoonLabel: 'Kıyı Lagünü',
          showWaves: true,
          showDepthLines: true,
          showWindArrow: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'mainlandLabel', label: 'Anakara Etiketi', type: 'text' },
      { key: 'islandLabel', label: 'Ada / Yarımada Etiketi', type: 'text' },
      { key: 'tomboloLabel', label: 'Tombolo (Bağlantı) Etiketi', type: 'text' },
      { key: 'lagoonLabel', label: 'Lagün Etiketi', type: 'text' },
      { key: 'showWaves', label: 'Dalga Cephelerini Göster', type: 'checkbox' },
      { key: 'showDepthLines', label: 'Derinlik Eş Yükselti Çizgilerini Göster', type: 'checkbox' },
      { key: 'showWindArrow', label: 'Hakim Rüzgar Yönü Okunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Deniz -->
        <rect x="0" y="0" width="540" height="360" fill="#bae6fd" />

        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Derinlik Çizgileri (Batimetri) -->
        ${p.showDepthLines ? `
          <g stroke="#7dd3fc" stroke-width="1.2" fill="none" stroke-dasharray="5,5">
            <path d="M 0 160 C 120 180 200 130 270 120 C 350 110 440 180 540 170" />
            <path d="M 0 100 C 140 120 220 80 300 70 C 380 60 460 110 540 100" />
            <circle cx="270" cy="90" r="65" />
          </g>
        ` : ''}

        <!-- Dalga Cepheleri ve Kırılma Okları -->
        ${p.showWaves ? `
          <g stroke="#38bdf8" stroke-width="1.8" fill="none" stroke-linecap="round">
            <path d="M 50 30 C 120 45 180 40 220 30" />
            <path d="M 320 30 C 360 40 420 45 490 30" />
            <path d="M 60 70 C 130 85 180 80 210 60" />
            <path d="M 330 60 C 360 80 410 85 480 70" />
          </g>
        ` : ''}

        <!-- ANAKARA (Güney Bölgesi) -->
        <path d="M 0 240 C 90 230 180 260 270 255 C 360 250 450 225 540 240 L 540 360 L 0 360 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2.5" />
        <path d="M 0 240 C 90 230 180 260 270 255 C 360 250 450 225 540 240 L 540 255 L 0 255 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1" opacity="0.6" />

        <!-- ADA (Kuzeyde Bağımsız Kütle) -->
        <g id="islandGroup">
          <ellipse cx="270" cy="90" rx="60" ry="42" fill="#94a3b8" stroke="#334155" stroke-width="2.5" />
          <ellipse cx="270" cy="90" rx="63" ry="45" fill="none" stroke="#ca8a04" stroke-width="2" stroke-dasharray="2,2" />
        </g>

        <!-- TOMBOLO (Kıyı Oku / Bağlama Seti Kumsal Köprüsü) -->
        <path d="M 235 125 C 248 160 252 210 240 255 L 300 255 C 288 210 292 160 305 125 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2.2" />
        <!-- Kumsal Çizgileri -->
        <g stroke="#eab308" stroke-width="1" stroke-linecap="round">
          <line x1="255" y1="160" x2="285" y2="160" />
          <line x1="252" y1="185" x2="288" y2="185" />
          <line x1="250" y1="210" x2="290" y2="210" />
        </g>

        <!-- LAGÜN (Kıyı Set Gölü - Sağ Tarafta) -->
        <ellipse cx="430" cy="275" rx="45" ry="22" fill="#7dd3fc" stroke="#0284c7" stroke-width="2" />
        <path d="M 375 255 C 410 245 450 248 485 255" stroke="#ca8a04" stroke-width="4" fill="none" stroke-linecap="round" />

        <!-- Hakim Rüzgar Oku -->
        ${p.showWindArrow ? `
          <g transform="translate(60, 80)">
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
            <line x1="-10" y1="-10" x2="8" y2="8" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
            <polygon points="12,12 3,10 10,3" fill="#2563eb" />
            <text x="0" y="28" font-size="9" font-weight="bold" fill="#2563eb" text-anchor="middle">Dalga / Rüzgar</text>
          </g>
        ` : ''}

        <!-- Etiket Kutuları -->
        <!-- Anakara -->
        <g transform="translate(120, 305)">
          <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.mainlandLabel)}</text>
        </g>
        <!-- Ada -->
        <g transform="translate(270, 88)">
          <rect x="-65" y="-12" width="130" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.islandLabel)}</text>
        </g>
        <!-- Tombolo -->
        <g transform="translate(270, 185)">
          <rect x="-70" y="-12" width="140" height="24" rx="4" fill="#ffffff" stroke="#ca8a04" stroke-width="2" />
          <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#854d0e">${escSvg(p.tomboloLabel)}</text>
        </g>
        <!-- Lagün -->
        <g transform="translate(430, 275)">
          <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="bold" fill="#0369a1">${escSvg(p.lagoonLabel)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 4. DÜNYA VEKTÖREL HARİTASI & BOĞAZLAR / KANALLAR
  // --------------------------------------------------------------------------
  worldMap: {
    id: 'worldMap',
    category: 'cografya',
    name: 'Dünya Vektörel Haritası & Boğazlar/Kanallar',
    tags: ['TYT', 'AYT', 'Dünya', 'Boğazlar', 'İklim', 'Dilsiz Harita'],
    desc: 'Kıtalar, Ekvator, Dönenceler, Greenwich meridyeni ve stratejik su yollarını (Panama, Süveyş, Hürmüz, Cebelitarık vb.) içeren vektörel dünya haritası.',
    defaultParams: {
      title: 'Dünya Dilsiz Haritası & Stratejik Noktalar',
      showEquator: true,
      showTropics: true,
      showGreenwich: true,
      pins: [
        { id: 'w1', x: 165, y: 195, label: '1', text: 'Panama Kanalı', color: '#dc2626' },
        { id: 'w2', x: 268, y: 135, label: '2', text: 'Cebelitarık Boğazı', color: '#dc2626' },
        { id: 'w3', x: 335, y: 155, label: '3', text: 'Süveyş Kanalı', color: '#dc2626' },
        { id: 'w4', x: 375, y: 165, label: '4', text: 'Hürmüz Boğazı', color: '#dc2626' },
        { id: 'w5', x: 440, y: 215, label: '5', text: 'Malakka Boğazı', color: '#dc2626' }
      ]
    },
    presets: [
      {
        name: 'Dünya Önemli Boğaz ve Kanalları (1: Panama, 2: Cebelitarık, 3: Süveyş, 4: Hürmüz, 5: Malakka)',
        params: {
          title: 'Dünya Deniz Ticaretinin Stratejik Su Yolları',
          showEquator: true,
          showTropics: true,
          showGreenwich: true,
          pins: [
            { id: 'w1', x: 165, y: 195, label: '1', text: 'Panama', color: '#dc2626' },
            { id: 'w2', x: 268, y: 135, label: '2', text: 'Cebelitarık', color: '#dc2626' },
            { id: 'w3', x: 335, y: 155, label: '3', text: 'Süveyş', color: '#dc2626' },
            { id: 'w4', x: 375, y: 165, label: '4', text: 'Hürmüz', color: '#dc2626' },
            { id: 'w5', x: 440, y: 215, label: '5', text: 'Malakka', color: '#dc2626' }
          ]
        }
      },
      {
        name: 'Dünya Nüfusunun Seyrek Olduğu 5 Bölge (Çöller, Kutuplar, Ekvatoral Orman)',
        params: {
          title: 'Dünyada Nüfusun Seyrek Olduğu Alanlar',
          showEquator: true,
          showTropics: true,
          showGreenwich: false,
          pins: [
            { id: 'w1', x: 200, y: 220, label: 'I', text: 'Amazon Havzası (Aşırı nem/sıcak)', color: '#d97706' },
            { id: 'w2', x: 300, y: 155, label: 'II', text: 'Büyük Sahra Çölü (Kuraklık)', color: '#d97706' },
            { id: 'w3', x: 410, y: 85, label: 'III', text: 'Sibirya (Şiddetli soğuk)', color: '#d97706' },
            { id: 'w4', x: 225, y: 55, label: 'IV', text: 'Grönland (Buzul alanı)', color: '#d97706' },
            { id: 'w5', x: 470, y: 265, label: 'V', text: 'Avustralya Çölleri', color: '#d97706' }
          ]
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      { key: 'showEquator', label: 'Ekvator Çizgisini Göster (0°)', type: 'checkbox' },
      { key: 'showTropics', label: 'Dönenceleri Göster (23° 27\' K / G)', type: 'checkbox' },
      { key: 'showGreenwich', label: 'Başlangıç Meridyenini Göster (0°)', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Okyanuslar -->
        <rect x="0" y="0" width="580" height="340" fill="#e0f2fe" />

        <!-- Meridyen & Paralel Rehber Çizgileri -->
        ${p.showGreenwich ? `
          <line x1="285" y1="0" x2="285" y2="340" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,3" />
          <text x="288" y="16" font-size="8.5" font-weight="bold" fill="#475569">0° Greenwich</text>
        ` : ''}

        ${p.showTropics ? `
          <!-- Yengeç Dönencesi -->
          <line x1="0" y1="125" x2="580" y2="125" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,4" />
          <text x="6" y="121" font-size="8" font-weight="bold" fill="#b45309">23° 27' K (Yengeç)</text>
          <!-- Oğlak Dönencesi -->
          <line x1="0" y1="235" x2="580" y2="235" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,4" />
          <text x="6" y="231" font-size="8" font-weight="bold" fill="#b45309">23° 27' G (Oğlak)</text>
        ` : ''}

        ${p.showEquator ? `
          <!-- Ekvator Çizgisi -->
          <line x1="0" y1="180" x2="580" y2="180" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="6,3" />
          <text x="6" y="176" font-size="9" font-weight="bold" fill="#dc2626">0° Ekvator</text>
        ` : ''}

        <!-- Kıtalar Vektör Çizimi -->
        <g fill="#f8fafc" stroke="#475569" stroke-width="1.4" stroke-linejoin="round">
          <!-- Kuzey Amerika -->
          <path d="M 60 45 C 90 40 140 45 160 70 C 180 90 170 120 160 140 C 145 160 120 150 100 130 C 80 120 70 80 60 45 Z" />
          <!-- Grönland -->
          <path d="M 205 35 C 230 30 245 45 235 65 C 220 75 205 60 205 35 Z" fill="#f1f5f9" />
          <!-- Güney Amerika -->
          <path d="M 160 185 C 190 180 220 205 210 240 C 200 270 180 300 165 315 C 155 295 150 250 155 210 Z" />
          <!-- Avrupa -->
          <path d="M 270 70 C 300 65 325 75 320 100 C 305 115 285 110 270 100 C 260 85 265 75 270 70 Z" />
          <!-- Afrika -->
          <path d="M 270 125 C 320 120 345 150 340 190 C 330 230 310 270 290 275 C 275 260 265 200 260 160 Z" />
          <!-- Asya -->
          <path d="M 330 65 C 380 50 460 55 490 85 C 510 110 490 150 460 160 C 440 170 410 190 395 180 C 380 150 350 140 330 110 Z" />
          <!-- Hindistan Yarımadası -->
          <path d="M 390 145 C 410 150 415 185 400 195 C 390 185 385 165 390 145 Z" />
          <!-- Avustralya -->
          <path d="M 445 230 C 485 225 510 245 495 280 C 470 295 440 285 435 260 Z" />
          <!-- Antarktika -->
          <path d="M 120 335 C 240 325 360 325 480 335 L 480 340 L 120 340 Z" fill="#f1f5f9" />
        </g>
      `;

      // Harita Pinleri
      if (p.pins && p.pins.length) {
        p.pins.forEach(pin => {
          svg += `
            <g class="sci-draggable sci-overlay-item" data-map-pin-id="${pin.id}" data-overlay-type="mapPin" transform="translate(${pin.x},${pin.y})">
              <path d="M 0 0 C -9 -12 -11 -18 -11 -24 A 11 11 0 1 1 11 -24 C 11 -18 9 -12 0 0 Z" fill="${pin.color || '#dc2626'}" stroke="#ffffff" stroke-width="1.8" />
              <circle cx="0" cy="-24" r="6" fill="#ffffff" />
              <text x="0" y="-21" text-anchor="middle" font-size="8" font-weight="bold" fill="${pin.color || '#dc2626'}">${escSvg(pin.label)}</text>
              ${pin.text ? `
                <rect x="12" y="-32" width="${pin.text.length * 6.5 + 10}" height="18" rx="4" fill="#ffffff" fill-opacity="0.95" stroke="${pin.color || '#dc2626'}" stroke-width="1" />
                <text x="${17 + (pin.text.length * 3.25)}" y="-19" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">${escSvg(pin.text)}</text>
              ` : ''}
            </g>
          `;
        });
      }

      if (p.title) {
        svg += `
          <rect x="10" y="10" width="${p.title.length * 7.5 + 24}" height="26" rx="6" fill="#ffffff" fill-opacity="0.9" stroke="#cbd5e1" stroke-width="1" />
          <text x="22" y="27" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 5. GÜNEŞ SİSTEMİNDE DÜNYA, EKSEN EĞİKLİĞİ & MEVSİMLER
  // --------------------------------------------------------------------------
  earthOrbitSeasons: {
    id: 'earthOrbitSeasons',
    category: 'cografya',
    name: 'Güneş Sisteminde Dünyanın Konumu & Mevsimler',
    tags: ['TYT', 'Mevsimler', 'Ekinoks', 'Gündönümü', 'Eksen Eğikliği'],
    desc: 'Dünyanın Güneş etrafında dolanımı, 23° 27\' eksen eğikliği, 21 Haziran, 23 Eylül, 21 Aralık, 21 Mart aydınlanma çemberi ve ışın geliş açıları.',
    defaultParams: {
      title: 'Dünyanın Yıllık Hareketi & 4 Önemli Tarih',
      focusDate: 'all', // 'all' | 'june' | 'december' | 'equinox'
      showRays: true,
      showAxialTilt: true,
      showOrbitPath: true
    },
    presets: [
      {
        name: '21 Haziran Konumu (Yaz Gündönümü - Yengeç Dönencesine Dik)',
        params: {
          title: '21 Haziran Yaz Gündönümü (Kuzey Yaz / Güney Kış)',
          focusDate: 'june',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      },
      {
        name: '21 Aralık Konumu (Kış Gündönümü - Oğlak Dönencesine Dik)',
        params: {
          title: '21 Aralık Kış Gündönümü (Kuzey Kış / Güney Yaz)',
          focusDate: 'december',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      },
      {
        name: '21 Mart & 23 Eylül Ekinoksu (Gece=Gündüz Eşitliği)',
        params: {
          title: 'Ekinoks Konumu: Ekvatora Dik Geliş & 12 Saat Gece/Gündüz',
          focusDate: 'equinox',
          showRays: true,
          showAxialTilt: true,
          showOrbitPath: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      {
        key: 'focusDate',
        label: 'Görünüm Modu',
        type: 'select',
        options: [
          { v: 'all', l: '4 Tarihli Genel Yıllık Yörünge (Elips)' },
          { v: 'june', l: '21 Haziran Yakın Çekim (Yaz Gündönümü)' },
          { v: 'december', l: '21 Aralık Yakın Çekim (Kış Gündönümü)' },
          { v: 'equinox', l: 'Ekinoks Yakın Çekim (21 Mart - 23 Eylül)' }
        ]
      },
      { key: 'showRays', label: 'Güneş Işınlarını Göster', type: 'checkbox' },
      { key: 'showAxialTilt', label: '23° 27\' Eksen Eğikliği Çizgisini Göster', type: 'checkbox' },
      { key: 'showOrbitPath', label: 'Yörünge Elips Çizgisini Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      if (p.focusDate === 'june' || p.focusDate === 'december' || p.focusDate === 'equinox') {
        return renderSingleDateCloseUp(p);
      }

      // Genel 4 Tarihli Yörünge Şeması
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="560" height="360" fill="#090d16" />

        ${p.title ? `<text x="280" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#f8fafc">${escSvg(p.title)}</text>` : ''}

        <!-- Elips Yörünge -->
        ${p.showOrbitPath ? `
          <ellipse cx="280" cy="180" rx="220" ry="110" fill="none" stroke="#334155" stroke-width="1.8" stroke-dasharray="6,4" />
          <!-- Dolanım Yönü Okları (Saat yönünün tersi) -->
          <polygon points="280,70 290,65 290,75" fill="#38bdf8" />
          <polygon points="500,180 505,190 495,190" fill="#38bdf8" />
          <polygon points="280,290 270,295 270,285" fill="#38bdf8" />
          <polygon points="60,180 55,170 65,170" fill="#38bdf8" />
        ` : ''}

        <!-- Güneş (Merkezde) -->
        <g id="sunCentral" transform="translate(280, 180)">
          <circle cx="0" cy="0" r="32" fill="#f59e0b" />
          <circle cx="0" cy="0" r="26" fill="#fbbf24" />
          <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="bold" fill="#78350f">GÜNEŞ</text>
        </g>

        <!-- 1. SOL KONUM: 21 HAZİRAN (YAZ GÜNDÖNÜMÜ) -->
        ${renderEarthMiniGlobe(60, 180, '21 Haziran', 'Yaz Gündönümü', -23.5, true)}

        <!-- 2. SAĞ KONUM: 21 ARALIK (KIŞ GÜNDÖNÜMÜ) -->
        ${renderEarthMiniGlobe(500, 180, '21 Aralık', 'Kış Gündönümü', -23.5, false)}

        <!-- 3. ÜST KONUM: 23 EYLÜL (SONBAHAR EKİNOKSU) -->
        ${renderEarthMiniGlobe(280, 70, '23 Eylül', 'Ekinoks', -23.5, null)}

        <!-- 4. ALT KONUM: 21 MART (İLKBAHAR EKİNOKSU) -->
        ${renderEarthMiniGlobe(280, 290, '21 Mart', 'Ekinoks', -23.5, null)}

        <!-- Yörünge Günberi ve Günöte Notu -->
        <text x="110" y="275" font-size="10" fill="#94a3b8">3 Ocak: Günberi (147 Milyon km)</text>
        <text x="360" y="95" font-size="10" fill="#94a3b8">4 Temmuz: Günöte (152 Milyon km)</text>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 6. MERİDYENLER, PARALELLER & YEREL SAAT HESAPLAMA
  // --------------------------------------------------------------------------
  meridianTime: {
    id: 'meridianTime',
    category: 'cografya',
    name: 'Meridyenler & Yerel Saat Hesaplama',
    tags: ['TYT', 'Meridyen', 'Yerel Saat', 'Boylam', 'Güneşin Konumu'],
    desc: 'Başlangıç meridyeni (Greenwich 0°), 4 dakikalık yerel saat farkı formülü ve Güneşin gökyüzündeki tepe noktası şeması.',
    defaultParams: {
      title: 'Meridyenler & Yerel Saat Farkı Hesabı',
      meridian1: '30° Doğu (İzmit)',
      time1: '12:00',
      meridian2: '45° Doğu (Iğdır)',
      time2: '13:00',
      showFormulas: true
    },
    presets: [
      {
        name: 'ÖSYM Çıkmış Soru: İzmit (30°D) ile Iğdır (45°D) Yerel Saat Farkı',
        params: {
          title: '30°D (İzmit) ve 45°D (Iğdır) Saat Farkı Hesabı',
          meridian1: '30° D (İzmit)',
          time1: '12:00',
          meridian2: '45° D (Iğdır)',
          time2: '13:00',
          showFormulas: true
        }
      },
      {
        name: 'Doğu ve Batı Boylamları Farkı (15° Batı vs 30° Doğu)',
        params: {
          title: 'Farklı Yarımkürelerdeki Boylamlar Arası Süre',
          meridian1: '15° Batı',
          time1: '10:00',
          meridian2: '30° Doğu',
          time2: '13:00',
          showFormulas: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'meridian1', label: '1. Meridyen Bilgisi', type: 'text' },
      { key: 'time1', label: '1. Merkez Saati', type: 'text' },
      { key: 'meridian2', label: '2. Meridyen Bilgisi', type: 'text' },
      { key: 'time2', label: '2. Merkez Saati', type: 'text' },
      { key: 'showFormulas', label: 'Hesaplama Formülü Kutusunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Ufuk Düzlemi ve Güneşin Yükseltisi Yayı -->
        <path d="M 60 210 Q 270 50 480 210" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6,4" />
        <line x1="40" y1="210" x2="500" y2="210" stroke="#0f172a" stroke-width="2.5" />
        <text x="50" y="230" font-size="11" font-weight="bold" fill="#0f172a">DOĞU (Doğuş)</text>
        <text x="440" y="230" font-size="11" font-weight="bold" fill="#0f172a">BATI (Batış)</text>

        <!-- 1. Merkez Güneşi (Öğle Vakti Tepe Noktası) -->
        <g transform="translate(270, 130)">
          <circle cx="0" cy="0" r="22" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
          <text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#78350f">12:00 (Öğle)</text>
          <line x1="0" y1="24" x2="0" y2="80" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3" />
        </g>

        <!-- 1. Merkez Bilgi Kutusu -->
        <g transform="translate(140, 175)">
          <rect x="-65" y="-22" width="130" height="44" rx="6" fill="#ffffff" stroke="#2563eb" stroke-width="2" />
          <text x="0" y="-4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.meridian1)}</text>
          <text x="0" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#2563eb">Saat: ${escSvg(p.time1)}</text>
        </g>

        <!-- 2. Merkez Bilgi Kutusu -->
        <g transform="translate(400, 175)">
          <rect x="-65" y="-22" width="130" height="44" rx="6" fill="#ffffff" stroke="#16a34a" stroke-width="2" />
          <text x="0" y="-4" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.meridian2)}</text>
          <text x="0" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">Saat: ${escSvg(p.time2)}</text>
        </g>

        <!-- Formül ve Kural Bilgi Kutusu -->
        ${p.showFormulas ? `
          <g transform="translate(70, 255)">
            <rect x="0" y="0" width="400" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
            <text x="15" y="20" font-size="11" font-weight="bold" fill="#0f172a">📐 Coğrafi Yerel Saat Kuralları:</text>
            <text x="15" y="38" font-size="10.5" fill="#334155">• İki ardışık meridyen arasındaki yerel saat farkı daima 4 dakikadır (1° = 4 dk).</text>
            <text x="15" y="54" font-size="10.5" fill="#334155">• Doğu meridyenlerinde Güneş daha erken doğar ve yerel saat daima daha ileridir.</text>
          </g>
        ` : ''}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 7. İZOHİPS (EŞ YÜKSELTİ EĞRİLERİ) & TOPOGRAFYA HARİTASI
  // --------------------------------------------------------------------------
  isohypseTopography: {
    id: 'isohypseTopography',
    category: 'cografya',
    name: 'İzohips (Eş Yükselti) Topografya Haritası',
    tags: ['TYT', 'İzohips', 'Tepe', 'Vadi', 'Sırt', 'Falez', 'Delta'],
    desc: 'Tepe, sırt (V), vadi (ters V), akarsu akış yönü, kapalı çukur/krater (içe dönük oklar), boyun, falez ve profil hattı.',
    defaultParams: {
      title: 'İzohips Topografya Haritası & Yer Şekilleri',
      contourInterval: '50 m',
      showStream: true,
      showDepression: true,
      showProfileLine: true,
      showCliff: true
    },
    presets: [
      {
        name: 'ÖSYM Klasik Soru Modeli (Tepe, Boyun, Vadi, Delta)',
        params: {
          title: 'Topografya Haritasında Numaralandırılmış Şekiller',
          contourInterval: '50 m',
          showStream: true,
          showDepression: true,
          showProfileLine: true,
          showCliff: true
        }
      },
      {
        name: 'Kapalı Çukur (Krater) ve Falez Sorusu',
        params: {
          title: 'Volkanik Krater (Kapalı Çukur) & Kıyı Falezi',
          contourInterval: '100 m',
          showStream: false,
          showDepression: true,
          showProfileLine: true,
          showCliff: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Harita Başlığı', type: 'text' },
      { key: 'contourInterval', label: 'İzohips Aralığı (Eş Yükselti Adımı)', type: 'text' },
      { key: 'showStream', label: 'Akarsu ve Delta Ovası Çiz', type: 'checkbox' },
      { key: 'showDepression', label: 'Kapalı Çukur (Krater Okları) Göster', type: 'checkbox' },
      { key: 'showProfileLine', label: 'A - B Profil Doğrultusunu Göster', type: 'checkbox' },
      { key: 'showCliff', label: 'Falez / Kıyı Uçurumunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <!-- Zemin -->
        <rect x="0" y="0" width="540" height="360" fill="#f8fafc" />

        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Deniz (Kuzeydoğu veya Doğu Tarafı) -->
        <path d="M 430 0 C 420 120 440 220 540 300 L 540 0 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />
        <text x="490" y="60" font-size="12" font-weight="bold" fill="#0369a1">DENİZ (0 m)</text>

        <!-- İzohips Eğrileri (Kahverengi) -->
        <g stroke="#92400e" stroke-width="1.6" fill="none" stroke-linejoin="round">
          <!-- Kıyı Çizgisi (0 m) -->
          <path d="M 430 0 C 420 120 440 220 540 300" stroke="#0284c7" stroke-width="2.5" />
          
          <!-- 50 m Eğrisi -->
          <path d="M 370 0 C 360 120 375 230 460 360" />
          
          <!-- 100 m Eğrisi (Vadi ve Sırt Girintileriyle) -->
          <path d="M 310 0 C 290 80 320 160 300 220 C 290 260 350 310 390 360" />

          <!-- 150 m Eğrisi -->
          <path d="M 250 0 C 230 70 260 150 240 210 C 220 260 270 320 310 360" />

          <!-- SOL TEPE (Zirve: 350 m) -->
          <path d="M 120 120 C 145 100 175 110 180 140 C 175 170 135 180 115 160 C 100 145 105 130 120 120 Z" />
          <path d="M 130 130 C 145 120 160 125 165 140 C 160 155 140 160 130 150 Z" />
          <polygon points="145,135 150,143 140,143" fill="#b45309" stroke="#b45309" stroke-width="1" />
          <text x="145" y="156" font-size="8" font-weight="bold" fill="#b45309" text-anchor="middle">▲ 365 m</text>

          <!-- SAĞ TEPE (Zirve: 300 m) -->
          <path d="M 210 120 C 235 100 265 110 270 140 C 265 170 225 180 205 160 C 190 145 195 130 210 120 Z" />
          <path d="M 220 130 C 235 120 250 125 255 140 C 250 155 230 160 220 150 Z" />
          <polygon points="235,135 240,143 230,143" fill="#b45309" stroke="#b45309" stroke-width="1" />
        </g>
      `;

      // Akarsu ve Vadi (Ters V girintisi)
      if (p.showStream) {
        svg += `
          <!-- Akarsu -->
          <path d="M 50 250 Q 150 210 280 210 Q 360 200 440 190" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
          <!-- Akış Yönü Oku -->
          <polygon points="380,195 365,190 365,200" fill="#0284c7" />
          <!-- Delta Çıkıntısı -->
          <path d="M 435 175 Q 465 190 435 205 Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.5" />
          <text x="475" y="195" font-size="9" font-weight="bold" fill="#854d0e">Delta</text>
        `
      }

      // Kapalı Çukur / Krater (İçe dönük oklar)
      if (p.showDepression) {
        svg += `
          <!-- Kapalı Çukur Çemberi -->
          <g transform="translate(100, 260)">
            <ellipse cx="0" cy="0" rx="35" ry="25" fill="#fef3c7" stroke="#b45309" stroke-width="1.8" />
            <!-- İçe Dönük Oklar -->
            <line x1="0" y1="-25" x2="0" y2="-13" stroke="#b45309" stroke-width="1.6" />
            <polygon points="0,-10 -3,-16 3,-16" fill="#b45309" />
            <line x1="0" y1="25" x2="0" y2="13" stroke="#b45309" stroke-width="1.6" />
            <polygon points="0,10 -3,16 3,16" fill="#b45309" />
            <line x1="-35" y1="0" x2="-23" y2="0" stroke="#b45309" stroke-width="1.6" />
            <polygon points="-20,0 -26,-3 -26,3" fill="#b45309" />
            <line x1="35" y1="0" x2="23" y2="0" stroke="#b45309" stroke-width="1.6" />
            <polygon points="20,0 26,-3 26,3" fill="#b45309" />
            <text x="0" y="4" font-size="8" font-weight="bold" fill="#78350f" text-anchor="middle">Krater / Çukur</text>
          </g>
        `;
      }

      // Falez (Kıyı Uçurumu - İzohipslerin deniz kıyısında sıklaşması)
      if (p.showCliff) {
        svg += `
          <g transform="translate(425, 60)">
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#b91c1c" stroke-width="2" stroke-dasharray="2,2" />
            <text x="-25" y="4" font-size="9" font-weight="bold" fill="#b91c1c">Falez</text>
          </g>
        `;
      }

      // İki Tepe Arası Boyun
      svg += `
        <text x="190" y="145" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Boyun</text>
      `;

      // Profil Hattı A - B
      if (p.showProfileLine) {
        svg += `
          <line x1="60" y1="140" x2="400" y2="140" stroke="#2563eb" stroke-width="2" stroke-dasharray="4,3" />
          <circle cx="60" cy="140" r="5" fill="#2563eb" />
          <text x="50" y="144" font-size="12" font-weight="bold" fill="#2563eb">A</text>
          <circle cx="400" cy="140" r="5" fill="#2563eb" />
          <text x="410" y="144" font-size="12" font-weight="bold" fill="#2563eb">B</text>
        `;
      }

      // Lejant ve İzo Aralığı
      svg += `
        <g transform="translate(20, 310)">
          <rect x="0" y="0" width="160" height="28" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
          <text x="8" y="18" font-size="9.5" font-weight="bold" fill="#0f172a">Eş Yükselti Eğrisi: ${escSvg(p.contourInterval)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderEarthMiniGlobe(x, y, dateText, subText, tiltAngle = -23.5, northSummer = true) {
  const r = 24;
  return `
    <g transform="translate(${x}, ${y})">
      <!-- Eksen Çizgisi -->
      <line x1="${tiltAngle * 0.7}" y1="-34" x2="${-tiltAngle * 0.7}" y2="34" stroke="#e2e8f0" stroke-width="1.5" />
      <circle cx="0" cy="0" r="${r}" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
      
      <!-- Aydınlanma Çemberi -->
      ${northSummer === true ? `
        <!-- Sol aydınlık, sağ karanlık (21 Haziran) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 1 0 ${r} Z" fill="#030712" opacity="0.65" />
      ` : (northSummer === false ? `
        <!-- Sağ aydınlık, sol karanlık (21 Aralık) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 0 0 ${r} Z" fill="#030712" opacity="0.65" />
      ` : `
        <!-- Ekinoks (Yarı aydınlık) -->
        <path d="M 0 -${r} A ${r} ${r} 0 0 1 0 ${r} Z" fill="#030712" opacity="0.5" />
      `)}

      <!-- Tarih Etiketi -->
      <rect x="-45" y="32" width="90" height="26" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <text x="0" y="44" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#f8fafc">${dateText}</text>
      <text x="0" y="54" text-anchor="middle" font-size="8" fill="#94a3b8">${subText}</text>
    </g>
  `;
}

function renderSingleDateCloseUp(p) {
  const isJune = p.focusDate === 'june';
  const isDec = p.focusDate === 'december';
  const title = isJune ? '21 Haziran Konumu & Güneş Işınları' : (isDec ? '21 Aralık Konumu & Aydınlanma Çemberi' : 'Ekinoks Durumu');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
      <rect x="0" y="0" width="540" height="350" fill="#0f172a" />
      <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#f8fafc">${title}</text>

      <!-- Güneş (Sol Tarafta) -->
      <g transform="translate(40, 175)">
        <circle cx="0" cy="0" r="50" fill="#f59e0b" />
        <circle cx="0" cy="0" r="42" fill="#fbbf24" />
        <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="bold" fill="#78350f">GÜNEŞ</text>
      </g>

      <!-- Işınlar -->
      <g stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4">
        <line x1="95" y1="120" x2="270" y2="120" />
        <line x1="95" y1="175" x2="270" y2="175" />
        <line x1="95" y1="230" x2="270" y2="230" />
      </g>

      <!-- Büyük Dünya Modeli -->
      <g transform="translate(360, 175)">
        <!-- Eksen Eğikliği Çizgisi (23° 27') -->
        <line x1="-40" y1="-140" x2="40" y2="140" stroke="#f8fafc" stroke-width="2" />
        <text x="-48" y="-144" font-size="9" font-weight="bold" fill="#f8fafc">Kuzey Kutup Noktası</text>
        <text x="44" y="148" font-size="9" font-weight="bold" fill="#f8fafc">Güney Kutup Noktası</text>

        <!-- Küre -->
        <circle cx="0" cy="0" r="90" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />

        <!-- Aydınlanma Çemberi -->
        <path d="M 0 -90 A 90 90 0 0 ${isJune ? '1' : '0'} 0 90 Z" fill="#030712" opacity="0.65" />

        <!-- Enlem Paralelleri -->
        <ellipse cx="0" cy="-35" rx="82" ry="12" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4,2" />
        <text x="86" y="-32" font-size="8.5" fill="#f59e0b">Yengeç Dönencesi (23°27' K)</text>

        <ellipse cx="0" cy="0" rx="90" ry="14" fill="none" stroke="#ef4444" stroke-width="2" />
        <text x="94" y="4" font-size="8.5" font-weight="bold" fill="#ef4444">Ekvator (0°)</text>

        <ellipse cx="0" cy="35" rx="82" ry="12" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4,2" />
        <text x="86" y="38" font-size="8.5" fill="#f59e0b">Oğlak Dönencesi (23°27' G)</text>
      </g>
    </svg>
  `;
}


// Module Exports
__exports['GEO_TEMPLATES'] = GEO_TEMPLATES;

});

__define('modules/science/physTemplates.js', function(__exports, __require, __module) {
const { escSvg } = __require('modules/science/overlayEngine.js');

/**
 * Egemen's Testmaker — Fizik Şablon Envanteri (TYT & AYT)
 * Devreler, Vektörler, Dalgalar, Yay-Kütle, Eğik Düzlem, Manyetizma, Transformatör,
 * Isı-Sıcaklık, Makaralar, Optik, Dinamik ve Sıvı Basıncı.
 */

const PHYS_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. ELEKTRİK DEVRESİ (DİNAMİK DİRENÇLER, PİL & ÖLÇÜ ALETLERİ)
  // --------------------------------------------------------------------------
  electricCircuit: {
    id: 'electricCircuit',
    category: 'fizik',
    name: 'Elektrik Devresi & Ohm Yasası',
    tags: ['TYT', 'AYT', 'Devre', 'Direnç', 'Ohm', 'Voltmetre'],
    desc: 'Seri/paralel dirençler, üreteç, anahtar, voltmetre ve ampermetre ile parametrik devre modeli. İstenilen yere serbest direnç sembolü ve formül konabilir.',
    defaultParams: {
      circuitType: 'series_parallel', // 'series' | 'parallel' | 'series_parallel' | 'wheatstone'
      vVal: '24 V',
      r1Val: '6 Ω',
      r2Val: '3 Ω',
      r3Val: '4 Ω',
      showVoltmeter: true,
      showAmmeter: true,
      switchState: 'closed', // 'open' | 'closed'
      showFormulaBox: true
    },
    presets: [
      {
        name: 'TYT 2023 - Seri ve Paralel Bağlı Lamba & Direnç (Eşdeğer Direnç)',
        params: {
          circuitType: 'series_parallel',
          vVal: '36 V',
          r1Val: '6 Ω',
          r2Val: '12 Ω',
          r3Val: '4 Ω',
          showVoltmeter: true,
          showAmmeter: true,
          switchState: 'closed',
          showFormulaBox: true
        }
      },
      {
        name: 'TYT - Paralel Kol Akım Paylaşımı & Voltmetre Ölçümü',
        params: {
          circuitType: 'parallel',
          vVal: '12 V',
          r1Val: '4 Ω',
          r2Val: '2 Ω',
          r3Val: '',
          showVoltmeter: true,
          showAmmeter: true,
          switchState: 'closed',
          showFormulaBox: true
        }
      },
      {
        name: 'Basit Seri Devre (R1 + R2)',
        params: {
          circuitType: 'series',
          vVal: '20 V',
          r1Val: '5 Ω',
          r2Val: '5 Ω',
          r3Val: '',
          showVoltmeter: false,
          showAmmeter: true,
          switchState: 'closed',
          showFormulaBox: false
        }
      }
    ],
    schema: [
      {
        key: 'circuitType',
        label: 'Devre Bağlantı Şekli',
        type: 'select',
        options: [
          { v: 'series_parallel', l: 'Karma (Seri + Paralel Kollar)' },
          { v: 'parallel', l: 'Paralel Bağlı Dirençler' },
          { v: 'series', l: 'Seri Bağlı Dirençler' }
        ]
      },
      { key: 'vVal', label: 'Üreteç Gerilimi (V)', type: 'text' },
      { key: 'r1Val', label: '1. Direnç Değeri (R₁)', type: 'text' },
      { key: 'r2Val', label: '2. Direnç Değeri (R₂)', type: 'text' },
      { key: 'r3Val', label: '3. Direnç Değeri (R₃)', type: 'text' },
      { key: 'showVoltmeter', label: 'Voltmetre (V) Göster', type: 'checkbox' },
      { key: 'showAmmeter', label: 'Ampermetre (A) Göster', type: 'checkbox' },
      {
        key: 'switchState',
        label: 'Anahtar Konumu',
        type: 'select',
        options: [{ v: 'closed', l: 'Kapalı (Akım Geçer)' }, { v: 'open', l: 'Açık (Akım Kesik)' }]
      },
      { key: 'showFormulaBox', label: 'Ohm Yasası Formül Kutusunu Göster (V = I·R)', type: 'checkbox' }
    ],
    renderSvg(p) {
      const isClosed = p.switchState === 'closed';

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />

        <!-- Ana Devre İletken Telleri -->
        <g stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Alt Hat (Üreteç ve Anahtar) -->
          <line x1="80" y1="280" x2="210" y2="280" />
          <line x1="270" y1="280" x2="350" y2="280" />
          <line x1="410" y1="280" x2="460" y2="280" />
          <line x1="460" y1="280" x2="460" y2="80" />
          <line x1="80" y1="280" x2="80" y2="80" />
      `;

      if (p.circuitType === 'series') {
        svg += `
          <!-- Üst Seri Hat -->
          <line x1="80" y1="80" x2="160" y2="80" />
          <line x1="240" y1="80" x2="320" y2="80" />
          <line x1="400" y1="80" x2="460" y2="80" />
        </g>
        `;
        // R1 ve R2
        svg += renderResistorBox(200, 80, 'R₁', p.r1Val);
        svg += renderResistorBox(360, 80, 'R₂', p.r2Val);
      } else if (p.circuitType === 'parallel') {
        svg += `
          <!-- Üst Paralel Düğümler -->
          <line x1="80" y1="80" x2="180" y2="80" />
          <line x1="180" y1="50" x2="180" y2="130" />
          <line x1="180" y1="50" x2="220" y2="50" />
          <line x1="180" y1="130" x2="220" y2="130" />
          <line x1="300" y1="50" x2="340" y2="50" />
          <line x1="300" y1="130" x2="340" y2="130" />
          <line x1="340" y1="50" x2="340" y2="130" />
          <line x1="340" y1="80" x2="460" y2="80" />
        </g>
        `;
        svg += renderResistorBox(260, 50, 'R₁', p.r1Val);
        svg += renderResistorBox(260, 130, 'R₂', p.r2Val);
      } else {
        // Karma Devre
        svg += `
          <line x1="80" y1="80" x2="140" y2="80" />
          <line x1="220" y1="80" x2="270" y2="80" />
          <!-- Paralel Kollar -->
          <line x1="270" y1="50" x2="270" y2="120" />
          <line x1="270" y1="50" x2="310" y2="50" />
          <line x1="270" y1="120" x2="310" y2="120" />
          <line x1="390" y1="50" x2="430" y2="50" />
          <line x1="390" y1="120" x2="430" y2="120" />
          <line x1="430" y1="50" x2="430" y2="120" />
          <line x1="430" y1="80" x2="460" y2="80" />
        </g>
        `;
        svg += renderResistorBox(180, 80, 'R₁', p.r1Val);
        svg += renderResistorBox(350, 50, 'R₂', p.r2Val);
        svg += renderResistorBox(350, 120, 'R₃', p.r3Val);
      }

      // Üreteç (Pil)
      svg += `
        <g id="batteryComp" transform="translate(240, 280)">
          <line x1="-15" y1="-18" x2="-15" y2="18" stroke="#0f172a" stroke-width="4" />
          <line x1="15" y1="-10" x2="15" y2="10" stroke="#0f172a" stroke-width="2.5" />
          <text x="-25" y="-12" font-size="12" font-weight="bold" fill="#dc2626">+</text>
          <text x="25" y="-12" font-size="12" font-weight="bold" fill="#0f172a">-</text>
          <text x="0" y="32" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">V = ${escSvg(p.vVal)}</text>
        </g>
      `;

      // Anahtar (K anahtarı)
      svg += `
        <g id="switchComp" transform="translate(380, 280)">
          <circle cx="-15" cy="0" r="3.5" fill="#0f172a" />
          <circle cx="15" cy="0" r="3.5" fill="${isClosed ? '#0f172a' : '#ffffff'}" stroke="#0f172a" stroke-width="2" />
          <line x1="-15" y1="0" x2="${isClosed ? '15' : '10'}" y2="${isClosed ? '0' : '-16'}" stroke="#0f172a" stroke-width="2.5" />
          <text x="0" y="-18" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">K (${isClosed ? 'Kapalı' : 'Açık'})</text>
        </g>
      `;

      // Ampermetre (Devre üzerinde seri)
      if (p.showAmmeter) {
        svg += `
          <g id="ammeterComp" transform="translate(460, 180)">
            <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#059669" stroke-width="2.5" />
            <text x="0" y="6" text-anchor="middle" font-size="15" font-weight="bold" fill="#059669">A</text>
            <text x="26" y="5" font-size="11" font-weight="bold" fill="#059669">A₁</text>
          </g>
        `;
      }

      // Voltmetre (R1 üzerine paralel bağlı)
      if (p.showVoltmeter) {
        svg += `
          <g id="voltmeterComp" stroke="#2563eb" stroke-width="1.8" fill="none">
            <line x1="140" y1="80" x2="140" y2="20" />
            <line x1="140" y1="20" x2="180" y2="20" />
            <line x1="220" y1="20" x2="220" y2="80" />
            <circle cx="180" cy="20" r="15" fill="#ffffff" stroke="#2563eb" stroke-width="2" />
            <text x="180" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#2563eb" stroke="none">V</text>
          </g>
        `;
      }

      // Akım Yönü Oku
      if (isClosed) {
        svg += `
          <g fill="#dc2626" stroke="#dc2626" stroke-width="1.5">
            <line x1="70" y1="180" x2="70" y2="140" />
            <polygon points="70,132 66,145 74,145" />
            <text x="60" y="160" text-anchor="end" font-size="11" font-weight="bold" stroke="none">i (Akım)</text>
          </g>
        `;
      }

      // Formül Kutusu (Ohm Kanunu)
      if (p.showFormulaBox) {
        svg += `
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="130" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
            <text x="65" y="22" text-anchor="middle" font-size="12" font-style="italic" font-weight="bold" fill="#0f172a">V = I · R</text>
          </g>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. VEKTÖRLER & KARELİ DÜZLEMDE BİLEŞKE KUVVET
  // --------------------------------------------------------------------------
  vectorsGrid: {
    id: 'vectorsGrid',
    category: 'fizik',
    name: 'Vektörler & Bileşke Kuvvet (Kareli Düzlem)',
    tags: ['TYT', 'AYT', 'Vektör', 'Bileşke', 'Kuvvet', 'Kareli Düzlem'],
    desc: 'Kareli koordinat düzleminde F1, F2, F3 vektörleri, bileşke R vektörü ve açı hesaplamaları.',
    defaultParams: {
      title: 'Aynı Düzlemdeki Vektörlerin Bileşkesi',
      gridSize: '6x6',
      showResultant: true,
      f1: '3, 1', // dx, dy birim cinsinden
      f2: '-2, 3',
      f3: '1, -2'
    },
    presets: [
      {
        name: 'AYT - 3 Vektörün Bileşkesi (R = F1 + F2 + F3)',
        params: {
          title: 'Sürtünmesiz Yatay Düzlemde Cisme Etki Eden Kuvvetler',
          showResultant: true,
          f1: '3, 1',
          f2: '-1, 2',
          f3: '0, -2'
        }
      },
      {
        name: 'Denge Durumu (Bileşke Sıfır: R = 0)',
        params: {
          title: 'Hareketsiz Duran Cisme Etki Eden Dengelenmiş Kuvvetler',
          showResultant: false,
          f1: '2, 2',
          f2: '-2, 1',
          f3: '0, -3'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Soru Başlığı', type: 'text' },
      { key: 'f1', label: '1. Kuvvet Vektörü (dx, dy)', type: 'text', hint: 'Örn: 3, 1' },
      { key: 'f2', label: '2. Kuvvet Vektörü (dx, dy)', type: 'text', hint: 'Örn: -2, 3' },
      { key: 'f3', label: '3. Kuvvet Vektörü (dx, dy)', type: 'text', hint: 'Örn: 1, -2' },
      { key: 'showResultant', label: 'Bileşke Vektörü (R) Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const originX = 260;
      const originY = 175;
      const u = 32; // 1 birim kare 32px

      const parseV = (str) => {
        const parts = (str || '0,0').split(',').map(s => parseFloat(s.trim()) || 0);
        return { dx: parts[0], dy: parts[1] };
      };

      const v1 = parseV(p.f1);
      const v2 = parseV(p.f2);
      const v3 = parseV(p.f3);
      const rVec = { dx: v1.dx + v2.dx + v3.dx, dy: v1.dy + v2.dy + v3.dy };

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- 8x8 Kareli Grid Izgarası -->
        <g stroke="#e2e8f0" stroke-width="1.2">
      `;

      for (let i = -4; i <= 4; i++) {
        svg += `<line x1="${originX - 4 * u}" y1="${originY + i * u}" x2="${originX + 4 * u}" y2="${originY + i * u}" />`;
        svg += `<line x1="${originX + i * u}" y1="${originY - 4 * u}" x2="${originX + i * u}" y2="${originY + 4 * u}" />`;
      }

      svg += `</g>`;

      // Eksen Çizgileri
      svg += `
        <line x1="${originX - 4 * u}" y1="${originY}" x2="${originX + 4 * u}" y2="${originY}" stroke="#94a3b8" stroke-width="1.8" />
        <line x1="${originX}" y1="${originY - 4 * u}" x2="${originX}" y2="${originY + 4 * u}" stroke="#94a3b8" stroke-width="1.8" />
        <!-- Orijin Cismi (Kütle) -->
        <circle cx="${originX}" cy="${originY}" r="5" fill="#0f172a" />
        <text x="${originX - 8}" y="${originY + 16}" font-size="11" font-weight="bold" fill="#64748b">O</text>
      `;

      // Vektör Çizim Fonksiyonu
      const drawVec = (dx, dy, color, label) => {
        const targetX = originX + dx * u;
        const targetY = originY - dy * u; // SVG y ekseni ters
        const angle = Math.atan2(targetY - originY, targetX - originX);
        const headLen = 10;
        const x1 = targetX - headLen * Math.cos(angle - Math.PI / 6);
        const y1 = targetY - headLen * Math.sin(angle - Math.PI / 6);
        const x2 = targetX - headLen * Math.cos(angle + Math.PI / 6);
        const y2 = targetY - headLen * Math.sin(angle + Math.PI / 6);

        return `
          <line x1="${originX}" y1="${originY}" x2="${targetX}" y2="${targetY}" stroke="${color}" stroke-width="2.6" stroke-linecap="round" />
          <polygon points="${targetX},${targetY} ${x1},${y1} ${x2},${y2}" fill="${color}" />
          <text x="${targetX + (dx >= 0 ? 8 : -14)}" y="${targetY + (dy >= 0 ? -6 : 14)}" font-size="12" font-weight="bold" fill="${color}">${label}</text>
        `;
      };

      svg += drawVec(v1.dx, v1.dy, '#2563eb', 'F₁');
      svg += drawVec(v2.dx, v2.dy, '#059669', 'F₂');
      svg += drawVec(v3.dx, v3.dy, '#d97706', 'F₃');

      if (p.showResultant && (rVec.dx !== 0 || rVec.dy !== 0)) {
        svg += drawVec(rVec.dx, rVec.dy, '#dc2626', 'R (Bileşke)');
      }

      // 1 birim kare lejantı
      svg += `
        <g transform="translate(420, 290)">
          <rect x="0" y="0" width="${u}" height="${u}" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
          <text x="${u / 2}" y="${u / 2 + 4}" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">1 br</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. DALGALAR & PERİYODİK HAREKET
  // --------------------------------------------------------------------------
  waveMotion: {
    id: 'waveMotion',
    category: 'fizik',
    name: 'Dalgalar (Enine Dalga, Dalga Boyu λ & Genlik)',
    tags: ['TYT', 'AYT', 'Dalga Boyu', 'Genlik', 'Tepe', 'Çukur', 'Frekans'],
    desc: 'Sinüzoidal enine dalga modeli; dalga boyu (λ), genlik (A), dalga tepesi, dalga çukuru ve ilerleme yönü.',
    defaultParams: {
      title: 'Periyodik Dalga Modeli (Dalga Boyu & Genlik)',
      waveLengthLabel: 'λ = 8 cm',
      amplitudeLabel: 'A = 4 cm',
      cycles: 2.5,
      showNodes: true,
      showArrow: true
    },
    presets: [
      {
        name: 'TYT - İki Tepe Arası Dalga Boyu Ölçümü',
        params: {
          title: 'Homojen Ortamda İlerleyen Periyodik Dalga',
          waveLengthLabel: 'λ (Dalga Boyu)',
          amplitudeLabel: 'Genlik (A)',
          cycles: 2.5,
          showNodes: true,
          showArrow: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'waveLengthLabel', label: 'Dalga Boyu Etiketi (λ)', type: 'text' },
      { key: 'amplitudeLabel', label: 'Genlik Etiketi (A)', type: 'text' },
      { key: 'showNodes', label: 'Tepe & Çukur Noktalarını İşaretle', type: 'checkbox' },
      { key: 'showArrow', label: 'İlerleme Yönü Okunu Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const startX = 60;
      const endX = 480;
      const centerY = 180;
      const amp = 60; // Genlik px
      const lambda = 160; // Dalga boyu px

      let pathD = `M ${startX} ${centerY}`;
      for (let x = startX; x <= endX; x += 4) {
        const y = centerY - amp * Math.sin(((x - startX) / lambda) * 2 * Math.PI);
        pathD += ` L ${x} ${y.toFixed(1)}`;
      }

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Denge Konumu (Eksen) -->
        <line x1="${startX - 20}" y1="${centerY}" x2="${endX + 20}" y2="${centerY}" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="6,4" />
        <text x="${endX + 25}" y="${centerY + 4}" font-size="11" font-weight="bold" fill="#64748b">Denge Konumu</text>

        <!-- Sinüs Dalga Eğrisi -->
        <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />

        <!-- Dalga Boyu (λ) Ölçüm Çizgisi (İki Tepe Arası) -->
        <g stroke="#dc2626" stroke-width="1.8">
          <line x1="${startX + lambda * 0.25}" y1="${centerY - amp - 15}" x2="${startX + lambda * 1.25}" y2="${centerY - amp - 15}" />
          <line x1="${startX + lambda * 0.25}" y1="${centerY - amp - 20}" x2="${startX + lambda * 0.25}" y2="${centerY - amp - 10}" />
          <line x1="${startX + lambda * 1.25}" y1="${centerY - amp - 20}" x2="${startX + lambda * 1.25}" y2="${centerY - amp - 10}" />
          <text x="${startX + lambda * 0.75}" y="${centerY - amp - 22}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626" stroke="none">${escSvg(p.waveLengthLabel)}</text>
        </g>

        <!-- Genlik (A) Ölçüm Çizgisi -->
        <g stroke="#059669" stroke-width="1.8">
          <line x1="${startX + lambda * 0.25}" y1="${centerY}" x2="${startX + lambda * 0.25}" y2="${centerY - amp}" stroke-dasharray="3,3" />
          <line x1="${startX + lambda * 0.25 - 25}" y1="${centerY - amp}" x2="${startX + lambda * 0.25 - 25}" y2="${centerY}" />
          <line x1="${startX + lambda * 0.25 - 30}" y1="${centerY - amp}" x2="${startX + lambda * 0.25 - 20}" y2="${centerY - amp}" />
          <line x1="${startX + lambda * 0.25 - 30}" y1="${centerY}" x2="${startX + lambda * 0.25 - 20}" y2="${centerY}" />
          <text x="${startX + lambda * 0.25 - 35}" y="${centerY - amp / 2 + 4}" text-anchor="end" font-size="11" font-weight="bold" fill="#059669" stroke="none">${escSvg(p.amplitudeLabel)}</text>
        </g>
      `;

      // Tepe & Çukur Noktaları
      if (p.showNodes) {
        svg += `
          <circle cx="${startX + lambda * 0.25}" cy="${centerY - amp}" r="4.5" fill="#dc2626" />
          <text x="${startX + lambda * 0.25}" y="${centerY - amp - 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#dc2626">Dalga Tepesi</text>

          <circle cx="${startX + lambda * 0.75}" cy="${centerY + amp}" r="4.5" fill="#2563eb" />
          <text x="${startX + lambda * 0.75}" y="${centerY + amp + 16}" text-anchor="middle" font-size="10" font-weight="bold" fill="#2563eb">Dalga Çukuru</text>
        `;
      }

      // İlerleme Yönü Oku
      if (p.showArrow) {
        svg += `
          <g transform="translate(360, 60)">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
            <polygon points="68,0 56,-5 56,5" fill="#0f172a" />
            <text x="30" y="-10" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">İlerleme Hızı (v)</text>
          </g>
        `;
      }

      // Formül Kutusu
      svg += `
        <g transform="translate(30, 270)">
          <rect x="0" y="0" width="180" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
          <text x="90" y="23" text-anchor="middle" font-size="12" font-style="italic" font-weight="bold" fill="#0f172a">v = λ · f  =  λ / T</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 4. YAY-KÜTLE SİSTEMİ & BASİT HARMONİK HAREKET
  // --------------------------------------------------------------------------
  springHarmonic: {
    id: 'springHarmonic',
    category: 'fizik',
    name: 'Yay - Kütle Sistemi & Harmonik Hareket',
    tags: ['AYT', 'Yay', 'Basit Harmonik Hareket', 'Periyot', 'Hooke'],
    desc: 'Tavana asılı veya yatay düzlemde yay sabiti (k), asılı kütle (m), denge konumu ve periyot (T = 2π√(m/k)) modeli.',
    defaultParams: {
      title: 'Düşey Yay - Kütle Sistemi',
      springK: 'k = 100 N/m',
      massM: 'm = 4 kg',
      displacement: '+x (Uzanım)',
      showPeriodFormula: true
    },
    presets: [
      {
        name: 'AYT - Periyot Hesabı (T = 2π√(m/k))',
        params: {
          title: 'Sürtünmesiz Ortamda Salınım Yapan Yaylı Sarkaç',
          springK: 'k = 200 N/m',
          massM: 'm = 2 kg',
          displacement: '+x',
          showPeriodFormula: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'springK', label: 'Yay Sabiti (k)', type: 'text' },
      { key: 'massM', label: 'Kütle Değeri (m)', type: 'text' },
      { key: 'displacement', label: 'Uzanım / Genlik (+x, -x)', type: 'text' },
      { key: 'showPeriodFormula', label: 'Periyot Formülünü Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Tavan (Sabit Askı Noktası) -->
        <line x1="180" y1="60" x2="340" y2="60" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        <!-- Tavan Taraması -->
        <g stroke="#94a3b8" stroke-width="1.5">
          ${[190, 210, 230, 250, 270, 290, 310, 330].map(x => `<line x1="${x}" y1="60" x2="${x + 8}" y2="50" />`).join('')}
        </g>

        <!-- Helezon Yay Çizimi -->
        <path d="
          M 260 60
          L 260 75
          C 230 85 290 95 260 105
          C 230 115 290 125 260 135
          C 230 145 290 155 260 165
          C 230 175 290 185 260 195
          L 260 210
        " fill="none" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />

        <!-- Yay Sabiti Etiketi -->
        <rect x="285" y="125" width="${p.springK.length * 7 + 16}" height="22" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <text x="293" y="140" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.springK)}</text>

        <!-- Asılı Kütle (m) -->
        <g transform="translate(260, 240)">
          <rect x="-35" y="-30" width="70" height="60" rx="6" fill="#cbd5e1" stroke="#334155" stroke-width="2.5" />
          <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.massM)}</text>
        </g>

        <!-- Denge & Genlik Seviyeleri (O, +x, -x) -->
        <g stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,4">
          <!-- -x Seviyesi -->
          <line x1="120" y1="190" x2="400" y2="190" />
          <text x="410" y="194" font-size="11" font-weight="bold" fill="#dc2626">+r (Üst Denge)</text>

          <!-- O Denge Noktası -->
          <line x1="120" y1="240" x2="400" y2="240" stroke="#2563eb" />
          <text x="410" y="244" font-size="11" font-weight="bold" fill="#2563eb">O (Denge Noktası)</text>

          <!-- +x Seviyesi -->
          <line x1="120" y1="290" x2="400" y2="290" />
          <text x="410" y="294" font-size="11" font-weight="bold" fill="#dc2626">-r (Alt Denge)</text>
        </g>

        <!-- Formül Kutusu -->
        ${p.showPeriodFormula ? `
          <g transform="translate(30, 275)">
            <rect x="0" y="0" width="160" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
            <text x="80" y="26" text-anchor="middle" font-size="13" font-style="italic" font-weight="bold" fill="#0f172a">T = 2π √(m / k)</text>
          </g>
        ` : ''}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 5. EĞİK DÜZLEM & SÜRTÜNME KUVVETİ
  // --------------------------------------------------------------------------
  inclinedPlane: {
    id: 'inclinedPlane',
    category: 'fizik',
    name: 'Eğik Düzlem & Sürtünme Kuvveti',
    tags: ['TYT', 'AYT', 'Dinamik', 'Eğik Düzlem', 'Sürtünme', 'Kuvvet'],
    desc: 'α açılı eğik düzlemde m kütleli cisim, mg sinα, mg cosα bileşenleri, tepki kuvveti (N) ve sürtünme (Fs).',
    defaultParams: {
      title: 'Eğik Düzlemde Cisme Etki Eden Kuvvetler',
      angleAlpha: '37°',
      massLabel: 'm = 5 kg',
      frictionState: 'with_friction', // 'frictionless' | 'with_friction'
      showComponents: true
    },
    presets: [
      {
        name: 'AYT - 37° Eğik Düzlemde İvme Hesabı (sin 37° = 0.6, cos 37° = 0.8)',
        params: {
          title: 'Sürtünmeli Eğik Düzlemde Kayan Cisim (k = 0.2)',
          angleAlpha: '37°',
          massLabel: 'm = 2 kg',
          frictionState: 'with_friction',
          showComponents: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'angleAlpha', label: 'Eğik Düzlem Açısı (α)', type: 'text' },
      { key: 'massLabel', label: 'Cisim Kütlesi (m)', type: 'text' },
      {
        key: 'frictionState',
        label: 'Sürtünme Durumu',
        type: 'select',
        options: [{ v: 'with_friction', l: 'Sürtünmeli (Fs Oku Var)' }, { v: 'frictionless', l: 'Sürtünmesiz (Fs = 0)' }]
      },
      { key: 'showComponents', label: 'Ağırlık Bileşenlerini Göster (mg·sinα, mg·cosα)', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Eğik Düzlem Kama Geometrisi -->
        <polygon points="60,280 440,280 440,90" fill="#e2e8f0" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Açı α Yay Çizimi -->
        <path d="M 120 280 A 60 60 0 0 0 110 255" fill="none" stroke="#dc2626" stroke-width="2" />
        <text x="130" y="272" font-size="12" font-weight="bold" fill="#dc2626">α = ${escSvg(p.angleAlpha)}</text>

        <!-- Düzlem Üzerindeki Blok (Döndürülmüş Koordinat Sistemi: ~26.5 derece) -->
        <g transform="translate(250, 185) rotate(-26.5)">
          <rect x="-35" y="-45" width="70" height="45" rx="4" fill="#cbd5e1" stroke="#0f172a" stroke-width="2" />
          <text x="0" y="-20" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(p.massLabel)}</text>

          <!-- Normal Tepki Kuvveti (N) -->
          <line x1="0" y1="-45" x2="0" y2="-95" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="0,-100 -4,-90 4,-90" fill="#2563eb" />
          <text x="-8" y="-98" font-size="11" font-weight="bold" fill="#2563eb">N</text>

          <!-- Sürtünme Kuvveti (Fs) -->
          ${p.frictionState === 'with_friction' ? `
            <line x1="35" y1="-2" x2="85" y2="-2" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" />
            <polygon points="90,-2 80,-6 80,2" fill="#d97706" />
            <text x="96" y="2" font-size="11" font-weight="bold" fill="#d97706">Fs</text>
          ` : ''}

          <!-- mg sinα (Aşağı Doğru Çeken Kuvvet) -->
          ${p.showComponents ? `
            <line x1="-35" y1="-2" x2="-85" y2="-2" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" />
            <polygon points="-90,-2 -80,-6 -80,2" fill="#dc2626" />
            <text x="-95" y="2" text-anchor="end" font-size="11" font-weight="bold" fill="#dc2626">mg · sinα</text>
          ` : ''}
        </g>

        <!-- Gerçek Düşey Ağırlık Vektörü (G = mg) -->
        <g transform="translate(250, 185)">
          <line x1="0" y1="0" x2="0" y2="70" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
          <polygon points="0,78 -5,66 5,66" fill="#0f172a" />
          <text x="10" y="74" font-size="12" font-weight="bold" fill="#0f172a">G = m·g</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 6. MANYETİK ALAN & İNDÜKSİYON (SAĞ EL KURALI)
  // --------------------------------------------------------------------------
  magneticField: {
    id: 'magneticField',
    category: 'fizik',
    name: 'Manyetik Alan & Sağ El Kuralı (B, I, F)',
    tags: ['AYT', 'Manyetizma', 'Sağ El Kuralı', 'Lorentz', 'Manyetik Kuvvet'],
    desc: 'Manyetik alan çizgileri (B), akım geçen düz tel (I) ve etkiyen manyetik kuvvet (F = B·I·L·sinθ).',
    defaultParams: {
      title: 'Manyetik Alandaki Akım Taşıyan Tele Etkiyen Kuvvet',
      bFieldLabel: 'B (Manyetik Alan)',
      currentLabel: 'I = 4 A',
      forceLabel: 'F = B · I · L',
      bDirection: 'into_page' // 'into_page' (çarpı) | 'out_of_page' (nokta) | 'right'
    },
    presets: [
      {
        name: 'AYT - Sayfa Düzlemine Dik Manyetik Alan (Çarpı: ⊗)',
        params: {
          title: 'Sayfa Düzleminden İçeri Doğru Düzgün B Alanı',
          bFieldLabel: 'B (İçeri ⊗)',
          currentLabel: 'I',
          forceLabel: 'F (Manyetik Kuvvet)',
          bDirection: 'into_page'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'bFieldLabel', label: 'Manyetik Alan Etiketi', type: 'text' },
      { key: 'currentLabel', label: 'Akım Etiketi (I)', type: 'text' },
      { key: 'forceLabel', label: 'Manyetik Kuvvet Etiketi (F)', type: 'text' },
      {
        key: 'bDirection',
        label: 'Manyetik Alan Yönü',
        type: 'select',
        options: [
          { v: 'into_page', l: 'Sayfa Düzleminden İçeri (⊗)' },
          { v: 'out_of_page', l: 'Sayfa Düzleminden Dışarı (⊙)' }
        ]
      }
    ],
    renderSvg(p) {
      const isInto = p.bDirection === 'into_page';

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Düzgün Manyetik Alan Bölgesi (Kutusu) -->
        <rect x="80" y="60" width="380" height="230" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.8" />
        <text x="95" y="85" font-size="12" font-weight="bold" fill="#166534">${escSvg(p.bFieldLabel)}</text>

        <!-- Manyetik Alan Sembolleri Matrisi -->
        <g stroke="#16a34a" stroke-width="1.6">
      `;

      for (let rx = 140; rx <= 420; rx += 70) {
        for (let ry = 95; ry <= 260; ry += 55) {
          if (isInto) {
            // Çarpı (Sayfadan içeri)
            svg += `
              <circle cx="${rx}" cy="${ry}" r="9" fill="#ffffff" />
              <line x1="${rx - 5}" y1="${ry - 5}" x2="${rx + 5}" y2="${ry + 5}" />
              <line x1="${rx + 5}" y1="${ry - 5}" x2="${rx - 5}" y2="${ry + 5}" />
            `;
          } else {
            // Nokta (Sayfadan dışarı)
            svg += `
              <circle cx="${rx}" cy="${ry}" r="9" fill="#ffffff" />
              <circle cx="${rx}" cy="${ry}" r="2.5" fill="#16a34a" />
            `;
          }
        }
      }

      svg += `</g>`;

      // Akım Geçen Düz İletken Tel (Yatay veya Düşey)
      svg += `
        <!-- İletken Tel -->
        <line x1="120" y1="180" x2="420" y2="180" stroke="#0f172a" stroke-width="5" stroke-linecap="round" />
        <!-- Akım Oku -->
        <polygon points="432,180 416,173 416,187" fill="#0f172a" />
        <text x="440" y="184" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.currentLabel)}</text>

        <!-- Manyetik Kuvvet Oku (F) -> Sağ El Kuralı: Başparmak akım (+x), Dört parmak içeri, Avuç içi yukarı (+y) -->
        <g transform="translate(270, 180)">
          <line x1="0" y1="0" x2="0" y2="-75" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
          <polygon points="0,-85 -6,-72 6,-72" fill="#dc2626" />
          <text x="12" y="-72" font-size="13" font-weight="bold" fill="#dc2626">${escSvg(p.forceLabel)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 7. ISI - SICAKLIK HAL DEĞİŞİM GRAFİĞİ
  // --------------------------------------------------------------------------
  thermalHeatGraph: {
    id: 'thermalHeatGraph',
    category: 'fizik',
    name: 'Isı - Sıcaklık Hal Değişim Grafiği',
    tags: ['TYT', 'Isı', 'Sıcaklık', 'Hal Değişimi', 'Erime', 'Kaynama'],
    desc: 'Sıcaklık (T) - Verilen Isı (Q) grafiği; katı, erime, sıvı, kaynama ve gaz fazları.',
    defaultParams: {
      title: 'Saf Maddenin Sıcaklık - Isı Grafiği',
      tMelt: '0 °C (Erime)',
      tBoil: '100 °C (Kaynama)',
      q1: 'Q₁',
      q2: 'Q₂',
      q3: 'Q₃'
    },
    presets: [
      {
        name: 'TYT - Saf Suyun Isınma ve Hal Değişimi (Buz -> Su -> Buhar)',
        params: {
          title: '1 Atm Basınçta Buzun Su ve Buhara Dönüşümü',
          tMelt: '0 °C (Erime Noktası)',
          tBoil: '100 °C (Kaynama Noktası)',
          q1: 'Q₁',
          q2: 'Q₂',
          q3: 'Q₃'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Grafik Başlığı', type: 'text' },
      { key: 'tMelt', label: 'Erime Sıcaklığı', type: 'text' },
      { key: 'tBoil', label: 'Kaynama Sıcaklığı', type: 'text' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Eksenler -->
        <g stroke="#0f172a" stroke-width="2">
          <!-- Sıcaklık Ekseni (T) -->
          <line x1="80" y1="280" x2="80" y2="45" />
          <polygon points="80,38 75,50 85,50" fill="#0f172a" />
          <text x="70" y="42" text-anchor="end" font-size="12" font-weight="bold">Sıcaklık (T)</text>

          <!-- Isı Ekseni (Q) -->
          <line x1="80" y1="280" x2="490" y2="280" />
          <polygon points="498,280 486,275 486,285" fill="#0f172a" />
          <text x="495" y="298" font-size="12" font-weight="bold">Verilen Isı (Q)</text>
        </g>

        <!-- Hal Değişimi Eğrisi -->
        <!-- 1. Katı Isınma (80,260 -> 140,210) -->
        <!-- 2. Erime Platrosu (140,210 -> 220,210) -->
        <!-- 3. Sıvı Isınma (220,210 -> 300,120) -->
        <!-- 4. Kaynama Platosu (300,120 -> 400,120) -->
        <!-- 5. Gaz Isınma (400,120 -> 460,70) -->
        <path d="M 80 260 L 140 210 L 220 210 L 300 120 L 400 120 L 460 70" fill="none" stroke="#2563eb" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Erime Noktası Kesikli Çizgisi -->
        <line x1="80" y1="210" x2="220" y2="210" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="72" y="214" text-anchor="end" font-size="10.5" font-weight="bold" fill="#dc2626">${escSvg(p.tMelt)}</text>

        <!-- Kaynama Noktası Kesikli Çizgisi -->
        <line x1="80" y1="120" x2="400" y2="120" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="72" y="124" text-anchor="end" font-size="10.5" font-weight="bold" fill="#dc2626">${escSvg(p.tBoil)}</text>

        <!-- Faz Etiketleri -->
        <text x="100" y="245" font-size="10" font-weight="bold" fill="#64748b">Katı</text>
        <text x="180" y="200" text-anchor="middle" font-size="10" font-weight="bold" fill="#0284c7">Katı + Sıvı (Erime)</text>
        <text x="250" y="170" font-size="10" font-weight="bold" fill="#64748b">Sıvı</text>
        <text x="350" y="110" text-anchor="middle" font-size="10" font-weight="bold" fill="#0284c7">Sıvı + Gaz (Kaynama)</text>
        <text x="440" y="90" font-size="10" font-weight="bold" fill="#64748b">Gaz</text>
      `;

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderResistorBox(x, y, label, val) {
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="-30" y="-14" width="60" height="28" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" />
      <text x="0" y="-18" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>
      ${val ? `<text x="0" y="4" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#2563eb">${escSvg(val)}</text>` : ''}
    </g>
  `;
}


// Module Exports
__exports['PHYS_TEMPLATES'] = PHYS_TEMPLATES;

});

__define('modules/science/chemTemplates.js', function(__exports, __require, __module) {
const { escSvg } = __require('modules/science/overlayEngine.js');

/**
 * Egemen's Testmaker — Kimya Şablon Envanteri (TYT & AYT)
 * Çözünürlük Eğrisi, Galvanik Pil, Titrasyon, Potansiyel Enerji Diyagramı,
 * Manometre / Gaz Yasaları, Molekül Geometrisi (VSEPR), Bohr ve Periyodik Tablo.
 */

const CHEM_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. ÇÖZÜNÜRLÜK - SICAKLIK GRAFİĞİ
  // --------------------------------------------------------------------------
  solubilityCurve: {
    id: 'solubilityCurve',
    category: 'kimya',
    name: 'Çözünürlük - Sıcaklık Grafiği (Doygunluk & Çökelme)',
    tags: ['TYT', 'AYT', 'Çözeltiler', 'Çözünürlük', 'Doygunluk', 'Çökelme'],
    desc: 'Sıcaklık (°C) ile çözünürlük (g / 100 g su) eğrisi; doymuş, doymamış ve aşırı doymuş bölgeler.',
    defaultParams: {
      title: 'X Tuzunun Çözünürlük - Sıcaklık Grafiği',
      saltName: 'X Tuzu (Endotermik)',
      t1Val: '20 °C',
      s1Val: '25 g',
      t2Val: '50 °C',
      s2Val: '60 g',
      showPoints: true
    },
    presets: [
      {
        name: 'AYT - Endotermik Çözünen X Tuzu (Isı Alan)',
        params: {
          title: 'X Maddesinin Sudaki Çözünürlük Eğrisi',
          saltName: 'X Tuzu (ΔH > 0)',
          t1Val: '20 °C',
          s1Val: '30 g',
          t2Val: '60 °C',
          s2Val: '75 g',
          showPoints: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Grafik Başlığı', type: 'text' },
      { key: 'saltName', label: 'Tuz / Madde İsmi', type: 'text' },
      { key: 't1Val', label: '1. Sıcaklık Değeri (T₁)', type: 'text' },
      { key: 's1Val', label: '1. Çözünürlük Değeri (Ç₁)', type: 'text' },
      { key: 't2Val', label: '2. Sıcaklık Değeri (T₂)', type: 'text' },
      { key: 's2Val', label: '2. Çözünürlük Değeri (Ç₂)', type: 'text' },
      { key: 'showPoints', label: 'Doygunluk Noktalarını İşaretle', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Eksenler -->
        <g stroke="#0f172a" stroke-width="2">
          <!-- Y Ekseni: Çözünürlük (g / 100 g su) -->
          <line x1="85" y1="280" x2="85" y2="45" />
          <polygon points="85,38 80,50 90,50" fill="#0f172a" />
          <text x="75" y="42" text-anchor="end" font-size="11" font-weight="bold">Çözünürlük (g / 100 g su)</text>

          <!-- X Ekseni: Sıcaklık (°C) -->
          <line x1="85" y1="280" x2="490" y2="280" />
          <polygon points="498,280 486,275 486,285" fill="#0f172a" />
          <text x="495" y="300" font-size="12" font-weight="bold">Sıcaklık (°C)</text>
        </g>

        <!-- Çözünürlük Eğrisi (Endotermik Yay) -->
        <path d="M 85 240 C 180 230 280 180 450 80" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" />
        <text x="455" y="80" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.saltName)}</text>

        <!-- 1. Nokta Kesişim Çizgileri -->
        <g stroke="#dc2626" stroke-width="1.4" stroke-dasharray="4,4">
          <line x1="85" y1="200" x2="210" y2="200" />
          <line x1="210" y1="200" x2="210" y2="280" />
          <circle cx="210" cy="200" r="4.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
          <text x="75" y="204" text-anchor="end" font-size="11" font-weight="bold" fill="#dc2626" stroke="none">${escSvg(p.s1Val)}</text>
          <text x="210" y="296" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626" stroke="none">${escSvg(p.t1Val)}</text>
        </g>

        <!-- 2. Nokta Kesişim Çizgileri -->
        <g stroke="#059669" stroke-width="1.4" stroke-dasharray="4,4">
          <line x1="85" y1="120" x2="380" y2="120" />
          <line x1="380" y1="120" x2="380" y2="280" />
          <circle cx="380" cy="120" r="4.5" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
          <text x="75" y="124" text-anchor="end" font-size="11" font-weight="bold" fill="#059669" stroke="none">${escSvg(p.s2Val)}</text>
          <text x="380" y="296" text-anchor="middle" font-size="11" font-weight="bold" fill="#059669" stroke="none">${escSvg(p.t2Val)}</text>
        </g>

        <!-- Doymuş / Doymamış Alan Açıklamaları -->
        <g font-size="10.5" font-weight="bold">
          <text x="160" y="140" fill="#9333ea">• Aşırı Doymuş Bölge</text>
          <text x="300" y="170" fill="#2563eb">• Eğri Üzeri (Doymuş Çözelti)</text>
          <text x="320" y="240" fill="#d97706">• Doymamış Bölge</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. ELEKTROKİMYASAL PİL (GALVANİK DANIEL HÜCRESİ)
  // --------------------------------------------------------------------------
  galvanicCell: {
    id: 'galvanicCell',
    category: 'kimya',
    name: 'Elektrokimyasal Galvanik Pil (Daniell Hücresi)',
    tags: ['AYT', 'Elektrokimya', 'Pil', 'Anot', 'Katot', 'Tuz Köprüsü'],
    desc: 'Anot ve katot kapları, elektrotlar (Zn/Cu), tuz köprüsü, voltmetre ve dış devrede elektron akış yönü.',
    defaultParams: {
      title: 'Zn - Cu Galvanik Pili (E°pil = 1.10 V)',
      anodeMetal: 'Zn (Anot)',
      cathodeMetal: 'Cu (Katot)',
      vRead: '1.10 V',
      showElectronFlow: true
    },
    presets: [
      {
        name: 'AYT Standart Daniell Pili (Zn - Cu)',
        params: {
          title: 'Zn - Cu Standart Elektrokimyasal Pili',
          anodeMetal: 'Zn (Anot)',
          cathodeMetal: 'Cu (Katot)',
          vRead: '1.10 V',
          showElectronFlow: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'anodeMetal', label: 'Anot Elektrot Metal / İsmi', type: 'text' },
      { key: 'cathodeMetal', label: 'Katot Elektrot Metal / İsmi', type: 'text' },
      { key: 'vRead', label: 'Voltmetre Değeri', type: 'text' },
      { key: 'showElectronFlow', label: 'Elektron Akış Okunu Göster (e⁻)', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="360" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- 1. Kap (Anot Beheri - Sol) -->
        <rect x="70" y="160" width="140" height="150" rx="8" fill="#f0fdf4" stroke="#0f172a" stroke-width="2.5" />
        <!-- Çözelti Seviyesi -->
        <rect x="72" y="210" width="136" height="98" fill="#dcfce7" opacity="0.8" />
        <text x="140" y="275" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">1 M Zn²⁺(suda)</text>

        <!-- 2. Kap (Katot Beheri - Sağ) -->
        <rect x="330" y="160" width="140" height="150" rx="8" fill="#eff6ff" stroke="#0f172a" stroke-width="2.5" />
        <!-- Çözelti Seviyesi -->
        <rect x="332" y="210" width="136" height="98" fill="#dbeafe" opacity="0.8" />
        <text x="400" y="275" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e40af">1 M Cu²⁺(suda)</text>

        <!-- Anot Elektrodu (Zn Çubuğu) -->
        <rect x="125" y="110" width="28" height="150" rx="3" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
        <text x="139" y="100" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.anodeMetal)}</text>

        <!-- Katot Elektrodu (Cu Çubuğu) -->
        <rect x="385" y="110" width="28" height="150" rx="3" fill="#fed7aa" stroke="#c2410c" stroke-width="2" />
        <text x="399" y="100" text-anchor="middle" font-size="12" font-weight="bold" fill="#c2410c">${escSvg(p.cathodeMetal)}</text>

        <!-- Tuz Köprüsü (Ters U Borusu) -->
        <path d="M 175 230 L 175 140 C 175 125 365 125 365 140 L 365 230" fill="none" stroke="#fef08a" stroke-width="24" stroke-linecap="round" />
        <path d="M 175 230 L 175 140 C 175 125 365 125 365 140 L 365 230" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
        <text x="270" y="138" text-anchor="middle" font-size="11" font-weight="bold" fill="#854d0e">Tuz Köprüsü (KNO₃)</text>

        <!-- Dış Devre İletken Teli ve Voltmetre -->
        <g stroke="#0f172a" stroke-width="2.5" fill="none">
          <line x1="139" y1="110" x2="139" y2="55" />
          <line x1="139" y1="55" x2="245" y2="55" />
          <line x1="295" y1="55" x2="399" y2="55" />
          <line x1="399" y1="55" x2="399" y2="110" />
        </g>

        <!-- Voltmetre -->
        <circle cx="270" cy="55" r="22" fill="#ffffff" stroke="#2563eb" stroke-width="2.5" />
        <text x="270" y="52" text-anchor="middle" font-size="10" font-weight="bold" fill="#64748b">V</text>
        <text x="270" y="66" text-anchor="middle" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.vRead)}</text>

        <!-- Elektron Akış Yönü Oku (Anot -> Katot) -->
        ${p.showElectronFlow ? `
          <g transform="translate(190, 45)">
            <line x1="0" y1="0" x2="40" y2="0" stroke="#dc2626" stroke-width="2.5" />
            <polygon points="48,0 36,-4 36,4" fill="#dc2626" />
            <text x="20" y="-8" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626">e⁻ Akışı</text>
          </g>
        ` : ''}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. ASİT - BAZ TİTRASYONU & EŞDEĞERLİK NOKTASI
  // --------------------------------------------------------------------------
  acidBaseTitration: {
    id: 'acidBaseTitration',
    category: 'kimya',
    name: 'Asit - Baz Titrasyonu & pH Eğrisi',
    tags: ['AYT', 'Asit-Baz', 'Titrasyon', 'Büret', 'Eşdeğerlik', 'pH'],
    desc: 'Kuvvetli asit - kuvvetli baz titrasyon eğrisi (pH - Eklenen Baz Hacmi), eşdeğerlik noktası (pH = 7).',
    defaultParams: {
      title: 'Kuvvetli Asit - Kuvvetli Baz Titrasyon Eğrisi',
      acidFormula: 'HCl (0.1 M, 25 mL)',
      baseFormula: 'NaOH (0.1 M)',
      veqLabel: 'V_eş = 25 mL',
      startPh: 'pH = 1',
      showEquivalenceLine: true
    },
    presets: [
      {
        name: 'AYT Standart Titrasyon (HCl + NaOH -> NaCl + H2O)',
        params: {
          title: '0.1 M 25 mL HCl Çözeltisinin 0.1 M NaOH ile Titrasyonu',
          acidFormula: 'HCl',
          baseFormula: 'NaOH',
          veqLabel: '25 mL (Eşdeğerlik)',
          startPh: 'pH = 1',
          showEquivalenceLine: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Grafik Başlığı', type: 'text' },
      { key: 'acidFormula', label: 'Titrasyon Asidi', type: 'text' },
      { key: 'baseFormula', label: 'Eklenen Baz Çözeltisi', type: 'text' },
      { key: 'veqLabel', label: 'Eşdeğerlik Hacmi Etiketi', type: 'text' },
      { key: 'showEquivalenceLine', label: 'pH = 7 Eşdeğerlik Çizgisini Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Eksenler -->
        <g stroke="#0f172a" stroke-width="2">
          <!-- Y Ekseni (pH: 0 - 14) -->
          <line x1="80" y1="280" x2="80" y2="50" />
          <polygon points="80,42 75,54 85,54" fill="#0f172a" />
          <text x="70" y="48" text-anchor="end" font-size="12" font-weight="bold">pH</text>

          <!-- X Ekseni (Eklenen Baz Hacmi V mL) -->
          <line x1="80" y1="280" x2="480" y2="280" />
          <polygon points="488,280 476,275 476,285" fill="#0f172a" />
          <text x="485" y="300" font-size="11" font-weight="bold">Eklenen Baz Hacmi (mL)</text>
        </g>

        <!-- Titrasyon S Eğrisi -->
        <!-- pH=1 (80, 260) -> pH=3 (220, 240) -> Dik Sıçrama pH=7 (260, 165) -> pH=11 (300, 90) -> pH=13 (440, 75) -->
        <path d="M 80 260 C 180 255 240 240 255 190 L 265 140 C 280 90 340 75 440 75" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" />

        <!-- Eşdeğerlik Noktası (pH = 7) -->
        ${p.showEquivalenceLine ? `
          <g stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4,4">
            <line x1="80" y1="165" x2="260" y2="165" />
            <line x1="260" y1="165" x2="260" y2="280" />
            <circle cx="260" cy="165" r="5" fill="#16a34a" stroke="#ffffff" stroke-width="2" />
            <text x="72" y="169" text-anchor="end" font-size="11" font-weight="bold" fill="#16a34a" stroke="none">pH = 7</text>
            <text x="260" y="296" text-anchor="middle" font-size="11" font-weight="bold" fill="#16a34a" stroke="none">${escSvg(p.veqLabel)}</text>
            <text x="275" y="165" font-size="11" font-weight="bold" fill="#16a34a" stroke="none">Dönüm Noktası</text>
          </g>
        ` : ''}

        <!-- Başlangıç pH=1 -->
        <text x="72" y="264" text-anchor="end" font-size="11" font-weight="bold" fill="#dc2626">${escSvg(p.startPh)}</text>
        <text x="72" y="79" text-anchor="end" font-size="11" font-weight="bold" fill="#2563eb">pH = 13</text>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 4. TEPKİME HIZI & POTANSİYEL ENERJİ GRAFİĞİ
  // --------------------------------------------------------------------------
  potentialEnergyDiagram: {
    id: 'potentialEnergyDiagram',
    category: 'kimya',
    name: 'Potansiyel Enerji - Tepkime Koordinatı (ΔH, Ea)',
    tags: ['AYT', 'Tepkime Hızı', 'Aktifleşme Enerjisi', 'Entalpi', 'Katalizör'],
    desc: 'Girenler, ürünler, aktifleşmiş kompleks, ileri aktifleşme enerjisi (Eai), geri aktifleşme (Eag) ve tepkime ısısı (ΔH).',
    defaultParams: {
      title: 'Tepkimenin Potansiyel Enerji - Tepkime Koordinatı Grafiği',
      reactionType: 'exothermic', // 'exothermic' (ΔH < 0) | 'endothermic' (ΔH > 0)
      showCatalyst: true,
      eaiLabel: 'Ea_i',
      deltaHLabel: 'ΔH < 0'
    },
    presets: [
      {
        name: 'AYT - Ekzotermik Tepkime & Katalizör Etkisi (ΔH < 0)',
        params: {
          title: 'Ekzotermik Tepkimede Katalizörün Eai\'ye Etkisi',
          reactionType: 'exothermic',
          showCatalyst: true,
          eaiLabel: 'Ea_i = 60 kJ',
          deltaHLabel: 'ΔH = -40 kJ'
        }
      },
      {
        name: 'AYT - Endotermik Tepkime (ΔH > 0)',
        params: {
          title: 'Endotermik Tepkime Grafiği (Ürünler > Girenler)',
          reactionType: 'endothermic',
          showCatalyst: false,
          eaiLabel: 'Ea_i',
          deltaHLabel: 'ΔH > 0'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Grafik Başlığı', type: 'text' },
      {
        key: 'reactionType',
        label: 'Tepkime Türü',
        type: 'select',
        options: [{ v: 'exothermic', l: 'Ekzotermik (Isı Veren: ΔH < 0)' }, { v: 'endothermic', l: 'Endotermik (Isı Alan: ΔH > 0)' }]
      },
      { key: 'showCatalyst', label: 'Katalizörlü Eğriyi Göster (Kesikli Tepe)', type: 'checkbox' },
      { key: 'eaiLabel', label: 'İleri Aktifleşme Enerjisi Etiketi', type: 'text' },
      { key: 'deltaHLabel', label: 'Tepkime Isısı Etiketi (ΔH)', type: 'text' }
    ],
    renderSvg(p) {
      const isExo = p.reactionType === 'exothermic';
      const reactantsY = 200;
      const peakY = 80;
      const productsY = isExo ? 240 : 150;
      const catalystPeakY = 120;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Eksenler -->
        <g stroke="#0f172a" stroke-width="2">
          <!-- Potansiyel Enerji (PE) -->
          <line x1="80" y1="280" x2="80" y2="45" />
          <polygon points="80,38 75,50 85,50" fill="#0f172a" />
          <text x="70" y="45" text-anchor="end" font-size="11" font-weight="bold">Potansiyel Enerji (PE)</text>

          <!-- Tepkime Koordinatı (TK) -->
          <line x1="80" y1="280" x2="480" y2="280" />
          <polygon points="488,280 476,275 476,285" fill="#0f172a" />
          <text x="485" y="300" font-size="11" font-weight="bold">Tepkime Koordinatı</text>
        </g>

        <!-- Katalizörsüz Ana Eğri -->
        <path d="M 80 ${reactantsY} L 160 ${reactantsY} C 210 ${reactantsY} 230 ${peakY} 270 ${peakY} C 310 ${peakY} 330 ${productsY} 380 ${productsY} L 460 ${productsY}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />

        <!-- Katalizörlü Eğri (Daha Düşük Tepe) -->
        ${p.showCatalyst ? `
          <path d="M 160 ${reactantsY} C 210 ${reactantsY} 230 ${catalystPeakY} 270 ${catalystPeakY} C 310 ${catalystPeakY} 330 ${productsY} 380 ${productsY}" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4" />
          <text x="270" y="${catalystPeakY - 8}" text-anchor="middle" font-size="10" font-weight="bold" fill="#dc2626">Katalizörlü</text>
        ` : ''}

        <!-- Girenler ve Ürünler Etiketleri -->
        <text x="120" y="${reactantsY - 8}" font-size="11" font-weight="bold" fill="#0f172a">Girenler</text>
        <text x="420" y="${productsY - 8}" font-size="11" font-weight="bold" fill="#0f172a">Ürünler</text>

        <!-- Eai (İleri Aktifleşme Enerjisi Çizgisi) -->
        <g stroke="#d97706" stroke-width="1.8">
          <line x1="270" y1="${reactantsY}" x2="270" y2="${peakY}" stroke-dasharray="3,3" />
          <line x1="180" y1="${peakY}" x2="270" y2="${peakY}" stroke-dasharray="3,3" />
          <text x="255" y="${(reactantsY + peakY) / 2}" text-anchor="end" font-size="11" font-weight="bold" fill="#d97706">${escSvg(p.eaiLabel)}</text>
        </g>

        <!-- ΔH (Tepkime Isısı Farkı) -->
        <g stroke="#16a34a" stroke-width="1.8">
          <line x1="380" y1="${reactantsY}" x2="460" y2="${reactantsY}" stroke-dasharray="3,3" />
          <line x1="440" y1="${reactantsY}" x2="440" y2="${productsY}" />
          <text x="450" y="${(reactantsY + productsY) / 2 + 4}" font-size="11" font-weight="bold" fill="#16a34a">${escSvg(p.deltaHLabel)}</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 5. GAZ YASALARI & MANOMETRE / PİSTONLU KAP
  // --------------------------------------------------------------------------
  gasLawsManometer: {
    id: 'gasLawsManometer',
    category: 'kimya',
    name: 'Gaz Yasaları & Açık Uçlu Manometre',
    tags: ['AYT', 'Gazlar', 'Manometre', 'Açık Hava Basıncı', 'Piston'],
    desc: 'U borulu cıva manometresi; Pgaz = P0 ± h basınç dengesi veya hareketli sürtünmesiz pistonlu kap.',
    defaultParams: {
      title: 'Açık Uçlu Manometrede Gaz Basıncı Dengesi',
      gasName: 'He Gazı',
      p0Label: 'P₀ = 76 cm-Hg',
      hDiff: 'h = 10 cm',
      liquidLevel: 'higher_right' // 'higher_right' (Pgaz > P0) | 'higher_left' (Pgaz < P0) | 'equal'
    },
    presets: [
      {
        name: 'AYT - Gaz Basıncı Açık Hava Basıncından Büyük (Pgaz = P0 + h)',
        params: {
          title: 'Açık Uçlu Manometre (P_gaz = P₀ + h)',
          gasName: 'X Gazı',
          p0Label: 'P₀ = 75 cmHg',
          hDiff: 'h = 15 cm',
          liquidLevel: 'higher_right'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'gasName', label: 'Tüp İçi Gaz İsmi', type: 'text' },
      { key: 'p0Label', label: 'Açık Hava Basıncı (P₀)', type: 'text' },
      { key: 'hDiff', label: 'Cıva Seviye Farkı (h)', type: 'text' },
      {
        key: 'liquidLevel',
        label: 'Cıva Denge Seviyesi',
        type: 'select',
        options: [
          { v: 'higher_right', l: 'Sağ Kol Yüksekte (P_gaz = P₀ + h)' },
          { v: 'higher_left', l: 'Sol Kol Yüksekte (P_gaz = P₀ - h)' },
          { v: 'equal', l: 'Eşit Seviyede (P_gaz = P₀)' }
        ]
      }
    ],
    renderSvg(p) {
      const isRight = p.liquidLevel === 'higher_right';
      const isLeft = p.liquidLevel === 'higher_left';
      const leftY = isRight ? 210 : (isLeft ? 150 : 180);
      const rightY = isRight ? 150 : (isLeft ? 210 : 180);

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 350" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="350" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Gaz Balonu (Sol Hazne) -->
        <g id="gasChamber">
          <circle cx="150" cy="180" r="55" fill="#f0fdf4" stroke="#0f172a" stroke-width="2.5" />
          <text x="150" y="175" text-anchor="middle" font-size="13" font-weight="bold" fill="#166534">${escSvg(p.gasName)}</text>
          <text x="150" y="195" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">P_gaz = ?</text>
          <!-- Bağlantı Borusu -->
          <rect x="203" y="172" width="60" height="16" fill="#f0fdf4" stroke="#0f172a" stroke-width="2.5" />
        </g>

        <!-- U Borusu Manometre -->
        <!-- Sol Kol Dikey, Taban, Sağ Kol Dikey -->
        <g stroke="#0f172a" stroke-width="2.5" fill="none">
          <path d="M 260 172 L 260 280 C 260 300 360 300 360 280 L 360 80" />
          <path d="M 276 188 L 276 275 C 276 288 344 288 344 275 L 344 80" />
        </g>

        <!-- Cıva Dolgusu (Hg) -->
        <path d="
          M 260 ${leftY} L 276 ${leftY}
          L 276 275 C 276 288 344 288 344 275
          L 344 ${rightY} L 360 ${rightY}
          L 360 280 C 360 300 260 300 260 280 Z
        " fill="#94a3b8" stroke="#475569" stroke-width="1" />

        <!-- Cıva Seviye Farkı h Çizgileri -->
        ${isRight ? `
          <g stroke="#dc2626" stroke-width="1.5">
            <line x1="276" y1="${leftY}" x2="380" y2="${leftY}" stroke-dasharray="3,3" />
            <line x1="344" y1="${rightY}" x2="380" y2="${rightY}" stroke-dasharray="3,3" />
            <line x1="375" y1="${leftY}" x2="375" y2="${rightY}" />
            <text x="385" y="${(leftY + rightY) / 2 + 4}" font-size="11" font-weight="bold" fill="#dc2626">${escSvg(p.hDiff)}</text>
          </g>
        ` : ''}

        <!-- Açık Uç ve P0 Oku -->
        <g transform="translate(352, 65)">
          <line x1="0" y1="0" x2="0" y2="25" stroke="#2563eb" stroke-width="2.5" />
          <polygon points="0,32 -4,20 4,20" fill="#2563eb" />
          <text x="0" y="-8" text-anchor="middle" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.p0Label)}</text>
        </g>

        <!-- Basınç Denklem Notu -->
        <g transform="translate(30, 290)">
          <rect x="0" y="0" width="180" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
          <text x="90" y="22" text-anchor="middle" font-size="12" font-style="italic" font-weight="bold" fill="#0f172a">
            ${isRight ? 'P_gaz = P₀ + h' : (isLeft ? 'P_gaz = P₀ - h' : 'P_gaz = P₀')}
          </text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 6. MOLEKÜL GEOMETRİSİ (VSEPR & BAĞ AÇILARI)
  // --------------------------------------------------------------------------
  molecularGeometry: {
    id: 'molecularGeometry',
    category: 'kimya',
    name: 'Molekül Geometrisi & VSEPR Modeli',
    tags: ['AYT', 'VSEPR', 'Hibritleşme', 'Bağ Açısı', 'Molekül Geometrisi'],
    desc: 'AX2 Doğrusal (180°), AX3 Düzlem Üçgen (120°), AX4 Düzgün Dörtyüzlü (109.5°), AX3E Üçgen Piramit (107°), AX2E2 Kırık Doğru (104.5°).',
    defaultParams: {
      geoShape: 'tetrahedral', // 'linear' | 'trigonal_planar' | 'tetrahedral' | 'trigonal_pyramidal' | 'bent'
      centralAtom: 'C',
      ligandAtom: 'H',
      showAngle: true
    },
    presets: [
      {
        name: 'Metan (CH4) - Düzgün Dörtyüzlü (sp3, 109.5°)',
        params: { geoShape: 'tetrahedral', centralAtom: 'C', ligandAtom: 'H', showAngle: true }
      },
      {
        name: 'Amonyak (NH3) - Üçgen Piramit (sp3, 107°)',
        params: { geoShape: 'trigonal_pyramidal', centralAtom: 'N', ligandAtom: 'H', showAngle: true }
      },
      {
        name: 'Su (H2O) - Kırık Doğru / Açısal (sp3, 104.5°)',
        params: { geoShape: 'bent', centralAtom: 'O', ligandAtom: 'H', showAngle: true }
      },
      {
        name: 'Karbondioksit (CO2) - Doğrusal (sp, 180°)',
        params: { geoShape: 'linear', centralAtom: 'C', ligandAtom: 'O', showAngle: true }
      }
    ],
    schema: [
      {
        key: 'geoShape',
        label: 'VSEPR Geometrisi',
        type: 'select',
        options: [
          { v: 'tetrahedral', l: 'Düzgün Dörtyüzlü (AX4, 109.5°)' },
          { v: 'trigonal_pyramidal', l: 'Üçgen Piramit (AX3E, 107°)' },
          { v: 'bent', l: 'Kırık Doğru / Açısal (AX2E2, 104.5°)' },
          { v: 'trigonal_planar', l: 'Düzlem Üçgen (AX3, 120°)' },
          { v: 'linear', l: 'Doğrusal (AX2, 180°)' }
        ]
      },
      { key: 'centralAtom', label: 'Merkez Atom (A)', type: 'text' },
      { key: 'ligandAtom', label: 'Bağlı Atomlar (X)', type: 'text' },
      { key: 'showAngle', label: 'Bağ Açısını Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const cx = 270;
      const cy = 180;
      let angleText = '109.5°';
      let vseprCode = 'AX₄ (sp³)';

      if (p.geoShape === 'linear') { angleText = '180°'; vseprCode = 'AX₂ (sp)'; }
      else if (p.geoShape === 'trigonal_planar') { angleText = '120°'; vseprCode = 'AX₃ (sp²)'; }
      else if (p.geoShape === 'trigonal_pyramidal') { angleText = '107°'; vseprCode = 'AX₃E (sp³)'; }
      else if (p.geoShape === 'bent') { angleText = '104.5°'; vseprCode = 'AX₂E₂ (sp³)'; }

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">VSEPR Molekül Geometrisi: ${vseprCode}</text>

        <!-- Bağlar ve Ligandlar -->
        <g stroke="#0f172a" stroke-width="3">
      `;

      if (p.geoShape === 'linear') {
        svg += `
          <line x1="${cx - 90}" y1="${cy}" x2="${cx + 90}" y2="${cy}" />
          ${renderAtom(cx - 90, cy, p.ligandAtom, '#38bdf8')}
          ${renderAtom(cx + 90, cy, p.ligandAtom, '#38bdf8')}
          <!-- Açı Yayı -->
          <path d="M ${cx - 30} ${cy} A 30 30 0 0 1 ${cx + 30} ${cy}" fill="none" stroke="#dc2626" stroke-width="2" />
          <text x="${cx}" y="${cy - 36}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">${angleText}</text>
        `;
      } else if (p.geoShape === 'bent') {
        svg += `
          <line x1="${cx}" y1="${cy}" x2="${cx - 75}" y2="${cy + 65}" />
          <line x1="${cx}" y1="${cy}" x2="${cx + 75}" y2="${cy + 65}" />
          ${renderAtom(cx - 75, cy + 65, p.ligandAtom, '#38bdf8')}
          ${renderAtom(cx + 75, cy + 65, p.ligandAtom, '#38bdf8')}
          <!-- Ortaklanmamış Elektron Çiftleri (Kulaklar) -->
          <ellipse cx="${cx - 20}" cy="${cy - 35}" rx="8" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" transform="rotate(-30, ${cx - 20}, ${cy - 35})" />
          <ellipse cx="${cx + 20}" cy="${cy - 35}" rx="8" ry="16" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" transform="rotate(30, ${cx + 20}, ${cy - 35})" />
          <text x="${cx}" y="${cy + 45}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">${angleText}</text>
        `;
      } else {
        // Tetrahedral / Piramit
        svg += `
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 85}" />
          <line x1="${cx}" y1="${cy}" x2="${cx - 75}" y2="${cy + 65}" />
          <line x1="${cx}" y1="${cy}" x2="${cx + 75}" y2="${cy + 65}" />
          <line x1="${cx}" y1="${cy}" x2="${cx + 25}" y2="${cy + 75}" stroke-width="6" stroke-linecap="round" />
          ${renderAtom(cx, cy - 85, p.ligandAtom, '#38bdf8')}
          ${renderAtom(cx - 75, cy + 65, p.ligandAtom, '#38bdf8')}
          ${renderAtom(cx + 75, cy + 65, p.ligandAtom, '#38bdf8')}
          ${renderAtom(cx + 25, cy + 75, p.ligandAtom, '#38bdf8')}
          <text x="${cx - 35}" y="${cy + 15}" font-size="12" font-weight="bold" fill="#dc2626">${angleText}</text>
        `;
      }

      svg += `</g>`;

      // Merkez Atom
      svg += renderAtom(cx, cy, p.centralAtom, '#f59e0b', 24);

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderAtom(x, y, symbol, fill, r = 18) {
  return `
    <g transform="translate(${x}, ${y})">
      <circle cx="0" cy="0" r="${r}" fill="${fill}" stroke="#0f172a" stroke-width="2" />
      <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(symbol)}</text>
    </g>
  `;
}


// Module Exports
__exports['CHEM_TEMPLATES'] = CHEM_TEMPLATES;

});

__define('modules/science/bioTemplates.js', function(__exports, __require, __module) {
const { escSvg } = __require('modules/science/overlayEngine.js');

/**
 * Egemen's Testmaker — Biyoloji Şablon Envanteri (TYT & AYT)
 * Sürüklenebilir Hücre Mimarisi & Organeller, Nefron & Boşaltım,
 * Nöron & Sinaps İletimi, Kalp & Dolaşım, Kloroplast / Calvin Döngüsü ve Besin Ağı.
 */

const BIO_TEMPLATES = {
  // --------------------------------------------------------------------------
  // 1. HÜCRE MİMARİSİ (SÜRÜKLENEBİLİR ORGANELLER & DİNAMİK OKLAR)
  // --------------------------------------------------------------------------
  cellStructure: {
    id: 'cellStructure',
    category: 'biyoloji',
    name: 'Hücre Mimarisi & Sürüklenebilir Organeller',
    tags: ['TYT', 'LGS', 'Organeller', 'Hücre', 'Mitokondri', 'Çekirdek'],
    desc: 'Bitki veya hayvan hücresi; organeller (çekirdek, mitokondri, golgi vb.) tuval üzerinde serbestçe sürüklenebilir, ok ve yazılar organeli dinamik takip eder.',
    defaultParams: {
      cellType: 'animal', // 'animal' | 'plant'
      labelStyle: 'roman', // 'roman' | 'letters' | 'names'
      showCellWall: true,
      organelles: {
        nucleus: { active: true, x: 220, y: 175, label: 'I' },
        mitochondria: { active: true, x: 370, y: 130, label: 'II' },
        golgi: { active: true, x: 140, y: 240, label: 'III' },
        vacuole: { active: true, x: 320, y: 235, label: 'IV' },
        chloroplast: { active: false, x: 360, y: 95, label: 'V' },
        ribosome: { active: true, x: 190, y: 105, label: 'VI' },
        centrosome: { active: true, x: 170, y: 205, label: 'VII' }
      }
    },
    presets: [
      {
        name: 'TYT - Hayvan Hücresi (Organeller Sürüklenebilir I-VII)',
        params: {
          cellType: 'animal',
          labelStyle: 'roman',
          showCellWall: false,
          organelles: {
            nucleus: { active: true, x: 220, y: 175, label: 'I' },
            mitochondria: { active: true, x: 370, y: 130, label: 'II' },
            golgi: { active: true, x: 140, y: 240, label: 'III' },
            vacuole: { active: true, x: 320, y: 235, label: 'IV' },
            chloroplast: { active: false, x: 360, y: 95, label: 'V' },
            ribosome: { active: true, x: 190, y: 105, label: 'VI' },
            centrosome: { active: true, x: 170, y: 205, label: 'VII' }
          }
        }
      },
      {
        name: 'TYT - Bitki Hücresi (Kloroplast & Merkezi Koful Aktif)',
        params: {
          cellType: 'plant',
          labelStyle: 'roman',
          showCellWall: true,
          organelles: {
            nucleus: { active: true, x: 170, y: 155, label: 'I' },
            mitochondria: { active: true, x: 130, y: 265, label: 'II' },
            golgi: { active: true, x: 140, y: 90, label: 'III' },
            vacuole: { active: true, x: 330, y: 215, label: 'IV' },
            chloroplast: { active: true, x: 370, y: 100, label: 'V' },
            ribosome: { active: true, x: 240, y: 110, label: 'VI' },
            centrosome: { active: false, x: 170, y: 205, label: 'VII' }
          }
        }
      }
    ],
    schema: [
      {
        key: 'cellType',
        label: 'Hücre Tipi',
        type: 'select',
        options: [
          { v: 'animal', l: 'Hayvan Hücresi (Yuvarlak / Esnek Zar)' },
          { v: 'plant', l: 'Bitki Hücresi (Köşeli / Çeperli)' }
        ]
      },
      {
        key: 'labelStyle',
        label: 'Etiketleme Şekli',
        type: 'select',
        options: [
          { v: 'roman', l: 'Roma Rakamları (I, II, III...)' },
          { v: 'letters', l: 'Harfler (K, L, M...)' },
          { v: 'names', l: 'Organel İsimleri' }
        ]
      }
    ],
    renderSvg(p) {
      const isPlant = p.cellType === 'plant';
      const orgs = p.organelles || {};

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 370" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <defs>
          <radialGradient id="bioCytoGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${isPlant ? '#f0fdf4' : '#eff6ff'}" />
            <stop offset="100%" stop-color="${isPlant ? '#dcfce7' : '#dbeafe'}" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="540" height="370" fill="#ffffff" />
        <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">
          ${isPlant ? 'Bitki Hücresi Mimarisi & Organeller' : 'Hayvan Hücresi Mimarisi & Organeller'}
        </text>
      `;

      // Hücre Çeperi ve Zarı
      if (isPlant) {
        svg += `
          <!-- Hücre Çeperi (Selüloz) -->
          <polygon points="70,45 440,45 485,190 440,335 70,335 30,190" fill="#bbf7d0" stroke="#16a34a" stroke-width="7" stroke-linejoin="round" />
          <!-- Plazma Zarı -->
          <polygon points="76,51 434,51 477,190 434,329 76,329 38,190" fill="url(#bioCytoGrad)" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round" />
        `;
      } else {
        svg += `
          <!-- Hayvan Plazma Zarı -->
          <ellipse cx="260" cy="190" rx="205" ry="145" fill="url(#bioCytoGrad)" stroke="#0284c7" stroke-width="3" />
        `;
      }

      // Sürüklenebilir Organeller
      // 1. Çekirdek (Nucleus)
      if (orgs.nucleus?.active) {
        const nx = orgs.nucleus.x;
        const ny = orgs.nucleus.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="nucleus" transform="translate(${nx},${ny})">
            <circle cx="0" cy="0" r="42" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" />
            <circle cx="0" cy="0" r="15" fill="#c2410c" opacity="0.85" />
            <circle cx="24" cy="0" r="2" fill="#9a3412" />
            <circle cx="-24" cy="0" r="2" fill="#9a3412" />
            <circle cx="0" cy="24" r="2" fill="#9a3412" />
          </g>
          ${renderOrganellePointer(nx, ny - 42, nx, ny - 70, nx - 35, ny - 70, getOrgLabel(orgs.nucleus.label, p.labelStyle, 'Çekirdek'))}
        `;
      }

      // 2. Mitokondri
      if (orgs.mitochondria?.active) {
        const mx = orgs.mitochondria.x;
        const my = orgs.mitochondria.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="mitochondria" transform="translate(${mx},${my}) rotate(-25)">
            <rect x="-35" y="-18" width="70" height="36" rx="18" fill="#fecdd3" stroke="#e11d48" stroke-width="2" />
            <path d="M -22 -10 Q -15 0 -22 10 Q -8 0 -5 -10 Q 5 0 2 10 Q 15 0 12 -10" fill="none" stroke="#be123c" stroke-width="2" />
          </g>
          ${renderOrganellePointer(mx, my, mx + 50, my, mx + 75, my, getOrgLabel(orgs.mitochondria.label, p.labelStyle, 'Mitokondri'))}
        `;
      }

      // 3. Golgi Aygıtı
      if (orgs.golgi?.active) {
        const gx = orgs.golgi.x;
        const gy = orgs.golgi.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="golgi" transform="translate(${gx},${gy})">
            <path d="M -25 -12 C 0 -6 0 -6 25 -12" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <path d="M -30 0 C 0 8 0 8 30 0" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <path d="M -25 14 C 0 20 0 20 25 14" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" />
            <circle cx="-35" cy="4" r="3.5" fill="#8b5cf6" />
            <circle cx="34" cy="-4" r="3" fill="#8b5cf6" />
          </g>
          ${renderOrganellePointer(gx, gy, gx - 50, gy, gx - 75, gy, getOrgLabel(orgs.golgi.label, p.labelStyle, 'Golgi Aygıtı'))}
        `;
      }

      // 4. Koful (Vacuole)
      if (orgs.vacuole?.active) {
        const vx = orgs.vacuole.x;
        const vy = orgs.vacuole.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="vacuole" transform="translate(${vx},${vy})">
            ${isPlant ? `
              <rect x="-65" y="-50" width="130" height="100" rx="30" fill="#bae6fd" stroke="#0284c7" stroke-width="2" opacity="0.8" />
              <text x="0" y="5" font-size="10" fill="#0369a1" text-anchor="middle" font-style="italic">Hücre Özsuyu</text>
            ` : `
              <ellipse cx="0" cy="0" rx="26" ry="18" fill="#bae6fd" stroke="#0284c7" stroke-width="2" opacity="0.85" />
            `}
          </g>
          ${renderOrganellePointer(vx, vy, vx + 55, vy + 15, vx + 80, vy + 15, getOrgLabel(orgs.vacuole.label, p.labelStyle, isPlant ? 'Merkezi Koful' : 'Koful'))}
        `;
      }

      // 5. Kloroplast
      if (orgs.chloroplast?.active) {
        const cx = orgs.chloroplast.x;
        const cy = orgs.chloroplast.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="chloroplast" transform="translate(${cx},${cy}) rotate(15)">
            <ellipse cx="0" cy="0" rx="34" ry="22" fill="#86efac" stroke="#15803d" stroke-width="2" />
            <line x1="-18" y1="-8" x2="18" y2="-8" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
            <line x1="-18" y1="8" x2="18" y2="8" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" />
          </g>
          ${renderOrganellePointer(cx, cy, cx + 55, cy - 20, cx + 80, cy - 20, getOrgLabel(orgs.chloroplast.label, p.labelStyle, 'Kloroplast'))}
        `;
      }

      // 6. Ribozom
      if (orgs.ribosome?.active) {
        const rx = orgs.ribosome.x;
        const ry = orgs.ribosome.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="ribosome" transform="translate(${rx},${ry})">
            <circle cx="0" cy="0" r="6.5" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
            <circle cx="8" cy="4" r="5.5" fill="#475569" stroke="#0f172a" stroke-width="1.5" />
          </g>
          ${renderOrganellePointer(rx, ry, rx, ry - 35, rx - 35, ry - 35, getOrgLabel(orgs.ribosome.label, p.labelStyle, 'Ribozom'))}
        `;
      }

      // 7. Sentrozom
      if (orgs.centrosome?.active && !isPlant) {
        const sx = orgs.centrosome.x;
        const sy = orgs.centrosome.y;
        svg += `
          <g class="sci-draggable" data-organelle-key="centrosome" transform="translate(${sx},${sy})">
            <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
            <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#eab308" stroke="#a16207" stroke-width="1.5" />
          </g>
          ${renderOrganellePointer(sx, sy, sx - 45, sy - 15, sx - 70, sy - 15, getOrgLabel(orgs.centrosome.label, p.labelStyle, 'Sentrozom'))}
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 2. NEFRON & BOŞALTIM SİSTEMİ
  // --------------------------------------------------------------------------
  nephron: {
    id: 'nephron',
    category: 'biyoloji',
    name: 'Nefron & Boşaltım Modeli (Süzülme & Emilim)',
    tags: ['AYT', 'Boşaltım', 'Nefron', 'Glomerulus', 'Bowman', 'Henle'],
    desc: 'Glomerulus, Bowman kapsülü, proksimal tüp, Henle kulpu, distal tüp, toplama kanalı ve süzülme/emilim okları.',
    defaultParams: {
      title: 'Böbrek Nefronunun Yapısı & İdrar Oluşumu',
      labelType: 'num', // 'num' | 'names'
      showFlowArrows: true,
      showVessels: true
    },
    presets: [
      {
        name: 'AYT - Numaralandırılmış Nefron Kısımları (I-V)',
        params: {
          title: 'Nefronda Numaralandırılmış Bölgeler',
          labelType: 'num',
          showFlowArrows: true,
          showVessels: true
        }
      },
      {
        name: 'Nefron Kısımları İsimleriyle',
        params: {
          title: 'Nefronun Anatomik Yapısı ve Süzülme Yönü',
          labelType: 'names',
          showFlowArrows: true,
          showVessels: true
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      {
        key: 'labelType',
        label: 'Bölge İsimlendirmesi',
        type: 'select',
        options: [{ v: 'num', l: 'Numaralı (I, II, III, IV, V)' }, { v: 'names', l: 'Anatomik İsimler' }]
      },
      { key: 'showFlowArrows', label: 'Süzülme ve Emilim Oklarını Göster', type: 'checkbox' },
      { key: 'showVessels', label: 'Getirici / Götürücü Kılcalları Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const isNum = p.labelType === 'num';
      const l1 = isNum ? 'I' : 'Glomerulus';
      const l2 = isNum ? 'II' : 'Bowman Kapsülü';
      const l3 = isNum ? 'III' : 'Proksimal Tüp';
      const l4 = isNum ? 'IV' : 'Henle Kulpu';
      const l5 = isNum ? 'V' : 'Toplama Kanalı';

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="360" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Korteks / Medulla Ayrım Çizgisi -->
        <line x1="40" y1="170" x2="500" y2="170" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="50" y="165" font-size="10" font-weight="bold" fill="#94a3b8">Korteks (Kabuk)</text>
        <text x="50" y="185" font-size="10" font-weight="bold" fill="#94a3b8">Medulla (Öz)</text>

        <!-- NEFRON KANALI YOLU -->
        <!-- Bowman -> Proksimal -> Henle İnen -> Henle Çıkan -> Distal -> Toplama -->
        <g stroke="#f59e0b" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
          <!-- Bowman C Kapsülü -->
          <path d="M 140 100 C 110 80 110 140 140 120" />
          <!-- Proksimal Tüp Kıvrımları -->
          <path d="M 140 110 C 180 90 190 140 220 120" />
          <!-- Henle Kulpu İnen Kol -->
          <path d="M 220 120 L 220 280 C 220 310 270 310 270 280 L 270 120" />
          <!-- Distal Tüp -->
          <path d="M 270 120 C 310 100 320 140 360 110" />
          <!-- İdrar Toplama Kanalı -->
          <path d="M 360 110 L 430 110 L 430 330" />
        </g>
        <!-- Nefron Kanalı Dış Konturu -->
        <g stroke="#b45309" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 140 92 C 100 70 100 150 140 128" />
          <path d="M 140 102 C 175 82 185 132 212 112" />
          <path d="M 212 112 L 212 280 C 212 318 278 318 278 280 L 278 112" />
          <path d="M 278 112 C 315 92 325 132 352 102" />
          <path d="M 352 102 L 422 102 L 422 330" />
        </g>

        <!-- Glomerulus Kılcal Yumağı (Kırmızı Damar) -->
        <g id="glomerulusGroup" transform="translate(125, 110)">
          <circle cx="0" cy="0" r="16" fill="#fecdd3" stroke="#dc2626" stroke-width="2.5" />
          <path d="M -8 -8 Q 0 8 8 -8 Q -8 0 8 8" fill="none" stroke="#dc2626" stroke-width="2.5" />
        </g>

        <!-- Damarlar (Getirici / Götürücü Atardamarlar) -->
        ${p.showVessels ? `
          <g stroke="#dc2626" stroke-width="3" fill="none" stroke-linecap="round">
            <line x1="80" y1="70" x2="115" y2="100" />
            <line x1="115" y1="120" x2="80" y2="150" />
            <text x="60" y="65" font-size="9.5" font-weight="bold" fill="#dc2626" stroke="none">Getirici Atar</text>
          </g>
        ` : ''}

        <!-- Süzülme ve Geri Emilim Okları -->
        ${p.showFlowArrows ? `
          <!-- Süzülme (Glomerulus -> Bowman) -->
          <line x1="135" y1="110" x2="160" y2="110" stroke="#2563eb" stroke-width="2.5" />
          <polygon points="166,110 156,106 156,114" fill="#2563eb" />
          <text x="155" y="100" font-size="9" font-weight="bold" fill="#2563eb">Süzülme</text>

          <!-- Henle Geri Emilim Okları -->
          <line x1="220" y1="200" x2="185" y2="200" stroke="#059669" stroke-width="2" />
          <polygon points="180,200 188,197 188,203" fill="#059669" />
          <text x="175" y="195" font-size="9" font-weight="bold" fill="#059669">H₂O Emilimi</text>

          <line x1="270" y1="220" x2="305" y2="220" stroke="#d97706" stroke-width="2" />
          <polygon points="310,220 302,217 302,223" fill="#d97706" />
          <text x="312" y="215" font-size="9" font-weight="bold" fill="#d97706">NaCl Emilimi</text>
        ` : ''}

        <!-- Numaralandırılmış / İsimlendirilmiş Etiket Kutuları -->
        <!-- I: Glomerulus -->
        ${renderNephronBadge(125, 60, l1)}
        <!-- II: Bowman Kapsülü -->
        ${renderNephronBadge(80, 115, l2)}
        <!-- III: Proksimal Tüp -->
        ${renderNephronBadge(200, 75, l3)}
        <!-- IV: Henle Kulpu -->
        ${renderNephronBadge(245, 335, l4)}
        <!-- V: Toplama Kanalı -->
        ${renderNephronBadge(430, 75, l5)}
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // 3. NÖRON & SİNAPS İLETİMİ
  // --------------------------------------------------------------------------
  synapse: {
    id: 'synapse',
    category: 'biyoloji',
    name: 'Nöron Yapısı & Sinaps İletimi',
    tags: ['AYT', 'Sinir Sistemi', 'Nöron', 'Sinaps', 'Akson', 'Dendrit'],
    desc: 'Hücre gövdesi, dendritler, akson, miyelin kılıf, Ranvier boğumu ve sinaptik boşluktaki nörotransmitter iletimi.',
    defaultParams: {
      title: 'Motor Nöron Yapısı & İmpuls İletim Yönü',
      showMyelin: true,
      showTransmitters: true,
      impulseDirection: 'left_to_right'
    },
    presets: [
      {
        name: 'AYT - Miyelinli Nöron & Atlama İletimi',
        params: {
          title: 'Miyelin Kılıflı Nöronda İmpuls İletimi',
          showMyelin: true,
          showTransmitters: true,
          impulseDirection: 'left_to_right'
        }
      }
    ],
    schema: [
      { key: 'title', label: 'Şema Başlığı', type: 'text' },
      { key: 'showMyelin', label: 'Miyelin Kılıfları & Ranvier Boğumunu Göster', type: 'checkbox' },
      { key: 'showTransmitters', label: 'Sinaptik Boşluktaki Nörotransmitterleri Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 340" width="100%" height="100%" class="sci-interactive-svg" style="font-family:'Noto Sans',sans-serif;">
        <rect x="0" y="0" width="540" height="340" fill="#ffffff" />
        ${p.title ? `<text x="270" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}

        <!-- Nöron Gövdesi (Soma) & Dendritler (Sol) -->
        <g id="somaGroup" transform="translate(100, 170)">
          <!-- Dendrit Dalları -->
          <path d="M -30 -30 L -60 -60 M -35 0 L -75 0 M -30 30 L -60 60 M 0 -35 L 0 -70 M 0 35 L 0 70" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
          <!-- Hücre Gövdesi -->
          <circle cx="0" cy="0" r="36" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="0" cy="0" r="14" fill="#0284c7" opacity="0.8" />
          <text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#ffffff">Çekirdek</text>
          <text x="-65" y="-65" font-size="11" font-weight="bold" fill="#0369a1">Dendrit</text>
        </g>

        <!-- Akson Gövdesi (İletken Hat) -->
        <line x1="136" y1="170" x2="450" y2="170" stroke="#0284c7" stroke-width="6" stroke-linecap="round" />

        <!-- Miyelin Kılıf Boğumları (Schwann Hücreleri) -->
        ${p.showMyelin ? `
          <g transform="translate(160, 170)">
            <!-- 1. Kılıf -->
            <rect x="0" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 2. Kılıf -->
            <rect x="75" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 3. Kılıf -->
            <rect x="150" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <!-- 4. Kılıf -->
            <rect x="225" y="-16" width="60" height="32" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />

            <!-- Ranvier Boğumu Ok ve Notu -->
            <line x1="68" y1="-2" x2="68" y2="-45" stroke="#dc2626" stroke-width="1.8" />
            <polygon points="68,-2 65,-10 71,-10" fill="#dc2626" />
            <text x="68" y="-50" text-anchor="middle" font-size="10" font-weight="bold" fill="#dc2626">Ranvier Boğumu</text>
            <text x="180" y="-22" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#854d0e">Miyelin Kılıf</text>
          </g>
        ` : ''}

        <!-- Akson Uçları & Sinaps Yumruları (Sağ) -->
        <g id="axonTerminals" transform="translate(450, 170)" stroke="#0284c7" stroke-width="3">
          <line x1="0" y1="0" x2="35" y2="-40" />
          <circle cx="35" cy="-40" r="7" fill="#0284c7" />
          <line x1="0" y1="0" x2="45" y2="0" />
          <circle cx="45" cy="0" r="7" fill="#0284c7" />
          <line x1="0" y1="0" x2="35" y2="40" />
          <circle cx="35" cy="40" r="7" fill="#0284c7" />
          <text x="55" y="4" font-size="11" font-weight="bold" fill="#0369a1" stroke="none">Akson Ucu (Sinaps)</text>
        </g>

        <!-- İmpuls İletim Yönü Oku (Dendrit -> Akson Ucu) -->
        <g transform="translate(180, 240)">
          <line x1="0" y1="0" x2="200" y2="0" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
          <polygon points="210,0 196,-6 196,6" fill="#dc2626" />
          <text x="100" y="-10" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">İmpuls İletim Yönü (Dendrit ➔ Akson)</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  }
};

function renderOrganellePointer(fromX, fromY, midX, midY, toX, toY, label) {
  const isLeft = toX < fromX;
  const boxW = label.length > 2 ? label.length * 8 + 16 : 28;
  const boxX = isLeft ? toX - boxW : toX;

  return `
    <g stroke="#0f172a" stroke-width="1.6" fill="none">
      <circle cx="${fromX}" cy="${fromY}" r="2.5" fill="#0f172a" />
      <line x1="${fromX}" y1="${fromY}" x2="${midX}" y2="${midY}" />
      <line x1="${midX}" y1="${midY}" x2="${toX}" y2="${toY}" />
    </g>
    <g transform="translate(${boxX}, ${toY - 12})">
      <rect x="0" y="0" width="${boxW}" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.6" />
      <text x="${boxW / 2}" y="16" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>
    </g>
  `;
}

function getOrgLabel(code, style, name) {
  if (style === 'names') return name;
  return code || name;
}

function renderNephronBadge(x, y, label) {
  const w = label.length > 2 ? label.length * 8 + 14 : 26;
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="-${w / 2}" y="-12" width="${w}" height="24" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
      <text x="0" y="4.5" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#0f172a">${escSvg(label)}</text>
    </g>
  `;
}


// Module Exports
__exports['BIO_TEMPLATES'] = BIO_TEMPLATES;

});

__define('modules/scienceTemplates.js', function(__exports, __require, __module) {
const { $, openModal, closeModal } = __require('utils.js');
const { GEO_TEMPLATES } = __require('modules/science/geoTemplates.js');
const { PHYS_TEMPLATES } = __require('modules/science/physTemplates.js');
const { CHEM_TEMPLATES } = __require('modules/science/chemTemplates.js');
const { BIO_TEMPLATES } = __require('modules/science/bioTemplates.js');
const { injectOverlaysIntoSvg, setupStageInteractions, addOverlayItem, deleteSelectedOverlayItem, resetAllOverlays, setSelectedOverlayId } = __require('modules/science/overlayEngine.js');

/**
 * Egemen's Testmaker — Fen Bilimleri & Coğrafya Şablon Envanteri (Fizik, Kimya, Biyoloji, Coğrafya)
 * TYT, AYT, LGS ve KPSS müfredatına uygun parametrik vektörel (SVG) diyagram üretim motoru,
 * interaktif tuval, devre sembolleri, KaTeX formülleri, organel ve harita pinleri yönetim katmanı.
 */

let onScienceInsertCallback = null;
let onScienceCancelCallback = null;
let activeCategory = 'all'; // 'all' | 'cografya' | 'fizik' | 'kimya' | 'biyoloji'
let activeTemplateId = 'turkeyMap';
let currentParams = {};

// ============================================================================
// 1. ŞABLON TANIMLARI & VEKTÖREL ÇİZİM MOTORLARI
// ============================================================================

const SCIENCE_TEMPLATES = {
  // Coğrafya, Fizik, Kimya ve Biyoloji Modülleri
  ...GEO_TEMPLATES,
  ...PHYS_TEMPLATES,
  ...CHEM_TEMPLATES,
  ...BIO_TEMPLATES,
  // --------------------------------------------------------------------------
  // BİYOLOJİ ŞABLONLARI
  // --------------------------------------------------------------------------
  pedigree: {
    id: 'pedigree',
    category: 'biyoloji',
    name: 'Soy Ağacı (Kalıtım / Pedigree)',
    tags: ['TYT', 'LGS', 'Mendel', 'Kalıtım'],
    desc: 'Otozomal veya eşeye bağlı kalıtım için 3 nesilli, taranmış/hasta birey seçilebilir soy ağacı.',
    defaultParams: {
      title: 'Soy Ağacı',
      affectedList: '2, 5, 7',
      carrierList: '',
      labelType: 'num', // 'num' | 'letters' | 'none'
      showLegend: true
    },
    presets: [
      { name: 'TYT 2023 - Otozomal Çekinik (1, 4, 7 Hasta)', params: { affectedList: '1, 4, 7', carrierList: '', labelType: 'num', showLegend: true } },
      { name: 'TYT - X\'e Bağlı Renk Körlüğü (2 Erkek Hasta, 3 Taşıyıcı)', params: { affectedList: '2, 6', carrierList: '3', labelType: 'num', showLegend: true } },
      { name: 'LGS - Kalıtım & Çaprazlama Şeması', params: { affectedList: '5, 8', carrierList: '', labelType: 'num', showLegend: true } }
    ],
    schema: [
      { key: 'title', label: 'Başlık / Not', type: 'text' },
      { key: 'affectedList', label: 'Taranmış (Hasta) Birey Numaraları', type: 'text', hint: 'Örn: 2, 5, 7' },
      { key: 'carrierList', label: 'Taşıyıcı Dişiler (Yarım Taralı)', type: 'text', hint: 'Örn: 3, 6' },
      { key: 'labelType', label: 'Birey İsimlendirmesi', type: 'select', options: [{ v: 'num', l: 'Numaralı (1, 2, 3...)' }, { v: 'letters', l: 'Harfli (K, L, M...)' }, { v: 'none', l: 'Gizle' }] },
      { key: 'showLegend', label: 'Lejant (Açıklama Kutusu) Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const aff = p.affectedList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const carr = p.carrierList.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const isAff = (id) => aff.includes(id);
      const isCarr = (id) => carr.includes(id);

      const individuals = [
        { id: 1, type: 'male', x: 140, y: 70 },
        { id: 2, type: 'female', x: 260, y: 70 },
        { id: 3, type: 'female', x: 90, y: 180 },
        { id: 4, type: 'male', x: 190, y: 180 },
        { id: 5, type: 'female', x: 290, y: 180 },
        { id: 6, type: 'male', x: 390, y: 180 },
        { id: 7, type: 'male', x: 300, y: 290 },
        { id: 8, type: 'female', x: 380, y: 290 }
      ];

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 370" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        ${p.title ? `<text x="260" y="26" text-anchor="middle" font-size="14" font-weight="bold" fill="#0f172a">${escSvg(p.title)}</text>` : ''}
        
        <!-- Nesil Çizgileri -->
        <line x1="156" y1="70" x2="244" y2="70" stroke="#0f172a" stroke-width="2.2" />
        <line x1="200" y1="70" x2="200" y2="120" stroke="#0f172a" stroke-width="2.2" />
        <line x1="90" y1="120" x2="290" y2="120" stroke="#0f172a" stroke-width="2.2" />
        <line x1="90" y1="120" x2="90" y2="164" stroke="#0f172a" stroke-width="2.2" />
        <line x1="190" y1="120" x2="190" y2="164" stroke="#0f172a" stroke-width="2.2" />
        <line x1="290" y1="120" x2="290" y2="164" stroke="#0f172a" stroke-width="2.2" />
        <line x1="306" y1="180" x2="374" y2="180" stroke="#0f172a" stroke-width="2.2" />
        <line x1="340" y1="180" x2="340" y2="230" stroke="#0f172a" stroke-width="2.2" />
        <line x1="300" y1="230" x2="380" y2="230" stroke="#0f172a" stroke-width="2.2" />
        <line x1="300" y1="230" x2="300" y2="274" stroke="#0f172a" stroke-width="2.2" />
        <line x1="380" y1="230" x2="380" y2="274" stroke="#0f172a" stroke-width="2.2" />
        
        <!-- Nesil Numaraları (I, II, III) -->
        <text x="35" y="75" font-size="13" font-weight="bold" fill="#64748b">I</text>
        <text x="35" y="185" font-size="13" font-weight="bold" fill="#64748b">II</text>
        <text x="35" y="295" font-size="13" font-weight="bold" fill="#64748b">III</text>
      `;

      individuals.forEach(ind => {
        const fill = isAff(ind.id) ? '#0f172a' : '#ffffff';
        const stroke = '#0f172a';
        let label = p.labelType === 'num' ? String(ind.id) : (p.labelType === 'letters' ? String.fromCharCode(64 + ind.id) : '');

        if (ind.type === 'male') {
          svg += `<rect x="${ind.x - 16}" y="${ind.y - 16}" width="32" height="32" fill="${fill}" stroke="${stroke}" stroke-width="2.4" rx="2" />`;
        } else {
          if (isCarr(ind.id)) {
            svg += `<circle cx="${ind.x}" cy="${ind.y}" r="16" fill="#ffffff" stroke="${stroke}" stroke-width="2.4" />`;
            svg += `<path d="M ${ind.x} ${ind.y - 16} A 16 16 0 0 1 ${ind.x} ${ind.y + 16} Z" fill="#0f172a" />`;
          } else {
            svg += `<circle cx="${ind.x}" cy="${ind.y}" r="16" fill="${fill}" stroke="${stroke}" stroke-width="2.4" />`;
          }
        }

        if (label) {
          svg += `<text x="${ind.x}" y="${ind.y + 32}" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">${label}</text>`;
        }
      });

      if (p.showLegend) {
        svg += `
          <g transform="translate(60, 335)">
            <rect x="0" y="0" width="14" height="14" fill="#0f172a" stroke="#0f172a" stroke-width="1.5" />
            <text x="20" y="11" font-size="11" fill="#334155">: Özelliği gösteren erkek</text>
            <circle cx="170" cy="7" r="7" fill="#0f172a" stroke="#0f172a" stroke-width="1.5" />
            <text x="184" y="11" font-size="11" fill="#334155">: Özelliği gösteren dişi</text>
            <rect x="330" y="0" width="14" height="14" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
            <text x="350" y="11" font-size="11" fill="#334155">: Sağlıklı</text>
          </g>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  dnaModel: {
    id: 'dnaModel',
    category: 'biyoloji',
    name: 'DNA & Nükleotid Modeli',
    tags: ['LGS', 'TYT', 'DNA', 'Genetik Kod', 'Nükleotid'],
    desc: 'LGS Fen Bilimleri ve TYT için A-T-G-C baz çiftleri, fosfat-şeker omurgası ve hidrojen bağları şablonu.',
    defaultParams: {
      mode: 'ladder',
      sequence: 'A-T-G-C-T-A',
      maskMode: 'none'
    },
    presets: [
      { name: 'LGS - Baz Eşleşmesi (A-T, G-C ve ? Soru Kalıbı)', params: { mode: 'ladder', sequence: 'A-T-G-C-A', maskMode: 'mask_bases' } },
      { name: 'LGS/TYT - Tek Nükleotid Yapısı (Fosfat-Şeker-Baz)', params: { mode: 'nucleotide' } },
      { name: 'TYT - Hidrojen Bağı Sayısı (2\'li ve 3\'lü)', params: { mode: 'ladder', sequence: 'A-T-G-C-C-G', maskMode: 'none' } }
    ],
    schema: [
      { key: 'mode', label: 'Model Görünümü', type: 'select', options: [{ v: 'ladder', l: 'DNA Çift Zincir (Basamaklı Model)' }, { v: 'nucleotide', l: 'Tek Nükleotid Detay Şeması (P-D-Baz)' }] },
      { key: 'sequence', label: '1. Zincir Baz Dizilimi (Sol)', type: 'text', hint: 'Örn: A-T-G-C-A' },
      { key: 'maskMode', label: 'Soru İçin Gizleme', type: 'select', options: [{ v: 'none', l: 'Tüm Harfleri Göster (Normal)' }, { v: 'mask_bases', l: 'Sağ Zinciri [ 1 ], [ 2 ] ile Maskele' }] }
    ],
    renderSvg(p) {
      if (p.mode === 'nucleotide') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 260" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="240" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="#0f172a">Bir Nükleotidin Yapısı</text>
          
          <!-- Fosfat (P) -->
          <circle cx="80" cy="130" r="28" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5" />
          <text x="80" y="136" text-anchor="middle" font-size="16" font-weight="bold" fill="#b91c1c">P</text>
          <text x="80" y="180" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">Fosfat</text>

          <line x1="108" y1="130" x2="160" y2="130" stroke="#0f172a" stroke-width="2.5" />

          <!-- Deoksiriboz Şekeri (Beşgen) -->
          <polygon points="210,90 255,122 238,172 182,172 165,122" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
          <text x="210" y="142" text-anchor="middle" font-size="16" font-weight="bold" fill="#b45309">D</text>
          <text x="210" y="196" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">Deoksiriboz</text>

          <line x1="255" y1="130" x2="310" y2="130" stroke="#0f172a" stroke-width="2.5" />

          <!-- Organik Baz (Adenin) -->
          <rect x="310" y="102" width="110" height="56" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" />
          <text x="365" y="136" text-anchor="middle" font-size="15" font-weight="bold" fill="#1d4ed8">Adenin (A)</text>
          <text x="365" y="180" text-anchor="middle" font-size="12" font-weight="bold" fill="#64748b">Organik Baz</text>

          <text x="240" y="235" text-anchor="middle" font-size="11" fill="#475569">Nükleotid = Fosfat + Deoksiriboz Şekeri + Organik Azotlu Baz</text>
        </svg>`;
      }

      const bases = p.sequence.toUpperCase().split(/[^A-Z]/).filter(Boolean);
      const complement = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
      const colors = {
        'A': { bg: '#dbeafe', border: '#2563eb', text: '#1d4ed8' },
        'T': { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c' },
        'G': { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
        'C': { bg: '#fef3c7', border: '#d97706', text: '#b45309' }
      };

      const startY = 70;
      const stepY = 44;
      const totalH = startY + bases.length * stepY + 40;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 ${Math.max(320, totalH)}" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">DNA Çift Zincirli Yapısı</text>
        <text x="135" y="48" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">1. Zincir</text>
        <text x="325" y="48" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">2. Zincir</text>

        <line x1="80" y1="${startY - 10}" x2="80" y2="${startY + bases.length * stepY}" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
        <line x1="380" y1="${startY - 10}" x2="380" y2="${startY + bases.length * stepY}" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
      `;

      bases.forEach((b1, i) => {
        const b2 = complement[b1] || 'T';
        const y = startY + i * stepY;
        const c1 = colors[b1] || colors['A'];
        const c2 = colors[b2] || colors['T'];
        const isTriple = (b1 === 'G' || b1 === 'C');

        svg += `
          <rect x="100" y="${y - 14}" width="70" height="28" rx="5" fill="${c1.bg}" stroke="${c1.border}" stroke-width="2" />
          <text x="135" y="${y + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="${c1.text}">${b1}</text>
        `;

        if (isTriple) {
          svg += `
            <line x1="172" y1="${y - 6}" x2="288" y2="${y - 6}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />
            <line x1="172" y1="${y}" x2="288" y2="${y}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />
            <line x1="172" y1="${y + 6}" x2="288" y2="${y + 6}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />
          `;
        } else {
          svg += `
            <line x1="172" y1="${y - 4}" x2="288" y2="${y - 4}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />
            <line x1="172" y1="${y + 4}" x2="288" y2="${y + 4}" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" />
          `;
        }

        const isMasked = p.maskMode === 'mask_bases';
        const rightText = isMasked ? `[ ${i + 1} ]` : b2;
        const rBg = isMasked ? '#f1f5f9' : c2.bg;
        const rBorder = isMasked ? '#0f172a' : c2.border;
        const rTextCol = isMasked ? '#0f172a' : c2.text;

        svg += `
          <rect x="290" y="${y - 14}" width="70" height="28" rx="5" fill="${rBg}" stroke="${rBorder}" stroke-width="2" />
          <text x="325" y="${y + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="${rTextCol}">${rightText}</text>
        `;
      });

      svg += `</svg>`;
      return svg;
    }
  },

  foodPyramid: {
    id: 'foodPyramid',
    category: 'biyoloji',
    name: 'Besin Piramidi / Enerji Zinciri',
    tags: ['LGS', 'TYT', 'Ekoloji', 'Enerji Piramidi'],
    desc: 'Trofik düzeyler, üreticiden tepe tüketiciye biyokütle ve %10 enerji aktarım piramidi.',
    defaultParams: {
      levels: '4',
      tier1: 'Üreticiler (Bitkiler)',
      tier2: '1. Tüketiciler (Otçullar)',
      tier3: '2. Tüketiciler (Etçiller)',
      tier4: '3. Tüketiciler (Tepe Yırtıcı)',
      showDecomposer: true,
      showArrows: true
    },
    presets: [
      { name: 'LGS - Canlı İsimli Besin Piramidi', params: { levels: '4', tier1: 'Ot / Buğday', tier2: 'Çekirge', tier3: 'Kurbağa', tier4: 'Yılan / Kartal', showDecomposer: true } },
      { name: 'TYT - Enerji & Biyolojik Birikim Kuralları', params: { levels: '4', tier1: 'Üreticiler (10.000 J)', tier2: 'Otçullar (1.000 J)', tier3: 'Etçiller (100 J)', tier4: 'Tepe Tüketici (10 J)', showArrows: true } }
    ],
    schema: [
      { key: 'levels', label: 'Basamak Sayısı', type: 'select', options: [{ v: '3', l: '3 Basamak' }, { v: '4', l: '4 Basamak (Standart)' }, { v: '5', l: '5 Basamak' }] },
      { key: 'tier1', label: '1. Katman (En Alt - Üretici)', type: 'text' },
      { key: 'tier2', label: '2. Katman (1. Tüketici)', type: 'text' },
      { key: 'tier3', label: '3. Katman (2. Tüketici)', type: 'text' },
      { key: 'tier4', label: '4. Katman (Tepe Tüketici)', type: 'text' },
      { key: 'showDecomposer', label: 'Ayrıştırıcılar (Mantar/Bakteri) Kutusu', type: 'checkbox' },
      { key: 'showArrows', label: 'Biyolojik Birikim & Enerji Okları', type: 'checkbox' }
    ],
    renderSvg(p) {
      const n = parseInt(p.levels) || 4;
      const texts = [p.tier1, p.tier2, p.tier3, p.tier4, '4. Tüketiciler'];
      const tierColors = ['#86efac', '#fed7aa', '#fbcfe8', '#fca5a5', '#c4b5fd'];

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 360" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="250" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Ekolojik Besin & Enerji Piramidi</text>
      `;

      const baseY = 320;
      const totalHeight = 250;
      const hPerTier = totalHeight / n;
      const centerX = 230;

      for (let i = 0; i < n; i++) {
        const yBottom = baseY - i * hPerTier;
        const yTop = yBottom - hPerTier;
        const wBottom = 340 * (1 - (i / n) * 0.75);
        const wTop = 340 * (1 - ((i + 1) / n) * 0.75);

        const x1 = centerX - wBottom / 2;
        const x2 = centerX + wBottom / 2;
        const x3 = centerX + wTop / 2;
        const x4 = centerX - wTop / 2;

        svg += `
          <polygon points="${x1},${yBottom} ${x2},${yBottom} ${x3},${yTop} ${x4},${yTop}" fill="${tierColors[i]}" stroke="#0f172a" stroke-width="2" />
          <text x="${centerX}" y="${(yBottom + yTop) / 2 + 5}" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(texts[i])}</text>
        `;
      }

      if (p.showDecomposer) {
        svg += `
          <g transform="translate(425, 70)">
            <rect x="0" y="0" width="95" height="250" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
            <text x="47" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#b45309" transform="rotate(-90 47 115)">AYRIŞTIRICILAR</text>
            <text x="47" y="235" text-anchor="middle" font-size="10" fill="#78350f">(Mantar, Bakteri)</text>
            <line x1="-5" y1="50" x2="-25" y2="50" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3,2" />
            <line x1="-5" y1="125" x2="-25" y2="125" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3,2" />
            <line x1="-5" y1="200" x2="-25" y2="200" stroke="#d97706" stroke-width="1.8" stroke-dasharray="3,2" />
          </g>
        `;
      }

      if (p.showArrows) {
        svg += `
          <g transform="translate(30, 80)">
            <line x1="0" y1="230" x2="0" y2="10" stroke="#dc2626" stroke-width="2.5" />
            <polygon points="0,0 -4,12 4,12" fill="#dc2626" />
            <text x="12" y="70" font-size="10.5" font-weight="bold" fill="#dc2626" transform="rotate(-90 12 70)">▲ Biyolojik Birikim Artar</text>
            <text x="12" y="190" font-size="10.5" font-weight="bold" fill="#15803d" transform="rotate(-90 12 190)">▼ Aktarılan Enerji (%10) Azalır</text>
          </g>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  mitosis: {
    id: 'mitosis',
    category: 'biyoloji',
    name: 'Hücre Bölünmesi (Mitoz Evreleri)',
    tags: ['TYT', 'LGS', 'Mitoz', 'Kromozom'],
    desc: 'Profaz, Metafaz (ekvatoral dizilme), Anafaz (kromatit ayrılması) ve Telofaz evreleri.',
    defaultParams: {
      phase: 'metaphase',
      chromosomeCount: '4'
    },
    presets: [
      { name: 'TYT - Metafaz (Ekvatorda Tek Sıra Dizilim)', params: { phase: 'metaphase', chromosomeCount: '4' } },
      { name: 'TYT - Anafaz (Kardeş Kromatitlerin Kutuplara Çekilmesi)', params: { phase: 'anaphase', chromosomeCount: '4' } },
      { name: 'LGS - Hücre Bölünmesi Sıralama Sorusu', params: { phase: 'metaphase' } }
    ],
    schema: [
      { key: 'phase', label: 'Bölünme Evresi', type: 'select', options: [{ v: 'prophase', l: 'Profaz' }, { v: 'metaphase', l: 'Metafaz (Ekvatorda Dizilim)' }, { v: 'anaphase', l: 'Anafaz (Kutuplara Çekilme)' }, { v: 'telophase', l: 'Telofaz / Sitokinez' }] }
    ],
    renderSvg(p) {
      const phaseTitles = { prophase: 'Profaz Evresi', metaphase: 'Metafaz Evresi (2n = 4)', anaphase: 'Anafaz Evresi', telophase: 'Telofaz ve Sitokinez' };
      const title = phaseTitles[p.phase] || 'Mitoz Bölünme';

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 340" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="250" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${title}</text>
      `;

      if (p.phase === 'metaphase') {
        svg += `
          <ellipse cx="250" cy="175" rx="180" ry="135" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
          <line x1="80" y1="175" x2="420" y2="175" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />
          <text x="430" y="179" font-size="10" fill="#64748b">Ekvatoral Düzlem</text>

          <circle cx="250" cy="65" r="7" fill="#ea580c" />
          <circle cx="250" cy="285" r="7" fill="#ea580c" />
          <text x="250" y="52" text-anchor="middle" font-size="10" font-weight="bold" fill="#c2410c">Kutup</text>

          <g stroke="#cbd5e1" stroke-width="1.2">
            <line x1="250" y1="65" x2="160" y2="175" />
            <line x1="250" y1="65" x2="220" y2="175" />
            <line x1="250" y1="65" x2="280" y2="175" />
            <line x1="250" y1="65" x2="340" y2="175" />

            <line x1="250" y1="285" x2="160" y2="175" />
            <line x1="250" y1="285" x2="220" y2="175" />
            <line x1="250" y1="285" x2="280" y2="175" />
            <line x1="250" y1="285" x2="340" y2="175" />
          </g>

          ${[160, 220, 280, 340].map((x, idx) => {
            const color = idx % 2 === 0 ? '#ef4444' : '#3b82f6';
            return `
              <g transform="translate(${x}, 175)">
                <line x1="-10" y1="-18" x2="10" y2="18" stroke="${color}" stroke-width="5" stroke-linecap="round" />
                <line x1="10" y1="-18" x2="-10" y2="18" stroke="${color}" stroke-width="5" stroke-linecap="round" />
                <circle cx="0" cy="0" r="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
              </g>
            `;
          }).join('')}
        `;
      } else if (p.phase === 'anaphase') {
        svg += `
          <ellipse cx="250" cy="175" rx="160" ry="145" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="250" cy="55" r="7" fill="#ea580c" />
          <circle cx="250" cy="295" r="7" fill="#ea580c" />
          
          ${[170, 220, 280, 330].map((x, idx) => {
            const color = idx % 2 === 0 ? '#ef4444' : '#3b82f6';
            return `
              <g transform="translate(${x}, 105)">
                <path d="M -9 14 Q 0 0 9 14" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" />
                <circle cx="0" cy="2" r="3" fill="#fef08a" stroke="#ca8a04" />
                <line x1="0" y1="0" x2="${250 - x}" y2="-45" stroke="#cbd5e1" stroke-width="1.2" />
              </g>
            `;
          }).join('')}

          ${[170, 220, 280, 330].map((x, idx) => {
            const color = idx % 2 === 0 ? '#ef4444' : '#3b82f6';
            return `
              <g transform="translate(${x}, 245)">
                <path d="M -9 -14 Q 0 0 9 -14" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" />
                <circle cx="0" cy="-2" r="3" fill="#fef08a" stroke="#ca8a04" />
                <line x1="0" y1="0" x2="${250 - x}" y2="45" stroke="#cbd5e1" stroke-width="1.2" />
              </g>
            `;
          }).join('')}
        `;
      } else {
        svg += `
          <circle cx="250" cy="175" r="130" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
          <circle cx="250" cy="175" r="75" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5,4" />
          <text x="250" y="180" text-anchor="middle" font-size="12" font-style="italic" fill="#991b1b">Kromatin İplikler Kısalıp Kalınlaşır</text>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // KİMYA ŞABLONLARI
  // --------------------------------------------------------------------------
  bohrAtom: {
    id: 'bohrAtom',
    category: 'kimya',
    name: 'Bohr Atom Modeli & Katman Dağılımı',
    tags: ['TYT', 'LGS', 'Atom', 'Periyodik Sistem', 'Katman'],
    desc: 'Elektron katman halkaları (2, 8, 8), çekirdek proton/nötron gösterimi ve değerlik elektronları.',
    defaultParams: {
      symbol: 'Na',
      electrons: '2, 8, 1',
      protons: '11',
      neutrons: '12',
      showNucleusDetail: true
    },
    presets: [
      { name: '11Na (Sodyum: 2, 8, 1) - 3. Periyot 1A', params: { symbol: 'Na', electrons: '2, 8, 1', protons: '11', neutrons: '12' } },
      { name: '17Cl (Klor: 2, 8, 7) - 3. Periyot 7A', params: { symbol: 'Cl', electrons: '2, 8, 7', protons: '17', neutrons: '18' } },
      { name: '6C (Karbon: 2, 4) - 2. Periyot 4A', params: { symbol: 'C', electrons: '2, 4', protons: '6', neutrons: '6' } }
    ],
    schema: [
      { key: 'symbol', label: 'Element Sembolü', type: 'text' },
      { key: 'electrons', label: 'Katman Elektron Dağılımı (Virgülle)', type: 'text', hint: 'Örn: 2, 8, 1' },
      { key: 'protons', label: 'Proton Sayısı (p+)', type: 'text' },
      { key: 'neutrons', label: 'Nötron Sayısı (n0)', type: 'text' },
      { key: 'showNucleusDetail', label: 'Çekirdekte p+ ve n0 Sayılarını Yaz', type: 'checkbox' }
    ],
    renderSvg(p) {
      const shells = p.electrons.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const radii = [52, 88, 124, 155];
      const centerX = 230;
      const centerY = 180;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 370" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="250" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Bohr Atom Modeli — Katman Elektron Dağılımı</text>
      `;

      shells.forEach((count, sIdx) => {
        const r = radii[sIdx] || (50 + sIdx * 35);
        svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,3" />`;

        for (let e = 0; e < count; e++) {
          const angle = (2 * Math.PI / count) * e - Math.PI / 2;
          const eX = centerX + r * Math.cos(angle);
          const eY = centerY + r * Math.sin(angle);
          const isValence = (sIdx === shells.length - 1);
          const eColor = isValence ? '#ea580c' : '#2563eb';

          svg += `<circle cx="${eX}" cy="${eY}" r="5" fill="${eColor}" stroke="#ffffff" stroke-width="1.2" />`;
        }
      });

      svg += `<circle cx="${centerX}" cy="${centerY}" r="28" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5" />`;

      if (p.showNucleusDetail && p.protons) {
        svg += `
          <text x="${centerX}" y="${centerY - 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#991b1b">${p.protons}p⁺</text>
          <text x="${centerX}" y="${centerY + 12}" text-anchor="middle" font-size="9" fill="#7f1d1d">${p.neutrons || '0'}n⁰</text>
        `;
      } else {
        svg += `<text x="${centerX}" y="${centerY + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#991b1b">${p.symbol}</text>`;
      }

      const distNotation = shells.join(' ) ');
      svg += `
        <g transform="translate(130, 335)">
          <rect x="0" y="0" width="240" height="28" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
          <text x="120" y="19" text-anchor="middle" font-size="12" font-weight="bold" fill="#0f172a">${p.protons ? `_${p.protons}` : ''}${p.symbol} :  ) ${distNotation} )</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  nuclideSymbol: {
    id: 'nuclideSymbol',
    category: 'kimya',
    name: 'Nükleon & İyon Gösterimi (X Sembolü)',
    tags: ['TYT', 'Kimya', 'İyon Yükü', 'Atom No', 'Kütle No'],
    desc: 'Kütle No (A), Atom No (Z), Nötron (n), İyon Yükü (q), Elektron (e) sınav şablonu.',
    defaultParams: {
      symbol: 'X',
      massNum: '35',
      neutronNum: '18',
      atomicNum: '17',
      charge: '-1',
      electrons: '18',
      showFormulas: true
    },
    presets: [
      { name: 'TYT - İyon Yükü ve Elektron Hesabı (Cl- Anyonu)', params: { symbol: 'Cl', massNum: '35', atomicNum: '17', charge: '-1', electrons: '18', neutronNum: '18' } },
      { name: 'TYT - Katyon Hesaplama (Al 3+ Katyonu)', params: { symbol: 'Al', massNum: '27', atomicNum: '13', charge: '+3', electrons: '10', neutronNum: '14' } },
      { name: 'TYT - Soru Kalıbı (? Bilinmeyenli Değerler)', params: { symbol: 'X', massNum: '40', atomicNum: '?', charge: '+2', electrons: '18', neutronNum: '20' } }
    ],
    schema: [
      { key: 'symbol', label: 'Element Sembolü', type: 'text' },
      { key: 'massNum', label: 'Kütle Numarası (Sol Üst)', type: 'text' },
      { key: 'neutronNum', label: 'Nötron Sayısı (Sol Orta)', type: 'text' },
      { key: 'atomicNum', label: 'Proton / Atom No (Sol Alt)', type: 'text' },
      { key: 'charge', label: 'İyon Yükü (Sağ Üst)', type: 'text' },
      { key: 'electrons', label: 'Elektron Sayısı (Sağ Alt)', type: 'text' },
      { key: 'showFormulas', label: 'Ters "U" İlişki Formülünü Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 300" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">İyon ve Atom Tanecik Şeması</text>
        <text x="230" y="165" text-anchor="middle" font-size="88" font-weight="bold" fill="#0f172a">${escSvg(p.symbol)}</text>

        <g transform="translate(130, 95)">
          <rect x="-35" y="-22" width="70" height="34" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8" />
          <text x="0" y="2" text-anchor="middle" font-size="16" font-weight="bold" fill="#1d4ed8">${escSvg(p.massNum)}</text>
          <text x="0" y="24" text-anchor="middle" font-size="9" fill="#64748b">Kütle No (A)</text>
        </g>

        <g transform="translate(130, 155)">
          <rect x="-35" y="-18" width="70" height="30" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
          <text x="0" y="4" text-anchor="middle" font-size="15" font-weight="bold" fill="#334155">${escSvg(p.neutronNum)}</text>
          <text x="0" y="24" text-anchor="middle" font-size="9" fill="#64748b">Nötron (n)</text>
        </g>

        <g transform="translate(130, 215)">
          <rect x="-35" y="-18" width="70" height="34" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8" />
          <text x="0" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#b91c1c">${escSvg(p.atomicNum)}</text>
          <text x="0" y="28" text-anchor="middle" font-size="9" fill="#64748b">Proton (Z)</text>
        </g>

        <g transform="translate(330, 95)">
          <rect x="-35" y="-22" width="70" height="34" rx="6" fill="#fefce8" stroke="#ca8a04" stroke-width="1.8" />
          <text x="0" y="2" text-anchor="middle" font-size="16" font-weight="bold" fill="#a16207">${escSvg(p.charge)}</text>
          <text x="0" y="24" text-anchor="middle" font-size="9" fill="#64748b">İyon Yükü (q)</text>
        </g>

        <g transform="translate(330, 215)">
          <rect x="-35" y="-18" width="70" height="34" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8" />
          <text x="0" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#15803d">${escSvg(p.electrons)}</text>
          <text x="0" y="28" text-anchor="middle" font-size="9" fill="#64748b">Elektron (e⁻)</text>
        </g>

        ${p.showFormulas ? `
          <path d="M 330 185 Q 230 265 130 185" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />
          <text x="230" y="278" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">Z = e + q  •  A = Z + n</text>
        ` : ''}
      </svg>`;
    }
  },

  periodicTable: {
    id: 'periodicTable',
    category: 'kimya',
    name: 'Periyodik Tablo Kesiti',
    tags: ['TYT', 'LGS', 'Periyot', 'Grup', 'Periyodik Özellikler'],
    desc: 'Gruplar (1A, 2A, 7A, 8A vb.) ve periyotlarda elementlerin bağıl konumları kesiti.',
    defaultParams: {
      cellX: '2, 1',
      elemX: 'X',
      cellY: '2, 7',
      elemY: 'Y',
      cellZ: '3, 1',
      elemZ: 'Z',
      cellT: '3, 8',
      elemT: 'T'
    },
    presets: [
      { name: 'TYT - Yarıçap & İyonlaşma Enerjisi Kıyaslama Kesiti', params: { cellX: '2, 1', elemX: 'X', cellY: '2, 7', elemY: 'Y', cellZ: '3, 1', elemZ: 'Z', cellT: '3, 8', elemT: 'T' } },
      { name: 'LGS - Periyodik Tabloda Yer Bulma', params: { cellX: '1, 1', elemX: 'H', cellY: '2, 8', elemY: 'Ne', cellZ: '3, 2', elemZ: 'Mg', cellT: '3, 7', elemT: 'Cl' } }
    ],
    schema: [
      { key: 'elemX', label: '1. Element Sembolü', type: 'text' },
      { key: 'cellX', label: '1. Element Konumu (Periyot, GrupNo)', type: 'text', hint: 'Örn: 2, 1' },
      { key: 'elemY', label: '2. Element Sembolü', type: 'text' },
      { key: 'cellY', label: '2. Element Konumu (Periyot, GrupNo)', type: 'text', hint: 'Örn: 2, 7' },
      { key: 'elemZ', label: '3. Element Sembolü', type: 'text' },
      { key: 'cellZ', label: '3. Element Konumu (Periyot, GrupNo)', type: 'text', hint: 'Örn: 3, 1' },
      { key: 'elemT', label: '4. Element Sembolü', type: 'text' },
      { key: 'cellT', label: '4. Element Konumu (Periyot, GrupNo)', type: 'text', hint: 'Örn: 3, 8' }
    ],
    renderSvg(p) {
      const groups = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A'];
      const periods = ['1', '2', '3'];

      const cellMap = {};
      const addElem = (loc, sym) => {
        if (!loc || !sym) return;
        const [r, c] = loc.split(',').map(s => parseInt(s.trim()));
        if (r && c) cellMap[`${r}_${c}`] = sym;
      };
      addElem(p.cellX, p.elemX);
      addElem(p.cellY, p.elemY);
      addElem(p.cellZ, p.elemZ);
      addElem(p.cellT, p.elemT);

      const startX = 65;
      const startY = 75;
      const cellW = 46;
      const cellH = 46;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 280" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="245" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Periyodik Sistemden Bir Kesit</text>
      `;

      groups.forEach((g, cIdx) => {
        const x = startX + cIdx * cellW;
        svg += `<text x="${x + cellW / 2}" y="62" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">${g}</text>`;
      });

      periods.forEach((pr, rIdx) => {
        const y = startY + rIdx * cellH;
        svg += `<text x="44" y="${y + cellH / 2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">${pr}.P</text>`;
      });

      periods.forEach((pr, rIdx) => {
        const r = rIdx + 1;
        groups.forEach((g, cIdx) => {
          const c = cIdx + 1;
          const x = startX + cIdx * cellW;
          const y = startY + rIdx * cellH;
          const elem = cellMap[`${r}_${c}`];

          const isEmptyHole = (r === 1 && c > 1 && c < 8);
          if (isEmptyHole) return;

          const isFilled = Boolean(elem);
          const bg = isFilled ? '#e0f2fe' : '#ffffff';
          const stroke = isFilled ? '#0284c7' : '#cbd5e1';
          const strokeW = isFilled ? 2 : 1;

          svg += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${bg}" stroke="${stroke}" stroke-width="${strokeW}" />`;
          if (elem) {
            svg += `<text x="${x + cellW / 2}" y="${y + cellH / 2 + 6}" text-anchor="middle" font-size="16" font-weight="bold" fill="#0369a1">${escSvg(elem)}</text>`;
          }
        });
      });

      svg += `
        <g transform="translate(65, 245)">
          <line x1="0" y1="0" x2="368" y2="0" stroke="#0f172a" stroke-width="1.8" />
          <polygon points="368,0 358,-4 358,4" fill="#0f172a" />
          <text x="184" y="16" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#0f172a">Aynı periyotta sağa doğru: İyonlaşma enerjisi artar, yarıçap azalır</text>
        </g>
      `;

      svg += `</svg>`;
      return svg;
    }
  },

  labApparatus: {
    id: 'labApparatus',
    category: 'kimya',
    name: 'Kimya Deney Düzeneği (Isıtma & Ayırma)',
    tags: ['TYT', 'LGS', 'Deney', 'Ayırma Hunisi', 'Beher'],
    desc: 'Beher + İspirto Ocağı + Termometre veya Ayırma Hunisi (iki fazlı karışım).',
    defaultParams: {
      type: 'heating',
      liquidColor: '#38bdf8',
      tempValue: '78 °C',
      liquidLabel1: 'Saf Su / Etil Alkol',
      liquidLabel2: 'Zeytinyağı (Üst Faz)'
    },
    presets: [
      { name: 'TYT - Kaynama Noktası Tespiti (Termometreli Isıtma)', params: { type: 'heating', tempValue: '78 °C', liquidLabel1: 'Etil Alkol' } },
      { name: 'TYT - Ayırma Hunisi (Heterojen Sıvı-Sıvı Fazları)', params: { type: 'funnel', liquidLabel1: 'Su (d = 1 g/cm³)', liquidLabel2: 'Zeytinyağı (d = 0.9 g/cm³)' } }
    ],
    schema: [
      { key: 'type', label: 'Düzenek Türü', type: 'select', options: [{ v: 'heating', l: 'Isıtma Düzeneği (Beher, Ocak, Termometre)' }, { v: 'funnel', l: 'Ayırma Hunisi (İki Fazlı Sıvı Karışımı)' }] },
      { key: 'liquidLabel1', label: '1. Sıvı / Alt Faz Etiketi', type: 'text' },
      { key: 'liquidLabel2', label: '2. Sıvı (Ayırma Hunisi İçin)', type: 'text' },
      { key: 'tempValue', label: 'Termometre Değeri (Isıtmada)', type: 'text' }
    ],
    renderSvg(p) {
      if (p.type === 'funnel') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Ayırma Hunisi ile Yoğunluk Farkından Ayırma</text>

          <line x1="120" y1="50" x2="120" y2="330" stroke="#475569" stroke-width="6" stroke-linecap="round" />
          <rect x="70" y="325" width="100" height="15" fill="#334155" rx="3" />
          <line x1="120" y1="120" x2="190" y2="120" stroke="#475569" stroke-width="4" />

          <rect x="215" y="55" width="30" height="15" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" rx="2" />
          <path d="M 215 70 C 170 100 170 180 220 220 L 220 270 L 240 270 L 240 220 C 290 180 290 100 245 70 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" />
          
          <path d="M 185 130 C 180 150 195 175 230 175 C 265 175 280 150 275 130 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
          <path d="M 195 175 C 210 205 220 220 220 240 L 240 240 C 240 220 250 205 265 175 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5" />

          <rect x="210" y="245" width="40" height="8" rx="2" fill="#dc2626" stroke="#0f172a" stroke-width="1.5" />
          <polygon points="200,325 260,325 245,290 215,290" fill="#eff6ff" stroke="#0f172a" stroke-width="2" />

          <g font-size="11" font-weight="bold">
            <line x1="275" y1="145" x2="330" y2="145" stroke="#0f172a" stroke-width="1.5" />
            <text x="335" y="149" fill="#a16207">${escSvg(p.liquidLabel2)}</text>
            <line x1="260" y1="200" x2="330" y2="200" stroke="#0f172a" stroke-width="1.5" />
            <text x="335" y="204" fill="#1d4ed8">${escSvg(p.liquidLabel1)}</text>
          </g>
        </svg>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Sıvı Isıtma & Kaynama Noktası Deneyi</text>

        <line x1="80" y1="330" x2="380" y2="330" stroke="#64748b" stroke-width="2" />

        <line x1="170" y1="230" x2="150" y2="330" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <line x1="290" y1="230" x2="310" y2="330" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="230" x2="300" y2="230" stroke="#334155" stroke-width="5" />
        <line x1="165" y1="228" x2="295" y2="228" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4,2" />

        <rect x="205" y="275" width="50" height="45" rx="8" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
        <line x1="230" y1="275" x2="230" y2="265" stroke="#cbd5e1" stroke-width="4" />
        <path d="M 230 265 Q 220 245 230 235 Q 240 245 230 265 Z" fill="#f97316" stroke="#dc2626" stroke-width="1.5" />
        <path d="M 230 260 Q 225 248 230 242 Q 235 248 230 260 Z" fill="#fef08a" />

        <path d="M 180 130 L 180 222 Q 180 226 185 226 L 275 226 Q 280 226 280 222 L 280 130" fill="none" stroke="#0f172a" stroke-width="2.5" />
        <rect x="175" y="126" width="110" height="5" rx="2" fill="#cbd5e1" />
        
        <path d="M 182 170 Q 230 173 278 170 L 278 224 L 182 224 Z" fill="${p.liquidColor}" opacity="0.65" />
        <circle cx="210" cy="190" r="3" fill="#ffffff" opacity="0.7" />
        <circle cx="245" cy="180" r="4" fill="#ffffff" opacity="0.7" />
        <circle cx="230" cy="205" r="2.5" fill="#ffffff" opacity="0.7" />

        <rect x="226" y="70" width="8" height="135" rx="4" fill="#f8fafc" stroke="#dc2626" stroke-width="1.8" />
        <circle cx="230" cy="202" r="7" fill="#ef4444" />
        <line x1="230" y1="200" x2="230" y2="105" stroke="#ef4444" stroke-width="3" />

        <g transform="translate(242, 85)">
          <rect x="0" y="-12" width="65" height="24" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
          <text x="32" y="4" text-anchor="middle" font-size="11" font-weight="bold" fill="#b91c1c">${escSvg(p.tempValue)}</text>
        </g>

        <text x="300" y="195" font-size="12" font-weight="bold" fill="#0f172a">${escSvg(p.liquidLabel1)}</text>
        <line x1="295" y1="192" x2="260" y2="192" stroke="#0f172a" stroke-width="1.5" />
      </svg>`;
    }
  },

  phScale: {
    id: 'phScale',
    category: 'kimya',
    name: 'pH Skalası & Asit-Baz İndikatörleri',
    tags: ['LGS', 'TYT', 'Asitler', 'Bazlar', 'pH'],
    desc: '0-14 renk skalası, asidik/nötr/bazik bölgeler ve çözelti işaretçileri.',
    defaultParams: {
      marker1Val: '2.5',
      marker1Name: 'X (Limon Suyu)',
      marker2Val: '7.0',
      marker2Name: 'Y (Saf Su)',
      marker3Val: '11.5',
      marker3Name: 'Z (Çamaşır Suyu)'
    },
    presets: [
      { name: 'LGS - X, Y, Z Maddeleri Asitlik Kıyaslama', params: { marker1Val: '3.0', marker1Name: 'X çözeltisi', marker2Val: '7.0', marker2Name: 'Y çözeltisi', marker3Val: '12.0', marker3Name: 'Z çözeltisi' } },
      { name: 'TYT - Günlük Hayat Maddeleri (Mide Asidi - Sabun)', params: { marker1Val: '1.5', marker1Name: 'Mide Özsuyu', marker2Val: '7.4', marker2Name: 'Kan', marker3Val: '10.0', marker3Name: 'Sabunlu Su' } }
    ],
    schema: [
      { key: 'marker1Name', label: '1. Madde Adı', type: 'text' },
      { key: 'marker1Val', label: '1. Madde pH (0-14)', type: 'text' },
      { key: 'marker2Name', label: '2. Madde Adı', type: 'text' },
      { key: 'marker2Val', label: '2. Madde pH (0-14)', type: 'text' },
      { key: 'marker3Name', label: '3. Madde Adı', type: 'text' },
      { key: 'marker3Val', label: '3. Madde pH (0-14)', type: 'text' }
    ],
    renderSvg(p) {
      const startX = 50;
      const endX = 450;
      const barY = 140;
      const barW = endX - startX;
      const barH = 32;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 290" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <defs>
          <linearGradient id="phGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ef4444" />
            <stop offset="25%" stop-color="#f97316" />
            <stop offset="50%" stop-color="#22c55e" />
            <stop offset="75%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#7c3aed" />
          </linearGradient>
        </defs>
        <text x="250" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">pH Skalası (Asitlik - Bazlık Derecesi)</text>

        <rect x="${startX}" y="${barY}" width="${barW}" height="${barH}" rx="6" fill="url(#phGrad)" stroke="#0f172a" stroke-width="2" />

        ${Array.from({ length: 15 }).map((_, i) => {
          const x = startX + (barW / 14) * i;
          return `
            <line x1="${x}" y1="${barY + barH}" x2="${x}" y2="${barY + barH + 6}" stroke="#0f172a" stroke-width="1.5" />
            <text x="${x}" y="${barY + barH + 20}" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${i}</text>
          `;
        }).join('')}

        <text x="${startX + 70}" y="${barY - 14}" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">ASİDİK (0 - 7)</text>
        <text x="${startX + barW / 2}" y="${barY - 14}" text-anchor="middle" font-size="12" font-weight="bold" fill="#15803d">NÖTR (7)</text>
        <text x="${endX - 70}" y="${barY - 14}" text-anchor="middle" font-size="12" font-weight="bold" fill="#6d28d9">BAZİK (7 - 14)</text>
      `;

      const markers = [
        { name: p.marker1Name, val: parseFloat(p.marker1Val), color: '#b91c1c' },
        { name: p.marker2Name, val: parseFloat(p.marker2Val), color: '#15803d' },
        { name: p.marker3Name, val: parseFloat(p.marker3Val), color: '#6d28d9' }
      ].filter(m => !isNaN(m.val) && m.name);

      markers.forEach((m, idx) => {
        const clamped = Math.max(0, Math.min(14, m.val));
        const mX = startX + (barW / 14) * clamped;
        const yTop = 60 + (idx % 2 === 0 ? 0 : 25);

        svg += `
          <g>
            <line x1="${mX}" y1="${yTop + 20}" x2="${mX}" y2="${barY}" stroke="${m.color}" stroke-width="2" />
            <polygon points="${mX},${barY} ${mX - 4},${barY - 8} ${mX + 4},${barY - 8}" fill="${m.color}" />
            <rect x="${mX - 45}" y="${yTop}" width="90" height="20" rx="4" fill="#ffffff" stroke="${m.color}" stroke-width="1.5" />
            <text x="${mX}" y="${yTop + 14}" text-anchor="middle" font-size="10" font-weight="bold" fill="${m.color}">${escSvg(m.name)} (${m.val})</text>
          </g>
        `;
      });

      svg += `</svg>`;
      return svg;
    }
  },

  lewisDot: {
    id: 'lewisDot',
    category: 'kimya',
    name: 'Lewis Nokta Yapısı & Kimyasal Bağlar',
    tags: ['TYT', 'Kimya', 'Lewis', 'Kovalent Bağ', 'İyonik Bağ'],
    desc: 'H2O, NH3, CH4, CO2, NaCl molekülleri, bağlayıcı ve ortaklanmamış elektron çiftleri.',
    defaultParams: {
      molecule: 'H2O',
      showLonePairs: true,
      highlightBonds: true
    },
    presets: [
      { name: 'TYT - H2O Lewis Yapısı (2 Bağ, 2 Ortaklanmamış Çift)', params: { molecule: 'H2O', showLonePairs: true, highlightBonds: true } },
      { name: 'TYT - CO2 Lewis Yapısı (Çift Bağlar: O=C=O)', params: { molecule: 'CO2', showLonePairs: true, highlightBonds: true } },
      { name: 'TYT - NH3 Lewis Yapısı (3 Bağ, 1 Ortaklanmamış Çift)', params: { molecule: 'NH3', showLonePairs: true, highlightBonds: true } },
      { name: 'TYT - İyonik Bağ Lewis Gösterimi ([Na]+ [:Cl:]-)', params: { molecule: 'NaCl', showLonePairs: true } }
    ],
    schema: [
      { key: 'molecule', label: 'Molekül / Bileşik Seçimi', type: 'select', options: [
        { v: 'H2O', l: 'Su (H₂O) — Kırık Doğru' },
        { v: 'CO2', l: 'Karbondioksit (CO₂) — Doğrusal (Çift Bağ)' },
        { v: 'NH3', l: 'Amonyak (NH₃) — Üçgen Piramit' },
        { v: 'CH4', l: 'Metan (CH₄) — Düzgün Dörtyüzlü' },
        { v: 'NaCl', l: 'Sodyum Klorür (NaCl) — İyonik Gösterim' },
        { v: 'N2', l: 'Azot Gazı (N₂) — Üçlü Kovalent Bağ' }
      ]},
      { key: 'showLonePairs', label: 'Ortaklanmamış Değerlik Elektron Çiftlerini Göster', type: 'checkbox' },
      { key: 'highlightBonds', label: 'Bağlayıcı Çiftleri (Çizgi) Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="240" y="26" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Lewis Nokta Yapısı ve Kimyasal Türler</text>
      `;

      const dotPair = (x1, y1, x2, y2) => {
        if (!p.showLonePairs) return '';
        return `<circle cx="${x1}" cy="${y1}" r="3" fill="#dc2626" /><circle cx="${x2}" cy="${y2}" r="3" fill="#dc2626" />`;
      };

      if (p.molecule === 'CO2') {
        // O = C = O
        svg += `
          <!-- Merkez C -->
          <text x="240" y="158" text-anchor="middle" font-size="34" font-weight="bold" fill="#0f172a">C</text>
          <!-- Sol O -->
          <text x="140" y="158" text-anchor="middle" font-size="34" font-weight="bold" fill="#0f172a">O</text>
          <!-- Sağ O -->
          <text x="340" y="158" text-anchor="middle" font-size="34" font-weight="bold" fill="#0f172a">O</text>
          <!-- Çift Bağlar (Sol ve Sağ) -->
          <line x1="165" y1="142" x2="215" y2="142" stroke="#2563eb" stroke-width="3.5" />
          <line x1="165" y1="154" x2="215" y2="154" stroke="#2563eb" stroke-width="3.5" />
          <line x1="265" y1="142" x2="315" y2="142" stroke="#2563eb" stroke-width="3.5" />
          <line x1="265" y1="154" x2="315" y2="154" stroke="#2563eb" stroke-width="3.5" />
          <!-- O üstü ortaklanmamış çiftler -->
          ${dotPair(130, 115, 150, 115)}
          ${dotPair(130, 178, 150, 178)}
          ${dotPair(330, 115, 350, 115)}
          ${dotPair(330, 178, 350, 178)}

          <text x="240" y="245" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">4 Bağlayıcı Çift (2 Çiftli Bağ) • 4 Ortaklanmamış Elektron Çifti</text>
        `;
      } else if (p.molecule === 'NH3') {
        // N merkezli üçgen piramit
        svg += `
          <text x="240" y="145" text-anchor="middle" font-size="34" font-weight="bold" fill="#0f172a">N</text>
          <text x="160" y="210" text-anchor="middle" font-size="28" font-weight="bold" fill="#0f172a">H</text>
          <text x="240" y="235" text-anchor="middle" font-size="28" font-weight="bold" fill="#0f172a">H</text>
          <text x="320" y="210" text-anchor="middle" font-size="28" font-weight="bold" fill="#0f172a">H</text>
          <!-- Bağlar -->
          <line x1="225" y1="155" x2="175" y2="195" stroke="#2563eb" stroke-width="3" />
          <line x1="240" y1="160" x2="240" y2="208" stroke="#2563eb" stroke-width="3" />
          <line x1="255" y1="155" x2="305" y2="195" stroke="#2563eb" stroke-width="3" />
          <!-- N Tepesindeki Ortaklanmamış Çift -->
          ${dotPair(233, 105, 247, 105)}
          <text x="240" y="270" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">3 Bağlayıcı Çift • 1 Ortaklanmamış Elektron Çifti</text>
        `;
      } else if (p.molecule === 'NaCl') {
        // [Na]+ [ :Cl: ]-
        svg += `
          <!-- Na Katyonu -->
          <text x="150" y="158" text-anchor="middle" font-size="36" font-weight="bold" fill="#0f172a">[ Na ]</text>
          <text x="195" y="125" font-size="22" font-weight="bold" fill="#ea580c">⁺</text>
          <!-- Cl Anyonu -->
          <text x="290" y="158" text-anchor="middle" font-size="36" font-weight="bold" fill="#0f172a">[ : Cl : ]</text>
          <text x="350" y="125" font-size="22" font-weight="bold" fill="#ea580c">⁻</text>
          <!-- Cl etrafındaki 8 elektron -->
          ${dotPair(290, 115, 305, 115)}
          ${dotPair(290, 178, 305, 178)}
          <text x="240" y="245" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">İyonik Bağ: Elektron Alışverişi Sonucu Oluşan Elektrostatik Çekim</text>
        `;
      } else {
        // H2O Varsayılan (Kırık doğru)
        svg += `
          <text x="240" y="145" text-anchor="middle" font-size="36" font-weight="bold" fill="#0f172a">O</text>
          <text x="165" y="205" text-anchor="middle" font-size="28" font-weight="bold" fill="#0f172a">H</text>
          <text x="315" y="205" text-anchor="middle" font-size="28" font-weight="bold" fill="#0f172a">H</text>
          <!-- Bağlar -->
          <line x1="225" y1="150" x2="180" y2="188" stroke="#2563eb" stroke-width="3" />
          <line x1="255" y1="150" x2="300" y2="188" stroke="#2563eb" stroke-width="3" />
          <!-- Oksijen Üstü 2 Çift Ortaklanmamış Elektron -->
          ${dotPair(215, 100, 228, 92)}
          ${dotPair(252, 92, 265, 100)}
          <text x="240" y="255" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">2 Bağlayıcı Elektron Çifti • 2 Ortaklanmamış Elektron Çifti</text>
        `;
      }

      svg += `</svg>`;
      return svg;
    }
  },

  // --------------------------------------------------------------------------
  // FİZİK ŞABLONLARI
  // --------------------------------------------------------------------------
  simpleMachines: {
    id: 'simpleMachines',
    category: 'fizik',
    name: 'Makaralar & Basit Makineler',
    tags: ['LGS', 'TYT', 'Basit Makineler', 'Makara', 'Palanga', 'Eğik Düzlem'],
    desc: 'Sabit makara, hareketli makara, palanga, kaldıraç veya eğik düzlem şablonu.',
    defaultParams: {
      type: 'movable',
      loadVal: '60 N',
      forceVal: '30 N'
    },
    presets: [
      { name: 'LGS - Hareketli Makara (Kuvvetten 2 Kat Kazanç: F = G/2)', params: { type: 'movable', loadVal: '60 N', forceVal: '30 N' } },
      { name: 'LGS - Sabit Makara (Kuvvetin Yönü Değişir: F = G)', params: { type: 'fixed', loadVal: '40 N', forceVal: '40 N' } },
      { name: 'LGS/TYT - Eğik Düzlem (h ve L hipotenüs)', params: { type: 'inclined', loadVal: 'P', forceVal: 'F' } }
    ],
    schema: [
      { key: 'type', label: 'Makine Türü', type: 'select', options: [{ v: 'movable', l: 'Hareketli Makara (F = G / 2)' }, { v: 'fixed', l: 'Sabit Makara (F = G)' }, { v: 'inclined', l: 'Eğik Düzlem' }] },
      { key: 'loadVal', label: 'Yük Değeri (G)', type: 'text', hint: 'Örn: 60 N' },
      { key: 'forceVal', label: 'Kuvvet Değeri (F)', type: 'text', hint: 'Örn: 30 N veya ?' }
    ],
    renderSvg(p) {
      if (p.type === 'fixed') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Sabit Makara Sistemi (F = G)</text>

          <line x1="130" y1="50" x2="330" y2="50" stroke="#0f172a" stroke-width="4" />
          ${Array.from({ length: 11 }).map((_, i) => `<line x1="${140 + i * 18}" y1="50" x2="${150 + i * 18}" y2="38" stroke="#0f172a" stroke-width="2" />`).join('')}

          <line x1="230" y1="50" x2="230" y2="100" stroke="#475569" stroke-width="5" />
          <circle cx="230" cy="120" r="35" fill="#f1f5f9" stroke="#0f172a" stroke-width="3" />
          <circle cx="230" cy="120" r="8" fill="#475569" />

          <line x1="195" y1="120" x2="195" y2="240" stroke="#0f172a" stroke-width="2.5" />
          <rect x="170" y="240" width="50" height="45" rx="6" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
          <text x="195" y="268" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">${escSvg(p.loadVal)}</text>
          <text x="195" y="305" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">Yük (G)</text>

          <line x1="265" y1="120" x2="265" y2="230" stroke="#0f172a" stroke-width="2.5" />
          <polygon points="265,245 259,230 271,230" fill="#dc2626" />
          <text x="300" y="242" font-size="13" font-weight="bold" fill="#dc2626">F = ${escSvg(p.forceVal)}</text>
        </svg>`;
      }

      if (p.type === 'inclined') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 320" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="245" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Eğik Düzlem (Kuvvet Kazancı)</text>

          <polygon points="80,260 400,260 400,100" fill="#f8fafc" stroke="#0f172a" stroke-width="3" />
          <path d="M 120 260 A 40 40 0 0 0 115 240" fill="none" stroke="#dc2626" stroke-width="2" />
          <text x="135" y="252" font-size="12" font-weight="bold" fill="#dc2626">α</text>

          <line x1="415" y1="100" x2="415" y2="260" stroke="#64748b" stroke-width="1.8" />
          <line x1="410" y1="100" x2="420" y2="100" stroke="#64748b" stroke-width="1.8" />
          <line x1="410" y1="260" x2="420" y2="260" stroke="#64748b" stroke-width="1.8" />
          <text x="435" y="185" font-size="12" font-weight="bold" fill="#475569">h</text>

          <text x="220" y="150" font-size="12" font-weight="bold" fill="#475569" transform="rotate(-26 220 150)">Uzunluk (L)</text>

          <g transform="translate(240, 180) rotate(-26.5)">
            <rect x="-25" y="-35" width="50" height="35" rx="4" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
            <text x="0" y="-13" text-anchor="middle" font-size="12" font-weight="bold" fill="#9a3412">${escSvg(p.loadVal)}</text>
            
            <line x1="25" y1="-18" x2="65" y2="-18" stroke="#dc2626" stroke-width="2.5" />
            <polygon points="75,-18 63,-23 63,-13" fill="#dc2626" />
            <text x="85" y="-14" font-size="12" font-weight="bold" fill="#dc2626">F = ${escSvg(p.forceVal)}</text>
          </g>

          <text x="245" y="300" text-anchor="middle" font-size="11" fill="#64748b">Kuvvet Kazancı: F · L = G · h</text>
        </svg>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 360" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Hareketli Makara Sistemi (F = G / 2)</text>

        <line x1="130" y1="50" x2="330" y2="50" stroke="#0f172a" stroke-width="4" />
        ${Array.from({ length: 11 }).map((_, i) => `<line x1="${140 + i * 18}" y1="50" x2="${150 + i * 18}" y2="38" stroke="#0f172a" stroke-width="2" />`).join('')}

        <circle cx="195" cy="54" r="4" fill="#0f172a" />
        <line x1="195" y1="54" x2="195" y2="180" stroke="#0f172a" stroke-width="2.5" />

        <path d="M 195 180 A 35 35 0 0 0 265 180" fill="none" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="230" cy="180" r="35" fill="#f1f5f9" stroke="#0f172a" stroke-width="3" />
        <circle cx="230" cy="180" r="8" fill="#475569" />

        <line x1="230" y1="188" x2="230" y2="240" stroke="#0f172a" stroke-width="3" />
        <rect x="205" y="240" width="50" height="45" rx="6" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
        <text x="230" y="268" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">${escSvg(p.loadVal)}</text>
        <text x="230" y="305" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">Yük (G)</text>

        <line x1="265" y1="180" x2="265" y2="75" stroke="#0f172a" stroke-width="2.5" />
        <polygon points="265,60 259,75 271,75" fill="#dc2626" />
        <text x="290" y="72" font-size="13" font-weight="bold" fill="#dc2626">F = ${escSvg(p.forceVal)}</text>
      </svg>`;
    }
  },

  opticsRay: {
    id: 'opticsRay',
    category: 'fizik',
    name: 'Optik: Işığın Kırılması & Aynalar',
    tags: ['TYT', 'Optik', 'Kırılma', 'Snell', 'Yansıma'],
    desc: 'Az yoğundan çok yoğuna normale yaklaşma, sınır açısı veya düzlem ayna yansıması.',
    defaultParams: {
      scenario: 'dense',
      angle1: '50°',
      angle2: '30°',
      medium1: 'n₁ (Hava / Az Yoğun)',
      medium2: 'n₂ (Cam / Çok Yoğun)'
    },
    presets: [
      { name: 'TYT - Az Yoğundan Çok Yoğuna (Normale Yaklaşma)', params: { scenario: 'dense', angle1: '50°', angle2: '30°', medium1: 'Hava (n₁)', medium2: 'Cam (n₂ > n₁)' } },
      { name: 'TYT - Tam Yansıma & Sınır Açısı Sorusu', params: { scenario: 'rare', angle1: '42°', angle2: '90°', medium1: 'Su (n₁)', medium2: 'Hava (n₂ < n₁)' } },
      { name: 'TYT - Düzlem Aynada Yansıma Kanunu (θg = θy)', params: { scenario: 'mirror', angle1: '40°', angle2: '40°' } }
    ],
    schema: [
      { key: 'scenario', label: 'Optik Olayı', type: 'select', options: [{ v: 'dense', l: 'Az Yoğundan Çok Yoğuna (Normale Yaklaşma)' }, { v: 'rare', l: 'Çok Yoğundan Az Yoğuna (Normalden Uzaklaşma / Sınır Açısı)' }, { v: 'mirror', l: 'Düzlem Aynada Yansıma' }] },
      { key: 'medium1', label: '1. Ortam İsmi', type: 'text' },
      { key: 'medium2', label: '2. Ortam İsmi', type: 'text' },
      { key: 'angle1', label: 'Gelme Açısı (α)', type: 'text' },
      { key: 'angle2', label: 'Kırılma / Yansıma Açısı (β)', type: 'text' }
    ],
    renderSvg(p) {
      if (p.scenario === 'mirror') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 300" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Düzlem Aynada Yansıma (θ_gelen = θ_yansıyan)</text>

          <line x1="60" y1="220" x2="400" y2="220" stroke="#0f172a" stroke-width="3" />
          ${Array.from({ length: 17 }).map((_, i) => `<line x1="${70 + i * 20}" y1="220" x2="${60 + i * 20}" y2="232" stroke="#64748b" stroke-width="1.8" />`).join('')}

          <line x1="230" y1="60" x2="230" y2="220" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,4" />
          <text x="230" y="50" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">Normal (N)</text>

          <line x1="110" y1="100" x2="230" y2="220" stroke="#2563eb" stroke-width="2.5" />
          <polygon points="175,165 163,161 171,153" fill="#2563eb" />
          <text x="100" y="90" font-size="11" font-weight="bold" fill="#2563eb">Gelen Işın</text>

          <line x1="230" y1="220" x2="350" y2="100" stroke="#16a34a" stroke-width="2.5" />
          <polygon points="295,155 303,167 291,167" fill="#16a34a" />
          <text x="350" y="90" font-size="11" font-weight="bold" fill="#16a34a">Yansıyan Işın</text>

          <path d="M 215 170 A 40 40 0 0 1 230 160" fill="none" stroke="#2563eb" stroke-width="1.8" />
          <text x="210" y="150" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.angle1)}</text>

          <path d="M 230 160 A 40 40 0 0 1 245 170" fill="none" stroke="#16a34a" stroke-width="1.8" />
          <text x="250" y="150" font-size="11" font-weight="bold" fill="#16a34a">${escSvg(p.angle2)}</text>
        </svg>`;
      }

      const isDense = p.scenario === 'dense';
      const kX = isDense ? 280 : 330;

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 340" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Işığın Kırılması (Snell Yasası: n₁ · sin α = n₂ · sin β)</text>

        <line x1="50" y1="170" x2="410" y2="170" stroke="#0f172a" stroke-width="2.5" />
        <rect x="50" y="45" width="360" height="125" fill="#f8fafc" />
        <rect x="50" y="170" width="360" height="135" fill="${isDense ? '#dbeafe' : '#f1f5f9'}" />

        <text x="70" y="75" font-size="12" font-weight="bold" fill="#1e3a8a">${escSvg(p.medium1)}</text>
        <text x="70" y="200" font-size="12" font-weight="bold" fill="#1e3a8a">${escSvg(p.medium2)}</text>

        <line x1="230" y1="55" x2="230" y2="295" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5,4" />
        <text x="230" y="50" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">Normal (N)</text>

        <line x1="120" y1="80" x2="230" y2="170" stroke="#2563eb" stroke-width="2.5" />
        <polygon points="180,129 168,126 177,117" fill="#2563eb" />
        
        <line x1="230" y1="170" x2="${kX}" y2="280" stroke="#16a34a" stroke-width="2.5" />
        <polygon points="${(230 + kX) / 2},225 ${(230 + kX) / 2 - 8},215 ${(230 + kX) / 2 + 4},215" fill="#16a34a" />

        <path d="M 205 140 A 35 35 0 0 1 230 135" fill="none" stroke="#2563eb" stroke-width="1.8" />
        <text x="210" y="125" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.angle1)}</text>

        <path d="M 230 205 A 35 35 0 0 0 ${(230 + kX) / 2} 200" fill="none" stroke="#16a34a" stroke-width="1.8" />
        <text x="245" y="215" font-size="11" font-weight="bold" fill="#16a34a">${escSvg(p.angle2)}</text>
      </svg>`;
    }
  },

  dynamicsFBD: {
    id: 'dynamicsFBD',
    category: 'fizik',
    name: 'Kuvvet & Serbest Cisim Diyagramı (FBD)',
    tags: ['TYT', 'Dinamik', 'Kuvvet', 'Sürtünme', 'Newton'],
    desc: 'Yatay zemin üzerinde kütle bloğu ve etkiyen kuvvet vektörleri (F, fs, N, G).',
    defaultParams: {
      mass: 'm = 4 kg',
      forceF: 'F = 20 N',
      frictionFs: 'fs = 4 N',
      showFriction: true,
      showNormal: true,
      showWeight: true
    },
    presets: [
      { name: 'TYT - Yatay Sürtünmeli Zeminde Çekilen Cisim (F ve fs)', params: { mass: 'm', forceF: 'F', frictionFs: 'fs', showFriction: true, showNormal: false, showWeight: false } },
      { name: 'TYT/AYT - 4 Kuvvetin Tümünün Gösterildiği Serbest Cisim Diyagramı', params: { mass: '2 kg', forceF: '30 N', frictionFs: '10 N', showFriction: true, showNormal: true, showWeight: true } }
    ],
    schema: [
      { key: 'mass', label: 'Kütle Değeri', type: 'text' },
      { key: 'forceF', label: 'Çekme Kuvveti (F)', type: 'text' },
      { key: 'frictionFs', label: 'Sürtünme Kuvveti (fs)', type: 'text' },
      { key: 'showFriction', label: 'Sürtünme Kuvvetini Göster', type: 'checkbox' },
      { key: 'showNormal', label: 'Yüzey Tepki Kuvvetini (N) Göster', type: 'checkbox' },
      { key: 'showWeight', label: 'Yerçekimi / Ağırlığı (G=mg) Göster', type: 'checkbox' }
    ],
    renderSvg(p) {
      const bX = 230;
      const bY = 160;
      const bW = 80;
      const bH = 60;

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="250" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Serbest Cisim Diyagramı (Newton Hareket Yasaları)</text>

        <line x1="60" y1="${bY + bH / 2}" x2="440" y2="${bY + bH / 2}" stroke="#0f172a" stroke-width="2.5" />
        ${Array.from({ length: 19 }).map((_, i) => `<line x1="${75 + i * 19}" y1="${bY + bH / 2}" x2="${65 + i * 19}" y2="${bY + bH / 2 + 10}" stroke="#64748b" stroke-width="1.5" />`).join('')}

        <rect x="${bX - bW / 2}" y="${bY - bH / 2}" width="${bW}" height="${bH}" rx="4" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" />
        <text x="${bX}" y="${bY + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">${escSvg(p.mass)}</text>

        <line x1="${bX + bW / 2}" y1="${bY}" x2="${bX + bW / 2 + 90}" y2="${bY}" stroke="#2563eb" stroke-width="3" />
        <polygon points="${bX + bW / 2 + 100},${bY} ${bX + bW / 2 + 88},${bY - 5} ${bX + bW / 2 + 88},${bY + 5}" fill="#2563eb" />
        <text x="${bX + bW / 2 + 50}" y="${bY - 10}" text-anchor="middle" font-size="12" font-weight="bold" fill="#1d4ed8">${escSvg(p.forceF)}</text>

        ${p.showFriction ? `
          <line x1="${bX - bW / 2}" y1="${bY + bH / 2 - 4}" x2="${bX - bW / 2 - 70}" y2="${bY + bH / 2 - 4}" stroke="#dc2626" stroke-width="2.5" />
          <polygon points="${bX - bW / 2 - 80},${bY + bH / 2 - 4} ${bX - bW / 2 - 68},${bY + bH / 2 - 9} ${bX - bW / 2 - 68},${bY + bH / 2 + 1}" fill="#dc2626" />
          <text x="${bX - bW / 2 - 45}" y="${bY + bH / 2 - 14}" text-anchor="middle" font-size="12" font-weight="bold" fill="#b91c1c">${escSvg(p.frictionFs)}</text>
        ` : ''}

        ${p.showNormal ? `
          <line x1="${bX}" y1="${bY - bH / 2}" x2="${bX}" y2="${bY - bH / 2 - 65}" stroke="#16a34a" stroke-width="2.5" />
          <polygon points="${bX},${bY - bH / 2 - 75} ${bX - 5},${bY - bH / 2 - 63} ${bX + 5},${bY - bH / 2 - 63}" fill="#16a34a" />
          <text x="${bX + 16}" y="${bY - bH / 2 - 40}" font-size="12" font-weight="bold" fill="#15803d">N (Tepki)</text>
        ` : ''}

        ${p.showWeight ? `
          <line x1="${bX}" y1="${bY + bH / 2}" x2="${bX}" y2="${bY + bH / 2 + 65}" stroke="#9333ea" stroke-width="2.5" />
          <polygon points="${bX},${bY + bH / 2 + 75} ${bX - 5},${bY + bH / 2 + 63} ${bX + 5},${bY + bH / 2 + 63}" fill="#9333ea" />
          <text x="${bX + 16}" y="${bY + bH / 2 + 45}" font-size="12" font-weight="bold" fill="#7e22ce">G = m·g</text>
        ` : ''}
      </svg>`;
    }
  },

  liquidPressure: {
    id: 'liquidPressure',
    category: 'fizik',
    name: 'Sıvı Basıncı & U Borusu / Taşırma',
    tags: ['LGS', 'TYT', 'Basınç', 'U Borusu', 'Kaldırma Kuvveti'],
    desc: 'U borusunda karışmayan sıvı dengesi (h1·d1 = h2·d2) veya taşırma kabı.',
    defaultParams: {
      type: 'utube',
      density1: 'd₁ (Su)',
      density2: 'd₂ (Cıva)',
      height1: '2h',
      height2: 'h'
    },
    presets: [
      { name: 'LGS/TYT - U Borusunda Karışmayan Sıvı Yoğunluk Dengesi', params: { type: 'utube', density1: 'd₁', density2: 'd₂', height1: '3h', height2: 'h' } },
      { name: 'TYT - Kaldırma Kuvveti (K, L, M Yüzen/Askıda/Batan)', params: { type: 'buoyancy' } }
    ],
    schema: [
      { key: 'type', label: 'Deney Düzeneği', type: 'select', options: [{ v: 'utube', l: 'U Borusu Sıvı Dengesi' }, { v: 'buoyancy', l: 'Kaldırma Kuvveti (Yüzen, Askıda, Batan Cisimler)' }] },
      { key: 'density1', label: '1. Sıvı Yoğunluğu (d1)', type: 'text' },
      { key: 'density2', label: '2. Sıvı Yoğunluğu (d2)', type: 'text' },
      { key: 'height1', label: '1. Sıvı Yüksekliği (Sol)', type: 'text' },
      { key: 'height2', label: '2. Sıvı Yüksekliği (Sağ)', type: 'text' }
    ],
    renderSvg(p) {
      if (p.type === 'buoyancy') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 320" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
          <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">Sıvıların Kaldırma Kuvveti (F_K = V_batan · d_sıvı · g)</text>

          <rect x="90" y="80" width="280" height="200" rx="4" fill="#eff6ff" stroke="#0f172a" stroke-width="3" />
          <line x1="90" y1="120" x2="370" y2="120" stroke="#0284c7" stroke-width="2" />
          <text x="350" y="112" font-size="11" font-weight="bold" fill="#0369a1">d_sıvı</text>

          <g transform="translate(145, 120)">
            <rect x="-22" y="-22" width="44" height="44" rx="4" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
            <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">K</text>
            <text x="0" y="38" text-anchor="middle" font-size="10" font-weight="bold" fill="#475569">d_K &lt; d_sıvı</text>
          </g>

          <g transform="translate(230, 180)">
            <rect x="-22" y="-22" width="44" height="44" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
            <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#854d0e">L</text>
            <text x="0" y="38" text-anchor="middle" font-size="10" font-weight="bold" fill="#475569">d_L = d_sıvı</text>
          </g>

          <g transform="translate(315, 256)">
            <rect x="-22" y="-22" width="44" height="44" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />
            <text x="0" y="5" text-anchor="middle" font-size="13" font-weight="bold" fill="#991b1b">M</text>
            <text x="0" y="-28" text-anchor="middle" font-size="10" font-weight="bold" fill="#475569">d_M &gt; d_sıvı</text>
          </g>
        </svg>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 340" width="100%" height="100%" style="font-family:'Noto Sans',sans-serif;">
        <text x="230" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">U Borusunda Karışmayan Sıvı Dengesi</text>

        <path d="M 140 70 L 140 250 A 40 40 0 0 0 220 290 L 240 290 A 40 40 0 0 0 320 250 L 320 70" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        <path d="M 190 70 L 190 240 A 15 15 0 0 0 205 255 L 255 255 A 15 15 0 0 0 270 240 L 270 70" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />

        <path d="M 141 210 L 189 210 L 189 240 A 15 15 0 0 0 205 255 L 255 255 A 15 15 0 0 0 270 240 L 270 160 L 319 160 L 319 250 A 40 40 0 0 1 240 290 L 220 290 A 40 40 0 0 1 141 250 Z" fill="#cbd5e1" />
        <text x="230" y="275" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">${escSvg(p.density2)}</text>

        <rect x="141" y="100" width="48" height="110" fill="#93c5fd" />
        <text x="165" y="150" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">${escSvg(p.density1)}</text>

        <line x1="120" y1="210" x2="340" y2="210" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,3" />
        <text x="350" y="214" font-size="10" font-weight="bold" fill="#dc2626">Denge Çizgisi</text>

        <line x1="125" y1="100" x2="125" y2="210" stroke="#2563eb" stroke-width="1.5" />
        <line x1="120" y1="100" x2="130" y2="100" stroke="#2563eb" stroke-width="1.5" />
        <line x1="120" y1="210" x2="130" y2="210" stroke="#2563eb" stroke-width="1.5" />
        <text x="110" y="155" text-anchor="end" font-size="11" font-weight="bold" fill="#2563eb">${escSvg(p.height1)}</text>

        <line x1="335" y1="160" x2="335" y2="210" stroke="#475569" stroke-width="1.5" />
        <line x1="330" y1="160" x2="340" y2="160" stroke="#475569" stroke-width="1.5" />
        <line x1="330" y1="210" x2="340" y2="210" stroke="#475569" stroke-width="1.5" />
        <text x="350" y="185" font-size="11" font-weight="bold" fill="#475569">${escSvg(p.height2)}</text>

        <text x="230" y="325" text-anchor="middle" font-size="11" fill="#475569">Sıvı Basıncı Dengesi: h₁ · d₁ = h₂ · d₂</text>
      </svg>`;
    }
  }
};

function escSvg(str) {
  return String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// ============================================================================
// 2. SVG -> PNG 2X RETINA EXPORTER
// ============================================================================

function svgToDataUrl(svgString, scale = 2) {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = (img.width || 520) * scale;
        canvas.height = (img.height || 360) * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png', 0.95));
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

// ============================================================================
// 3. MODAL YÖNETİMİ & ETKİLEŞİM MANTIĞI
// ============================================================================

function setOnScienceInsertCallback(fn) {
  onScienceInsertCallback = fn;
}

function openScienceModal(callback, onCancel) {
  if (typeof callback === 'function') {
    onScienceInsertCallback = callback;
  }
  if (typeof onCancel === 'function') {
    onScienceCancelCallback = onCancel;
  } else {
    onScienceCancelCallback = null;
  }
  openModal('scienceModal');
  renderCategoryTabs();
  renderTemplateList();
  selectTemplate(activeTemplateId);
}

function closeScienceModal() {
  closeModal('scienceModal');
  if (typeof onScienceCancelCallback === 'function') {
    const cb = onScienceCancelCallback;
    onScienceCancelCallback = null;
    cb();
  }
}

function renderCategoryTabs() {
  const tabs = document.querySelectorAll('.sci-cat-tab');
  tabs.forEach(tab => {
    const isAct = tab.dataset.cat === activeCategory;
    tab.className = `sci-cat-tab px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
      isAct ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;
  });
}

function renderTemplateList() {
  const listEl = $('sciTemplateList');
  if (!listEl) return;
  listEl.innerHTML = '';

  const q = ($('sciSearchInput')?.value || '').toLowerCase().trim();

  const entries = Object.values(SCIENCE_TEMPLATES).filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (q && !t.name.toLowerCase().includes(q) && !t.desc.toLowerCase().includes(q) && !t.tags.some(tg => tg.toLowerCase().includes(q))) {
      return false;
    }
    return true;
  });

  if (!entries.length) {
    listEl.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">Eşleşen şablon bulunamadı.</div>`;
    return;
  }

  entries.forEach(t => {
    const isAct = t.id === activeTemplateId;
    const catIcon = t.category === 'cografya' ? '🌍' : (t.category === 'biyoloji' ? '🧬' : (t.category === 'kimya' ? '🧪' : '⚡'));
    const catBadgeColor = t.category === 'cografya' ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300' :
      (t.category === 'biyoloji' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' :
      (t.category === 'kimya' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300' : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300'));

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 ${
      isAct ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900 dark:bg-slate-800 dark:border-slate-100 dark:ring-slate-100' : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800'
    }`;

    card.innerHTML = `
      <span class="text-xl shrink-0 p-1 rounded-lg bg-white shadow-xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">${catIcon}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-bold text-slate-900 truncate dark:text-slate-100">${escSvg(t.name)}</span>
        </div>
        <p class="text-[10.5px] text-slate-500 line-clamp-2 mt-0.5 leading-snug dark:text-slate-400">${escSvg(t.desc)}</p>
        <div class="flex items-center gap-1 mt-1.5 flex-wrap">
          <span class="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded border ${catBadgeColor}">${t.category}</span>
          ${t.tags.slice(0, 2).map(tag => `<span class="text-[9px] text-slate-400 dark:text-slate-500">#${tag}</span>`).join(' ')}
        </div>
      </div>
    `;

    card.onclick = () => selectTemplate(t.id);
    listEl.appendChild(card);
  });
}

function selectTemplate(templateId) {
  const tpl = SCIENCE_TEMPLATES[templateId];
  if (!tpl) return;
  activeTemplateId = templateId;
  currentParams = JSON.parse(JSON.stringify(tpl.defaultParams || {}));
  currentParams._overlays = [];
  setSelectedOverlayId(null);

  renderTemplateList();
  renderPresets(tpl);
  renderSchemaControls(tpl);
  updateLivePreview();
}

function renderPresets(tpl) {
  const presetBox = $('sciPresetBox');
  if (!presetBox) return;
  presetBox.innerHTML = '';

  if (!tpl.presets || !tpl.presets.length) {
    presetBox.classList.add('hidden');
    return;
  }
  presetBox.classList.remove('hidden');

  const title = document.createElement('span');
  title.className = 'text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1';
  title.textContent = 'TYT & LGS Çıkmış Soru Hazır Ayarları:';
  presetBox.appendChild(title);

  const wrap = document.createElement('div');
  wrap.className = 'flex flex-wrap gap-1.5';

  tpl.presets.forEach(pr => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-[11px] font-medium px-2 py-1 rounded-lg border border-slate-200 bg-white hover:border-slate-900 hover:text-slate-900 text-slate-600 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-100';
    btn.textContent = `★ ${pr.name}`;
    btn.onclick = () => {
      Object.assign(currentParams, pr.params);
      renderSchemaControls(tpl);
      updateLivePreview();
    };
    wrap.appendChild(btn);
  });
  presetBox.appendChild(wrap);
}

function renderSchemaControls(tpl) {
  const container = $('sciParamControls');
  if (!container) return;
  container.innerHTML = '';

  tpl.schema.forEach(field => {
    const val = currentParams[field.key] !== undefined ? currentParams[field.key] : tpl.defaultParams[field.key];
    const row = document.createElement('div');
    row.className = 'space-y-1';

    if (field.type === 'checkbox') {
      row.className = 'flex items-center gap-2 pt-1';
      row.innerHTML = `
        <input type="checkbox" id="field_${field.key}" class="rounded border-slate-300 dark:border-slate-700" ${val ? 'checked' : ''}>
        <label for="field_${field.key}" class="text-[12px] font-medium text-slate-700 dark:text-slate-300 select-none cursor-pointer">${escSvg(field.label)}</label>
      `;
      const input = row.querySelector('input');
      input.onchange = (e) => {
        currentParams[field.key] = e.target.checked;
        updateLivePreview();
      };
    } else if (field.type === 'select') {
      row.innerHTML = `
        <label class="lbl text-[11px] font-semibold text-slate-700 dark:text-slate-300">${escSvg(field.label)}</label>
        <select class="inp text-[12px] !py-1.5" id="field_${field.key}">
          ${field.options.map(opt => `<option value="${opt.v}" ${val === opt.v ? 'selected' : ''}>${opt.l}</option>`).join('')}
        </select>
      `;
      const select = row.querySelector('select');
      select.onchange = (e) => {
        currentParams[field.key] = e.target.value;
        updateLivePreview();
      };
    } else {
      row.innerHTML = `
        <div class="flex items-center justify-between">
          <label class="lbl text-[11px] font-semibold text-slate-700 dark:text-slate-300">${escSvg(field.label)}</label>
          ${field.hint ? `<span class="text-[10px] text-slate-400">${escSvg(field.hint)}</span>` : ''}
        </div>
        <input class="inp text-[12px] !py-1.5" id="field_${field.key}" value="${escSvg(val || '')}">
      `;
      const input = row.querySelector('input');
      input.oninput = (e) => {
        currentParams[field.key] = e.target.value;
        updateLivePreview();
      };
    }

    container.appendChild(row);
  });
}

function updateLivePreview() {
  const stage = $('sciPreviewStage');
  if (!stage) return;

  const tpl = SCIENCE_TEMPLATES[activeTemplateId];
  if (!tpl) return;

  let svgStr = tpl.renderSvg(currentParams);
  svgStr = injectOverlaysIntoSvg(svgStr, currentParams);
  stage.innerHTML = svgStr;

  const infoEl = $('sciSelectedInfo');
  setupStageInteractions(
    stage,
    currentParams,
    () => updateLivePreview(),
    (sel) => {
      if (infoEl) {
        if (!sel) {
          infoEl.classList.add('hidden');
          infoEl.textContent = '';
        } else {
          infoEl.classList.remove('hidden');
          if (sel.type === 'organelle') {
            infoEl.textContent = `Seçili: Organel (${sel.key})`;
          } else if (sel.type === 'symbol') {
            infoEl.textContent = `Seçili: Devre Bileşeni`;
          } else if (sel.type === 'formula') {
            infoEl.textContent = `Seçili: Formül`;
          } else if (sel.type === 'arrow') {
            infoEl.textContent = `Seçili: İşaret Oku`;
          } else if (sel.type === 'pin' || sel.type === 'mapPin') {
            infoEl.textContent = `Seçili: Harita Pini`;
          } else if (sel.type === 'text') {
            infoEl.textContent = `Seçili: Metin Notu`;
          } else {
            infoEl.textContent = `Seçili Öğe: ${sel.type}`;
          }
        }
      }
    }
  );
}

// ============================================================================
// 4. BAŞLATICI & OLAY DİNLEYİCİLERİ
// ============================================================================

function initScienceTemplates() {
  const searchInp = $('sciSearchInput');
  if (searchInp) {
    searchInp.oninput = () => renderTemplateList();
  }

  document.querySelectorAll('.sci-cat-tab').forEach(btn => {
    btn.onclick = () => {
      activeCategory = btn.dataset.cat;
      renderCategoryTabs();
      renderTemplateList();
    };
  });

  const closeBtn = $('sciModalClose');
  if (closeBtn) closeBtn.onclick = closeScienceModal;
  const cancelBtn = $('sciModalCancel');
  if (cancelBtn) cancelBtn.onclick = closeScienceModal;

  // İnteraktif Katman Araç Çubuğu Butonları
  const addSymbolBtn = $('sciToolAddSymbol');
  if (addSymbolBtn) {
    addSymbolBtn.onclick = () => {
      const choice = prompt(
        'Eklenecek devre bileşeni türünü seçin:\n1 - Direnç (Kutu)\n2 - Direnç (Zigzag)\n3 - Pil / Üreteç (+/-)\n4 - Açık Anahtar\n5 - Kapalı Anahtar\n6 - Lamba\n7 - Voltmetre (V)\n8 - Ampermetre (A)\n9 - Sığaç / Kapasitör (C)',
        '1'
      );
      if (!choice) return;
      const map = {
        '1': 'resistor',
        '2': 'resistor_zigzag',
        '3': 'battery',
        '4': 'switch_open',
        '5': 'switch_closed',
        '6': 'bulb',
        '7': 'voltmeter',
        '8': 'ammeter',
        '9': 'capacitor'
      };
      const symbol = map[choice.trim()] || 'resistor';
      let defaultLabel = (symbol === 'resistor' || symbol === 'resistor_zigzag') ? 'R' : (symbol === 'battery' ? 'V' : (symbol === 'bulb' ? 'K' : ''));
      const label = prompt('Bileşen etiketi / adı (İsteğe bağlı, örn: R1, V, Lamba, K):', defaultLabel);
      let defaultVal = (symbol === 'resistor' || symbol === 'resistor_zigzag') ? '6 Ω' : (symbol === 'battery' ? '12 V' : '');
      const val = prompt('Bileşen sayısal değeri / birimi (İsteğe bağlı, örn: 6 Ω, 12 V, 2 A):', defaultVal);
      addOverlayItem(currentParams, 'symbol', {
        symbol,
        label: label || '',
        val: val || '',
        x: 260,
        y: 170
      });
      updateLivePreview();
    };
  }

  const addFormulaBtn = $('sciToolAddFormula');
  if (addFormulaBtn) {
    addFormulaBtn.onclick = () => {
      const formula = prompt(
        'Matematiksel / Fiziksel Formül yazın:\n(Örn: V = I \\times R, E = mc^2, F_net = m \\cdot a, \\lambda = v / f, P = h \\cdot d \\cdot g):',
        'V = I \\times R'
      );
      if (formula) {
        addOverlayItem(currentParams, 'formula', {
          text: formula,
          x: 240,
          y: 170,
          size: 16
        });
        updateLivePreview();
      }
    };
  }

  const addTextBtn = $('sciToolAddText');
  if (addTextBtn) {
    addTextBtn.onclick = () => {
      const text = prompt('Eklenecek metin / not:', 'Önemli Not');
      if (text) {
        addOverlayItem(currentParams, 'text', {
          text,
          x: 240,
          y: 170,
          size: 13
        });
        updateLivePreview();
      }
    };
  }

  const addArrowBtn = $('sciToolAddArrow');
  if (addArrowBtn) {
    addArrowBtn.onclick = () => {
      const label = prompt('Ok üzerine kuvvet / yön etiketi (İsteğe bağlı, örn: F, v, Akım, Boğaz):', '');
      addOverlayItem(currentParams, 'arrow', {
        x1: 200,
        y1: 170,
        x2: 300,
        y2: 170,
        label: label || '',
        color: '#dc2626'
      });
      updateLivePreview();
    };
  }

  const addPinBtn = $('sciToolAddPin');
  if (addPinBtn) {
    addPinBtn.onclick = () => {
      const label = prompt('Pin numarası veya harfi (örn: I, II, III, A, B, 1, 2):', 'I');
      if (label === null) return;
      const text = prompt('Pin açıklama metni (İsteğe bağlı, örn: Çukurova Deltası, Rize, Kapıdağ Tombolosu):', '');
      if (currentParams.pins && Array.isArray(currentParams.pins)) {
        const id = 'p_' + Date.now();
        currentParams.pins.push({
          id,
          x: 260,
          y: 150,
          label: label || 'I',
          text: text || '',
          color: '#dc2626'
        });
      } else {
        addOverlayItem(currentParams, 'pin', {
          label: label || 'I',
          text: text || '',
          color: '#dc2626',
          x: 260,
          y: 150
        });
      }
      updateLivePreview();
    };
  }

  const deleteSelectedBtn = $('sciToolDeleteSelected');
  if (deleteSelectedBtn) {
    deleteSelectedBtn.onclick = () => {
      const deleted = deleteSelectedOverlayItem(currentParams);
      if (!deleted) {
        alert('Lütfen önce silmek istediğiniz bir öğeyi (katman, pin veya devre bileşeni) tuval üzerinde tıklayarak seçin.');
      } else {
        updateLivePreview();
      }
    };
  }

  const resetOverlaysBtn = $('sciToolResetOverlays');
  if (resetOverlaysBtn) {
    resetOverlaysBtn.onclick = () => {
      if (confirm('Eklenen tüm katmanları ve taşımaları sıfırlamak istiyor musunuz?')) {
        const tpl = SCIENCE_TEMPLATES[activeTemplateId];
        if (tpl) {
          currentParams = JSON.parse(JSON.stringify(tpl.defaultParams || {}));
          currentParams._overlays = [];
          setSelectedOverlayId(null);
          renderSchemaControls(tpl);
          updateLivePreview();
        }
      }
    };
  }

  const insertBtn = $('sciModalInsert');
  if (insertBtn) {
    insertBtn.onclick = async () => {
      const tpl = SCIENCE_TEMPLATES[activeTemplateId];
      if (!tpl) return;
      let svgStr = tpl.renderSvg(currentParams);
      svgStr = injectOverlaysIntoSvg(svgStr, currentParams);

      insertBtn.disabled = true;
      const oldText = insertBtn.textContent;
      insertBtn.textContent = 'Ekleniyor...';

      try {
        const dataUrl = await svgToDataUrl(svgStr, 2);
        if (typeof onScienceInsertCallback === 'function') {
          onScienceInsertCallback(dataUrl, tpl.name, tpl.category);
        }
        closeScienceModal();
      } catch (err) {
        console.error('Fen şablonu dışa aktarma hatası:', err);
        alert('Görsel oluşturulurken bir hata meydana geldi.');
      } finally {
        insertBtn.disabled = false;
        insertBtn.textContent = oldText;
      }
    };
  }

  const downloadBtn = $('sciModalDownload');
  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      const tpl = SCIENCE_TEMPLATES[activeTemplateId];
      if (!tpl) return;
      let svgStr = tpl.renderSvg(currentParams);
      svgStr = injectOverlaysIntoSvg(svgStr, currentParams);
      try {
        const dataUrl = await svgToDataUrl(svgStr, 2);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${tpl.id}_${Date.now()}.png`;
        a.click();
      } catch (e) {
        console.error(e);
      }
    };
  }

  const copySvgBtn = $('sciModalCopySvg');
  if (copySvgBtn) {
    copySvgBtn.onclick = async () => {
      const tpl = SCIENCE_TEMPLATES[activeTemplateId];
      if (!tpl) return;
      let svgStr = tpl.renderSvg(currentParams);
      svgStr = injectOverlaysIntoSvg(svgStr, currentParams);
      try {
        await navigator.clipboard.writeText(svgStr);
        const old = copySvgBtn.textContent;
        copySvgBtn.textContent = 'Kopyalandı!';
        setTimeout(() => { copySvgBtn.textContent = old; }, 1500);
      } catch (e) {
        alert('SVG kopyalanamadı.');
      }
    };
  }
}


// Module Exports
__exports['SCIENCE_TEMPLATES'] = SCIENCE_TEMPLATES;
__exports['svgToDataUrl'] = svgToDataUrl;
__exports['setOnScienceInsertCallback'] = setOnScienceInsertCallback;
__exports['openScienceModal'] = openScienceModal;
__exports['closeScienceModal'] = closeScienceModal;
__exports['initScienceTemplates'] = initScienceTemplates;

});

__define('modules/textModal.js', function(__exports, __require, __module) {
const { questions, MAX, LETTERS } = __require('state.js');
const { $, uid, esc, openModal, closeModal, warnText, clearWarn } = __require('utils.js');
const { openGeometryModal } = __require('modules/geometryDrawer.js');
const { openScienceModal } = __require('modules/scienceTemplates.js');

let editingId = null;
let questionKind = 'coktan';
let questionLevel = 'orta';
let blankItems = [''];
let blankAnswers = [''];
let txtImgSrc = null;
let blankImgSrc = null;
let onSaveCallback = null;

function setOnSaveCallback(fn) {
  onSaveCallback = fn;
}

function renderBlankList() {
  const list = $('blankQList');
  if (!list) return;
  list.innerHTML = '';
  blankItems.forEach((txt, i) => {
    if (blankAnswers[i] === undefined) blankAnswers[i] = '';
    const row = document.createElement('div');
    row.className = 'rounded-lg border border-slate-100 bg-white p-2 dark:border-slate-700 dark:bg-slate-900';
    row.innerHTML =
      `<div class="flex items-start gap-2">` +
        `<span class="mt-2.5 w-5 shrink-0 text-right text-xs font-semibold text-slate-400">${i + 1}.</span>` +
        `<textarea class="inp h-12 flex-1 leading-relaxed" placeholder="Türk edebiyatında ilk roman ... tarafından yazılmıştır." data-bi="${i}">${esc(txt)}</textarea>` +
        (blankItems.length > 1 ? `<button class="mt-2 shrink-0 rounded px-1.5 py-0.5 text-xs text-slate-300 transition hover:text-rose-600" data-bd="${i}">✕</button>` : '') +
      `</div>` +
      `<div class="mt-1.5 flex items-center gap-2 pl-7">` +
        `<span class="w-14 shrink-0 text-[10px] font-medium uppercase tracking-wide text-emerald-600">Cevap</span>` +
        `<input class="inp !h-7 flex-1 text-[12px]" placeholder="Opsiyonel · cevap anahtarında görünür" data-ba="${i}" value="${esc(blankAnswers[i] || '')}">` +
      `</div>`;
    list.appendChild(row);
  });
  list.querySelectorAll('[data-bi]').forEach((ta) => {
    ta.oninput = () => { blankItems[+ta.dataset.bi] = ta.value; };
  });
  list.querySelectorAll('[data-ba]').forEach((inp) => {
    inp.oninput = () => { blankAnswers[+inp.dataset.ba] = inp.value; };
  });
  list.querySelectorAll('[data-bd]').forEach((btn) => {
    btn.onclick = () => {
      blankItems.splice(+btn.dataset.bd, 1);
      blankAnswers.splice(+btn.dataset.bd, 1);
      renderBlankList();
    };
  });
}

function setQuestionKind(kind) {
  questionKind = kind;
  document.querySelectorAll('.qkind').forEach((b) => {
    const on = b.dataset.qk === kind;
    b.className = 'qkind rounded-lg py-2 font-medium transition ' +
      (on ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400');
  });
  $('blankPanel').classList.toggle('hidden', kind !== 'bosluk');
  $('preamblePanel').classList.toggle('hidden', kind === 'bosluk');
  $('rootPanel').classList.toggle('hidden', kind === 'bosluk');
  $('optionsPanel').classList.toggle('hidden', kind !== 'coktan');
  $('layoutPanel').classList.toggle('hidden', kind !== 'coktan');
  $('commonImgBlock').classList.toggle('hidden', kind === 'bosluk');
  $('aiPromptPanel').classList.toggle('hidden', kind !== 'coktan');
  if (kind === 'klasik' && $('txtBlank').value === '0') $('txtBlank').value = '25';
  if (kind === 'coktan') $('txtBlank').value = '0';
  if (kind === 'bosluk') { $('txtBlank').value = '0'; renderBlankList(); }
}

function renderOptionAnswer() {
  const current = $('txtAns').value;
  document.querySelectorAll('[data-opt-answer]').forEach((btn) => {
    const active = btn.dataset.optAnswer === current;
    btn.className = 'opt-answer w-7 shrink-0 rounded-md py-1 text-xs font-bold transition ' +
      (active ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700');
  });
}

function setTxtImg(src) {
  txtImgSrc = src;
  $('imgPreview').src = src || '';
  $('imgPreview').classList.toggle('hidden', !src);
  $('imgUploadPlaceholder').classList.toggle('hidden', !!src);
  $('txtImgRemove').classList.toggle('hidden', !src);
}

function setBlankImg(src) {
  blankImgSrc = src;
  $('blankImgPreview').src = src || '';
  $('blankImgPreview').classList.toggle('hidden', !src);
  $('blankImgPlaceholder').classList.toggle('hidden', !!src);
  $('blankImgRemove').classList.toggle('hidden', !src);
}

function renderLevelPills() {
  document.querySelectorAll('#txtLevelGroup .lvl-pill').forEach(btn => {
    const isAct = btn.dataset.lvl === questionLevel;
    btn.classList.toggle('active', isAct);
    if (isAct) {
      if (questionLevel === 'kolay') btn.className = 'lvl-pill active flex-1 rounded-lg border border-emerald-500 bg-emerald-50 py-1.5 text-[11px] font-semibold text-emerald-800 transition dark:bg-emerald-950/50 dark:text-emerald-300';
      else if (questionLevel === 'zor') btn.className = 'lvl-pill active flex-1 rounded-lg border border-rose-500 bg-rose-50 py-1.5 text-[11px] font-semibold text-rose-800 transition dark:bg-rose-950/50 dark:text-rose-300';
      else btn.className = 'lvl-pill active flex-1 rounded-lg border border-amber-500 bg-amber-50 py-1.5 text-[11px] font-semibold text-amber-800 transition dark:bg-amber-950/50 dark:text-amber-300';
    } else {
      btn.className = 'lvl-pill flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300';
    }
  });
}

function openText(q) {
  editingId = q ? q.id : null;
  $('txtTitle').textContent = q ? 'Yazılı soruyu düzenle' : 'Yazılı soru ekle';
  setTxtImg(q && q.imgSrc ? q.imgSrc : null);
  $('imgUploadPanel').classList.toggle('hidden', !(q && q.imgSrc));
  
  questionLevel = (q && q.level) || 'orta';
  renderLevelPills();
  if ($('txtTags')) $('txtTags').value = (q && Array.isArray(q.tags)) ? q.tags.join(', ') : '';

  const bImg = q && q.kind === 'bosluk' ? q.imgSrc : null;
  setBlankImg(bImg || null);
  $('blankImgPanel').classList.toggle('hidden', !bImg);
  
  if (q && q.kind === 'bosluk') {
    if (q.blankItems && q.blankItems.length) blankItems = [...q.blankItems];
    else if (q.blankText) blankItems = [q.blankText];
    else blankItems = [''];
    
    if (q.groupId) {
      const grouped = questions.filter((x) => x.groupId === q.groupId && x.kind === 'bosluk');
      blankAnswers = blankItems.map((_, idx) => (grouped[idx] && grouped[idx].answer) || '');
    } else if (q.blankAnswers && q.blankAnswers.length) {
      blankAnswers = [...q.blankAnswers];
    } else {
      blankAnswers = blankItems.map((_, idx) => (idx === 0 ? (q.answer || '') : ''));
    }
  } else {
    blankItems = [''];
    blankAnswers = [''];
  }
  
  setQuestionKind(q && q.kind ? q.kind : 'coktan');
  $('txtPreamble').value = q ? (q.text || '') : '';
  $('txtRoot').value = q ? (q.root || '') : '';
  $('txtWordBank').value = q && q.wordBank ? q.wordBank.join(', ') : '';
  for (let i = 0; i < 5; i++) $('opt' + i).value = q && q.options ? (q.options[i] || '') : '';
  $('txtAns').value = q && q.answer ? q.answer : '';
  renderOptionAnswer();
  $('txtLayout').value = q && q.layout ? q.layout : 'v';
  $('txtBlank').value = String(q && q.blank ? q.blank : (q && q.kind === 'klasik' ? 25 : 0));
  clearWarn();
  openModal('textModal');
  $('aiPromptPanel').removeAttribute('open');
}

function saveText(keepOpen) {
  try {
    _saveText(keepOpen);
  } catch (e) {
    console.error('saveText hatası:', e);
    if (!keepOpen) closeModal('textModal');
    alert('Soru kaydedilirken beklenmedik bir hata oluştu:\n' + (e && e.message ? e.message : e));
  }
}

function _saveText(keepOpen) {
  const preamble = $('txtPreamble').value.trim();
  const root = $('txtRoot').value.trim();
  const wordBank = $('txtWordBank').value.split(',').map((w) => w.trim()).filter(Boolean);

  if (questionKind === 'bosluk') {
    const validBlanks = blankItems.map((t) => t.trim()).filter(Boolean);
    if (!validBlanks.length) {
      if (!keepOpen) return closeModal('textModal');
      return warnText('Lütfen en az bir boşluk doldurma cümlesi giriniz.');
    }
    if (editingId) {
      const idx = questions.findIndex((x) => x.id === editingId);
      const oldGroupId = questions[idx].groupId;
      let groupQuestions = oldGroupId ? questions.filter((x) => x.groupId === oldGroupId) : [questions[idx]];
      groupQuestions.forEach((gq) => {
        const gi = questions.findIndex((x) => x.id === gq.id);
        if (gi >= 0) questions.splice(gi, 1);
      });
      const gid = validBlanks.length > 1 ? uid() : null;
      const validAns = [];
      blankItems.forEach((t, i) => { if (t.trim()) validAns.push((blankAnswers[i] || '').trim()); });
      validBlanks.forEach((bt, bi) => {
        questions.splice(idx + bi, 0, {
          id: bi === 0 ? editingId : uid(),
          groupId: gid,
          stem: '',
          name: 'metin',
          type: 'text',
          kind: 'bosluk',
          text: '',
          root: '',
          imgSrc: bi === 0 && blankImgSrc ? blankImgSrc : null,
          blankText: bt,
          blankItems: validBlanks,
          wordBank,
          bankShared: false,
          options: ['', '', '', '', ''],
          layout: 'v',
          blank: 0,
          answer: validAns[bi] || null,
        });
      });
    } else {
      if (questions.length + validBlanks.length > MAX) return alert('Bir testte en fazla 100 soru bulundurabilirsiniz.');
      const gid = validBlanks.length > 1 ? uid() : null;
      const validAns = [];
      blankItems.forEach((t, i) => { if (t.trim()) validAns.push((blankAnswers[i] || '').trim()); });
      validBlanks.forEach((bt, bi) => {
        questions.push({
          id: uid(),
          groupId: gid,
          stem: '',
          name: 'metin',
          type: 'text',
          kind: 'bosluk',
          text: '',
          root: '',
          imgSrc: bi === 0 && blankImgSrc ? blankImgSrc : null,
          blankText: bt,
          blankItems: validBlanks,
          wordBank,
          bankShared: false,
          options: ['', '', '', '', ''],
          layout: 'v',
          blank: 0,
          answer: validAns[bi] || null,
        });
      });
    }
    if (onSaveCallback) onSaveCallback();
    if (keepOpen) {
      editingId = null;
      $('txtTitle').textContent = 'Yazılı soru ekle';
      blankItems = [''];
      blankAnswers = [''];
      $('txtWordBank').value = '';
      setBlankImg(null);
      $('blankImgPanel').classList.add('hidden');
      $('blankImgFile').value = '';
      renderBlankList();
    } else {
      closeModal('textModal');
    }
    return;
  }

  if (!preamble && !root) {
    const hasOptions = [0, 1, 2, 3, 4].some((i) => $('opt' + i).value.trim());
    if (!hasOptions) return closeModal('textModal');
    return warnText('Lütfen soru metni veya soru kökü giriniz.');
  }

  const options = [0, 1, 2, 3, 4].map((i) => $('opt' + i).value.trim());
  const tags = $('txtTags') ? $('txtTags').value.split(',').map(t => t.trim()).filter(Boolean) : [];
  const data = {
    type: 'text',
    kind: questionKind,
    level: questionLevel || 'orta',
    tags: tags,
    text: preamble,
    root: root,
    imgSrc: txtImgSrc ? txtImgSrc : null,
    blankText: '',
    blankItems: [],
    wordBank: [],
    bankShared: false,
    options: questionKind === 'coktan' ? options : ['', '', '', '', ''],
    layout: $('txtLayout').value,
    blank: +$('txtBlank').value || 0,
    answer: $('txtAns').value || null,
  };

  if (editingId) {
    const q = questions.find((x) => x.id === editingId);
    if (q) Object.assign(q, data);
  } else {
    if (questions.length >= MAX) return alert('Bir testte en fazla 100 soru bulundurabilirsiniz.');
    questions.push(Object.assign({ id: uid(), groupId: null, stem: '', name: 'metin' }, data));
  }

  if (onSaveCallback) onSaveCallback();

  if (keepOpen) {
    editingId = null;
    $('txtTitle').textContent = 'Yazılı soru ekle';
    $('txtPreamble').value = '';
    $('txtRoot').value = '';
    setTxtImg(null);
    $('imgUploadPanel').classList.add('hidden');
    $('txtImgFile').value = '';
    [0, 1, 2, 3, 4].forEach((i) => ($('opt' + i).value = ''));
    $('txtAns').value = '';
    renderOptionAnswer();
  } else {
    closeModal('textModal');
  }
}

function extractMarked(raw) {
  if (!raw) return null;
  const m = raw.match(/\*([\s\S]*?)\*/);
  if (!m) return null;
  return { marked: m[1].trim(), rest: (raw.slice(0, m.index) + ' ' + raw.slice(m.index + m[0].length)).trim() };
}

function autoParseQuestion(raw) {
  if (!raw || !raw.trim()) return;
  const starMatch = extractMarked(raw);
  const source = starMatch ? starMatch.rest : raw;
  const lines = source.split('\n');
  const optMap = {};
  const rest = [];
  const optRegex = /^\s*([A-Ea-e])\s*[).:\-]\s*(.+)$/;

  lines.forEach((line) => {
    const m = line.trim().match(optRegex);
    if (m && 'ABCDEabcde'.includes(m[1])) {
      optMap[m[1].toUpperCase()] = m[2].trim();
    } else if (!/(?:cevap|doğru\s*cevap|dogru\s*cevap|yanıt|answer)\s*[:=]?\s*[A-Ea-e]\b/i.test(line)) {
      rest.push(line);
    }
  });

  if (Object.keys(optMap).length >= 2) {
    LETTERS.forEach((l, i) => {
      if (optMap[l] !== undefined) $('opt' + i).value = optMap[l];
    });
  }

  const am = raw.match(/(?:cevap|doğru\s*cevap|dogru\s*cevap|yanıt|answer)\s*[:=]?\s*([A-Ea-e])\b/i);
  if (am) {
    $('txtAns').value = am[1].toUpperCase();
    renderOptionAnswer();
  }

  if (starMatch && starMatch.marked) {
    $('txtRoot').value = starMatch.marked;
    $('txtPreamble').value = rest.join('\n').trim();
    return;
  }

  const remainingText = rest.join('\n').trim();
  if (remainingText) {
    const paragraphs = remainingText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length >= 2) {
      $('txtRoot').value = paragraphs[paragraphs.length - 1];
      $('txtPreamble').value = paragraphs.slice(0, -1).join('\n\n');
    } else {
      const singleLines = remainingText.split('\n').map((l) => l.trim()).filter(Boolean);
      if (singleLines.length >= 2 && (singleLines[singleLines.length - 1].endsWith('?') || /buna göre|hangisidir|değildir|söylenebilir|kaçtır|hangisinde/i.test(singleLines[singleLines.length - 1]))) {
        $('txtRoot').value = singleLines[singleLines.length - 1];
        $('txtPreamble').value = singleLines.slice(0, -1).join('\n');
      } else if (remainingText.endsWith('?') || /buna göre|hangisidir|değildir|aşağıdakilerden|kaçtır/i.test(remainingText)) {
        $('txtRoot').value = remainingText;
        if ($('txtPreamble').value === raw) $('txtPreamble').value = '';
      } else {
        $('txtPreamble').value = remainingText;
      }
    }
  }
}

function handleInsertGeometryQuestion(dataUrl) {
  if (!dataUrl) return;

  const preamble = $('txtPreamble')?.value.trim() || '';
  const root = $('txtRoot')?.value.trim() || '';
  const hasUserText = Boolean(preamble || root);

  const defaultRoot = 'Şekilde verilenlere göre istenen değeri bulunuz.';
  const qText = hasUserText ? preamble : '';
  const qRoot = hasUserText ? (root || defaultRoot) : defaultRoot;

  const options = [0, 1, 2, 3, 4].map((i) => $('opt' + i)?.value.trim() || '');
  const hasOptions = options.some(Boolean);

  const tags = $('txtTags')?.value ? $('txtTags').value.split(',').map((t) => t.trim()).filter(Boolean) : ['geometri'];
  if (!tags.includes('geometri')) tags.push('geometri');

  if (editingId) {
    const q = questions.find((x) => x.id === editingId);
    if (q) {
      q.imgSrc = dataUrl;
      if (qText) q.text = qText;
      if (qRoot) q.root = qRoot;
      if (hasOptions) q.options = options;
      if ($('txtAns')?.value) q.answer = $('txtAns').value;
      if (tags.length) q.tags = tags;
    }
  } else {
    if (questions.length >= MAX) {
      alert('Bir testte en fazla 100 soru bulundurabilirsiniz.');
      return;
    }
    const newQ = {
      id: uid(),
      groupId: null,
      stem: '',
      name: 'geometri',
      type: 'text',
      kind: questionKind === 'bosluk' ? 'coktan' : questionKind,
      level: questionLevel || 'orta',
      tags: tags,
      text: qText,
      root: qRoot,
      imgSrc: dataUrl,
      blankText: '',
      blankItems: [],
      wordBank: [],
      bankShared: false,
      options: hasOptions ? options : ['', '', '', '', ''],
      layout: $('txtLayout')?.value || 'v',
      blank: 0,
      answer: $('txtAns')?.value || null,
    };
    questions.push(newQ);
  }

  if (onSaveCallback) onSaveCallback();

  // Form alanlarını sıfırla ve kapat
  editingId = null;
  $('txtTitle').textContent = 'Yazılı soru ekle';
  $('txtPreamble').value = '';
  $('txtRoot').value = '';
  setTxtImg(null);
  $('imgUploadPanel').classList.add('hidden');
  $('txtImgFile').value = '';
  [0, 1, 2, 3, 4].forEach((i) => ($('opt' + i).value = ''));
  $('txtAns').value = '';
  renderOptionAnswer();
  closeModal('textModal');
}

function handleInsertScienceQuestion(dataUrl, templateName = 'Fen & Coğrafya Şablonu', category = 'fen') {
  if (!dataUrl) return;

  const preamble = $('txtPreamble')?.value.trim() || '';
  const root = $('txtRoot')?.value.trim() || '';
  const hasUserText = Boolean(preamble || root);

  const defaultRoot = 'Yukarıda verilen görsel ve bilgilere göre aşağıdaki yargılardan hangisi doğrudur?';
  const qText = hasUserText ? preamble : '';
  const qRoot = hasUserText ? (root || defaultRoot) : defaultRoot;

  const options = [0, 1, 2, 3, 4].map((i) => $('opt' + i)?.value.trim() || '');
  const hasOptions = options.some(Boolean);

  const tagList = [category || 'fen', 'şablon'];
  if (templateName) tagList.push(templateName.toLowerCase().slice(0, 15));

  if (editingId) {
    const q = questions.find((x) => x.id === editingId);
    if (q) {
      q.imgSrc = dataUrl;
      if (qText) q.text = qText;
      if (qRoot) q.root = qRoot;
      if (hasOptions) q.options = options;
      if ($('txtAns')?.value) q.answer = $('txtAns').value;
    }
  } else {
    if (questions.length >= MAX) {
      alert('Bir testte en fazla 100 soru bulundurabilirsiniz.');
      return;
    }
    const newQ = {
      id: uid(),
      groupId: null,
      stem: '',
      name: templateName || 'Fen/Coğrafya',
      type: 'text',
      kind: questionKind === 'bosluk' ? 'coktan' : questionKind,
      level: questionLevel || 'orta',
      tags: tagList,
      text: qText,
      root: qRoot,
      imgSrc: dataUrl,
      blankText: '',
      blankItems: [],
      wordBank: [],
      bankShared: false,
      options: hasOptions ? options : ['', '', '', '', ''],
      layout: $('txtLayout')?.value || 'v',
      blank: 0,
      answer: $('txtAns')?.value || null,
    };
    questions.push(newQ);
  }

  if (onSaveCallback) onSaveCallback();

  editingId = null;
  $('txtTitle').textContent = 'Yazılı soru ekle';
  $('txtPreamble').value = '';
  $('txtRoot').value = '';
  setTxtImg(null);
  $('imgUploadPanel').classList.add('hidden');
  $('txtImgFile').value = '';
  [0, 1, 2, 3, 4].forEach((i) => ($('opt' + i).value = ''));
  $('txtAns').value = '';
  renderOptionAnswer();
  closeModal('textModal');
}

function initTextModal() {
  document.querySelectorAll('.qkind').forEach((b) => (b.onclick = () => setQuestionKind(b.dataset.qk)));
  document.querySelectorAll('[data-opt-answer]').forEach((btn) => {
    btn.onclick = () => {
      $('txtAns').value = $('txtAns').value === btn.dataset.optAnswer ? '' : btn.dataset.optAnswer;
      renderOptionAnswer();
    };
  });

  const blankAddBtn = $('blankAddBtn');
  if (blankAddBtn) {
    blankAddBtn.onclick = () => {
      blankItems.push('');
      blankAnswers.push('');
      renderBlankList();
    };
  }

  $('copyPrompt').onclick = async () => {
    const txt = $('aiPrompt').innerText;
    try {
      await navigator.clipboard.writeText(txt);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const btn = $('copyPrompt');
    const old = btn.textContent;
    btn.textContent = 'Kopyalandı!';
    setTimeout(() => { btn.textContent = old; }, 1600);
  };

  const uploadImgBtn = $('txtUploadImgBtn');
  if (uploadImgBtn) {
    uploadImgBtn.onclick = () => {
      $('imgUploadPanel').classList.remove('hidden');
      $('txtImgFile').click();
    };
  }

  $('txtImgFile').onchange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setTxtImg(r.result);
      $('imgUploadPanel').classList.remove('hidden');
    };
    r.readAsDataURL(f);
  };
  $('txtImgRemove').onclick = () => {
    setTxtImg(null);
    $('txtImgFile').value = '';
    $('imgUploadPanel').classList.add('hidden');
  };

  const blankUploadBtn = $('blankUploadImgBtn');
  if (blankUploadBtn) {
    blankUploadBtn.onclick = () => {
      $('blankImgPanel').classList.remove('hidden');
      $('blankImgFile').click();
    };
  }

  $('blankImgFile').onchange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setBlankImg(r.result);
      $('blankImgPanel').classList.remove('hidden');
    };
    r.readAsDataURL(f);
  };
  $('blankImgRemove').onclick = () => {
    setBlankImg(null);
    $('blankImgFile').value = '';
    $('blankImgPanel').classList.add('hidden');
  };

  const sciBtn = $('txtOpenScienceBtn');
  if (sciBtn) {
    sciBtn.onclick = () => {
      closeModal('textModal');
      openScienceModal((dataUrl, name, cat) => {
        setTxtImg(dataUrl);
        $('imgUploadPanel').classList.remove('hidden');
        openModal('textModal');
      }, () => {
        openModal('textModal');
      });
    };
  }

  const blankSciBtn = $('blankOpenScienceBtn');
  if (blankSciBtn) {
    blankSciBtn.onclick = () => {
      closeModal('textModal');
      openScienceModal((dataUrl, name, cat) => {
        setBlankImg(dataUrl);
        $('blankImgPanel').classList.remove('hidden');
        openModal('textModal');
      }, () => {
        openModal('textModal');
      });
    };
  }

  $('textBtn').onclick = () => openText(null);
  $('txtCancel').onclick = () => closeModal('textModal');
  $('txtSave').onclick = () => saveText(false);
  $('txtSaveNew').onclick = () => saveText(true);

  document.querySelectorAll('#txtLevelGroup .lvl-pill').forEach((btn) => {
    btn.onclick = () => {
      questionLevel = btn.dataset.lvl;
      renderLevelPills();
    };
  });

  const headerGeoBtn = $('modalHeaderGeoBtn');
  if (headerGeoBtn) {
    headerGeoBtn.onclick = () => {
      closeModal('textModal');
      openGeometryModal((dataUrl) => {
        handleInsertGeometryQuestion(dataUrl);
      });
    };
  }

  const geoBtn = $('txtOpenGeoBtn');
  if (geoBtn) {
    geoBtn.onclick = () => {
      closeModal('textModal');
      openGeometryModal((dataUrl) => {
        handleInsertGeometryQuestion(dataUrl);
      });
    };
  }

  const blankGeoBtn = $('blankOpenGeoBtn');
  if (blankGeoBtn) {
    blankGeoBtn.onclick = () => {
      closeModal('textModal');
      openGeometryModal((dataUrl) => {
        handleInsertGeometryQuestion(dataUrl);
      });
    };
  }

  const dropzoneGeoBtn = $('dropzoneGeoBtn');
  if (dropzoneGeoBtn) {
    dropzoneGeoBtn.onclick = () => {
      openGeometryModal((dataUrl) => {
        handleInsertGeometryQuestion(dataUrl);
      });
    };
  }

  const dropzoneScienceBtn = $('dropzoneScienceBtn');
  if (dropzoneScienceBtn) {
    dropzoneScienceBtn.onclick = () => {
      openScienceModal((dataUrl, name, cat) => {
        handleInsertScienceQuestion(dataUrl, name, cat);
      });
    };
  }

  $('txtPreamble').addEventListener('paste', () => { setTimeout(() => autoParseQuestion($('txtPreamble').value), 10); });
  $('txtRoot').addEventListener('paste', () => { setTimeout(() => autoParseQuestion($('txtRoot').value), 10); });
}


// Module Exports
__exports['setOnSaveCallback'] = setOnSaveCallback;
__exports['renderBlankList'] = renderBlankList;
__exports['setQuestionKind'] = setQuestionKind;
__exports['renderOptionAnswer'] = renderOptionAnswer;
__exports['renderLevelPills'] = renderLevelPills;
__exports['openText'] = openText;
__exports['saveText'] = saveText;
__exports['extractMarked'] = extractMarked;
__exports['autoParseQuestion'] = autoParseQuestion;
__exports['handleInsertGeometryQuestion'] = handleInsertGeometryQuestion;
__exports['handleInsertScienceQuestion'] = handleInsertScienceQuestion;
__exports['initTextModal'] = initTextModal;

});

__define('modules/questionManager.js', function(__exports, __require, __module) {
const { questions, setQuestions, S, LETTERS, MAX } = __require('state.js');
const { $, uid, esc, setProgress, defaultBaseName, todayStr, parseTags } = __require('utils.js');
const { openText } = __require('modules/textModal.js');

let dragIdx = null;
let groupTarget = null, groupSel = [];
let onStateChanged = null;

function setOnQuestionChangeCallback(fn) {
  onStateChanged = fn;
}

function notifyChange() {
  if (typeof onStateChanged === 'function') {
    onStateChanged();
  }
}

function showPreview(q) {
  if (q.type === 'text' && q.kind === 'bosluk') {
    $('previewBody').innerHTML = `<div class="text-sm leading-relaxed">
        <span class="rounded bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">BOŞLUK DOLDURMA</span>
        ${q.imgSrc ? `<img src="${q.imgSrc}" class="mt-3 max-h-56 rounded-lg border border-slate-200">` : ''}
        <div class="mt-3 whitespace-pre-wrap text-slate-800 dark:text-slate-200">${esc(q.blankText).replace(/(\.\.\.|_{2,})/g, '<b class="text-amber-700">______________</b>')}</div>
        ${(q.wordBank || []).length ? `<div class="mt-4 rounded border border-amber-300 bg-amber-50 p-2 text-xs"><b class="text-amber-900">Kelime Havuzu:</b> ${esc((q.wordBank || []).join('  •  '))}</div>` : ''}
      </div>`;
  } else {
    $('previewBody').innerHTML = q.type === 'text'
      ? `<div class="text-sm leading-relaxed">
           ${q.imgSrc ? `<img src="${q.imgSrc}" class="mb-3 max-h-56 rounded-lg border border-slate-200">` : ''}
            ${q.text ? `<div class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">${esc(q.text)}</div>` : ''}
            ${q.root ? `<div class="mt-2 font-bold text-slate-900 dark:text-slate-100 whitespace-pre-wrap">${esc(q.root)}</div>` : ''}
            <div class="mt-3 ${q.layout === 'h' ? 'flex flex-wrap gap-4' : 'space-y-1.5'}">${(q.options || []).filter(Boolean)
              .map((o, k) => `<div><b class="text-slate-900 dark:text-slate-100">${LETTERS[k]})</b> ${esc(o)}</div>`).join('')}</div>
           ${q.blank ? `<div class="mt-3 border-t pt-2 text-xs italic text-slate-400">Klasik / Açık uçlu soru (${q.blank} mm boşluk)</div>` : ''}
         </div>`
      : `<img src="${q.src}" class="max-h-[80vh]">`;
  }
  $('preview').classList.replace('hidden', 'flex');
}

function openGroup(q) {
  groupTarget = q;
  groupSel = questions.filter(x => q.groupId && x.groupId === q.groupId && x.id !== q.id).map(x => x.id);
  $('gStem').value = q.stem || '';
  const g = $('gGrid');
  g.innerHTML = '';
  questions.forEach((x, i) => {
    if (x.id === q.id) return;
    const b = document.createElement('button');
    const on = () => groupSel.includes(x.id);
    const paint = () => b.className = 'rounded-lg border p-1.5 transition ' + (on() ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800' : 'border-slate-200 hover:border-slate-400 dark:border-slate-700');
    b.innerHTML = (x.type === 'text'
      ? `<div class="h-20 overflow-hidden text-left text-[9px] leading-tight text-slate-600 dark:text-slate-400">${esc(x.text || x.root || x.blankText || '')}</div>`
      : `<img src="${x.src}" class="h-20 w-full object-contain">`) + `<span class="mt-1 block text-[10px] font-medium text-slate-400">${i + 1}</span>`;
    paint();
    b.onclick = () => {
      groupSel = on() ? groupSel.filter(id => id !== x.id) : [...groupSel, x.id];
      paint();
    };
    g.appendChild(b);
  });
  $('groupModal').classList.replace('hidden', 'flex');
}

function render() {
  $('qCount').textContent = questions.length;
  $('ansCount').textContent = questions.filter(q => q.answer).length;
  const g = $('grid');
  g.innerHTML = '';
  if (!questions.length) {
    g.innerHTML = `<div id="emptyState" class="col-span-full flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
      <div>
        <p class="text-[15px] font-medium text-slate-700 dark:text-slate-300">Henüz soru oluşturmadınız</p>
        <p class="mt-1.5 text-[13px] leading-relaxed text-slate-400">
          Dilerseniz yukarıdaki seçenekleri kullanarak<br><b class="text-slate-600 dark:text-slate-300">Yazılı Kağıdı</b> veya <b class="text-slate-600 dark:text-slate-300">Konu Denemesi</b> oluşturabilirsiniz
        </p>
      </div></div>`;
    notifyChange();
    return;
  }
  g.className = 'grid grid-cols-2 gap-3 xl:grid-cols-3';
  questions.forEach((q, i) => {
    const d = document.createElement('div');
    d.className = 'card group relative cursor-grab rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-slate-300 hover:shadow-md active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900';
    if (q.groupId) {
      d.style.borderColor = document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a';
    }
    d.draggable = true;
    d.ondragstart = () => dragIdx = i;
    d.ondragover = e => e.preventDefault();
    d.ondrop = () => {
      if (dragIdx !== null && dragIdx !== i) {
        const [it] = questions.splice(dragIdx, 1);
        questions.splice(i, 0, it);
        render();
      }
    };
    d.ondblclick = () => showPreview(q);
    const lvl = q.level || 'orta';
    const lvlCfg = {
      kolay: { label: 'Kolay', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' },
      orta: { label: 'Orta', cls: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300' },
      zor: { label: 'Zor', cls: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300' }
    }[lvl] || { label: 'Orta', cls: 'border-slate-200 bg-slate-50 text-slate-700' };

    const qKindLabel = q.type === 'text'
      ? (q.kind === 'bosluk' ? 'Boşluk' : (q.kind === 'klasik' ? 'Klasik' : 'Test'))
      : 'Görsel';

    d.innerHTML = `
      <div class="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-1.5">
          <span class="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">#${i + 1}</span>
          <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">${qKindLabel}</span>
          <button type="button" class="btn-lvl-cycle rounded border px-1.5 py-0.2 text-[9px] font-bold transition hover:scale-105 ${lvlCfg.cls}" title="Zorluğu değiştirmek için tıklayın">${lvlCfg.label}</button>
        </div>
        <div class="tools flex items-center gap-1">
          <button class="btn-mini" data-a="prev" title="Önizle">🔍</button>
          ${q.type === 'text' ? '<button class="btn-mini" data-a="edit" title="Metni Düzenle">✏️</button>' : ''}
          <button class="btn-mini" data-a="grp" title="Gruplandır">🔗</button>
          <button class="btn-mini" data-a="up" title="Yukarı">↑</button>
          <button class="btn-mini" data-a="down" title="Aşağı">↓</button>
          <button class="btn-mini !text-rose-600 hover:!bg-rose-50 dark:hover:!bg-rose-950/40" data-a="del" title="Sil">✕</button>
        </div>
      </div>

      ${q.type === 'text'
        ? (q.kind === 'bosluk'
          ? `<div class="relative h-32 overflow-hidden rounded-lg bg-slate-50 p-2.5 text-left text-[11px] leading-snug dark:bg-slate-800">
               ${q.imgSrc ? `<span class="absolute right-2 bottom-2 z-10 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-medium text-white">📷 Görsel</span>` : ''}
               <div class="text-slate-700 dark:text-slate-300">${esc(q.blankText || '').replace(/(\.\.\.|_{2,})/g, '<span class="text-slate-400">______</span>')}</div>
               ${(q.wordBank || []).length ? `<div class="mt-1 text-[10px] text-slate-400 font-medium">Havuz: ${esc((q.wordBank || []).join(' · '))}</div>` : ''}
             </div>`
          : `<div class="relative h-32 overflow-hidden rounded-lg bg-slate-50 p-2.5 text-left text-[11px] leading-snug dark:bg-slate-800">
                ${q.imgSrc ? `<span class="absolute right-2 bottom-2 z-10 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-medium text-white">📷 Görsel</span>` : ''}
                ${q.text ? `<div class="text-slate-500 text-[10px] line-clamp-1">${esc(q.text)}</div>` : ''}
                ${q.root ? `<div class="mt-0.5 font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">${esc(q.root)}</div>` : ''}
                <div class="mt-1 ${q.layout === 'h' ? 'flex flex-wrap gap-2' : 'space-y-0.5'} text-slate-600 dark:text-slate-300">${(q.options || []).filter(Boolean)
                  .map((o, k) => `<div><span class="font-bold text-slate-400">${LETTERS[k]}</span> ${esc(o)}</div>`).join('')}</div>
                ${q.blank ? `<div class="mt-1 text-[10px] text-slate-400 italic">${q.blank} mm cevap satırı</div>` : ''}
              </div>`)
        : `<img src="${q.src}" class="h-32 w-full rounded-lg object-contain bg-slate-50 dark:bg-slate-800">`}

      ${(q.tags && q.tags.length) ? `
        <div class="mt-2 flex flex-wrap gap-1">
          ${q.tags.map(t => `<span class="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">#${esc(t)}</span>`).join('')}
        </div>
      ` : ''}

      <div class="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
        <span class="text-[10px] font-medium text-slate-400">Doğru Şık:</span>
        <div class="flex gap-1">${LETTERS.map(l =>
          `<button data-l="${l}" class="h-6 w-6 rounded-md border text-[11px] font-bold transition ${q.answer === l ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-sm' : 'border-slate-200 text-slate-400 hover:border-slate-400 dark:border-slate-700'}">${l}</button>`).join('')}</div>
      </div>`;

    const lvlBtn = d.querySelector('.btn-lvl-cycle');
    if (lvlBtn) {
      lvlBtn.onclick = (ev) => {
        ev.stopPropagation();
        const cycle = { kolay: 'orta', orta: 'zor', zor: 'kolay' };
        q.level = cycle[q.level || 'orta'] || 'orta';
        render();
      };
    }

    d.querySelectorAll('[data-a]').forEach(b => b.onclick = ev => {
      ev.stopPropagation();
      const a = b.dataset.a;
      if (a === 'del') questions.splice(i, 1);
      if (a === 'prev') return showPreview(q);
      if (a === 'edit') return openText(q);
      if (a === 'grp') return openGroup(q);
      if (a === 'up' && i > 0) { const [it] = questions.splice(i, 1); questions.splice(i - 1, 0, it); }
      if (a === 'down' && i < questions.length - 1) { const [it] = questions.splice(i, 1); questions.splice(i + 1, 0, it); }
      render();
    });

    d.querySelectorAll('[data-l]').forEach(b => b.onclick = ev => {
      ev.stopPropagation();
      q.answer = q.answer === b.dataset.l ? null : b.dataset.l;
      render();
    });

    g.appendChild(d);
  });

  notifyChange();
}

async function addFiles(list, syncUIFn) {
  const arr = [...list];
  const db = arr.find(f => f.name.toLowerCase().endsWith('.db'));
  if (db) {
    try {
      const raw = await db.text();
      const d = JSON.parse(raw);
      if (!d || !Array.isArray(d.questions)) throw new Error('Geçersiz taslak dosyası.');
      setQuestions(d.questions);
      if (d.settings && typeof d.settings === 'object') Object.assign(S, d.settings);
      if (typeof syncUIFn === 'function') syncUIFn();
      render();
    } catch (e) {
      alert('Taslak dosyası okunamadı. Dosyanın bu araç ile kaydedilmiş bir ".db" olduğundan emin olun.');
    }
    return;
  }
  const imgs = arr.filter(f => /image\/(jpeg|png|gif)/.test(f.type));
  if (!imgs.length) {
    alert('Yüklemek istediğiniz görsel sadece JPG, PNG veya GIF formatında olabilir.');
    return;
  }
  imgs.sort((a, b) => a.name.localeCompare(b.name, 'tr', { numeric: true }));
  let done = 0;
  setProgress(0, imgs.length);
  for (const f of imgs) {
    await new Promise(res => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          if (questions.length < MAX) {
            questions.push({
              id: uid(),
              src: r.result,
              w: im.width,
              h: im.height,
              answer: null,
              groupId: null,
              stem: '',
              name: f.name
            });
          }
          done++;
          setProgress(done, imgs.length);
          render();
          res();
        };
        im.src = r.result;
      };
      r.readAsDataURL(f);
    });
  }
  setTimeout(() => setProgress(0, null), 1200);
}

function initQuestionManager({ syncUIFn, collectFn }) {
  $('pickBtn').onclick = () => $('fileInput').click();
  $('fileInput').onchange = e => {
    addFiles(e.target.files, syncUIFn);
    e.target.value = '';
  };

  const dz = $('dropzone');
  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.classList.add('border-sky-400', 'bg-sky-50/50');
  });
  dz.addEventListener('dragleave', () => dz.classList.remove('border-sky-400', 'bg-sky-50/50'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('border-sky-400', 'bg-sky-50/50');
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files, syncUIFn);
  });

  $('clearAll').onclick = () => {
    if (confirm('Tüm sorular silinsin mi?')) {
      questions.length = 0;
      render();
    }
  };

  $('preview').onclick = () => $('preview').classList.replace('flex', 'hidden');

  $('gCancel').onclick = () => $('groupModal').classList.replace('flex', 'hidden');
  $('gSave').onclick = () => {
    const gid = (groupTarget && groupTarget.groupId) || uid();
    questions.forEach(x => {
      if (groupTarget && x.id === groupTarget.id) {
        x.groupId = groupSel.length ? gid : null;
        x.stem = $('gStem').value;
      } else if (groupSel.includes(x.id)) {
        x.groupId = gid;
        x.stem = '';
      } else if (x.groupId === gid) {
        x.groupId = null;
        x.stem = '';
      }
    });
    $('groupModal').classList.replace('flex', 'hidden');
    render();
  };

  $('saveDraft').onclick = () => {
    try {
      if (typeof collectFn === 'function') collectFn();
      if (!questions.length) {
        alert('Kaydedilecek soru bulunamadı. Önce en az bir soru ekleyin.');
        return;
      }
      const payload = JSON.stringify({ questions, settings: S });
      const blob = new Blob([payload], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const tParsed = parseTags(S.title || 'Test');
      const baseName = defaultBaseName(tParsed.clean, S);
      const a = document.createElement('a');
      a.href = url;
      a.download = baseName + ' - ' + todayStr() + '.db';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      alert('Çalışma kaydedilirken hata oluştu: ' + (e && e.message ? e.message : e));
    }
  };
}


// Module Exports
__exports['setOnQuestionChangeCallback'] = setOnQuestionChangeCallback;
__exports['showPreview'] = showPreview;
__exports['openGroup'] = openGroup;
__exports['render'] = render;
__exports['addFiles'] = addFiles;
__exports['initQuestionManager'] = initQuestionManager;

});

__define('modules/previewStage.js', function(__exports, __require, __module) {
const { questions, S } = __require('state.js');
const { $, openModal, closeModal } = __require('utils.js');
const { buildPreviewPages, pageSizeMM, getMebLogoBox, imgCache, fixLogoAspect, calculateQuestionBounds } = __require('modules/pdfEngine.js');
const { openText } = __require('modules/textModal.js');
const { render } = __require('modules/questionManager.js');

let pvPages = [];
let pvIndex = 0;
let pvTimer = null, pvBusy = false, pvDirty = false;
let pvZoom = 0, pvFitZoom = 1;
let selectedHeaderItems = new Set();
let dragState = null, suppressClick = false;
let headerDragState = null;
let icTarget = null, icSel = null, icDraw = false, icP0 = { x: 0, y: 0 };
let pvPan = null;
let collectFnRef = null;

function setCollectFn(fn) {
  collectFnRef = fn;
}

function pvSetBusy(on) {
  $('pvBusy').classList.toggle('on', on);
  $('pvLiveDot').classList.toggle('busy', on);
}

function schedulePreview() {
  clearTimeout(pvTimer);
  pvTimer = setTimeout(runPreview, 320);
}

function refreshNow() {
  clearTimeout(pvTimer);
  runPreview();
}

async function runPreview() {
  if (pvBusy) { pvDirty = true; return; }
  pvBusy = true;
  pvSetBusy(true);
  try {
    if (typeof collectFnRef === 'function') collectFnRef();
    const pages = await buildPreviewPages();
    pvPages = pages;
    if (pvIndex > pvPages.length - 1) pvIndex = pvPages.length - 1;
    if (pvIndex < 0) pvIndex = 0;
    showPvPage();
  } catch (e) {
    console.error('Önizleme hatası:', e);
  }
  pvBusy = false;
  pvSetBusy(false);
  if (pvDirty) {
    pvDirty = false;
    schedulePreview();
  }
}

function showPvPage() {
  const stack = $('pvStack');
  stack.innerHTML = '';
  const has = pvPages.length > 0;
  $('pvEmpty').classList.toggle('hide', has);
  if (has) {
    const c = pvPages[pvIndex].canvas;
    c.className = 'pv-canvas';
    stack.appendChild(c);
  }
  $('pvPageInfo').textContent = has ? (pvIndex + 1) + ' / ' + pvPages.length : '0 / 0';
  $('pvPrev').disabled = !has || pvIndex === 0;
  $('pvNext').disabled = !has || pvIndex >= pvPages.length - 1;
  const sz = (S.pageSize || 'a4').toUpperCase();
  const yon = S.orientation === 'landscape' ? 'Yatay' : 'Dikey';
  $('pvMeta').textContent = has
    ? sz + ' · ' + yon + ' · ' + (S.columns || 2) + ' sütun · ' + questions.length + ' soru · ' + pvPages.length + ' sayfa'
    : '—';
  if ($('pvBig').classList.contains('open')) showPvBig();
}

function pvDock(open) {
  const pane = $('previewPane');
  const card = pane && pane.querySelector('.pv-card');
  if (!card) return;
  const first = card.getBoundingClientRect();
  document.body.classList.toggle('pv-docked', open);
  const last = card.getBoundingClientRect();
  if (!first.width || !last.width) return;
  const dx = first.left - last.left, dy = first.top - last.top;
  const sx = first.width / last.width, sy = first.height / last.height;
  card.style.transformOrigin = 'top left';
  card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
  requestAnimationFrame(() => {
    card.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1)';
    card.style.transform = 'translate(0,0) scale(1,1)';
    setTimeout(() => { card.style.transition = ''; card.style.transform = ''; card.style.transformOrigin = ''; }, 600);
  });
}

function fitPreviewZoom() {
  const wrap = $('pvBigWrap'), cv = $('pvBigCanvas');
  if (!cv.width || !wrap.clientWidth || !wrap.clientHeight) return 1;
  return Math.min(1, (wrap.clientWidth - 28) / cv.width, (wrap.clientHeight - 18) / cv.height);
}

function applyPreviewZoom() {
  const cv = $('pvBigCanvas');
  if (!cv.width) return;
  cv.style.width = Math.round(cv.width * pvZoom) + 'px';
  cv.style.height = Math.round(cv.height * pvZoom) + 'px';
  requestAnimationFrame(layoutOverlay);
}

function showPvBig() {
  const cv = $('pvBigCanvas');
  if (!pvPages.length) { $('pvOverlay').innerHTML = ''; $('pvBigInfo').textContent = '0 / 0'; return; }
  const src = pvPages[pvIndex].canvas;
  cv.width = src.width; cv.height = src.height;
  cv.getContext('2d').drawImage(src, 0, 0);
  pvFitZoom = fitPreviewZoom();
  if (!pvZoom) pvZoom = pvFitZoom;
  pvZoom = Math.max(pvFitZoom * .55, Math.min(3.5, pvZoom));
  applyPreviewZoom();
  $('pvBigInfo').textContent = (pvIndex + 1) + ' / ' + pvPages.length;
  $('pvBigPrev').disabled = pvIndex === 0;
  $('pvBigNext').disabled = pvIndex >= pvPages.length - 1;
  requestAnimationFrame(layoutOverlay);
}

function layoutOverlay() {
  const cv = $('pvBigCanvas'), pg = pvPages[pvIndex], ov = $('pvOverlay');
  if (!pg) { ov.innerHTML = ''; return; }
  const dispW = cv.clientWidth || cv.width, k = dispW / pg.w;
  ov.style.width = dispW + 'px';
  ov.style.height = (pg.h * k) + 'px';
  
  const snapLine = $('pvSnapLine');
  const marquee = $('pvMarquee');
  ov.innerHTML = '';
  ov.appendChild(snapLine);
  ov.appendChild(marquee);
  
  if (S.showQuestionAreaGuide) {
    try {
      const qb = calculateQuestionBounds();
      const guideBox = document.createElement('div');
      guideBox.className = 'pv-qa-guide';
      guideBox.style.left = (qb.left * k) + 'px';
      guideBox.style.top = (qb.contentTop * k) + 'px';
      guideBox.style.width = (qb.width * k) + 'px';
      guideBox.style.height = (qb.usableH * k) + 'px';
      guideBox.innerHTML = `<span class="pv-qa-tag">📐 Güvenli Soru Alanı (${Math.round(qb.usableH)} mm)</span>`;
      ov.appendChild(guideBox);
    } catch (e) {}
  }
  
  (pg.items || []).forEach((it, i) => {
    const chip = document.createElement('div');
    chip.className = 'pvChip';
    chip.style.left = (it.x * k) + 'px';
    chip.style.top = (it.y * k) + 'px';
    chip.style.width = (it.w * k) + 'px';
    chip.style.height = (it.h * k) + 'px';
    const isImg = it.q.type !== 'text';
    chip.innerHTML =
      '<span class="pvNum">' + (i + 1) + '</span>' +
      '<span class="pvActs">' +
        (isImg
          ? '<button type="button" data-act="crop" title="Görseli kırp">✂</button>' +
            '<button type="button" data-act="fit" title="Sütun genişliğine sığdır">⤢</button>'
          : '<button type="button" data-act="edit" title="Metni düzenle">✎</button>') +
      '</span>' +
      (isImg ? '<span class="pvRz" data-act="rz" title="Boyutlandır"></span>' : '');
    ov.appendChild(chip);
    wireChip(chip, it, k);
  });
  
  if (pg.mebHeaderItems) {
    const headerLabels = {
      mebYear:'YIL', mebSchool:'OKUL', mebLesson:'DERS', mebExam:'SINIF+SINAV', mebDate:'TARIH',
      mebNameLbl:'AD', mebClassLbl:'SINIF ET', mebNoLbl:'NO', mebScoreLbl:'PUAN'
    };
    Object.values(pg.mebHeaderItems).forEach((it) => {
      if (!it.text) return;
      const chip = document.createElement('div');
      chip.className = 'pvChip pvTextChip' + (selectedHeaderItems.has(it.id) ? ' selected' : '');
      chip.dataset.hid = it.id;
      chip.style.left = (it.x * k) + 'px';
      chip.style.top = (it.y * k) + 'px';
      chip.style.width = (it.w * k) + 'px';
      chip.style.height = (it.h * k) + 'px';
      chip.innerHTML = '<span class="pvNum" style="background:#475569;font-size:7px">' + (headerLabels[it.id] || it.id) + '</span>';
      ov.appendChild(chip);
      wireHeaderChip(chip, it, k);
    });
  }
  
  if (pg.logoBox) {
    const box = pg.logoBox;
    const chip = document.createElement('div');
    chip.className = 'pvChip pvLogoChip' + (selectedHeaderItems.has('logo') ? ' selected' : '');
    chip.dataset.hid = 'logo';
    chip.style.left = (box.x * k) + 'px';
    chip.style.top = (box.y * k) + 'px';
    chip.style.width = (box.w * k) + 'px';
    chip.style.height = (box.h * k) + 'px';
    chip.innerHTML = '<span class="pvNum">LOGO</span>' +
      '<span class="pvActs"><button type="button" data-act="logofix" title="Logoyu doğal oranına getir">↺</button></span>' +
      '<span class="pvRz" data-act="rz" title="Boyutlandır"></span>';
    ov.appendChild(chip);
    wireLogoChipCombined(chip, k);
  }
}

function wireChip(chip, it, k) {
  chip.addEventListener('pointerdown', (e) => {
    const act = e.target.dataset.act;
    if (act && act !== 'rz') return;
    dragState = {
      chip, it, k, mode: act === 'rz' ? 'rz' : 'drag',
      sx: e.clientX, sy: e.clientY, moved: false,
      w0: it.w, h0: it.h, scale0: it.q.scale || 1
    };
    chip.setPointerCapture(e.pointerId);
    chip.classList.add('dragging');
    e.preventDefault();
  });
  chip.addEventListener('pointermove', (e) => {
    const d = dragState; if (!d || d.chip !== chip) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    if (!d.moved) return;
    if (d.mode === 'rz') {
      const baseW = d.w0 / d.scale0;
      let nw = Math.max(12, Math.min(baseW, d.w0 + dx / d.k));
      let nh = Math.max(8, d.h0 + dy / d.k);
      it.q.scale = nw / baseW;
      it.q.aspect = nh / nw;
      chip.style.width = (nw * d.k) + 'px';
      chip.style.height = (nh * d.k) + 'px';
    } else {
      chip.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      showDropLine(e.clientX, e.clientY, d.it.q.id);
    }
  });
  const end = (e) => {
    const d = dragState; if (!d || d.chip !== chip) return;
    chip.classList.remove('dragging'); chip.style.transform = '';
    dragState = null; hideDropLine();
    if (!d.moved) return;
    suppressClick = true;
    if (d.mode === 'rz') { refreshNow(); return; }
    const target = dropTarget(e.clientX, e.clientY, d.it.q.id);
    if (target) moveQuestion(d.it.q.id, target); else refreshNow();
  };
  chip.addEventListener('pointerup', end);
  chip.addEventListener('pointercancel', end);
  chip.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; return; }
    const act = e.target.dataset.act;
    if (act === 'edit') return editFromPaper(it.q);
    if (act === 'crop') return openImgCrop(it.q);
    if (act === 'fit') { it.q.scale = 1; it.q.aspect = undefined; return refreshNow(); }
    if (it.q.type === 'text') editFromPaper(it.q);
  });
}

function syncHeaderSelectionDom() {
  document.querySelectorAll('.pvTextChip,.pvLogoChip').forEach((chip) => {
    chip.classList.toggle('selected', selectedHeaderItems.has(chip.dataset.hid));
  });
}

function startHeaderDrag(e, startId, k, isLogo, isRz) {
  if (isRz) {
    headerDragState = {
      mode: 'resize_logo',
      sx: e.clientX, sy: e.clientY,
      w0: S.logoW || 26, h0: S.logoH || 26,
      k, moved: false
    };
    return;
  }
  if (!selectedHeaderItems.has(startId)) {
    if (!e.ctrlKey && !e.shiftKey) {
      selectedHeaderItems.clear();
    }
    selectedHeaderItems.add(startId);
    syncHeaderSelectionDom();
  }
  const itemsState = {};
  const pg = pvPages[pvIndex];
  
  selectedHeaderItems.forEach((id) => {
    if (id === 'logo') {
      const box = getMebLogoBox(S.margin || 10);
      itemsState[id] = { x0: box.x, y0: box.y, w: box.w, h: box.h };
    } else if (pg.mebHeaderItems && pg.mebHeaderItems[id]) {
      const it = pg.mebHeaderItems[id];
      itemsState[id] = { x0: it.x, y0: it.y, w: it.w, h: it.h };
    }
  });
  
  headerDragState = {
    mode: 'drag',
    sx: e.clientX, sy: e.clientY,
    k, itemsState, moved: false,
    startId
  };
}

function moveHeaderDrag(e) {
  const d = headerDragState; if (!d) return;
  const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
  if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
  if (!d.moved) return;
  
  const snapLine = $('pvSnapLine');
  const [PW] = pageSizeMM();
  const pageCenter = PW / 2;
  
  if (d.mode === 'resize_logo') {
    const nw = Math.max(8, d.w0 + dx / d.k);
    const nh = Math.max(8, d.h0 + dy / d.k);
    const logoChip = document.querySelector('.pvLogoChip');
    if (logoChip) {
      logoChip.style.width = (nw * d.k) + 'px';
      logoChip.style.height = (nh * d.k) + 'px';
    }
    d.nw = nw; d.nh = nh;
    return;
  }
  
  let deltaX = dx / d.k;
  let deltaY = dy / d.k;
  let snapX = null;
  const SNAP_THRESHOLD = 1.6;
  
  for (const [, s] of Object.entries(d.itemsState)) {
    const targetX = s.x0 + deltaX;
    const targetCenterX = targetX + s.w / 2;
    if (Math.abs(targetCenterX - pageCenter) < SNAP_THRESHOLD) {
      const exactDeltaX = (pageCenter - s.w / 2) - s.x0;
      deltaX = exactDeltaX;
      snapX = pageCenter;
      break;
    }
  }
  
  if (snapX !== null) {
    snapLine.style.display = 'block';
    snapLine.style.left = (snapX * d.k) + 'px';
    snapLine.style.height = '100%';
  } else {
    snapLine.style.display = 'none';
  }
  
  const chips = document.querySelectorAll('.pvChip');
  chips.forEach((chip) => {
    const id = chip.dataset.hid;
    if (!id || !d.itemsState[id]) return;
    const s = d.itemsState[id];
    chip.style.left = ((s.x0 + deltaX) * d.k) + 'px';
    chip.style.top = ((s.y0 + deltaY) * d.k) + 'px';
  });
  
  d.deltaX = deltaX;
  d.deltaY = deltaY;
}

function endHeaderDrag(e) {
  const d = headerDragState; if (!d) return;
  headerDragState = null;
  $('pvSnapLine').style.display = 'none';
  
  if (!d.moved) return;
  suppressClick = true;
  
  if (d.mode === 'resize_logo') {
    S.logoW = d.nw; S.logoH = d.nh;
    refreshNow();
    return;
  }
  
  S.mebPos = S.mebPos || {};
  for (const [id, s] of Object.entries(d.itemsState)) {
    const nx = s.x0 + d.deltaX;
    const ny = s.y0 + d.deltaY;
    if (id === 'logo') {
      S.logoX = nx;
      S.logoY = ny;
    } else {
      S.mebPos[id] = { x: nx, y: ny };
    }
  }
  refreshNow();
}

function wireHeaderChip(chip, it, k) {
  chip.addEventListener('pointerdown', (e) => {
    chip.setPointerCapture(e.pointerId);
    startHeaderDrag(e, it.id, k, false, false);
    e.stopPropagation();
  });
  chip.addEventListener('pointermove', (e) => {
    moveHeaderDrag(e);
    e.stopPropagation();
  });
  const up = (e) => {
    try { chip.releasePointerCapture(e.pointerId); } catch (err) {}
    endHeaderDrag(e);
    e.stopPropagation();
  };
  chip.addEventListener('pointerup', up);
  chip.addEventListener('pointercancel', up);
}

function wireLogoChipCombined(chip, k) {
  chip.addEventListener('click', (e) => {
    if (e.target.dataset.act === 'logofix') {
      e.stopPropagation();
      fixLogoAspect(refreshNow);
    }
  });
  chip.addEventListener('pointerdown', (e) => {
    if (e.target.dataset.act === 'logofix') { e.stopPropagation(); return; }
    const isRz = e.target.dataset.act === 'rz';
    chip.setPointerCapture(e.pointerId);
    startHeaderDrag(e, 'logo', k, true, isRz);
    e.stopPropagation();
  });
  chip.addEventListener('pointermove', (e) => {
    moveHeaderDrag(e);
    e.stopPropagation();
  });
  const up = (e) => {
    try { chip.releasePointerCapture(e.pointerId); } catch (err) {}
    endHeaderDrag(e);
    e.stopPropagation();
  };
  chip.addEventListener('pointerup', up);
  chip.addEventListener('pointercancel', up);
}

function pvPageCoords(clientX, clientY) {
  const pg = pvPages[pvIndex], cv = $('pvBigCanvas'), r = cv.getBoundingClientRect();
  const k = r.width / pg.w;
  return { mx: (clientX - r.left) / k, my: (clientY - r.top) / k, k };
}

function dropTarget(cx, cy, selfId) {
  const pg = pvPages[pvIndex]; if (!pg) return null;
  const { mx, my } = pvPageCoords(cx, cy);
  let best = null, bd = Infinity;
  (pg.items || []).forEach((it) => {
    if (it.q.id === selfId) return;
    const dd = Math.hypot(it.x + it.w / 2 - mx, it.y + it.h / 2 - my);
    if (dd < bd) { bd = dd; best = it; }
  });
  return best ? { id: best.q.id, after: my > best.y + best.h / 2 } : null;
}

function showDropLine(cx, cy, selfId) {
  const pg = pvPages[pvIndex]; if (!pg) return;
  const target = dropTarget(cx, cy, selfId);
  if (!target) return hideDropLine();
  const it = (pg.items || []).find((i) => i.q.id === target.id); if (!it) return;
  const { k } = pvPageCoords(cx, cy);
  const line = $('pvDropLine');
  line.style.display = 'block';
  line.style.left = (it.x * k) + 'px';
  line.style.width = (it.w * k) + 'px';
  line.style.top = ((target.after ? it.y + it.h : it.y) * k - 1) + 'px';
}

function hideDropLine() {
  $('pvDropLine').style.display = 'none';
}

function moveQuestion(dragId, target) {
  const di = questions.findIndex((q) => q.id === dragId);
  if (di < 0 || dragId === target.id) return refreshNow();
  const [dq] = questions.splice(di, 1);
  const ti = questions.findIndex((q) => q.id === target.id);
  const at = ti < 0 ? questions.length : ti + (target.after ? 1 : 0);
  questions.splice(at, 0, dq);
  render();
  refreshNow();
}

function editFromPaper(q) {
  $('pvBig').classList.remove('open');
  openText(q);
}

function openImgCrop(q) {
  icTarget = q; icSel = null;
  $('icImg').src = q.src;
  $('imgCropModal').classList.add('open');
  requestAnimationFrame(drawIcRect);
}

function icPos(e) {
  const im = $('icImg'), r = im.getBoundingClientRect();
  return { x: Math.max(0, Math.min(r.width, e.clientX - r.left)), y: Math.max(0, Math.min(r.height, e.clientY - r.top)) };
}

function drawIcRect() {
  const r = $('icRect');
  if (!icSel || icSel.w < 2 || icSel.h < 2) { r.style.display = 'none'; return; }
  r.style.display = 'block';
  r.style.left = icSel.x + 'px'; r.style.top = icSel.y + 'px';
  r.style.width = icSel.w + 'px'; r.style.height = icSel.h + 'px';
}

function closePvBig() {
  $('pvBig').classList.remove('open');
  pvZoom = 0;
  selectedHeaderItems.clear();
}

function initPreviewStage() {
  $('pvPrev').onclick = () => { if (pvIndex > 0) { pvIndex--; showPvPage(); } };
  $('pvNext').onclick = () => { if (pvIndex < pvPages.length - 1) { pvIndex++; showPvPage(); } };
  $('pvRefresh').onclick = () => { clearTimeout(pvTimer); runPreview(); };

  $('pvOpenBig').onclick = () => { pvZoom = 0; $('pvBig').classList.add('open'); requestAnimationFrame(showPvBig); };
  $('pvBigClose').onclick = closePvBig;
  $('pvBig').onclick = (e) => { if (e.target === $('pvBig')) closePvBig(); };
  $('pvBigPrev').onclick = () => { if (pvIndex > 0) { pvIndex--; showPvPage(); } };
  $('pvBigNext').onclick = () => { if (pvIndex < pvPages.length - 1) { pvIndex++; showPvPage(); } };
  $('pvZoomReset').onclick = () => { pvZoom = pvFitZoom; applyPreviewZoom(); };

  $('pvBigWrap').addEventListener('wheel', (e) => {
    if (!$('pvBig').classList.contains('open') || !pvZoom) return;
    e.preventDefault();
    const wrap = $('pvBigWrap'), cv = $('pvBigCanvas'), old = pvZoom;
    const next = Math.max(pvFitZoom * .55, Math.min(3.5, old * Math.exp(-e.deltaY * .0015)));
    if (Math.abs(next - old) < .001) return;
    const cr = cv.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    const pointX = wrap.scrollLeft + e.clientX - cr.left;
    const pointY = wrap.scrollTop + e.clientY - cr.top;
    const mouseX = e.clientX - wr.left, mouseY = e.clientY - wr.top;
    pvZoom = next; applyPreviewZoom();
    const ratio = next / old;
    requestAnimationFrame(() => {
      wrap.scrollLeft = pointX * ratio - mouseX;
      wrap.scrollTop = pointY * ratio - mouseY;
    });
  }, { passive: false });

  const pvBigWrap = $('pvBigWrap');
  pvBigWrap.addEventListener('pointerdown', (e) => {
    if (!$('pvBig').classList.contains('open') || e.button !== 0) return;
    if (e.target.closest && e.target.closest('.pvChip')) return;
    
    const isMarqueeMode = e.shiftKey;
    const rect = $('pvOverlay').getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    pvPan = {
      id: e.pointerId,
      mode: isMarqueeMode ? 'marquee' : 'pan',
      x: e.clientX, y: e.clientY,
      startX, startY,
      left: pvBigWrap.scrollLeft, top: pvBigWrap.scrollTop,
      moved: false
    };
    
    if (isMarqueeMode) {
      const marq = $('pvMarquee');
      marq.style.display = 'block';
      marq.style.left = startX + 'px';
      marq.style.top = startY + 'px';
      marq.style.width = '0px';
      marq.style.height = '0px';
    } else {
      pvBigWrap.classList.add('panning');
    }
    
    pvBigWrap.setPointerCapture(e.pointerId);
  });

  pvBigWrap.addEventListener('pointermove', (e) => {
    if (!pvPan || pvPan.id !== e.pointerId) return;
    const dx = e.clientX - pvPan.x, dy = e.clientY - pvPan.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) pvPan.moved = true;
    
    if (pvPan.mode === 'marquee') {
      const rect = $('pvOverlay').getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      
      const x = Math.min(pvPan.startX, curX);
      const y = Math.min(pvPan.startY, curY);
      const w = Math.abs(curX - pvPan.startX);
      const h = Math.abs(curY - pvPan.startY);
      
      const marq = $('pvMarquee');
      marq.style.left = x + 'px';
      marq.style.top = y + 'px';
      marq.style.width = w + 'px';
      marq.style.height = h + 'px';
    } else {
      pvBigWrap.scrollLeft = pvPan.left - dx;
      pvBigWrap.scrollTop = pvPan.top - dy;
    }
    e.preventDefault();
  });

  const stopPvPan = (e) => {
    if (!pvPan || pvPan.id !== e.pointerId) return;
    if (pvPan.mode === 'marquee') {
      const marq = $('pvMarquee');
      marq.style.display = 'none';
      if (pvPan.moved) {
        const mx = parseFloat(marq.style.left);
        const my = parseFloat(marq.style.top);
        const mw = parseFloat(marq.style.width);
        const mh = parseFloat(marq.style.height);
        
        if (!e.ctrlKey && !e.shiftKey) {
          selectedHeaderItems.clear();
        }
        
        const chips = document.querySelectorAll('.pvTextChip, .pvLogoChip');
        chips.forEach((chip) => {
          const cx = parseFloat(chip.style.left);
          const cy = parseFloat(chip.style.top);
          const cw = parseFloat(chip.style.width);
          const ch = parseFloat(chip.style.height);
          if (cx < mx + mw && cx + cw > mx && cy < my + mh && cy + ch > my) {
            const id = chip.dataset.hid;
            if (id) selectedHeaderItems.add(id);
          }
        });
        layoutOverlay();
      }
    } else {
      pvBigWrap.classList.remove('panning');
      if (!pvPan.moved) {
        selectedHeaderItems.clear();
        layoutOverlay();
      }
    }
    try { pvBigWrap.releasePointerCapture(e.pointerId); } catch (err) {}
    pvPan = null;
  };

  pvBigWrap.addEventListener('pointerup', stopPvPan);
  pvBigWrap.addEventListener('pointercancel', stopPvPan);

  window.addEventListener('resize', () => {
    if (!$('pvBig').classList.contains('open')) return;
    pvFitZoom = fitPreviewZoom();
    pvZoom = Math.max(pvFitZoom * .55, Math.min(3.5, pvZoom));
    applyPreviewZoom();
  });

  $('icStage').addEventListener('pointerdown', (e) => {
    icDraw = true; const p = icPos(e); icP0 = { x: p.x, y: p.y };
    icSel = { x: p.x, y: p.y, w: 0, h: 0 };
    $('icStage').setPointerCapture(e.pointerId); drawIcRect(); e.preventDefault();
  });
  $('icStage').addEventListener('pointermove', (e) => {
    if (!icDraw) return; const p = icPos(e);
    icSel = { x: Math.min(icP0.x, p.x), y: Math.min(icP0.y, p.y), w: Math.abs(p.x - icP0.x), h: Math.abs(p.y - icP0.y) };
    drawIcRect();
  });
  $('icStage').addEventListener('pointerup', () => { icDraw = false; });
  $('icReset').onclick = () => { icSel = null; drawIcRect(); };
  $('icClose').onclick = () => { $('imgCropModal').classList.remove('open'); icTarget = null; };
  $('imgCropModal').onclick = (e) => { if (e.target === $('imgCropModal')) { $('imgCropModal').classList.remove('open'); icTarget = null; } };
  $('icApply').onclick = () => {
    if (!icTarget) return;
    const im = $('icImg');
    if (!icSel || icSel.w < 6 || icSel.h < 6) { alert('Önce kırpılacak alanı çerçeveleyin.'); return; }
    const sc = im.naturalWidth / Math.max(1, im.clientWidth);
    const c = document.createElement('canvas');
    c.width = Math.round(icSel.w * sc); c.height = Math.round(icSel.h * sc);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(im, icSel.x * sc, icSel.y * sc, icSel.w * sc, icSel.h * sc, 0, 0, c.width, c.height);
    icTarget.src = c.toDataURL('image/jpeg', 0.92);
    icTarget.w = c.width; icTarget.h = c.height;
    icTarget.scale = 1; icTarget.aspect = undefined;
    delete imgCache[icTarget.id];
    $('imgCropModal').classList.remove('open');
    icTarget = null;
    render();
    refreshNow();
  };
}


// Module Exports
__exports['setCollectFn'] = setCollectFn;
__exports['pvSetBusy'] = pvSetBusy;
__exports['schedulePreview'] = schedulePreview;
__exports['refreshNow'] = refreshNow;
__exports['runPreview'] = runPreview;
__exports['showPvPage'] = showPvPage;
__exports['pvDock'] = pvDock;
__exports['showPvBig'] = showPvBig;
__exports['layoutOverlay'] = layoutOverlay;
__exports['closePvBig'] = closePvBig;
__exports['initPreviewStage'] = initPreviewStage;
Object.defineProperty(__exports, 'pvPages', { get: () => pvPages, set: (v) => { pvPages = v; }, enumerable: true, configurable: true });
Object.defineProperty(__exports, 'pvIndex', { get: () => pvIndex, set: (v) => { pvIndex = v; }, enumerable: true, configurable: true });

});

__define('modules/sidebar.js', function(__exports, __require, __module) {
const { S, questions, PRESET_COLORS } = __require('state.js');
const { $, esc } = __require('utils.js');
const { schedulePreview, pvDock, refreshNow } = __require('modules/previewStage.js');
const { trimLogoImage, setCustomLogo, fixLogoAspect, calculateQuestionBounds } = __require('modules/pdfEngine.js');
const { openCustomTemplateModal, getCustomTemplates, getActiveCustomTemplate } = __require('modules/customTemplate.js');

function openSidebar() {
  $('sidebarPanel').classList.add('open');
  $('sidebarOverlay').classList.add('open');
  pvDock(true);
}

function closeSidebar() {
  $('sidebarPanel').classList.remove('open');
  $('sidebarOverlay').classList.remove('open');
  pvDock(false);
}

function initDark() {
  let on = false;
  try {
    const saved = localStorage.getItem('testmaker-dark');
    if (saved !== null) on = saved === '1';
  } catch (e) {}
  document.documentElement.classList.toggle('dark', on);
  $('darkBtn').textContent = on ? '☀️' : '🌙';
  $('darkBtn').onclick = () => {
    const isDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('testmaker-dark', isDark ? '1' : '0'); } catch (e) {}
    $('darkBtn').textContent = isDark ? '☀️' : '🌙';
  };
}

const GUIDE = [
  {
    s: '🚀 1. Hızlı Başlangıç (3 Adımda Sınav Kâğıdı)',
    items: [
      ['Soruları Ekleyin', 'Soru görsellerini çalışma alanına sürükleyebilir, <b>Yazılı Soru Ekleyin</b> butonuyla çoktan seçmeli, boşluk doldurma veya klasik sorular yazabilir ya da <b>Soru Bankası Havuzu</b>ndan hazır sorular aktarabilirsiniz.'],
      ['Sınav ve Şablon Ayarlarını Yapın', 'Sol menüdeki <b>Test Ayarları</b> panelinden MEB Resmî Şablonu, Varsayılan Düzen veya Kendi Şablonunuzu seçip okul adını, dersi ve mizanpajı belirleyin.'],
      ['Baskıya Hazır PDF Oluşturun', '<b>Sınav Kâğıdını Oluştur</b> butonuna tıklayarak A4 boyutunda, çift sütunlu, cevap anahtarlı vektörel PDF çıktınızı anında indirin.']
    ]
  },
  {
    s: '🏛️ 2. MEB Resmî Şablonu ve Düzen Seçenekleri',
    items: [
      ['MEB Resmî Şablon Düzeni', 'Millî Eğitim Bakanlığı sınav yönergelerine tam uyumludur. Resmî MEB arması sol üst köşede yer alır; okul ve sınav başlığı sayfa genişliğinin tam ortasında bağımsız olarak hizalanır.'],
      ['Öğrenci Bilgi Alanları', 'Adı-Soyadı, Sınıfı, Okul Numarası ve Puan haneleri logonun altına muntazam biçimde dizilir; logo taşınsa veya boyutlandırılsa dahi başlık metinleri sabit kalır.'],
      ['Otomatik Mizanpaj ve Ayrım', 'Şablon başlığının yüksekliği ve sayfa kenar boşlukları hesaplanarak soruların yerleşeceği güvenli alan otomatik olarak ayrılır; başlık ve sorular asla üst üste binmez.']
    ]
  },
  {
    s: '📚 3. Soru Bankası Havuzu (DB Yönetimi ve Paylaşım)',
    items: [
      ['Kendi Soru Havuzunuzu Oluşturma', 'Dilediğiniz sayıda soru havuzu veritabanı (DB) açabilir, adlandırabilir ve branşlara göre kategorize edebilirsiniz.'],
      ['Zorluk Seviyelendirmesi', 'Sorularınızı <b>Kolay (🟢)</b>, <b>Orta (🟡)</b> ve <b>Zor (🔴)</b> olarak derecelendirebilir; sınav hazırlarken seviyeye göre filtreleme yapabilirsiniz.'],
      ['Konu ve Kazanım Etiketleri', 'Her soruya konu ve kazanım etiketleri ekleyebilir (ör. <i>#üçgenler</i>, <i>#fonksiyonlar</i>), etiketlere göre anında arama yapabilirsiniz.'],
      ['.db Dosyası Olarak Paylaşma', 'Soru havuzunuzu tek tıkla <b>.db</b> formatında bilgisayarınıza indirebilir, zümre öğretmenlerinizle paylaşabilir veya başkalarının hazırladığı havuzları sisteme yükleyebilirsiniz.']
    ]
  },
  {
    s: '📐 4. Yazılı Soru Ekleme ve Geometri Çizim Stüdyosu',
    items: [
      ['Soru Türleri', '<b>Çoktan Seçmeli</b> (A–E seçenekli), <b>Boşluk Doldurma</b> (üç nokta [...] ile otomatik algılanan kelime havuzlu) ve <b>Klasik</b> (açık uçlu, satır boşluklu) soru formatları desteklenir.'],
      ['Öncül ve Soru Kökü Ayrımı', 'Öncül metni standart punto ile, soru kökü ise öğrencinin dikkatini çekecek şekilde <b>kalın (bold)</b> olarak basılır.'],
      ['Geometri Soruları Çizim Stüdyosu', '<b>Yazılı Soru Ekleyin</b> penceresindeki <b>Geometri Sorusu</b> butonuna basarak; Öklid, muhteşem üçlü, 30-60-90, iç açıortay, kenarortay ve benzerlik dahil 12 zengin üçgen türü, çember, dörtgen ve paralel açılar çizebilirsiniz.'],
      ['Açı, Derece ve Kenar Seçenekleri', 'Şekiller üzerinde köşe adları (A, B, C), kenar uzunlukları, yükseklik (h), açı yayları, derece etiketleri ve taralı alanlar canlı önizleme ile soruya aktarılır.']
    ]
  },
  {
    s: '✂️ 5. Görsel ve PDF\'ten Soru Kesme (OCR Destekli)',
    items: [
      ['Hassas Alan Seçimi', 'Kitap taramalarını veya PDF sayfalarını yükleyip fareyle çerçeveleyerek tek tıkla soru havuzunuza ekleyebilirsiniz.'],
      ['Optik Karakter Tanıma (OCR)', 'Kırpılan sorudaki metin ve şıkları yapay zekâ OCR motoru ile otomatik olarak metne dönüştürebilirsiniz.']
    ]
  },
  {
    s: '🎨 6. Sınav Tasarım Rengi ve Mizanpaj',
    items: [
      ['5 Önerilen Renk Paleti', 'Resmî MEB Bordo, Kurumsal Lacivert, Zümrüt Yeşili, Canlandırıcı Turuncu ve Kurşunî Antrasit paletlerinden birini tek dokunuşla seçebilirsiniz.'],
      ['Özel Renk Seçici ve HEX Girişi', '<b>Kendi Rengini Seç</b> butonuyla renk tekerleğini açabilir veya doğrudan kurumunuzun <b>HEX</b> renk kodunu (ör. <i>#1E3A8A</i>) yazabilirsiniz.'],
      ['Akıllı Yerleşim ve Boşluk Ayarı', 'Sayfa sütun sayısı (1, 2, 3 sütun), sorular arası boşluk ve filigran ayarlarını canlı olarak değiştirebilirsiniz.']
    ]
  },
  {
    s: '📄 7. Çıktı Alma ve Çevrim Dışı Güvenlik',
    items: [
      ['Baskıya Hazır PDF ve Word (.docx)', 'Sınavınızı doğrudan yazıcıya gönderebileceğiniz vektörel PDF olarak oluşturabilir veya Word formatında dışa aktarabilirsiniz.'],
      ['Çoklu Kitapçık Desteği', 'A, B, C, D kitapçıkları oluşturulduğunda sorular otomatik olarak karıştırılır ve ortak cevap anahtarı üretilir.'],
      ['Veri Gizliliği', 'Tüm işlemler yerel tarayıcınız üzerinde gerçekleşir; soru ve sınav verileriniz hiçbir haricî sunucuya gönderilmez.']
    ]
  }
];

function initGuide() {
  const gb = $('guideBody');
  if (!gb) return;
  gb.innerHTML =
    GUIDE.map((g) => `
      <section class="mb-7">
        <h3 class="mb-3 border-b border-slate-200 pb-1.5 text-[13px] font-semibold tracking-wide text-slate-900 dark:border-slate-800 dark:text-slate-100">${g.s}</h3>
        <dl class="space-y-3">
          ${g.items.map(([t, d]) => `
            <div>
              <dt class="text-[13px] font-medium text-slate-800 dark:text-slate-200">${t}</dt>
              <dd class="mt-0.5 text-[13px] leading-relaxed text-slate-500">${d}</dd>
            </div>`).join('')}
        </dl>
      </section>`).join('') +
    `<section class="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-800">
       <div class="text-[13px] font-semibold text-slate-900 dark:text-slate-100">Egemen Bilim</div>
       <div class="mt-1.5 text-[13px] text-slate-500">
         <a class="text-slate-700 hover:underline dark:text-slate-300" href="tel:+905537891938">0553 789 1938</a>
         <span class="mx-2 text-slate-300">·</span>
         <a class="text-slate-700 hover:underline dark:text-slate-300" href="mailto:egemenbilim@gmail.com">egemenbilim@gmail.com</a>
       </div>
       <div class="mt-2 text-xs text-slate-400">Öneri ve hata bildirimleriniz için yazabilirsiniz.</div>
     </section>`;
  $('openGuide').onclick = () => $('guide').classList.replace('hidden', 'flex');
  $('guideClose').onclick = () => $('guide').classList.replace('flex', 'hidden');
}

function renderTabs() {
  [...$('typeTabs').children].forEach(b => {
    b.className = b.dataset.t === S.testType ? 'active' : '';
  });
  $('konuRow').classList.toggle('hidden', S.testType !== 'yaprak');
}

function renderTplCards() {
  const isMeb = S.template === 'meb';
  const isCustom = S.template === 'custom';
  document.querySelectorAll('.tpl-card').forEach(b => b.classList.toggle('active', b.dataset.tpl === S.template));
  document.querySelectorAll('.tpl-hide-meb').forEach(el => el.classList.toggle('hidden', isMeb || isCustom));
  document.querySelectorAll('.tpl-show-meb').forEach(el => el.classList.toggle('hidden', !isMeb));
  updateQuestionAreaMetrics();
}

function renderColorPalette() {
  const container = $('colorPaletteSwatches');
  if (!container) return;
  const curr = (S.themeColor || '#1d4ed8').toLowerCase();
  container.innerHTML = PRESET_COLORS.map(c => {
    const isAct = c.hex.toLowerCase() === curr;
    return `<button type="button" class="color-swatch-circle ${isAct ? 'active' : ''}" data-hex="${c.hex}" title="${c.name} (${c.hex})" style="background-color:${c.hex}">
      ${isAct ? '<span class="swatch-check">✓</span>' : ''}
    </button>`;
  }).join('');

  if ($('themeColorHex')) {
    $('themeColorHex').value = (S.themeColor || '#1d4ed8').toUpperCase();
  }
  if ($('themeColor')) {
    $('themeColor').value = S.themeColor || '#1d4ed8';
  }
}

function updateQuestionAreaMetrics() {
  try {
    const b = calculateQuestionBounds();
    if ($('qaUsableH')) $('qaUsableH').textContent = `${Math.round(b.usableH)} mm (${Math.round(b.contentTop)} mm - ${Math.round(b.bottomAdj)} mm)`;
    if ($('qaCols')) $('qaCols').textContent = `${b.numCols} Sütun`;
    if ($('qaColW')) $('qaColW').textContent = `${Math.round(b.colW)} mm`;
  } catch (e) {}
}

function renderLogoChoice() {
  const c = S.logoChoice || 'meb';
  $('mebLogoRadio').checked = c === 'meb';
  $('customLogoRadio').checked = c === 'custom';
  $('noLogoRadio').checked = c === 'none';
  $('customLogoPanel').classList.toggle('hidden', c !== 'custom');
  S.mebLogo = c !== 'none';
}

function collect() {
  S.title = $('title').value;
  S.school = $('school').value;
  S.lesson = $('lesson').value;
  S.description = $('description').value;
  S.konuKapsami = $('konuKapsami').value;
  S.mebYear = $('mebYear').value;
  S.mebSchool = $('mebSchool').value;
  S.mebDate = $('mebDate').value;
  S.mebLesson = $('mebLesson').value;
  S.mebGrade = $('mebGrade').value;
  S.mebExam = $('mebExam').value;
  S.mebNameLbl = $('mebNameLbl').value;
  S.mebClassLbl = $('mebClassLbl').value;
  S.mebNoLbl = $('mebNoLbl').value;
  S.mebScoreLbl = $('mebScoreLbl').value;
}

function syncUI() {
  if (S.title !== undefined) $('title').value = S.title;
  if (S.school !== undefined) $('school').value = S.school;
  if (S.lesson !== undefined) $('lesson').value = S.lesson;
  if (S.description !== undefined) $('description').value = S.description;
  if (S.konuKapsami !== undefined) $('konuKapsami').value = S.konuKapsami;
  if (S.groups !== undefined) $('groups').value = String(S.groups);
  if (S.optic !== undefined) $('optic').checked = !!S.optic;
  if (S.showAnswerKey !== undefined) $('showAnswerKey').checked = !!S.showAnswerKey;
  if (S.spacing !== undefined) { $('spacing').checked = !!S.spacing; $('spacingBox').classList.toggle('hidden', !S.spacing); }
  if (S.spacingValue !== undefined) { $('spacingValue').value = String(S.spacingValue); $('spVal').textContent = String(S.spacingValue); }
  if (S.smartLayout !== undefined) $('smartLayout').checked = !!S.smartLayout;
  if (S.watermark !== undefined) $('watermark').value = S.watermark;
  if (S.watermarkAngle !== undefined) { $('watermarkAngle').value = String(S.watermarkAngle); $('wmAngleVal').textContent = S.watermarkAngle + '°'; }
  if (S.watermarkSize !== undefined) { $('watermarkSize').value = String(S.watermarkSize); $('wmSizeVal').textContent = String(S.watermarkSize); }
  if (S.watermarkDivider !== undefined) $('watermarkDivider').checked = !!S.watermarkDivider;
  if (S.themeColor !== undefined) {
    $('themeColor').value = S.themeColor;
    renderColorPalette();
  }
  if (S.pageSize !== undefined) $('pageSize').value = S.pageSize;
  if (S.orientation !== undefined) $('orientation').value = S.orientation;
  if (S.columns !== undefined) $('columns').value = String(S.columns);
  if (S.margin !== undefined) { $('margin').value = String(S.margin); $('mgVal').textContent = String(S.margin); }
  if (S.template !== undefined) renderTplCards();
  if (S.mebYear !== undefined) $('mebYear').value = S.mebYear;
  if (S.mebSchool !== undefined) $('mebSchool').value = S.mebSchool;
  if (S.mebDate !== undefined) $('mebDate').value = S.mebDate;
  if (S.mebLesson !== undefined) $('mebLesson').value = S.mebLesson;
  if (S.mebGrade !== undefined) $('mebGrade').value = S.mebGrade;
  if (S.mebExam !== undefined) $('mebExam').value = S.mebExam;
  if (S.mebNameLbl !== undefined) $('mebNameLbl').value = S.mebNameLbl;
  if (S.mebClassLbl !== undefined) $('mebClassLbl').value = S.mebClassLbl;
  if (S.mebNoLbl !== undefined) $('mebNoLbl').value = S.mebNoLbl;
  if (S.mebScoreLbl !== undefined) $('mebScoreLbl').value = S.mebScoreLbl;
  if (S.logoChoice !== undefined) renderLogoChoice();
  renderTabs();
  updateQuestionAreaMetrics();
  $('qCount').textContent = questions.length;
  $('ansCount').textContent = questions.filter((q) => q.answer).length;
}

function initSidebar() {
  $('sidebarToggle').onclick = openSidebar;
  $('sidebarClose').onclick = closeSidebar;
  $('sidebarOverlay').onclick = closeSidebar;

  [...$('typeTabs').children].forEach(b => b.onclick = () => {
    S.testType = b.dataset.t;
    renderTabs();
  });
  renderTabs();

  $('groups').onchange = e => S.groups = +e.target.value;
  $('optic').onchange = e => S.optic = e.target.checked;
  $('showAnswerKey').onchange = e => S.showAnswerKey = e.target.checked;
  $('spacing').onchange = e => {
    S.spacing = e.target.checked;
    $('spacingBox').classList.toggle('hidden', !S.spacing);
  };
  $('spacingValue').oninput = e => {
    S.spacingValue = +e.target.value;
    $('spVal').textContent = e.target.value;
  };
  $('advBtn').onclick = () => {
    const h = $('advBox').classList.toggle('hidden');
    $('advArrow').textContent = h ? '＋' : '−';
  };
  $('tplBtn').onclick = () => {
    const h = $('tplBox').classList.toggle('hidden');
    $('tplArrow').textContent = h ? '＋' : '−';
  };

  document.querySelectorAll('.tpl-card').forEach(b => {
    b.onclick = () => {
      S.template = b.dataset.tpl;
      renderTplCards();
      schedulePreview();
    };
  });
  renderTplCards();

  const openCtplBtn = $('openCustomTplModal');
  if (openCtplBtn) {
    openCtplBtn.onclick = () => openCustomTemplateModal();
  }

  $('mebYear').oninput = e => S.mebYear = e.target.value;
  $('mebSchool').oninput = e => S.mebSchool = e.target.value;
  $('mebDate').oninput = e => S.mebDate = e.target.value;
  $('mebLesson').oninput = e => S.mebLesson = e.target.value;
  $('mebGrade').oninput = e => S.mebGrade = e.target.value;
  $('mebExam').oninput = e => S.mebExam = e.target.value;
  $('mebNameLbl').oninput = e => S.mebNameLbl = e.target.value;
  $('mebClassLbl').oninput = e => S.mebClassLbl = e.target.value;
  $('mebNoLbl').oninput = e => S.mebNoLbl = e.target.value;
  $('mebScoreLbl').oninput = e => S.mebScoreLbl = e.target.value;

  document.querySelectorAll('[name=logoChoice]').forEach(r => {
    r.onchange = () => {
      S.logoChoice = r.value;
      renderLogoChoice();
      schedulePreview();
    };
  });

  $('customLogoFile').onchange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      trimLogoImage(r.result, (trimmed) => {
        const im = new Image();
        im.onload = () => {
          setCustomLogo(trimmed, im);
          const ar = (im.naturalWidth || 1) / (im.naturalHeight || 1);
          let h = 22, w = h * ar;
          if (w > 60) { w = 60; h = w / ar; }
          S.logoW = Math.max(8, w);
          S.logoH = Math.max(8, h);
          schedulePreview();
        };
        im.src = trimmed;
        $('customLogoPreview').src = trimmed;
        $('customLogoPreview').classList.remove('hidden');
        $('customLogoPlaceholder').classList.add('hidden');
        $('customLogoRemove').classList.remove('hidden');
      });
    };
    r.readAsDataURL(f);
  };

  $('customLogoRemove').onclick = () => {
    setCustomLogo(null, null);
    $('customLogoFile').value = '';
    $('customLogoPreview').classList.add('hidden');
    $('customLogoPlaceholder').classList.remove('hidden');
    $('customLogoRemove').classList.add('hidden');
    schedulePreview();
  };

  $('logoFixAspect').onclick = () => fixLogoAspect(refreshNow);
  $('logoSizeReset').onclick = () => { S.logoW = 22; S.logoH = 22; schedulePreview(); };
  $('logoPosReset').onclick = () => {
    S.logoX = null;
    S.logoY = null;
    S.mebPos = null;
    schedulePreview();
  };
  renderLogoChoice();

  $('smartLayout').onchange = e => S.smartLayout = e.target.checked;
  $('watermark').oninput = e => S.watermark = e.target.value;
  $('watermarkAngle').oninput = e => {
    S.watermarkAngle = +e.target.value;
    $('wmAngleVal').textContent = e.target.value + '°';
  };
  $('watermarkSize').oninput = e => {
    S.watermarkSize = +e.target.value;
    $('wmSizeVal').textContent = e.target.value;
  };
  $('watermarkDivider').onchange = e => S.watermarkDivider = e.target.checked;
  $('konuKapsami').oninput = e => S.konuKapsami = e.target.value;

  // Sınav Tasarım Rengi Eventleri
  renderColorPalette();
  const swatches = $('colorPaletteSwatches');
  if (swatches) {
    swatches.onclick = (e) => {
      const btn = e.target.closest('.color-swatch-circle');
      if (btn && btn.dataset.hex) {
        S.themeColor = btn.dataset.hex;
        renderColorPalette();
        schedulePreview();
      }
    };
  }

  const customColorBtn = $('customColorPickBtn');
  if (customColorBtn) {
    customColorBtn.onclick = () => $('themeColor').click();
  }

  $('themeColor').oninput = (e) => {
    S.themeColor = e.target.value;
    renderColorPalette();
    schedulePreview();
  };

  const hexInp = $('themeColorHex');
  if (hexInp) {
    hexInp.oninput = (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
        S.themeColor = val;
        if ($('themeColor')) $('themeColor').value = val;
        renderColorPalette();
        schedulePreview();
      }
    };
  }

  const qaToggle = $('toggleQuestionAreaGuide');
  if (qaToggle) {
    qaToggle.onclick = () => {
      S.showQuestionAreaGuide = !S.showQuestionAreaGuide;
      qaToggle.textContent = S.showQuestionAreaGuide ? 'Kılavuzu Gizle' : 'Kılavuzu Göster';
      schedulePreview();
    };
  }

  $('pageSize').onchange = e => { S.pageSize = e.target.value; updateQuestionAreaMetrics(); };
  $('orientation').onchange = e => { S.orientation = e.target.value; updateQuestionAreaMetrics(); };
  $('columns').onchange = e => { S.columns = +e.target.value; updateQuestionAreaMetrics(); };
  $('margin').oninput = e => {
    S.margin = +e.target.value;
    $('mgVal').textContent = e.target.value;
    updateQuestionAreaMetrics();
  };

  ['input', 'change'].forEach(ev => {
    $('sidebarPanel').addEventListener(ev, schedulePreview);
  });
  [...$('typeTabs').children].forEach(b => b.addEventListener('click', schedulePreview));
  $('advBtn').addEventListener('click', schedulePreview);

  initDark();
  initGuide();
}


// Module Exports
__exports['GUIDE'] = GUIDE;
__exports['openSidebar'] = openSidebar;
__exports['closeSidebar'] = closeSidebar;
__exports['initDark'] = initDark;
__exports['initGuide'] = initGuide;
__exports['renderTabs'] = renderTabs;
__exports['renderTplCards'] = renderTplCards;
__exports['renderColorPalette'] = renderColorPalette;
__exports['updateQuestionAreaMetrics'] = updateQuestionAreaMetrics;
__exports['renderLogoChoice'] = renderLogoChoice;
__exports['collect'] = collect;
__exports['syncUI'] = syncUI;
__exports['initSidebar'] = initSidebar;

});

__define('modules/cropTool.js', function(__exports, __require, __module) {
const { questions, MAX, LETTERS } = __require('state.js');
const { $, uid } = __require('utils.js');

let cropSrc = null, cuts = [], cropAnswer = null, rect = null, drawing = false, startP = { x: 0, y: 0 };
let pdfPages = [], selectedPdfPage = null;
let pdfDoc = null;
let pdfRenderTasks = {};
let zoom = { s: 1, tx: 0, ty: 0 };
let pinch = null;

const CROP_ANS_BASE = 'h-6 w-6 rounded-md border text-[11px] font-medium transition ';
const CROP_ANS_OFF = 'border-white/25 text-white/80 hover:border-white/60 hover:text-white';
const CROP_ANS_ON = 'bg-white text-slate-900 border-white font-bold';

function paintCropAns() {
  const ansBox = $('cropAns');
  if (!ansBox) return;
  ansBox.querySelectorAll('[data-c]').forEach(x =>
    x.className = CROP_ANS_BASE + (cropAnswer === x.dataset.c ? CROP_ANS_ON : CROP_ANS_OFF));
}

function applyZoom() {
  const st = $('cropStage');
  if (st) st.style.transform = 'translate(' + zoom.tx + 'px,' + zoom.ty + 'px) scale(' + zoom.s + ')';
}

function resetZoom() {
  zoom = { s: 1, tx: 0, ty: 0 };
  pinch = null;
  applyZoom();
}

function pdfLoadingShow(msg) {
  const el = $('pdfLoading');
  if (!el) return;
  el.textContent = msg || 'PDF açılıyor...';
  el.classList.remove('hidden');
  el.classList.add('flex');
}

function pdfLoadingHide() {
  const el = $('pdfLoading');
  if (!el) return;
  el.classList.add('hidden');
  el.classList.remove('flex');
}

function clearPdfCache() {
  pdfPages.forEach(p => {
    if (p && p.blobUrl) {
      try { URL.revokeObjectURL(p.blobUrl); } catch (e) {}
    }
    if (p && p.canvas) {
      try { p.canvas.width = 0; p.canvas.height = 0; } catch (e) {}
    }
  });
  pdfPages = [];
  Object.values(pdfRenderTasks).forEach(t => {
    try { if (t && t.task) t.task.cancel(); } catch (e) {}
  });
  pdfRenderTasks = {};
  if (pdfDoc) {
    try { pdfDoc.destroy(); } catch (e) {}
    pdfDoc = null;
  }
}

async function renderPdfPage(n) {
  if (pdfPages[n - 1]) return pdfPages[n - 1];
  if (pdfRenderTasks[n]) return pdfRenderTasks[n].promise;
  const promise = (async () => {
    const page = await pdfDoc.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(1.5, 1500 / Math.max(1, base.width));
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
    pdfRenderTasks[n].task = task;
    await task.promise;
    const blobUrl = await new Promise((res) => {
      if (!canvas.toBlob) {
        res(canvas.toDataURL('image/jpeg', 0.9));
        return;
      }
      canvas.toBlob(b => res(b ? URL.createObjectURL(b) : canvas.toDataURL('image/jpeg', 0.9)), 'image/jpeg', 0.9);
    });
    pdfPages[n - 1] = { page: n, canvas, blobUrl };
    return pdfPages[n - 1];
  })();
  pdfRenderTasks[n] = { promise, task: null };
  try {
    const out = await promise;
    return out;
  } finally {
    delete pdfRenderTasks[n];
  }
}

async function selectPdfPage(n) {
  if (!pdfDoc) return;
  const sel = $('pdfPageSelect');
  if (sel) sel.value = String(n);
  selectedPdfPage = n;
  const cached = pdfPages[n - 1];
  if (!cached) pdfLoadingShow(n + '. sayfa hazırlanıyor…');
  try {
    const p = await renderPdfPage(n);
    if (selectedPdfPage !== n) return;
    cropSrc = p.blobUrl;
    const im = $('cropImg');
    im.src = cropSrc;
    im.classList.remove('hidden');
    $('cropHint').classList.add('hidden');
    rect = null;
    drawRect();
    hideCropAdd();
    resetZoom();
  } catch (e) {
    if (e && e.name === 'RenderingCancelledException') return;
    console.error(e);
    alert(n + '. sayfa açılamadı.');
  } finally {
    if (selectedPdfPage === n) pdfLoadingHide();
  }
}

async function loadPdfFile(file) {
  if (!window.pdfjsLib) { alert('PDF kütüphanesi yüklenemedi.'); return; }
  clearPdfCache();
  pdfLoadingShow('PDF açılıyor...');
  try {
    const buf = await file.arrayBuffer();
    pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
    pdfPages = new Array(pdfDoc.numPages);
    $('pdfPageBar').classList.remove('hidden');
    $('pdfPageBar').classList.add('flex');
    const sel = $('pdfPageSelect');
    let opts = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) opts += '<option value="' + i + '">Sayfa ' + i + '</option>';
    sel.innerHTML = opts;
    $('pdfPageCount').textContent = '/ ' + pdfDoc.numPages;
    sel.onchange = () => selectPdfPage(+sel.value);
    if (pdfDoc.numPages) await selectPdfPage(1);
    else pdfLoadingHide();
  } catch (e) {
    console.error(e);
    alert('PDF yüklenirken hata oluştu.');
    pdfLoadingHide();
  }
}

function stagePos(clientX, clientY) {
  const stage = $('cropStage');
  const b = stage.getBoundingClientRect();
  return { x: (clientX - b.left) / zoom.s, y: (clientY - b.top) / zoom.s };
}

function startDraw(clientX, clientY) {
  if (!cropSrc) return;
  hideCropAdd();
  drawing = true;
  startP = stagePos(clientX, clientY);
  rect = { x: startP.x, y: startP.y, w: 0, h: 0 };
  drawRect();
}

function moveDraw(clientX, clientY) {
  if (!drawing) return;
  const p = stagePos(clientX, clientY);
  rect = {
    x: Math.min(startP.x, p.x),
    y: Math.min(startP.y, p.y),
    w: Math.abs(p.x - startP.x),
    h: Math.abs(p.y - startP.y)
  };
  drawRect();
}

function endDraw(clientX, clientY) {
  if (!drawing) return;
  drawing = false;
  if (rect && rect.w > 10 && rect.h > 10) showCropAddAt(clientX, clientY);
}

function drawRect() {
  const r = $('cropRect');
  if (!rect) {
    r.classList.add('hidden');
    return;
  }
  r.classList.remove('hidden');
  r.style.left = rect.x + 'px';
  r.style.top = rect.y + 'px';
  r.style.width = rect.w + 'px';
  r.style.height = rect.h + 'px';
}

function showCropAddAt(clientX, clientY) {
  const bar = $('cropAddBar');
  const wrap = $('cropWrap');
  const wb = wrap.getBoundingClientRect();
  bar.classList.remove('hidden');
  bar.classList.add('flex');
  const bw = bar.offsetWidth || 240;
  const bh = bar.offsetHeight || 36;
  const gap = 8;
  let left = clientX - wb.left + wrap.scrollLeft + gap;
  let top = clientY - wb.top + wrap.scrollTop + gap;
  const maxLeft = wrap.scrollLeft + wrap.clientWidth - bw - 4;
  const maxTop = wrap.scrollTop + wrap.clientHeight - bh - 4;
  if (left > maxLeft) left = Math.max(4, clientX - wb.left + wrap.scrollLeft - bw - gap);
  if (left < 4) left = 4;
  if (top > maxTop) top = Math.max(4, clientY - wb.top + wrap.scrollTop - bh - gap);
  if (top < 4) top = 4;
  bar.style.left = left + 'px';
  bar.style.top = top + 'px';
}

function hideCropAdd() {
  const bar = $('cropAddBar');
  if (bar) {
    bar.classList.add('hidden');
    bar.classList.remove('flex');
  }
}

function trimCanvas(c) {
  const ctx = c.getContext('2d'), w = c.width, h = c.height, d = ctx.getImageData(0, 0, w, h).data;
  const blank = (i) => d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235;
  const rowB = (y) => {
    for (let x = 0; x < w; x++) if (!blank((y * w + x) * 4)) return false;
    return true;
  };
  const colB = (x) => {
    for (let y = 0; y < h; y++) if (!blank((y * w + x) * 4)) return false;
    return true;
  };
  let t = 0, b = h - 1, l = 0, r = w - 1;
  while (t < b && rowB(t)) t++;
  while (b > t && rowB(b)) b--;
  while (l < r && colB(l)) l++;
  while (r > l && colB(r)) r--;
  const p = 3;
  t = Math.max(0, t - p);
  l = Math.max(0, l - p);
  b = Math.min(h - 1, b + p);
  r = Math.min(w - 1, r + p);
  const o = document.createElement('canvas');
  o.width = r - l + 1;
  o.height = b - t + 1;
  o.getContext('2d').drawImage(c, l, t, o.width, o.height, 0, 0, o.width, o.height);
  return o;
}

function renderCuts(onOcrRequested) {
  $('cutCount').textContent = cuts.length;
  $('cutList').innerHTML = '<div class="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-white/40">Kesilenler</div>' +
    (cuts.length ? cuts.map((c, i) => `<div class="group relative mb-2 overflow-hidden rounded-lg bg-white p-1"><img src="${c.src}" class="w-full">
      <span class="absolute left-1.5 top-1.5 rounded bg-slate-900/80 px-1.5 text-[10px] font-medium text-white">${i + 1}${c.answer ? ' · ' + c.answer : ''}</span>
      <button data-ocr="${i}" class="absolute left-1.5 bottom-1.5 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-slate-900">Metni oku</button>
      <button data-i="${i}" class="absolute right-1.5 top-1.5 rounded bg-slate-900/80 px-1.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600">✕</button></div>`).join('')
      : '<div class="mt-4 text-center text-[11px] text-white/30">Henüz soru kesilmedi</div>');

  $('cutList').querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
    cuts.splice(+b.dataset.i, 1);
    renderCuts(onOcrRequested);
  });
  $('cutList').querySelectorAll('[data-ocr]').forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    if (onOcrRequested) onOcrRequested(cuts[+b.dataset.ocr]);
  });
}

async function ocrCutToText(cut, openTextFn, autoParseFn) {
  if (!cut || !cut.src) return;
  if (!window.Tesseract) { alert('OCR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.'); return; }
  try {
    if ($('progress')) {
      $('progress').classList.remove('hidden');
      $('progress').textContent = 'Metin okunuyor…';
    }
    const result = await window.Tesseract.recognize(cut.src, 'tur', {
      logger: (m) => {
        if (m.status === 'recognizing text' && $('progress')) {
          $('progress').textContent = 'Metin okunuyor… ' + Math.round((m.progress || 0) * 100) + '%';
        }
      }
    });
    const text = (result && result.data && result.data.text) ? result.data.text.trim() : '';
    if ($('progress')) $('progress').classList.add('hidden');
    if (!text) { alert('Metin okunamadı. Daha net bir kesim deneyin.'); return; }
    $('cropTool').classList.replace('flex', 'hidden');
    if (openTextFn) openTextFn(null);
    $('txtPreamble').value = text;
    if (autoParseFn) autoParseFn(text);
  } catch (e) {
    if ($('progress')) $('progress').classList.add('hidden');
    alert('OCR hatası: ' + (e && e.message ? e.message : e));
  }
}

function initCropTool({ onQuestionsUpdated, openTextFn, autoParseFn }) {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  $('cropAns').innerHTML = LETTERS.map(l => `<button type="button" data-c="${l}" class="${CROP_ANS_BASE}${CROP_ANS_OFF}">${l}</button>`).join('');
  $('cropAns').querySelectorAll('[data-c]').forEach(b => b.onclick = (e) => {
    e.stopPropagation();
    cropAnswer = cropAnswer === b.dataset.c ? null : b.dataset.c;
    paintCropAns();
  });

  $('openCrop').onclick = () => $('cropTool').classList.replace('hidden', 'flex');
  $('cropClose').onclick = () => {
    $('cropTool').classList.replace('flex', 'hidden');
    clearPdfCache();
    selectedPdfPage = null;
    $('pdfPageBar').classList.add('hidden');
    $('pdfPageBar').classList.remove('flex');
  };

  $('cropFile').onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
      loadPdfFile(f);
    } else {
      clearPdfCache();
      selectedPdfPage = null;
      $('pdfPageBar').classList.add('hidden');
      $('pdfPageBar').classList.remove('flex');
      const r = new FileReader();
      r.onload = () => {
        cropSrc = r.result;
        const im = $('cropImg');
        im.src = cropSrc;
        im.classList.remove('hidden');
        $('cropHint').classList.add('hidden');
        resetZoom();
      };
      r.readAsDataURL(f);
    }
    e.target.value = '';
  };

  const stage = $('cropStage');
  stage.addEventListener('mousedown', e => startDraw(e.clientX, e.clientY));
  stage.addEventListener('mousemove', e => moveDraw(e.clientX, e.clientY));
  stage.addEventListener('mouseup', e => endDraw(e.clientX, e.clientY));

  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      pinch = null;
      e.preventDefault();
      startDraw(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      drawing = false;
      hideCropAdd();
      const t0 = e.touches[0], t1 = e.touches[1];
      const d0 = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const b = stage.getBoundingClientRect();
      const O = { x: b.left - zoom.tx, y: b.top - zoom.ty };
      const m = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
      pinch = { d0, s0: zoom.s, cMid: { x: (m.x - O.x - zoom.tx) / zoom.s, y: (m.y - O.y - zoom.ty) / zoom.s } };
      e.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && drawing) {
      e.preventDefault();
      moveDraw(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && pinch) {
      const t0 = e.touches[0], t1 = e.touches[1];
      const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const sNew = Math.min(5, Math.max(1, pinch.s0 * (d / Math.max(1, pinch.d0))));
      const b = stage.getBoundingClientRect();
      const O = { x: b.left - zoom.tx, y: b.top - zoom.ty };
      const m = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
      let txNew = m.x - O.x - sNew * pinch.cMid.x;
      let tyNew = m.y - O.y - sNew * pinch.cMid.y;
      const wrap = $('cropWrap');
      const cw = wrap.clientWidth, ch = wrap.clientHeight;
      const ow = stage.offsetWidth, oh = stage.offsetHeight, c = 48;
      if (ow * sNew > cw) txNew = Math.max(cw - ow * sNew - c, Math.min(c, txNew)); else txNew = 0;
      if (oh * sNew > ch) tyNew = Math.max(ch - oh * sNew - c, Math.min(c, tyNew)); else tyNew = 0;
      zoom = { s: sNew, tx: txNew, ty: tyNew };
      applyZoom();
      e.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
      if (drawing) {
        const t = e.changedTouches[0];
        if (t) endDraw(t.clientX, t.clientY);
      }
      pinch = null;
    } else if (e.touches.length === 1) {
      pinch = null;
      drawing = false;
    }
  });

  stage.addEventListener('touchcancel', () => { pinch = null; drawing = false; });
  window.addEventListener('mouseup', () => { drawing = false; });
  window.addEventListener('touchend', () => { drawing = false; });

  ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup'].forEach(ev =>
    $('cropAddBar').addEventListener(ev, e => e.stopPropagation()));

  $('cropAddBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    $('cutBtn').click();
    hideCropAdd();
  });

  $('cropOcrBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    $('cutBtn').click();
    hideCropAdd();
    const last = cuts[cuts.length - 1];
    if (last) ocrCutToText(last, openTextFn, autoParseFn);
  });

  $('cutBtn').onclick = () => {
    if (!cropSrc || !rect || rect.w < 8 || rect.h < 8) return alert('Önce bir alan seçin.');
    const img = $('cropImg'), scale = img.naturalWidth / img.clientWidth;
    let c = document.createElement('canvas');
    c.width = rect.w * scale;
    c.height = rect.h * scale;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, rect.x * scale, rect.y * scale, rect.w * scale, rect.h * scale, 0, 0, c.width, c.height);
    if ($('autoTrim').checked) c = trimCanvas(c);
    cuts.push({
      id: uid(),
      src: c.toDataURL('image/jpeg', 0.92),
      w: c.width,
      h: c.height,
      answer: cropAnswer,
      groupId: null,
      stem: '',
      name: 'kirpma'
    });
    rect = null;
    drawRect();
    cropAnswer = null;
    paintCropAns();
    renderCuts((cut) => ocrCutToText(cut, openTextFn, autoParseFn));
  };

  renderCuts((cut) => ocrCutToText(cut, openTextFn, autoParseFn));

  $('cropUpload').onclick = () => {
    questions.push(...cuts);
    if (questions.length > MAX) questions.length = MAX;
    cuts = [];
    renderCuts((cut) => ocrCutToText(cut, openTextFn, autoParseFn));
    $('cropTool').classList.replace('flex', 'hidden');
    if (onQuestionsUpdated) onQuestionsUpdated();
  };
}


// Module Exports
__exports['clearPdfCache'] = clearPdfCache;
__exports['ocrCutToText'] = ocrCutToText;
__exports['initCropTool'] = initCropTool;

});

__define('modules/equationEditor.js', function(__exports, __require, __module) {
const { $, openModal, closeModal } = __require('utils.js');

const EQED_MAIN = [
  { label: 'Kesir', template: '\\frac{PAY}{PAYDA}' },
  { label: 'Karekök', template: '\\sqrt{SAYI}' },
  { label: 'Dereceli Kök', template: '\\sqrt[DERECE]{SAYI}' },
  { label: 'Üslü Sayı', template: 'TABAN^{ÜS}' },
  { label: 'Alt İndis', template: 'TABAN_{İNDİS}' },
  { label: 'Mutlak Değer', template: '\\left| SAYI \\right|' },
  {
    label: 'Logaritma', dropdown: [
      { label: 'log₁₀', template: '\\log(SAYI)' },
      { label: 'Taban Belirt', template: '\\log_{TABAN}(SAYI)' },
      { label: 'ln (doğal log)', template: '\\ln(SAYI)' }
    ]
  },
  {
    label: 'Trigonometri', dropdown: [
      { label: 'sin', template: '\\sin(AÇI)' },
      { label: 'cos', template: '\\cos(AÇI)' },
      { label: 'tan', template: '\\tan(AÇI)' },
      { label: 'cot', template: '\\cot(AÇI)' },
      { label: 'sec', template: '\\sec(AÇI)' },
      { label: 'csc', template: '\\csc(AÇI)' },
      { label: 'arcsin', template: '\\arcsin(SAYI)' },
      { label: 'arccos', template: '\\arccos(SAYI)' },
      { label: 'arctan', template: '\\arctan(SAYI)' },
      { label: 'Derece (°)', insert: '^{\\circ}' }
    ]
  },
  { label: 'Limit', template: '\\lim_{x \\to DEĞER}' },
  {
    label: 'Türev', dropdown: [
      { label: '1. Türev', template: "FONKSİYON'(DEĞİŞKEN)" },
      { label: '2. Türev', template: "FONKSİYON''(DEĞİŞKEN)" },
      { label: 'Leibniz Gösterimi', template: '\\frac{d\\,FONKSİYON}{d\\,DEĞİŞKEN}' }
    ]
  },
  {
    label: 'İntegral', dropdown: [
      { label: 'Belirsiz İntegral', template: '\\int FONKSİYON \\, dx' },
      { label: 'Belirli İntegral', template: '\\int_{ALT}^{ÜST} FONKSİYON \\, dx' },
      { label: 'Çevre İntegrali', template: '\\oint FONKSİYON \\, dx' }
    ]
  },
  { label: 'Toplam Sembolü', template: '\\sum_{i=ALT}^{ÜST} İFADE' },
  {
    label: 'Pi/Alfa/Theta', dropdown: [
      { label: 'π', insert: '\\pi' },
      { label: 'α', insert: '\\alpha' },
      { label: 'β', insert: '\\beta' },
      { label: 'θ', insert: '\\theta' },
      { label: 'Δ', insert: '\\Delta' },
      { label: '∞', insert: '\\infty' }
    ]
  },
  {
    label: 'Eşitsizlik/Karşılaştırma', dropdown: [
      { label: '≤ küçük eşit', insert: '\\leq' },
      { label: '≥ büyük eşit', insert: '\\geq' },
      { label: '≠ eşit değil', insert: '\\neq' },
      { label: '≈ yaklaşık eşit', insert: '\\approx' },
      { label: '≡ özdeş', insert: '\\equiv' },
      { label: '∝ orantılı', insert: '\\propto' }
    ]
  },
  {
    label: 'Küme İşlemleri', dropdown: [
      { label: '∈ elemanıdır', insert: '\\in' },
      { label: '∉ elemanı değildir', insert: '\\notin' },
      { label: '⊂ alt kümesi', insert: '\\subset' },
      { label: '⊆ alt küme/eşit', insert: '\\subseteq' },
      { label: '∪ birleşim', insert: '\\cup' },
      { label: '∩ kesişim', insert: '\\cap' },
      { label: '∅ boş küme', insert: '\\emptyset' },
      { label: '∀ her biri için', insert: '\\forall' },
      { label: '∃ vardır', insert: '\\exists' }
    ]
  },
  { label: 'Parçalı Fonksiyon', template: '\\begin{cases} DEĞER_1, & KOŞUL_1 \\\\ DEĞER_2, & KOŞUL_2 \\end{cases}' }
];

const EQED_ADV = [
  { label: 'Çarpım Sembolü', template: '\\prod_{i=ALT}^{ÜST} İFADE' },
  { label: 'Vektör', template: '\\vec{V}' },
  { label: 'Üst Çizgi', template: '\\overline{İFADE}' },
  { label: 'Şapka (^)', template: '\\hat{DEĞİŞKEN}' },
  { label: 'İkili Matris', template: '\\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix}' },
  {
    label: 'Ok Sembolleri', dropdown: [
      { label: '→ sağa ok', insert: '\\to' },
      { label: '⇒ ise (sonuç)', insert: '\\Rightarrow' },
      { label: '⇔ ancak ve ancak', insert: '\\Leftrightarrow' }
    ]
  },
  {
    label: 'Geometri', dropdown: [
      { label: '∠ açı', insert: '\\angle' },
      { label: '⊥ dik', insert: '\\perp' },
      { label: '∥ paralel', insert: '\\parallel' },
      { label: '△ üçgen', insert: '\\triangle' }
    ]
  }
];

const PLACEHOLDER_RE = /[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9_]*/g;

function closeAllPopovers(root) {
  root.querySelectorAll('.eqed-popover').forEach((p) => { p.classList.add('hidden'); });
}

function makeMainButton(root, textarea, item, onChange) {
  if (item.dropdown) {
    const wrap = document.createElement('div');
    wrap.className = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'eqed-btn w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300';
    btn.textContent = item.label + ' ▾';
    const pop = document.createElement('div');
    pop.className = 'eqed-popover hidden absolute left-0 top-full z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900';
    item.dropdown.forEach((sub) => {
      const sb = document.createElement('button');
      sb.type = 'button';
      sb.className = 'block w-full rounded-md px-2 py-1.5 text-left text-[12px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';
      sb.textContent = sub.label;
      sb.addEventListener('click', () => {
        if (sub.template != null) insertTemplate(textarea, sub.template);
        else if (sub.insert != null) insertPlain(textarea, sub.insert);
        pop.classList.add('hidden');
        onChange();
      });
      pop.appendChild(sb);
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasHidden = pop.classList.contains('hidden');
      closeAllPopovers(root);
      if (wasHidden) pop.classList.remove('hidden');
    });
    wrap.appendChild(btn);
    wrap.appendChild(pop);
    return wrap;
  }
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'eqed-btn w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300';
  b.textContent = item.label;
  b.addEventListener('click', () => {
    insertTemplate(textarea, item.template);
    onChange();
  });
  return b;
}

function insertPlain(textarea, str) {
  const start = textarea.selectionStart != null ? textarea.selectionStart : textarea.value.length;
  const end = textarea.selectionEnd != null ? textarea.selectionEnd : textarea.value.length;
  const val = textarea.value;
  textarea.value = val.slice(0, start) + str + val.slice(end);
  const pos = start + str.length;
  textarea.focus();
  textarea.setSelectionRange(pos, pos);
}

function insertTemplate(textarea, template) {
  const start = textarea.selectionStart != null ? textarea.selectionStart : textarea.value.length;
  const end = textarea.selectionEnd != null ? textarea.selectionEnd : textarea.value.length;
  const val = textarea.value;
  textarea.value = val.slice(0, start) + template + val.slice(end);
  textarea.focus();
  PLACEHOLDER_RE.lastIndex = start;
  const m = PLACEHOLDER_RE.exec(textarea.value);
  if (m && m.index < start + template.length) {
    textarea.setSelectionRange(m.index, m.index + m[0].length);
  } else {
    const pos = start + template.length;
    textarea.setSelectionRange(pos, pos);
  }
}

function jumpToPlaceholder(textarea, direction) {
  const val = textarea.value;
  const cursor = direction > 0 ? textarea.selectionEnd : textarea.selectionStart;
  if (direction > 0) {
    PLACEHOLDER_RE.lastIndex = cursor;
    const m = PLACEHOLDER_RE.exec(val);
    if (m) { textarea.setSelectionRange(m.index, m.index + m[0].length); return true; }
    return false;
  }
  const re = new RegExp(PLACEHOLDER_RE.source, 'g');
  let last = null, mm;
  while ((mm = re.exec(val))) {
    if (mm.index >= cursor) break;
    last = mm;
  }
  if (last) { textarea.setSelectionRange(last.index, last.index + last[0].length); return true; }
  return false;
}

function buildPreviewUpdater(textarea, previewEl, errorEl) {
  let t = null;
  return function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      const src = textarea.value.trim();
      if (!src) { previewEl.innerHTML = ''; errorEl.classList.add('hidden'); return; }
      try {
        if (window.katex) {
          window.katex.render(src, previewEl, { throwOnError: true, displayMode: true });
        }
        errorEl.classList.add('hidden');
      } catch (e) {
        previewEl.innerHTML = '';
        errorEl.textContent = 'Sözdizimi hatası: formülü kontrol edin.';
        errorEl.classList.remove('hidden');
      }
    }, 150);
  };
}

function initEquationEditor(container, opts = {}) {
  container.innerHTML = '';

  const mainGrid = document.createElement('div');
  mainGrid.className = 'grid grid-cols-3 gap-1.5 sm:grid-cols-4';
  container.appendChild(mainGrid);

  const textarea = document.createElement('textarea');
  textarea.className = 'eqed-input inp mt-3 h-24 font-mono text-[13px]';
  textarea.placeholder = 'Örn: \\frac{1}{2} + \\sqrt{x}';

  const advWrap = document.createElement('details');
  advWrap.className = 'eqed-advanced mt-2 rounded-lg border border-slate-200 dark:border-slate-700';
  const advSummary = document.createElement('summary');
  advSummary.className = 'cursor-pointer select-none px-3 py-2 text-[12px] font-medium text-slate-500 dark:text-slate-400';
  advSummary.textContent = '▸ Diğer Yapılar (İntegral, Vektör, Matris...)';
  const advGrid = document.createElement('div');
  advGrid.className = 'grid grid-cols-2 gap-1.5 border-t border-slate-100 p-2 dark:border-slate-800 sm:grid-cols-3';
  advWrap.appendChild(advSummary);
  advWrap.appendChild(advGrid);
  container.appendChild(advWrap);
  container.appendChild(textarea);

  const previewRow = document.createElement('div');
  previewRow.className = 'mt-2 flex items-center justify-between';
  const previewLabel = document.createElement('span');
  previewLabel.className = 'text-[11px] font-medium text-slate-400';
  previewLabel.textContent = 'Önizleme';
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'eqed-copy rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-400';
  copyBtn.textContent = 'Panoya Kopyala';
  previewRow.appendChild(previewLabel);
  previewRow.appendChild(copyBtn);
  container.appendChild(previewRow);

  const previewEl = document.createElement('div');
  previewEl.className = 'eqed-preview mt-1 min-h-[64px] overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60';
  container.appendChild(previewEl);

  const errorEl = document.createElement('div');
  errorEl.className = 'eqed-error mt-1 hidden text-[11px] font-medium text-rose-600';
  container.appendChild(errorEl);

  const scheduleUpdate = buildPreviewUpdater(textarea, previewEl, errorEl);

  EQED_MAIN.forEach((item) => {
    mainGrid.appendChild(makeMainButton(container, textarea, item, scheduleUpdate));
  });
  EQED_ADV.forEach((item) => {
    advGrid.appendChild(makeMainButton(container, textarea, item, scheduleUpdate));
  });

  textarea.addEventListener('input', scheduleUpdate);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const ok = jumpToPlaceholder(textarea, e.shiftKey ? -1 : 1);
      if (ok) e.preventDefault();
    }
  });
  document.addEventListener('click', () => { closeAllPopovers(container); });

  copyBtn.addEventListener('click', () => {
    const val = textarea.value;
    if (opts.onCopy) { opts.onCopy(val); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(val);
  });

  return {
    textarea,
    reset: () => { textarea.value = ''; previewEl.innerHTML = ''; errorEl.classList.add('hidden'); },
    getValue: () => textarea.value
  };
}

function initMathModalIntegration() {
  const mathState = { targetId: null, selStart: 0, selEnd: 0 };
  let eqedApi = null;

  function ensureEditor() {
    if (eqedApi) return eqedApi;
    const container = $('eqedContainer');
    if (!container) return null;
    eqedApi = initEquationEditor(container, {});
    return eqedApi;
  }

  document.querySelectorAll('.math-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const field = $(targetId);
      if (!field) return;
      mathState.targetId = targetId;
      mathState.selStart = field.selectionStart != null ? field.selectionStart : field.value.length;
      mathState.selEnd = field.selectionEnd != null ? field.selectionEnd : field.value.length;
      const api = ensureEditor();
      if (api) {
        api.reset();
        openModal('mathModal');
        setTimeout(() => { api.textarea.focus(); }, 30);
      }
    });
  });

  const closeBtn = $('mathModalClose');
  const cancelBtn = $('mathModalCancel');
  const insertBtn = $('mathModalInsert');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('mathModal'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('mathModal'));
  if (insertBtn) insertBtn.addEventListener('click', () => {
    const api = ensureEditor();
    if (!api) return;
    const latex = api.getValue().trim();
    if (!latex) { closeModal('mathModal'); return; }
    const field = $(mathState.targetId);
    if (!field) { closeModal('mathModal'); return; }
    const wrapped = '$' + latex + '$';
    const val = field.value;
    const before = val.slice(0, mathState.selStart);
    const after = val.slice(mathState.selEnd);
    field.value = before + wrapped + after;
    const pos = (before + wrapped).length;
    field.focus();
    field.setSelectionRange(pos, pos);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    closeModal('mathModal');
  });
}


// Module Exports
__exports['EQED_MAIN'] = EQED_MAIN;
__exports['EQED_ADV'] = EQED_ADV;
__exports['initEquationEditor'] = initEquationEditor;
__exports['initMathModalIntegration'] = initMathModalIntegration;

});

__define('modules/wordExport.js', function(__exports, __require, __module) {
const { questions, S, LETTERS } = __require('state.js');
const { $, defaultBaseName, todayStr, parseTags } = __require('utils.js');

function initWordExport(collectFn) {
  const wordBtn = $('wordBtn');
  if (!wordBtn) return;

  wordBtn.onclick = async () => {
    if (typeof collectFn === 'function') collectFn();
    if (!questions.length) return alert('Önce soru yükleyin.');
    const D = window.docx;
    if (!D) { alert('Word kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.'); return; }
    
    wordBtn.disabled = true;
    wordBtn.textContent = '⏳ Hazırlanıyor...';
    try {
      const children = [];
      const heading = [S.school, S.lesson, S.title].filter(Boolean).join(' — ') || 'Sınav';
      children.push(new D.Paragraph({ children: [new D.TextRun({ text: heading, bold: true, size: 28 })], spacing: { after: 200 } }));
      if (S.description) {
        children.push(new D.Paragraph({ children: [new D.TextRun({ text: S.description, italics: true, size: 20 })], spacing: { after: 300 } }));
      }
      const stripTex = (s) => String(s || '').replace(/\$([^$]+)\$/g, '$1');
      questions.forEach((q, i) => {
        const n = (i + 1) + '. ';
        if (q.type === 'text') {
          if (q.kind === 'bosluk') {
            children.push(new D.Paragraph({ children: [new D.TextRun({ text: n + stripTex(q.blankText || ''), size: 22 })], spacing: { after: 120 } }));
          } else {
            if (q.text) children.push(new D.Paragraph({ children: [new D.TextRun({ text: n + stripTex(q.text), size: 22 })], spacing: { after: 60 } }));
            if (q.root) children.push(new D.Paragraph({ children: [new D.TextRun({ text: (q.text ? '' : n) + stripTex(q.root), bold: true, size: 22 })], spacing: { after: 80 } }));
            (q.options || []).filter(Boolean).forEach((o, k) => {
              children.push(new D.Paragraph({ children: [new D.TextRun({ text: '   ' + LETTERS[k] + ') ' + stripTex(o), size: 20 })], spacing: { after: 40 } }));
            });
          }
        } else {
          children.push(new D.Paragraph({ children: [new D.TextRun({ text: n + '[Görsel soru]', italics: true, size: 20 })], spacing: { after: 120 } }));
        }
      });
      if (S.showAnswerKey && questions.some((q) => q.answer)) {
        children.push(new D.Paragraph({ children: [new D.TextRun({ text: 'CEVAP ANAHTARI', bold: true, size: 24 })], spacing: { before: 400, after: 120 } }));
        const key = questions.map((q, i) => (i + 1) + ') ' + (q.answer || '-')).join('   ');
        children.push(new D.Paragraph({ children: [new D.TextRun({ text: key, size: 20 })] }));
      }
      const doc = new D.Document({ sections: [{ properties: {}, children }] });
      const blob = await D.Packer.toBlob(doc);
      const tParsed = parseTags(S.title);
      const name = defaultBaseName(tParsed.clean, S) + ' - ' + todayStr() + '.docx';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      alert('Word oluşturulurken hata: ' + (e && e.message ? e.message : e));
      console.error(e);
    }
    wordBtn.disabled = false;
    wordBtn.textContent = '📄 Word olarak indir';
  };
}


// Module Exports
__exports['initWordExport'] = initWordExport;

});

__define('storage.js', function(__exports, __require, __module) {
const { S, questions, setQuestions } = __require('state.js');
const { $, openModal, closeModal } = __require('utils.js');

const AS_KEY = 'testmaker-autosave';
let asTimer = null, asReady = false, asRestoring = false;

function asOpenDB() {
  return new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('no idb'));
    const r = indexedDB.open('egemen-testmaker', 1);
    r.onupgradeneeded = () => { try { r.result.createObjectStore('kv'); } catch (e) {} };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function asPut(data) {
  return asOpenDB().then((db) => new Promise((res, rej) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(data, AS_KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  })).catch(() => {
    try { localStorage.setItem(AS_KEY, JSON.stringify({ t: data.t, n: data.questions.length })); } catch (e) {}
  });
}

function asGet() {
  return asOpenDB().then((db) => new Promise((res, rej) => {
    const tx = db.transaction('kv', 'readonly');
    const q = tx.objectStore('kv').get(AS_KEY);
    q.onsuccess = () => res(q.result || null);
    q.onerror = () => rej(q.error);
  })).catch(() => null);
}

function asClear() {
  return asOpenDB().then((db) => new Promise((res) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').delete(AS_KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => res();
  })).catch(() => {});
}

function scheduleAutosave(collectFn) {
  if (!asReady || asRestoring) return;
  clearTimeout(asTimer);
  asTimer = setTimeout(() => runAutosave(collectFn), 2000);
}

function runAutosave(collectFn) {
  try {
    if (typeof collectFn === 'function') collectFn();
    const payload = { t: Date.now(), questions, settings: S };
    asPut(payload);
  } catch (e) {}
}

async function offerRestore(syncUIFn, renderFn) {
  let data = null;
  try { data = await asGet(); } catch (e) {}
  if (!data || !Array.isArray(data.questions) || !data.questions.length) {
    asReady = true;
    return;
  }
  const d = new Date(data.t || Date.now());
  const p = (n) => String(n).padStart(2, '0');
  $('restoreMeta').textContent = data.questions.length + ' soru · ' + p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  openModal('restoreModal');
  $('restoreYes').onclick = () => {
    asRestoring = true;
    try {
      setQuestions(data.questions);
      if (data.settings && typeof data.settings === 'object') Object.assign(S, data.settings);
      if (typeof syncUIFn === 'function') syncUIFn();
      if (typeof renderFn === 'function') renderFn();
    } catch (e) {
      console.error(e);
    }
    closeModal('restoreModal');
    asRestoring = false;
    asReady = true;
  };
  $('restoreNo').onclick = () => {
    asClear();
    closeModal('restoreModal');
    asReady = true;
  };
}


// Module Exports
__exports['asOpenDB'] = asOpenDB;
__exports['asPut'] = asPut;
__exports['asGet'] = asGet;
__exports['asClear'] = asClear;
__exports['scheduleAutosave'] = scheduleAutosave;
__exports['runAutosave'] = runAutosave;
__exports['offerRestore'] = offerRestore;

});

__define('modules/questionBank.js', function(__exports, __require, __module) {
const { questions, setQuestions, S, LETTERS, MAX } = __require('state.js');
const { $, uid, esc, openModal, closeModal, todayStr } = __require('utils.js');

const BANK_STORAGE_KEY = 'testmaker_question_banks_v1';

let banks = [];
let currentBankId = null;
let selectedPoolQuestionIds = new Set();
let filterLevel = 'all';
let filterTag = '';
let filterSearch = '';
let onBankUpdatedCallback = null;

function setOnBankUpdatedCallback(fn) {
  onBankUpdatedCallback = fn;
}

// ================= IndexedDB / LocalStorage Storage =================
function openBankDB() {
  return new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('no idb'));
    const req = indexedDB.open('egemen-testmaker-banks', 1);
    req.onupgradeneeded = () => {
      try { req.result.createObjectStore('banks'); } catch (e) {}
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function loadBanks() {
  try {
    const db = await openBankDB();
    const data = await new Promise((res, rej) => {
      const tx = db.transaction('banks', 'readonly');
      const getReq = tx.objectStore('banks').get(BANK_STORAGE_KEY);
      getReq.onsuccess = () => res(getReq.result || null);
      getReq.onerror = () => rej(getReq.error);
    });
    if (Array.isArray(data) && data.length) {
      banks = data;
    } else {
      banks = getFallbackBanks();
    }
  } catch (e) {
    try {
      const raw = localStorage.getItem(BANK_STORAGE_KEY);
      banks = raw ? JSON.parse(raw) : getFallbackBanks();
    } catch (err) {
      banks = getFallbackBanks();
    }
  }

  if (!banks.length) {
    banks = [
      {
        id: uid(),
        name: 'Genel Soru Havuzu',
        description: 'Tüm branş ve seviyeler için varsayılan soru havuzu.',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        questions: []
      }
    ];
    saveBanks();
  }

  if (!currentBankId || !banks.find(b => b.id === currentBankId)) {
    currentBankId = banks[0].id;
  }

  return banks;
}

function getFallbackBanks() {
  return [
    {
      id: uid(),
      name: 'Genel Soru Havuzu',
      description: 'Tüm branş ve seviyeler için varsayılan soru havuzu.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: []
    }
  ];
}

async function saveBanks() {
  try {
    const db = await openBankDB();
    await new Promise((res, rej) => {
      const tx = db.transaction('banks', 'readwrite');
      tx.objectStore('banks').put(banks, BANK_STORAGE_KEY);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    try {
      localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(banks));
    } catch (err) {}
  }
  if (typeof onBankUpdatedCallback === 'function') {
    onBankUpdatedCallback();
  }
}

function getBanks() {
  return banks;
}

function getCurrentBank() {
  return banks.find(b => b.id === currentBankId) || banks[0] || null;
}

function setCurrentBank(bankId) {
  if (banks.find(b => b.id === bankId)) {
    currentBankId = bankId;
    selectedPoolQuestionIds.clear();
    renderBankModalContent();
  }
}

function createNewBank(name, description = '') {
  const trimmed = (name || '').trim();
  if (!trimmed) return null;
  const newBank = {
    id: uid(),
    name: trimmed,
    description: description.trim(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: []
  };
  banks.push(newBank);
  currentBankId = newBank.id;
  saveBanks();
  renderBankModalContent();
  return newBank;
}

function renameCurrentBank(newName) {
  const b = getCurrentBank();
  if (!b) return;
  const trimmed = (newName || '').trim();
  if (!trimmed) return;
  b.name = trimmed;
  b.updatedAt = Date.now();
  saveBanks();
  renderBankModalContent();
}

function deleteCurrentBank() {
  if (banks.length <= 1) {
    alert('En az bir soru havuzu bulunmalıdır. Havuz silinemez.');
    return;
  }
  const b = getCurrentBank();
  if (!b) return;
  if (!confirm(`"${b.name}" havuzunu ve içindeki tüm soruları silmek istediğinize emin misiniz?`)) {
    return;
  }
  banks = banks.filter(x => x.id !== b.id);
  currentBankId = banks[0].id;
  saveBanks();
  renderBankModalContent();
}

// ================= Question Import / Export to Pool =================
function addCurrentTestQuestionsToBank() {
  const b = getCurrentBank();
  if (!b) return;
  if (!questions.length) {
    alert('Şu anda sınavınızda soru bulunmuyor. Önce soru ekleyin.');
    return;
  }

  let addedCount = 0;
  questions.forEach((q) => {
    const clone = JSON.parse(JSON.stringify(q));
    clone.id = uid();
    clone.createdAt = Date.now();
    if (!clone.level) clone.level = 'orta';
    if (!Array.isArray(clone.tags)) clone.tags = [];
    b.questions.push(clone);
    addedCount++;
  });

  b.updatedAt = Date.now();
  saveBanks();
  renderBankModalContent();
  alert(`${addedCount} adet soru "${b.name}" havuzuna başarıyla eklendi!`);
}

function addSelectedPoolQuestionsToTest(onAddedCallback) {
  const b = getCurrentBank();
  if (!b || !selectedPoolQuestionIds.size) {
    alert('Lütfen sınava eklemek için en az bir soru seçin.');
    return;
  }

  const selectedList = b.questions.filter(q => selectedPoolQuestionIds.has(q.id));
  if (!selectedList.length) return;

  if (questions.length + selectedList.length > MAX) {
    alert(`Maksimum soru sınırı (${MAX}) aşılıyor. En fazla ${MAX - questions.length} soru daha ekleyebilirsiniz.`);
    return;
  }

  selectedList.forEach((q) => {
    const clone = JSON.parse(JSON.stringify(q));
    clone.id = uid();
    questions.push(clone);
  });

  selectedPoolQuestionIds.clear();
  closeModal('bankModal');
  if (typeof onAddedCallback === 'function') onAddedCallback();
  alert(`${selectedList.length} adet soru mevcut sınava eklendi.`);
}

// ================= DB Export & Import (.db) =================
function exportCurrentBankToDB() {
  const b = getCurrentBank();
  if (!b) return;
  if (!b.questions.length) {
    alert('Bu havuzda henüz soru bulunmuyor.');
    return;
  }

  const payload = {
    type: 'edtech-question-bank',
    version: 2,
    bankName: b.name,
    bankDescription: b.description || '',
    exportDate: new Date().toISOString(),
    questionCount: b.questions.length,
    questions: b.questions
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = b.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ\-_ ]/g, '').trim() || 'Soru_Bankasi';
  a.href = url;
  a.download = `${safeName} - ${todayStr()}.db`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function importBankFromDB(file) {
  if (!file) return;
  try {
    const raw = await file.text();
    const data = JSON.parse(raw);
    if (!data) throw new Error('Boş dosya');

    let importedQuestions = [];
    let bankName = file.name.replace(/\.db$/i, '').replace(/ - \d{2}\.\d{2}\.\d{4}$/, '') || 'İçe Aktarılan Havuz';
    let bankDesc = 'Paylaşılan .db dosyasından içe aktarıldı.';

    if (data.type === 'edtech-question-bank' && Array.isArray(data.questions)) {
      importedQuestions = data.questions;
      if (data.bankName) bankName = data.bankName;
      if (data.bankDescription) bankDesc = data.bankDescription;
    } else if (Array.isArray(data.questions)) {
      // TestMaker standard draft file
      importedQuestions = data.questions;
      bankName = 'İçe Aktarılan Soru Taslağı';
    } else if (Array.isArray(data)) {
      importedQuestions = data;
    } else {
      throw new Error('Geçersiz .db soru havuzu biçimi.');
    }

    if (!importedQuestions.length) {
      alert('Dosyada soru bulunamadı.');
      return;
    }

    const newBank = {
      id: uid(),
      name: bankName,
      description: bankDesc,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: importedQuestions.map(q => ({
        ...q,
        id: uid(),
        level: q.level || 'orta',
        tags: Array.isArray(q.tags) ? q.tags : []
      }))
    };

    banks.push(newBank);
    currentBankId = newBank.id;
    saveBanks();
    renderBankModalContent();
    alert(`"${newBank.name}" havuzu (${newBank.questions.length} soru) başarıyla içe aktarıldı!`);
  } catch (e) {
    alert('Soru havuzu dosyası okunamadı: ' + (e && e.message ? e.message : e));
  }
}

// ================= UI Rendering =================
function openBankModal() {
  renderBankModalContent();
  openModal('bankModal');
}

function renderBankModalContent() {
  const b = getCurrentBank();
  if (!b) return;

  // Render bank list dropdown
  const select = $('bankSelect');
  if (select) {
    select.innerHTML = banks.map(item =>
      `<option value="${item.id}" ${item.id === currentBankId ? 'selected' : ''}>${esc(item.name)} (${item.questions ? item.questions.length : 0} soru)</option>`
    ).join('');
  }

  // Update bank info
  if ($('bankTitleDisplay')) $('bankTitleDisplay').textContent = b.name;
  if ($('bankDescDisplay')) $('bankDescDisplay').textContent = b.description || 'Açıklama belirtilmemiş.';
  if ($('bankQTotal')) $('bankQTotal').textContent = b.questions ? b.questions.length : 0;

  // Filter questions
  let list = Array.isArray(b.questions) ? [...b.questions] : [];

  if (filterLevel !== 'all') {
    list = list.filter(q => (q.level || 'orta') === filterLevel);
  }

  if (filterTag) {
    const tLower = filterTag.toLowerCase();
    list = list.filter(q => (q.tags || []).some(t => t.toLowerCase().includes(tLower)));
  }

  if (filterSearch) {
    const sLower = filterSearch.toLowerCase();
    list = list.filter(q =>
      (q.text && q.text.toLowerCase().includes(sLower)) ||
      (q.root && q.root.toLowerCase().includes(sLower)) ||
      (q.blankText && q.blankText.toLowerCase().includes(sLower)) ||
      (q.tags && q.tags.some(t => t.toLowerCase().includes(sLower)))
    );
  }

  // Collect all unique tags in current bank for filter chips
  const allTags = new Set();
  (b.questions || []).forEach(q => {
    (q.tags || []).forEach(t => allTags.add(t));
  });

  const tagWrap = $('bankTagPills');
  if (tagWrap) {
    if (!allTags.size) {
      tagWrap.innerHTML = '<span class="text-[11px] text-slate-400 italic">Henüz etiket eklenmemiş</span>';
    } else {
      tagWrap.innerHTML = Array.from(allTags).map(t =>
        `<button type="button" data-tag="${esc(t)}" class="bank-tag-chip rounded-full px-2 py-0.5 text-[10px] font-medium transition ${filterTag === t ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}">#${esc(t)}</button>`
      ).join('');
    }
  }

  // Update selected count
  if ($('bankSelectedCount')) {
    $('bankSelectedCount').textContent = selectedPoolQuestionIds.size;
  }

  // Render question cards list
  const container = $('bankQuestionsList');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <span class="text-3xl">📭</span>
        <p class="mt-2 text-[14px] font-medium text-slate-700 dark:text-slate-300">Bu havuzda veya filtrede soru bulunamadı.</p>
        <p class="text-[12px] text-slate-400">Aktif sınavınızdaki soruları bu havuza ekleyebilir veya yeni .db havuzu yükleyebilirsiniz.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((q, idx) => {
    const isSelected = selectedPoolQuestionIds.has(q.id);
    const lvl = q.level || 'orta';
    const lvlConfig = {
      kolay: { label: 'Kolay', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
      orta: { label: 'Orta', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
      zor: { label: 'Zor', bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' }
    }[lvl] || { label: 'Orta', bg: 'bg-slate-50 text-slate-700 border-slate-200' };

    const qKindLabel = q.type === 'text'
      ? (q.kind === 'bosluk' ? 'Boşluk Doldurma' : (q.kind === 'klasik' ? 'Klasik Soru' : 'Çoktan Seçmeli'))
      : 'Görsel Soru';

    return `
      <div class="bank-q-card relative flex flex-col justify-between rounded-xl border p-3 transition ${isSelected ? 'border-slate-900 bg-slate-50/70 shadow-sm dark:border-white dark:bg-slate-800/80' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'}" data-qid="${q.id}">
        <div>
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="bank-q-check" data-qid="${q.id}" ${isSelected ? 'checked' : ''} style="accent-color:#0f172a">
              <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">Soru #${idx + 1}</span>
            </label>
            <div class="flex items-center gap-1.5">
              <span class="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">${qKindLabel}</span>
              <span class="rounded border px-1.5 py-0.5 text-[9px] font-semibold ${lvlConfig.bg}">${lvlConfig.label}</span>
            </div>
          </div>

          <div class="mt-2.5 max-h-28 overflow-hidden text-left text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">
            ${q.imgSrc ? `<div class="mb-2"><img src="${q.imgSrc}" class="max-h-16 rounded border border-slate-200"></div>` : ''}
            ${q.type === 'text'
              ? (q.kind === 'bosluk'
                ? esc(q.blankText || '').replace(/(\.\.\.|_{2,})/g, '______')
                : (q.text ? `<div class="text-slate-500 text-[11px] line-clamp-2">${esc(q.text)}</div>` : '') +
                  (q.root ? `<div class="font-semibold line-clamp-2">${esc(q.root)}</div>` : ''))
              : (q.src ? `<img src="${q.src}" class="max-h-24 w-full object-contain">` : '<span class="italic text-slate-400">Görsel</span>')}
          </div>
        </div>

        <div class="mt-3 border-t border-slate-100 pt-2 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap gap-1">
              ${(q.tags || []).map(t => `<span class="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">#${esc(t)}</span>`).join('')}
            </div>
            <div class="flex items-center gap-1">
              ${q.answer ? `<span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Cevap: ${q.answer}</span>` : ''}
              <button type="button" class="bank-q-delete rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-rose-600" data-del-qid="${q.id}" title="Bu soruyu havuzdan sil">Sil ✕</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ================= Event Wire-up =================
function initQuestionBank(onTestChangedCallback) {
  loadBanks().then(() => {
    renderBankModalContent();
  });

  // Open modal button
  const openBtn = $('openBankModalBtn');
  if (openBtn) openBtn.onclick = () => openBankModal();

  const openBtn2 = $('dropzoneBankBtn');
  if (openBtn2) openBtn2.onclick = () => openBankModal();

  // Close modal button
  const closeBtn = $('bankModalClose');
  if (closeBtn) closeBtn.onclick = () => closeModal('bankModal');

  // Bank dropdown switch
  const select = $('bankSelect');
  if (select) {
    select.onchange = (e) => {
      setCurrentBank(e.target.value);
    };
  }

  // Create new bank button
  const newBankBtn = $('bankCreateBtn');
  if (newBankBtn) {
    newBankBtn.onclick = () => {
      const name = prompt('Yeni Soru Havuzu Adı:');
      if (name && name.trim()) {
        const desc = prompt('Havuz Açıklaması (İsteğe bağlı):', '') || '';
        createNewBank(name, desc);
      }
    };
  }

  // Rename bank button
  const renameBankBtn = $('bankRenameBtn');
  if (renameBankBtn) {
    renameBankBtn.onclick = () => {
      const b = getCurrentBank();
      if (!b) return;
      const name = prompt('Havuzun Yeni Adı:', b.name);
      if (name && name.trim()) renameCurrentBank(name);
    };
  }

  // Delete bank button
  const delBankBtn = $('bankDeleteBtn');
  if (delBankBtn) {
    delBankBtn.onclick = () => deleteCurrentBank();
  }

  // Add current test questions to bank
  const saveTestBtn = $('bankSaveCurrentTestBtn');
  if (saveTestBtn) {
    saveTestBtn.onclick = () => addCurrentTestQuestionsToBank();
  }

  // Add selected pool questions to test
  const addSelectedBtn = $('bankAddSelectedBtn');
  if (addSelectedBtn) {
    addSelectedBtn.onclick = () => addSelectedPoolQuestionsToTest(onTestChangedCallback);
  }

  // Export current bank to .db
  const exportBtn = $('bankExportBtn');
  if (exportBtn) {
    exportBtn.onclick = () => exportCurrentBankToDB();
  }

  // Import .db to bank
  const importFile = $('bankImportFile');
  const importBtn = $('bankImportBtn');
  if (importBtn && importFile) {
    importBtn.onclick = () => importFile.click();
    importFile.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        importBankFromDB(e.target.files[0]);
        e.target.value = '';
      }
    };
  }

  // Level filter buttons
  document.querySelectorAll('[data-bank-filter-level]').forEach((btn) => {
    btn.onclick = () => {
      filterLevel = btn.dataset.bankFilterLevel;
      document.querySelectorAll('[data-bank-filter-level]').forEach(b => {
        b.classList.toggle('active', b.dataset.bankFilterLevel === filterLevel);
      });
      renderBankModalContent();
    };
  });

  // Search input
  const searchInp = $('bankSearchInp');
  if (searchInp) {
    searchInp.oninput = (e) => {
      filterSearch = e.target.value;
      renderBankModalContent();
    };
  }

  // Select all / Deselect all
  const selectAllBtn = $('bankSelectAllBtn');
  if (selectAllBtn) {
    selectAllBtn.onclick = () => {
      const b = getCurrentBank();
      if (!b || !b.questions) return;
      if (selectedPoolQuestionIds.size === b.questions.length) {
        selectedPoolQuestionIds.clear();
      } else {
        b.questions.forEach(q => selectedPoolQuestionIds.add(q.id));
      }
      renderBankModalContent();
    };
  }

  // Event delegation on question list container
  const container = $('bankQuestionsList');
  if (container) {
    container.onclick = (e) => {
      const target = e.target;
      // Checkbox click
      if (target.classList.contains('bank-q-check')) {
        const qid = target.dataset.qid;
        if (target.checked) selectedPoolQuestionIds.add(qid);
        else selectedPoolQuestionIds.delete(qid);
        if ($('bankSelectedCount')) $('bankSelectedCount').textContent = selectedPoolQuestionIds.size;
        const card = target.closest('.bank-q-card');
        if (card) {
          card.classList.toggle('border-slate-900', target.checked);
          card.classList.toggle('bg-slate-50/70', target.checked);
        }
        return;
      }
      // Tag click
      const tagChip = target.closest('.bank-tag-chip');
      if (tagChip) {
        const t = tagChip.dataset.tag;
        filterTag = filterTag === t ? '' : t;
        renderBankModalContent();
        return;
      }
      // Delete question from bank
      const delBtn = target.closest('.bank-q-delete');
      if (delBtn) {
        const qid = delBtn.dataset.delQid;
        const b = getCurrentBank();
        if (b && confirm('Bu soruyu havuzdan silmek istediğinize emin misiniz?')) {
          b.questions = b.questions.filter(q => q.id !== qid);
          selectedPoolQuestionIds.delete(qid);
          saveBanks();
          renderBankModalContent();
        }
        return;
      }
    };
  }
}


// Module Exports
__exports['setOnBankUpdatedCallback'] = setOnBankUpdatedCallback;
__exports['loadBanks'] = loadBanks;
__exports['saveBanks'] = saveBanks;
__exports['getBanks'] = getBanks;
__exports['getCurrentBank'] = getCurrentBank;
__exports['setCurrentBank'] = setCurrentBank;
__exports['createNewBank'] = createNewBank;
__exports['renameCurrentBank'] = renameCurrentBank;
__exports['deleteCurrentBank'] = deleteCurrentBank;
__exports['addCurrentTestQuestionsToBank'] = addCurrentTestQuestionsToBank;
__exports['addSelectedPoolQuestionsToTest'] = addSelectedPoolQuestionsToTest;
__exports['exportCurrentBankToDB'] = exportCurrentBankToDB;
__exports['importBankFromDB'] = importBankFromDB;
__exports['openBankModal'] = openBankModal;
__exports['renderBankModalContent'] = renderBankModalContent;
__exports['initQuestionBank'] = initQuestionBank;

});

__define('main.js', function(__exports, __require, __module) {
const { initSidebar, syncUI, collect } = __require('modules/sidebar.js');
const { render, initQuestionManager, setOnQuestionChangeCallback } = __require('modules/questionManager.js');
const { initTextModal, setOnSaveCallback, openText, autoParseQuestion } = __require('modules/textModal.js');
const { initCropTool } = __require('modules/cropTool.js');
const { initMathModalIntegration } = __require('modules/equationEditor.js');
const { initWordExport } = __require('modules/wordExport.js');
const { initMakePdfButton, ensureFont } = __require('modules/pdfEngine.js');
const { initPreviewStage, schedulePreview, setCollectFn, closePvBig } = __require('modules/previewStage.js');
const { scheduleAutosave, offerRestore } = __require('storage.js');
const { initQuestionBank } = __require('modules/questionBank.js');
const { initGeometryDrawer } = __require('modules/geometryDrawer.js');
const { initCustomTemplateManager } = __require('modules/customTemplate.js');
const { initScienceTemplates, closeScienceModal } = __require('modules/scienceTemplates.js');
const { $, closeModal } = __require('utils.js');

document.addEventListener('DOMContentLoaded', () => {
  setCollectFn(collect);

  const onDataChanged = () => {
    schedulePreview();
    scheduleAutosave(collect);
  };

  setOnSaveCallback(() => {
    render();
    onDataChanged();
  });

  setOnQuestionChangeCallback(onDataChanged);

  initSidebar();
  initTextModal();
  initQuestionManager({ syncUIFn: syncUI, collectFn: collect });
  initQuestionBank(() => {
    render();
    onDataChanged();
  });
  initGeometryDrawer();
  initCustomTemplateManager();
  initScienceTemplates();

  initCropTool({
    onQuestionsUpdated: () => {
      render();
      onDataChanged();
    },
    openTextFn: openText,
    autoParseFn: autoParseQuestion
  });
  initMathModalIntegration();
  initWordExport(collect);
  initMakePdfButton(collect);
  initPreviewStage();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('imgCropModal') && $('imgCropModal').classList.contains('open')) {
      $('imgCropModal').classList.remove('open');
    } else if ($('mathModal') && $('mathModal').classList.contains('flex')) {
      closeModal('mathModal');
    } else if ($('scienceModal') && $('scienceModal').classList.contains('flex')) {
      closeScienceModal();
    } else if ($('textModal') && $('textModal').classList.contains('flex')) {
      closeModal('textModal');
    } else if ($('bankModal') && $('bankModal').classList.contains('flex')) {
      closeModal('bankModal');
    } else if ($('geoModal') && $('geoModal').classList.contains('flex')) {
      closeModal('geoModal');
    } else if ($('customTplModal') && $('customTplModal').classList.contains('flex')) {
      closeModal('customTplModal');
    } else if ($('pvBig') && $('pvBig').classList.contains('open')) {
      closePvBig();
    }
  });

  ensureFont();
  render();
  schedulePreview();
  offerRestore(syncUI, render);
});


// Module Exports

});

  // Uygulama Giriş Noktası
  document.addEventListener('DOMContentLoaded', () => {
    try {
      __require('main.js');
    } catch (err) {
      console.error('Uygulama başlatma hatası:', err);
    }
  });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    try {
      __require('main.js');
    } catch (err) {}
  }
})();
