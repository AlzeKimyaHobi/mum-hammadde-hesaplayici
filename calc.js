// Mum Hammadde Hesaplayıcı - hesap mantığı
// alzekimya.com/pages/mum-hammadde-hesaplayici sayfasındaki mantıkla aynı yaklaşım:
// kap hacmini bul (ml), yoğunluğa göre gram karşılığını hesapla, doldurma payı ve
// esans oranı uygula.

// Yoğunluk kaynakları: craftybase.com (candle mass/volume dönüşüm tablosu,
// erimiş mum ~20°C) ve rafine soya için armatagecandlecompany.com (NatureWax
// C-3 özgül ağırlık testi). Her hammaddenin değeri farklıdır, karıştırılmamalı.
const HAMMADDELER = {
  soya_wax: {
    label: "Soya Wax",
    density: 0.90, // g/ml — craftybase.com candle yoğunluk tablosu
    productUrl: "https://alzekimya.com/soya-wax-1-kg" // Kavanoz dolum soyası
  },
  parafin: {
    label: "Parafin",
    density: 0.93, // g/ml — craftybase.com candle yoğunluk tablosu
    // Parafin için iki ayrı ürün var: kap tipine göre seçilir (aşağıda productUrlForKapTipi).
    productUrlSilikon: "https://alzekimya.com/parafin-wax", // Silikon kalıp parafini
    productUrlKapIci: "https://alzekimya.com/parafin-wax-mum-hammaddesi-5-yagli-1-kg-pakette" // Kap içi dolum parafini
  },
  balmumu: {
    label: "Balmumu",
    density: 0.96, // g/ml — craftybase.com / aqua-calc.com (beeswax)
    productUrl: "https://alzekimya.com/dogal-balmumu"
  },
  coconut_wax: {
    label: "Coconut Wax",
    density: 0.92, // g/ml — craftybase.com candle yoğunluk tablosu
    productUrl: "https://alzekimya.com/coconut-wax"
  },
  rafine_soya: {
    label: "Rafine Soya",
    density: 0.86, // g/ml — armatagecandlecompany.com, NatureWax C-3 özgül ağırlık testi
    productUrl: "https://alzekimya.com/rafine-beyaz-soya-parafini"
  },
  jel_mum: {
    label: "Jel Mum",
    density: 0.88, // g/ml — mineral yağ + polimer bazlı jel mumlar için sektörde yaygın kabul gören değer
    productUrl: "https://alzekimya.com/jel-mum"
  },
  stearin: {
    label: "Stearin",
    density: 0.94, // g/ml — Wikipedia, stearik asit katı hal yoğunluğu (20°C'de 0,9408 g/cm³)
    productUrl: "https://alzekimya.com/stearin-mum-sertlestiricisi"
  },
  beyaz_balmumu: {
    label: "Beyaz Balmumu",
    density: 0.96, // g/ml — ağartılmış balmumu, doğal balmumuyla aynı madde/yoğunluk
    productUrl: "https://alzekimya.com/cicek-mumu"
  },
  carnauba_wax: {
    label: "Carnauba Wax",
    density: 0.97, // g/ml — Wikipedia, carnauba wax yoğunluğu (~0,97 g/cm³)
    productUrl: "https://alzekimya.com/carnauba-wax"
  },
  mikrokristalin: {
    label: "Mikrokristalin",
    density: 0.81, // g/ml — ATDM teknik veri föyü, mikrokristalin wax özgül ağırlık 0,80-0,82 g/cm³ (ASTM D-3712)
    productUrl: "https://alzekimya.com/mum-malzemeleri" // sitede ayrı ürün sayfası bulunamadı, kategoriye yönlendirir
  }
};

// Parafin gibi kap tipine göre farklı ürüne yönlendirmesi gereken hammaddeler için.
function urunLinkiSec(hammaddeKey, hammadde, kapTipi) {
  if (hammaddeKey === "parafin") {
    return kapTipi === "silikon" ? hammadde.productUrlSilikon : hammadde.productUrlKapIci;
  }
  return hammadde.productUrl;
}

const DOLDURMA_ORANI = 0.92; // kabın ~%92'si wax ile dolar, kalan pay için
const ESANS_ORANI = 0.08; // wax ağırlığının %8'i esans (yaygın aralık %6-10)

function kapHacmiMl(kapTipi, girdi) {
  // girdi: { suGrami, en, boy, yukseklik, cap, adet }
  const adet = Math.max(1, Number(girdi.adet) || 1);
  let tekHacimMl = 0;

  if (kapTipi === "silikon") {
    // su alma kapasitesi (gram) = ml (suyun yoğunluğu 1 g/ml)
    tekHacimMl = Number(girdi.suGrami) || 0;
  } else if (kapTipi === "dikdortgen") {
    const en = Number(girdi.en) || 0;
    const boy = Number(girdi.boy) || 0;
    const yukseklik = Number(girdi.yukseklik) || 0;
    tekHacimMl = en * boy * yukseklik; // cm3 = ml
  } else if (kapTipi === "yuvarlak") {
    const cap = Number(girdi.cap) || 0;
    const yukseklik = Number(girdi.yukseklik) || 0;
    const yaricap = cap / 2;
    tekHacimMl = Math.PI * yaricap * yaricap * yukseklik;
  }

  return { tekHacimMl, adet };
}

function hesapla(hammaddeKey, kapTipi, girdi) {
  const hammadde = HAMMADDELER[hammaddeKey];
  if (!hammadde) {
    throw new Error("Geçersiz hammadde: " + hammaddeKey);
  }
  if (!["silikon", "dikdortgen", "yuvarlak"].includes(kapTipi)) {
    throw new Error("Geçersiz kap tipi: " + kapTipi);
  }

  const { tekHacimMl, adet } = kapHacmiMl(kapTipi, girdi);
  const toplamHacimMl = tekHacimMl * adet;
  const dolduracakHacimMl = toplamHacimMl * DOLDURMA_ORANI;

  const waxGram = dolduracakHacimMl * hammadde.density;
  const esansGram = waxGram * ESANS_ORANI;
  const toplamGram = waxGram + esansGram;

  return {
    hammadde: hammadde.label,
    productUrl: urunLinkiSec(hammaddeKey, hammadde, kapTipi),
    adet,
    tekHacimMl: round1(tekHacimMl),
    toplamHacimMl: round1(toplamHacimMl),
    waxGram: round1(waxGram),
    esansGram: round1(esansGram),
    toplamGram: round1(toplamGram)
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { HAMMADDELER, hesapla, kapHacmiMl, DOLDURMA_ORANI, ESANS_ORANI };
}
