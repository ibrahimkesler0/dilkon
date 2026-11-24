# DİLKON Dil Konuşma ve Rehabilitasyon Merkezi — Web Sitesi

Elazığ'daki DİLKON Dil Konuşma ve Rehabilitasyon Merkezi için sıfırdan tasarlanmış, tüm sayfa boyunca kaydırmaya bağlı gerçek 3D beyin modeli animasyonlarına sahip editoryal web sitesi.

## Özellikler
- **Gerçek 3D Model:** `public/models/brain.glb` (Apache-2.0, Brain Project — 309 anatomik parça 9 optimize gruba birleştirildi, yerel Draco WASM çözücü).
- **Sayfa Boyunca 3D Koreografi:** Lenis + GSAP ScrollTrigger ile Hero'dan İletişim'e kadar kesintisiz kamera, konum, 360° dönüş, korteks açılma ve bölge vurgulama (Broca, Wernicke, Motor Korteks, Arkuat Fasikül, Serebellum, Beyin Sapı).
- **Özgün Tipografi:** Newsreader + Golos Text + IBM Plex Mono (tam Türkçe karakter destekli).
- **Doğrulanmış Google Haritalar Verileri:** Adres, telefon, çalışma saatleri, erişilebilirlik özellikleri ve yalnızca **5 yıldızlı 20 gerçek aile yorumu** (`src/data.js`).

## Geliştirme

```bash
npm install
npm run dev
npm run build
```
