# DİLKON Dil Konuşma ve Rehabilitasyon Merkezi – Web Sitesi

Elazığ'daki DİLKON Dil Konuşma ve Rehabilitasyon Merkezi için tek sayfalık, 3D animasyonlu tanıtım sitesi.

- **Teknoloji:** Vite + Vanilla JS, Three.js (3D hero sahnesi), Swiper (yorum kaydırıcısı)
- **Veriler:** `src/data.js` (Google Haritalar kaydından: adres, telefon, çalışma saatleri, 5 yıldızlı yorumlar)

## Geliştirme

```bash
npm install
npm run dev
npm run build
```

## Kendi 3D modelinizi eklemek

Herhangi bir `.glb` dosyasını `src/models/` klasörüne koyup yeniden build almanız yeterli. Site bu dosyayı otomatik olarak algılar ve hero bölümündeki animasyonlu küre yerine gösterir.
