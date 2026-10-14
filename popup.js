document.addEventListener("DOMContentLoaded", () => {
  const kapTipiSelect = document.getElementById("kapTipi");
  const alanSilikon = document.getElementById("alanSilikon");
  const alanDikdortgen = document.getElementById("alanDikdortgen");
  const alanYuvarlak = document.getElementById("alanYuvarlak");
  const sonuc = document.getElementById("sonuc");

  function alanlariGuncelle() {
    const tip = kapTipiSelect.value;
    alanSilikon.classList.toggle("hidden", tip !== "silikon");
    alanDikdortgen.classList.toggle("hidden", tip !== "dikdortgen");
    alanYuvarlak.classList.toggle("hidden", tip !== "yuvarlak");
  }

  kapTipiSelect.addEventListener("change", alanlariGuncelle);
  alanlariGuncelle();

  document.getElementById("hesaplaBtn").addEventListener("click", () => {
    const hammaddeKey = document.getElementById("hammadde").value;
    const kapTipi = kapTipiSelect.value;

    const girdi = {
      suGrami: document.getElementById("suGrami").value,
      en: document.getElementById("en").value,
      boy: document.getElementById("boy").value,
      yukseklik: document.getElementById("yukseklikDik").value,
      cap: document.getElementById("cap").value,
      adet: document.getElementById("adet").value
    };
    if (kapTipi === "yuvarlak") {
      girdi.yukseklik = document.getElementById("yukseklikYuv").value;
    }

    let sonucVeri;
    try {
      sonucVeri = hesapla(hammaddeKey, kapTipi, girdi);
    } catch (e) {
      alert("Lütfen tüm alanları doğru doldurun.");
      return;
    }

    if (!sonucVeri.toplamHacimMl || sonucVeri.toplamHacimMl <= 0) {
      alert("Lütfen kap ölçülerini girin.");
      return;
    }

    document.getElementById("sonucWax").textContent = sonucVeri.waxGram + " g";
    document.getElementById("sonucEsans").textContent = sonucVeri.esansGram + " g";
    document.getElementById("sonucToplam").textContent = sonucVeri.toplamGram + " g";

    const link = document.getElementById("satinAlLink");
    link.href = sonucVeri.productUrl;
    link.textContent = sonucVeri.hammadde + "'i alzekimya.com'da görüntüle →";

    sonuc.classList.remove("hidden");
  });
});
