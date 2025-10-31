
// Load local Quran JSON files and render a full surah in the selected language.
const DATA_FILES = {
  tr: 'data/quran_tr.json',
  en: 'data/quran_en.json'
};

const languageSelect = document.getElementById('language');
const surahSelect = document.getElementById('surah');
const output = document.getElementById('output');
const info = document.getElementById('info');
const errorBox = document.getElementById('error');
const statusBox = document.getElementById('status');

let cached = { tr: null, en: null };

async function loadLanguage(lang) {
  if (cached[lang]) return cached[lang];
  const url = DATA_FILES[lang];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Veriye erişilemedi: ${res.status}`);
  const data = await res.json();
  cached[lang] = data;
  return data;
}

function fillSurahList(langData, preferLang) {
  // Reset
  surahSelect.innerHTML = '';
  langData.forEach((s, idx) => {
    const opt = document.createElement('option');
    // Use two-language display if available: e.g., "1 — Fatiha / al-Fatihah"
    const number = parseInt(s.index, 10);
    const nameLocal = s.name;
    opt.value = number;
    opt.textContent = `${number} — ${nameLocal}`;
    surahSelect.appendChild(opt);
  });
  // Default select: Fatiha
  surahSelect.value = 1;
}

function renderSurah(surahObj) {
  output.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = `${parseInt(surahObj.index,10)} — ${surahObj.name}`;
  output.appendChild(title);

  const count = surahObj.count;
  info.textContent = `Âyet sayısı: ${count}`;

  // Basmala handling: many JSONs include verse_1 as full text already.
  // We'll simply render each ayah in order.
  const verses = surahObj.verse;
  const keys = Object.keys(verses).sort((a,b)=>{
    const na = parseInt(a.split('_')[1],10);
    const nb = parseInt(b.split('_')[1],10);
    return na - nb;
  });

  keys.forEach(k => {
    const n = parseInt(k.split('_')[1],10);
    const p = document.createElement('p');
    p.className = 'ayah';
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = n + ')';
    const txt = document.createElement('span');
    txt.textContent = verses[k];
    p.appendChild(num);
    p.appendChild(txt);
    output.appendChild(p);
  });
}

async function init() {
  try {
    statusBox.style.display = 'inline';
    const lang = languageSelect.value;
    const data = await loadLanguage(lang);
    fillSurahList(data, lang);
    // Render default (Fatiha)
    renderSurah(data[0]);
  } catch (e) {
    errorBox.textContent = e.message;
    errorBox.style.display = 'block';
  } finally {
    statusBox.style.display = 'none';
  }
}

document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
    errorBox.style.display = 'none';
    statusBox.style.display = 'inline';
    const lang = languageSelect.value;
    const data = await loadLanguage(lang);
    const idx = parseInt(surahSelect.value, 10);
    const surahObj = data[idx - 1]; // zero-based
    renderSurah(surahObj);
  } catch (e) {
    errorBox.textContent = e.message;
    errorBox.style.display = 'block';
  } finally {
    statusBox.style.display = 'none';
  }
});

languageSelect.addEventListener('change', async () => {
  // Reload list & preview first surah on language change
  await init();
});

// Kickoff
init();
