document.addEventListener("DOMContentLoaded", async function () {
    const languageSelect = document.getElementById("language");
    const surahSelect = document.getElementById("surahSelect");
    const randomVerseBtn = document.getElementById("randomVerse");
    const verseBoxes = document.querySelectorAll(".verse-box");

    let quranAr = [];
    let quranTranslate = [];

    // JSON dosyalarını yükle
    async function loadQuranData() {
        try {
            const responseAr = await fetch("data/quran_ar.json");
            quranAr = await responseAr.json();
            console.log("✅ Arapça JSON yüklendi", quranAr);

            await loadTranslationData(); // Varsayılan dilin çevirisini yükle
            populateSurahDropdown();
        } catch (error) {
            console.error("⚠️ Hata: Arapça JSON yüklenemedi", error);
        }
    }

    // Seçilen dile göre çeviri JSON dosyasını yükle
    async function loadTranslationData() {
        const selectedLanguage = languageSelect.value;
        const translationFile = selectedLanguage === "en" ? "data/quran_en.json" : "data/quran_tr.json";

        try {
            const responseTranslate = await fetch(translationFile);
            quranTranslate = await responseTranslate.json();
            console.log(`✅ ${selectedLanguage.toUpperCase()} JSON yüklendi`, quranTranslate);
        } catch (error) {
            console.error("⚠️ Hata: Çeviri JSON yüklenemedi", error);
        }
    }

    // Dropdown menüye sureleri ekleme
    function populateSurahDropdown() {
        surahSelect.innerHTML = `<option value="all">All</option>`; // "All" seçeneği

        quranTranslate.forEach(surah => {
            let option = document.createElement("option");
            option.value = surah.index;
            option.textContent = `${surah.index} ${surah.name}`;
            surahSelect.appendChild(option);
        });

        console.log("✅ Dropdown menüsü güncellendi", surahSelect.innerHTML);
    }

    // Rastgele bir ayet seçme fonksiyonu
    function getRandomVerse(selectedSurahIndex = "all") {
        let surahList = selectedSurahIndex === "all" ? quranTranslate : [quranTranslate.find(surah => surah.index === selectedSurahIndex)];
        let surahIndex = Math.floor(Math.random() * surahList.length);
        let selectedSurahTr = surahList[surahIndex];

        if (!selectedSurahTr) return null;

        let selectedSurahAr = quranAr.find(surah => surah.index === selectedSurahTr.index);
        if (!selectedSurahAr) {
            console.warn(`⚠️ Arapça karşılığı bulunamayan sure: ${selectedSurahTr.index}`);
            return null;
        }

        let verseKeys = Object.keys(selectedSurahTr.verse);
        let randomVerseIndex = Math.floor(Math.random() * verseKeys.length);
        let verseKey = verseKeys[randomVerseIndex];

        return {
            surahIndex: selectedSurahTr.index,
            verseNumber: verseKey.replace("verse_", ""), // "verse_5" -> "5"
            prevVerseAr: randomVerseIndex > 0 ? selectedSurahAr.verse[verseKeys[randomVerseIndex - 1]] : "",
            verseAr: selectedSurahAr.verse[verseKey] || "",
            nextVerseAr: randomVerseIndex < verseKeys.length - 1 ? selectedSurahAr.verse[verseKeys[randomVerseIndex + 1]] : "",
            prevVerseTr: randomVerseIndex > 0 ? selectedSurahTr.verse[verseKeys[randomVerseIndex - 1]] : "",
            verseTr: selectedSurahTr.verse[verseKey] || "",
            nextVerseTr: randomVerseIndex < verseKeys.length - 1 ? selectedSurahTr.verse[verseKeys[randomVerseIndex + 1]] : ""
        };
    }

    // Ayetleri ekrana yazdırma fonksiyonu
    function displayVerses() {
        let selectedSurahIndex = surahSelect.value;
        let verseData = getRandomVerse(selectedSurahIndex);

        if (!verseData) return;

        verseBoxes[1].querySelector(".verse-title").textContent = `Surah ${verseData.surahIndex}, Ayah ${verseData.verseNumber}`;
        verseBoxes[1].querySelector(".verse-prev").textContent = verseData.prevVerseAr;
        verseBoxes[1].querySelector(".verse-main").textContent = verseData.verseAr;
        verseBoxes[1].querySelector(".verse-next").textContent = verseData.nextVerseAr;

        verseBoxes[0].querySelector(".verse-title").textContent = `Surah ${verseData.surahIndex}, Ayah ${verseData.verseNumber}`;
        verseBoxes[0].querySelector(".verse-prev").textContent = verseData.prevVerseTr;
        verseBoxes[0].querySelector(".verse-main").textContent = verseData.verseTr;
        verseBoxes[0].querySelector(".verse-next").textContent = verseData.nextVerseTr;
    }

    // Dil değiştirildiğinde yeni çeviri verisini yükle
    languageSelect.addEventListener("change", async function () {
        await loadTranslationData();
        populateSurahDropdown(); // Dil değişince dropdown'ı güncelle
    });

    // Rastgele ayet butonu
    randomVerseBtn.addEventListener("click", displayVerses);

    // JSON verilerini yükle
    loadQuranData();
});
