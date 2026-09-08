/* ══════════════════════════════════════════════════════
   Eğitim Promptları Deposu — Ana Orkestrasyon (Main)
   ══════════════════════════════════════════════════════ */

import {
  SINIF_REQUIRED, PANELS, HIDE_DERS, HIDE_KONU,
  dersOptions, promptTemplates, getConcreteInstruction
} from './templates.js';
import { toast, markInvalid, setResult, tidy } from './utils.js';

let courseCount = 0;
let veliCourseCount = 0;

export function addCourseRow() {
  if (courseCount >= 10) { toast("En fazla 10 ders ekleyebilirsiniz."); return; }
  courseCount++;
  const c = document.getElementById('dynamic-courses');
  if (!c) return;

  const r = document.createElement('div');
  r.className = 'course-row';
  r.innerHTML = `
    <div class="row-field">
      <label class="mini-label">Ders <span class="req">*</span></label>
      <select class="p-ders control">${dersOptions}</select>
    </div>
    <div class="row-field">
      <label class="mini-label">Konu(lar) <span class="req">*</span></label>
      <input type="text" class="p-konu control" placeholder="Örn: Türev, Limit">
    </div>
    ${courseCount > 1 ? `<button type="button" class="btn-remove">✕</button>` : ''}
  `;
  c.appendChild(r);

  if (courseCount > 1) {
    r.querySelector('.btn-remove').addEventListener('click', () => {
      r.remove();
      courseCount--;
    });
  }
}

export function addVeliCourseRow() {
  if (veliCourseCount >= 15) { toast("En fazla 15 ders ekleyebilirsiniz."); return; }
  veliCourseCount++;
  const c = document.getElementById('dynamic-veli-courses');
  if (!c) return;

  const r = document.createElement('div');
  r.className = 'veli-course-row';
  r.innerHTML = `
    <div class="row-field">
      <label class="mini-label">Ders ${veliCourseCount === 1 ? '<span class="req">*</span>' : ''}</label>
      <select class="v-ders control" onchange="window.handleVeliDersChange(this)">${dersOptions}</select>
    </div>
    <div class="row-field v-konu-container">
      <label class="mini-label">İşlenen Konular ${veliCourseCount === 1 ? '<span class="req">*</span>' : ''}</label>
      <input type="text" class="v-konu control" placeholder="Örn: Cümlede Anlam">
    </div>
    ${veliCourseCount > 1 ? `<button type="button" class="btn-remove">✕</button>` : ''}
  `;
  c.appendChild(r);

  if (veliCourseCount > 1) {
    r.querySelector('.btn-remove').addEventListener('click', () => {
      r.remove();
      veliCourseCount--;
    });
  }
}

export function handleVeliDersChange(sel) {
  const r = sel.closest('.veli-course-row');
  const k = r.querySelector('.v-konu-container');
  const isDeneme = sel.value === 'Deneme Sınavı';
  const isFirst = r === document.querySelector('.veli-course-row');

  k.innerHTML = `
    <label class="mini-label">${isDeneme ? 'Yayın Markası <span class="opt">(Opsiyonel)</span>' : 'İşlenen Konular ' + (isFirst ? '<span class="req">*</span>' : '')}</label>
    <input type="text" class="v-konu control" placeholder="${isDeneme ? 'Örn: 3D, Özdebir' : 'Örn: Cümlede Anlam'}">
  `;
}

export function onMateryalChange(v) {
  PANELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  document.getElementById('sinif-group').style.display = SINIF_REQUIRED.includes(v) ? 'block' : 'none';
  document.getElementById('main-ders-group').style.display = HIDE_DERS.includes(v) ? 'none' : 'block';
  document.getElementById('konu-group').style.display = HIDE_KONU.includes(v) ? 'none' : 'block';

  const map = {
    nlm: 'nlm-options',
    maarif: 'maarif-options',
    calisma_programi: 'program-options',
    veli_bulteni: 'veli-options',
    gagne: 'gagne-options',
    video: 'video-options'
  };
  if (map[v]) document.getElementById(map[v]).style.display = 'block';
}

export function getMateryal() {
  const c = document.querySelector('input[name="materyal"]:checked');
  return c ? c.value : '';
}

export function generatePrompt() {
  const materyal = getMateryal();
  if (!materyal) { toast("Lütfen bir Materyal Türü seçin."); return; }

  const sinifNeeded = SINIF_REQUIRED.includes(materyal);
  const sinifEl = document.getElementById("sinif");
  const sinif = sinifNeeded ? sinifEl.value : "";

  if (sinifNeeded && !sinif) {
    markInvalid(sinifEl);
    toast("Bu materyal türü için Sınıf Seviyesi zorunludur.");
    return;
  }

  const concreteEN = sinifNeeded ? getConcreteInstruction(sinif) : "";
  let sonuc = "";

  if (materyal === 'video') {
    const d = document.getElementById("ders").value;
    const k = document.getElementById("konu").value.trim();
    if (!d) { markInvalid(document.getElementById("ders")); toast("Ders seçin."); return; }
    if (!k) { markInvalid(document.getElementById("konu")); toast("Konu yazın."); return; }
    sonuc = promptTemplates.video.replace(/{ders}/g, d).replace(/{konu}/g, k);
  } else if (materyal === 'gagne') {
    const d = document.getElementById("ders").value;
    const k = document.getElementById("konu").value.trim();
    const s = document.getElementById("g-sure").value.trim();
    if (!d) { markInvalid(document.getElementById("ders")); toast("Ders seçin."); return; }
    if (!k) { markInvalid(document.getElementById("konu")); toast("Konu yazın."); return; }
    if (!s) { markInvalid(document.getElementById("g-sure")); toast("Ders Süresi zorunludur."); return; }
    sonuc = promptTemplates.gagne
      .replace(/{ders}/g, d)
      .replace(/{konu}/g, k)
      .replace(/{sinif}/g, sinif)
      .replace(/{g_sure}/g, s)
      .replace(/{ortaokul_ek}/g, concreteEN);
  } else if (materyal === 'veli_bulteni') {
    let liste = [];
    const rows = document.querySelectorAll('.veli-course-row');
    for (let i = 0; i < rows.length; i++) {
      const d = rows[i].querySelector('.v-ders').value;
      const k = rows[i].querySelector('.v-konu').value.trim();
      if (i === 0 && !d) { markInvalid(rows[i].querySelector('.v-ders')); toast("En az 1 ders seçin."); return; }
      if (d) {
        if (d === 'Deneme Sınavı') {
          liste.push(`Trial exam administered${k ? ` (Publisher: ${k})` : ''}`);
        } else {
          if (i === 0 && !k) { markInvalid(rows[i].querySelector('.v-konu')); toast("İlk dersin konusunu yazın."); return; }
          liste.push(`In ${d}, the topic${k ? ` "${k}"` : ''} was covered`);
        }
      }
    }
    const etk = document.getElementById("v-etkinlikler").value.trim() || "(Not specified)";
    sonuc = `Design 1 "Parent Information Bulletin" according to the pedagogical guidelines below.
I want to prepare a bulletin for our students. Write a professional, empathetic, very warm, and motivating text that will include parents in the educational process.
Use minimal warm emojis (e.g., 🌱, 📚, ✨). Create a completely human-sounding bulletin message (suitable for WhatsApp or a parent group) that does not feel like it was written by AI.
- If middle-school audience, add 2-3 very simple, practical pedagogical tips parents can apply at home.

[This Week's Data]
- Lessons Covered: ${liste.join(", ")}.
Please treat each lesson as a separate bullet point. Add contextually appropriate additions for each lesson. If there is a Trial Exam, focus on exam experience, analysis, and motivation.
- Extra Activities: ${etk}

Note: Create a general, motivating, embracing informational text for parents.`;
  } else if (materyal === 'calisma_programi') {
    const sure = document.getElementById("p-sure").value.trim();
    if (!sure) { markInvalid(document.getElementById("p-sure")); toast("Program Süresi zorunludur."); return; }

    let liste = [];
    const rows = document.querySelectorAll('.course-row');
    for (let i = 0; i < rows.length; i++) {
      const d = rows[i].querySelector('.p-ders').value;
      const k = rows[i].querySelector('.p-konu').value.trim();
      if (!d || !k) {
        if (!d) markInvalid(rows[i].querySelector('.p-ders'));
        if (!k) markInvalid(rows[i].querySelector('.p-konu'));
        toast("Tüm ders/konu alanlarını doldurun.");
        return;
      }
      liste.push(`${d} (${k})`);
    }

    const ogrenci = document.getElementById("p-ogrenci").value.trim();
    const kisi = ogrenci || "the student";
    const baslikKisi = ogrenci || "Student";
    const gs = document.getElementById("p-gunluk-sure").value.trim();
    const kaynak = document.getElementById("p-kaynak").value.trim();
    const ts = document.getElementById("p-toplam-soru").value.trim();
    const gks = document.getElementById("p-gunluk-soru").value.trim();
    const deneme = document.getElementById("p-deneme").value.trim();
    const ek = document.getElementById("p-ek").value.trim();

    let ekMetin = "";
    if (kaynak || ts || gks || deneme || ek) {
      ekMetin = "\n\nAdditional Expectations:\n";
      if (kaynak) ekMetin += `- Resource: ${kaynak}\n`;
      if (ts) ekMetin += `- Total Questions: ${ts}\n`;
      if (gks) ekMetin += `- Daily Questions: ${gks}\n`;
      if (deneme) ekMetin += `- Trial Exams: ${deneme}\n`;
      if (ek) ekMetin += `- Special Requests: ${ek}\n`;
    }

    sonuc = `We are working on "${liste.join(", ")}" for ${kisi}. Create a study schedule of ${sure}.
- Clear, understandable, and encouraging output.
- Consider the cognitive and psychological developmental level of the age group.
- Do not exceed MEB curriculum limits.
${gs ? `- Daily study time should not exceed ${gs}.` : '- Daily study duration should be determined by AI.'}
- Structure as a weekly TABLE with each day/criterion shown separately. Heading should include ${baslikKisi} and ${sure}.${ekMetin}`;
  } else if (materyal === 'maarif') {
    const d = document.getElementById("ders").value;
    const ok = document.getElementById("m-okul").value.trim();
    const t = document.getElementById("m-tarih").value.trim();
    const h = document.getElementById("m-hafta").value.trim();
    const s = document.getElementById("m-sure").value.trim();
    const u = document.getElementById("m-unite").value.trim();
    const k = document.getElementById("m-konular").value.trim();

    if (!d || !ok || !t || !h || !s || !u || !k) {
      [
        document.getElementById("ders"),
        document.getElementById("m-okul"),
        document.getElementById("m-tarih"),
        document.getElementById("m-hafta"),
        document.getElementById("m-sure"),
        document.getElementById("m-unite"),
        document.getElementById("m-konular")
      ].forEach((el, i) => {
        if ([d, ok, t, h, s, u, k][i] !== '') markInvalid(el);
      });
      toast("Ders Adı ve I. Bölüm zorunlu alanlarını doldurun.");
      return;
    }

    const og = document.getElementById("m-ogrenme_ciktilari").value.trim();
    const optF = [
      "alan", "kavramsal", "egilimler", "sosyal", "degerler",
      "okuryazarlik", "disiplinler", "beceriler_arasi", "icerik",
      "olcme", "kabuller", "on_degerlendirme", "kopru",
      "uygulamalar", "zenginlestirme", "destekleme"
    ];

    const v = {
      "{okul}": ok,
      "{ders}": d,
      "{tarih}": t,
      "{hafta}": h,
      "{sure}": s,
      "{unite}": u,
      "{konular}": k,
      "{ogrenme_ciktilari}": og || "(Generate appropriate learning outcome)"
    };

    optF.forEach(f => {
      const val = document.getElementById("m-" + f).value.trim();
      v["{" + f + "}"] = val || "(contextually fill)";
    });

    sonuc = promptTemplates.maarif;
    for (const key in v) sonuc = sonuc.split(key).join(v[key]);
  } else {
    const d = document.getElementById("ders").value;
    const k = document.getElementById("konu").value;
    const og = document.getElementById("ogretmen").value || "Egemen Bilim (Turkish Language and Literature Teacher)";
    const ku = document.getElementById("kurum").value || "[Institution Name]";

    if (!d) { markInvalid(document.getElementById("ders")); toast("Ders seçin."); return; }
    if (!k.trim()) { markInvalid(document.getElementById("konu")); toast("Konu yazın."); return; }

    sonuc = promptTemplates[materyal]
      .replace(/{ders}/g, d)
      .replace(/{konu}/g, k)
      .replace(/{sinif}/g, sinif || "")
      .replace(/{ogretmen}/g, og)
      .replace(/{kurum}/g, ku)
      .replace(/{ortaokul_ek}/g, concreteEN);

    if (materyal === 'nlm' && d === 'İngilizce') {
      sonuc = sonuc.replace('strictly in Turkish', 'appropriately for English language teaching');
      sonuc = sonuc.replace('KPI_1_LANGUAGE: 100% Turkish. ZERO English terminology in the final output (No "Slide", "Title", "Content").', 'KPI_1_LANGUAGE: Optimized for English teaching.');
      sonuc = sonuc.replace('STRICT LANGUAGE: The output must be entirely in Turkish. Replace all system words: "Slide" -> "Sayfa", "Title" -> "Başlık". NEVER use English UI terms.', 'LANGUAGE: Standard English terminology permitted.');
    }
  }

  setResult(tidy(sonuc));
}

export function copyPrompt() {
  const box = document.getElementById('result-box');
  if (box.classList.contains('empty')) { toast("Önce bir prompt oluşturun!"); return; }

  navigator.clipboard.writeText(box.textContent).then(() => {
    const btn = document.getElementById('btn-copy');
    const txt = document.getElementById('copy-text');
    btn.classList.add('done');
    txt.textContent = "Kopyalandı!";
    toast("Prompt panoya kopyalandı.", 'ok');
    setTimeout(() => {
      btn.classList.remove('done');
      txt.textContent = "Metni Kopyala";
    }, 2000);
  }).catch(err => toast("Kopyalama başarısız: " + err));
}

// Global window bağlaması (inline event handler'lar için)
window.generatePrompt = generatePrompt;
window.copyPrompt = copyPrompt;
window.handleVeliDersChange = handleVeliDersChange;

document.addEventListener("DOMContentLoaded", () => {
  addCourseRow();
  addVeliCourseRow();

  document.querySelectorAll('input[name="materyal"]').forEach(r => {
    r.addEventListener('change', () => onMateryalChange(r.value));
  });

  const btnCourse = document.getElementById('btn-add-course');
  if (btnCourse) btnCourse.addEventListener('click', addCourseRow);

  const btnVeliCourse = document.getElementById('btn-add-veli-course');
  if (btnVeliCourse) btnVeliCourse.addEventListener('click', addVeliCourseRow);

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generatePrompt();
    }
  });
});
