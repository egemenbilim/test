import { S, questions } from '../state.js';
import { $ } from '../utils.js';
import { schedulePreview, pvDock, refreshNow } from './previewStage.js';
import { trimLogoImage, setCustomLogo, fixLogoAspect } from './pdfEngine.js';

export function openSidebar() {
  $('sidebarPanel').classList.add('open');
  $('sidebarOverlay').classList.add('open');
  pvDock(true);
}

export function closeSidebar() {
  $('sidebarPanel').classList.remove('open');
  $('sidebarOverlay').classList.remove('open');
  pvDock(false);
}

export function initDark() {
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

export const GUIDE = [
  { s: '🚀 Hızlı Başlangıç', items: [
    ['Üç adımda test hazırlama', 'Önce sorularınızı ekleyin, ardından sol üstteki <b>Ayarlar</b> butonundan test ayarlarını yapın ve son olarak <b>Kağıdı Hazırla</b> butonuna basın. PDF dosyanız hazırdır.'],
    ['Soru ekleme yöntemleri', 'Soru eklemenin üç yolu vardır:<br>• <b>Soru Seçin</b> — bilgisayarınızdaki soru görsellerini yükleyin.<br>• <b>Yazılı Soru Ekleyin</b> — Soru yazın yahut metin bloğu olarak soruyu şıkları ile yapıştırın.<br>• <b>Görselden Soru Kesin</b> — Soruyu yüklediğiniz görselden veya PDF\'den keserek seçin.'],
  ]},
  { s: '✍️ Yazılı Soru Ekleme', items: [
    ['Soru tipleri', '<b>Çoktan Seçmeli:</b> A, B, C, D, E şıklı klasik test sorusudur.<br><b>Boşluk Doldurma:</b> Cümle içinde boş bırakılan yerlerin doldurulduğu sorudur.<br><b>Klasik:</b> Öğrencinin cevabını yazacağı boş satırlar içeren açık uçlu sorudur.'],
    ['Öncül ile soru kökü farkı', 'Bilgi metni (öncül) normal yazı tipiyle, asıl soruyu soran cümle (soru kökü) ise <b>kalın</b> yazı tipiyle yazdırılır. Böylece öğrenci kendisinden ne istendiğini kolayca görür.'],
    ['Hazır soruyu yapıştırma', 'Elinizdeki bir soruyu kopyalayıp metin kutusuna yapıştırdığınızda; şıklar, soru kökü ve varsa doğru cevap <b>otomatik olarak ayrıştırılır</b>.'],
    ['Boşluk doldurma sorusu', 'Cümlede boşluk bırakmak istediğiniz yere <b>üç nokta (...)</b> yazmanız yeterlidir.'],
    ['Görsel içeren soru', 'Soruya harita, grafik, şekil gibi bir görsel eklemek isterseniz <b>Görsel İçeren Soru</b> kutucuğunu işaretleyin.'],
  ]},
  { s: '✂️ Görselden/PDF\'ten Soru Kesme', items: [
    ['Nasıl kullanılır?', 'Kitap veya test sayfasının fotoğrafını ya da PDF\'ini yükleyin. Fareyle soruyu çerçeve içine alın ve beliren <b>Ekle</b> butonuna basın.'],
    ['PDF desteği', 'PDF dosyalarını yükleyebilir, sayfa seçerek istediğiniz sayfadan soru kesebilirsiniz.'],
    ['Kesim ipucu', 'Sorunun solundaki numarayı çerçevenin dışında bırakın; numaralandırmayı program kendisi yapar.'],
  ]},
  { s: '🗂️ Soruları Düzenleme', items: [
    ['Sıralama ve silme', 'Soruları fareyle sürükleyerek istediğiniz sıraya getirebilirsiniz.'],
    ['Cevap anahtarı', 'Her sorunun altındaki A–E kutucuklarından doğru cevabı işaretleyin.'],
  ]},
  { s: '⚙️ Test Ayarları', items: [
    ['Test türü', '<b>Yazılı Kağıdı:</b> Ad, sınıf ve puan alanları bulunan okul sınavı biçimidir.<br><b>Konu Denemesi:</b> Konu kapsamı girilebilen konu testi biçimidir.'],
    ['Kitapçık türü', 'A-B veya A-B-C-D seçeneğini kullandığınızda sorular her kitapçıkta farklı sırayla dizilir.'],
    ['Sayfa düzeni', 'Sütun sayısını, sayfa boyutunu, rengi ve kenar boşluklarını <b>Gelişmiş Ayarlar</b> bölümünden değiştirebilirsiniz.'],
    ['Filigran', 'Sayfaya kurum adınızı filigran olarak ekleyebilirsiniz.'],
    ['Optik form', 'Bu seçeneği işaretlediğinizde, soru sayınıza uygun bir optik cevap kağıdı testin sonuna eklenir.'],
  ]},
  { s: '💾 Kaydetme', items: [
    ['Çalışmanızı kaydetme', 'Sağ alttaki <b>Soruları Kaydet</b> butonuyla çalışmanızı indirebilirsiniz.'],
    ['Verileriniz güvende', 'Uygulama tamamen kendi bilgisayarınızda çalışır.'],
  ]},
];

export function initGuide() {
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

export function renderTabs() {
  [...$('typeTabs').children].forEach(b => {
    b.className = b.dataset.t === S.testType ? 'active' : '';
  });
  $('konuRow').classList.toggle('hidden', S.testType !== 'yaprak');
}

export function renderTplCards() {
  const isMeb = S.template === 'meb';
  document.querySelectorAll('.tpl-card').forEach(b => b.classList.toggle('active', b.dataset.tpl === S.template));
  document.querySelectorAll('.tpl-hide-meb').forEach(el => el.classList.toggle('hidden', isMeb));
  document.querySelectorAll('.tpl-show-meb').forEach(el => el.classList.toggle('hidden', !isMeb));
}

export function renderLogoChoice() {
  const c = S.logoChoice || 'meb';
  $('mebLogoRadio').checked = c === 'meb';
  $('customLogoRadio').checked = c === 'custom';
  $('noLogoRadio').checked = c === 'none';
  $('customLogoPanel').classList.toggle('hidden', c !== 'custom');
  S.mebLogo = c !== 'none';
}

export function collect() {
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

export function syncUI() {
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
  if (S.themeColor !== undefined) $('themeColor').value = S.themeColor;
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
  $('qCount').textContent = questions.length;
  $('ansCount').textContent = questions.filter((q) => q.answer).length;
}

export function initSidebar() {
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
          let h = 26, w = h * ar;
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
  $('logoSizeReset').onclick = () => { S.logoW = 26; S.logoH = 26; schedulePreview(); };
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
  $('themeColor').oninput = e => S.themeColor = e.target.value;
  $('pageSize').onchange = e => S.pageSize = e.target.value;
  $('orientation').onchange = e => S.orientation = e.target.value;
  $('columns').onchange = e => S.columns = +e.target.value;
  $('margin').oninput = e => {
    S.margin = +e.target.value;
    $('mgVal').textContent = e.target.value;
  };

  ['input', 'change'].forEach(ev => {
    $('sidebarPanel').addEventListener(ev, schedulePreview);
  });
  [...$('typeTabs').children].forEach(b => b.addEventListener('click', schedulePreview));
  $('advBtn').addEventListener('click', schedulePreview);

  initDark();
  initGuide();
}
