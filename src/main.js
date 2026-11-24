import "swiper/css";
import "swiper/css/pagination";
import "./style.css";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from "swiper/modules";
import { business, services, reviews, faqs } from "./data.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmtRating = (n) => n.toFixed(1).replace(".", ",");
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

document.body.classList.add("is-loading");

/* ---------- Business data binding ---------- */
const waText = encodeURIComponent("Merhaba, DİLKON'dan randevu almak istiyorum.");
const waUrl = `https://wa.me/${business.phoneIntl.replace("+", "")}?text=${waText}`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}&destination_place_id=${business.placeId}`;

$$("[data-rating]").forEach((el) => (el.textContent = fmtRating(business.rating)));
$$("[data-review-count]").forEach((el) => (el.textContent = business.reviewCount));
$$("[data-phone-link]").forEach((el) => (el.href = `tel:${business.phoneIntl}`));
$$("[data-phone-text]").forEach((el) => (el.textContent = business.phone));
$$("[data-whatsapp-link]").forEach((el) => (el.href = waUrl));
$$("[data-maps-link]").forEach((el) => (el.href = business.mapsUrl));
$$("[data-directions-link]").forEach((el) => (el.href = directionsUrl));
$$("[data-address]").forEach((el) => (el.textContent = business.address));
$$("[data-email-link]").forEach((el) => {
  el.href = business.instagram;
  el.target = "_blank";
  el.rel = "noopener";
  el.textContent = "@dilkonusmaelazig";
});
const emailRow = $("[data-email-row]");
if (emailRow) {
  $("small", emailRow).textContent = "Instagram";
  $(".ic", emailRow).innerHTML =
    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.6a6 6 0 0 0-1.6-4A6 6 0 0 0 16.4 2C14.8 1.9 9.2 1.9 7.6 2a6 6 0 0 0-4 1.6A6 6 0 0 0 2 7.6c-.1 1.6-.1 7.2 0 8.8a6 6 0 0 0 1.6 4 6 6 0 0 0 4 1.6c1.6.1 7.2.1 8.8 0a6 6 0 0 0 4-1.6 6 6 0 0 0 1.6-4c.1-1.6.1-7.2 0-8.8zm-2.1 10.6a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9A3.3 3.3 0 0 1 6.1 4.5C7.4 4 10.5 4.1 12 4.1s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z"/></svg>';
}

$("#map-frame").src = `https://maps.google.com/maps?q=${business.lat},${business.lng}&z=16&hl=tr&output=embed`;
$("#year").textContent = new Date().getFullYear();

/* ---------- Hours ---------- */
const today = new Date().getDay();
$("#hours-list").innerHTML = business.hours
  .map(
    (h) => `<li class="${h.idx === today ? "is-today" : ""} ${h.time ? "" : "is-closed"}">
      <span>${h.day}${h.idx === today ? " · Bugün" : ""}</span><span>${h.time ?? "Kapalı"}</span></li>`
  )
  .join("");

/* ---------- Services ---------- */
$("#services-grid").innerHTML = services
  .map(
    (s, i) => `<article class="service reveal" style="--tint:${s.tint};--d:${(i % 4) * 0.08}s">
      <span class="service__num">${String(i + 1).padStart(2, "0")}</span>
      <div class="service__icon" aria-hidden="true">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </article>`
  )
  .join("");

$$(".service").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
});

/* ---------- Reviews (yalnızca 5 yıldız) ---------- */
const avatarColors = ["#ff7a59", "#2557d6", "#19b3a6", "#9b5de5", "#f4a100", "#e8505b", "#0b7a75", "#5a67d8"];
const gIcon =
  '<svg class="review__g" viewBox="0 0 48 48" aria-label="Google"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

const fiveStar = reviews.filter((r) => r.rating === 5);
$("#reviews-wrapper").innerHTML = fiveStar
  .map((r, i) => {
    const initial = r.name.trim().charAt(0).toLocaleUpperCase("tr-TR");
    const long = r.text.length > 260;
    return `<div class="swiper-slide">
      <article class="review">
        <div class="review__stars" aria-label="5 yıldız">★★★★★</div>
        <p class="review__text">${esc(r.text)}</p>
        ${long ? '<button class="review__more" type="button">Devamını oku</button>' : ""}
        <div class="review__author">
          <span class="review__avatar" style="background:${avatarColors[i % avatarColors.length]}">${initial}</span>
          <div><strong>${esc(r.name)}</strong><small>${r.date} · Google</small></div>
          ${gIcon}
        </div>
      </article>
    </div>`;
  })
  .join("");

$$(".review__more").forEach((btn) =>
  btn.addEventListener("click", () => {
    const p = btn.previousElementSibling;
    const open = p.classList.toggle("is-open");
    btn.textContent = open ? "Daha az göster" : "Devamını oku";
  })
);

new Swiper("#reviews-swiper", {
  modules: [Navigation, Pagination, Autoplay, Keyboard, A11y],
  slidesPerView: 1.08,
  spaceBetween: 18,
  centeredSlides: true,
  loop: true,
  speed: 750,
  grabCursor: true,
  watchSlidesProgress: true,
  keyboard: { enabled: true },
  autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
  navigation: { prevEl: "#rev-prev", nextEl: "#rev-next" },
  pagination: { el: "#rev-pagination", clickable: true, dynamicBullets: true },
  a11y: { prevSlideMessage: "Önceki yorum", nextSlideMessage: "Sonraki yorum" },
  breakpoints: {
    640: { slidesPerView: 1.6, spaceBetween: 22 },
    960: { slidesPerView: 2.4, spaceBetween: 26 },
    1280: { slidesPerView: 3.2, spaceBetween: 28 },
  },
});

/* ---------- FAQ ---------- */
$("#faq-list").innerHTML = faqs
  .map(
    (f, i) => `<div class="faq__item reveal ${i === 0 ? "is-open" : ""}" style="--d:${i * 0.05}s">
      <button class="faq__q" type="button" aria-expanded="${i === 0}">${f.q}<span aria-hidden="true">+</span></button>
      <div class="faq__a"><div><p>${f.a}</p></div></div>
    </div>`
  )
  .join("");
$$(".faq__q").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const open = !item.classList.contains("is-open");
    $$(".faq__item").forEach((el) => {
      el.classList.remove("is-open");
      $(".faq__q", el).setAttribute("aria-expanded", "false");
    });
    if (open) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  })
);

/* ---------- Header / nav ---------- */
const header = $("#header");
const navLinks = $$("#nav a");
const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
  if (window.scrollY < 200) {
    navLinks.forEach((a) => a.classList.remove("is-active"));
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("#burger");
const nav = $("#nav");
const toggleMenu = (force) => {
  const open = force ?? !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => toggleMenu());
navLinks.forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

const sections = $$("main section[id]");
const navObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      }
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

/* ---------- Reveal + counters ---------- */
const animateCounter = (el) => {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const dur = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * eased).toFixed(dec).replace(".", ",") + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$(".counter", e.target).forEach(animateCounter);
      revealObserver.unobserve(e.target);
    }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Structured data (SEO) ---------- */
const ld = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: business.name,
  telephone: business.phoneIntl,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ataşehir, Zeybekler Sk. No:35",
    postalCode: "23270",
    addressLocality: "Elazığ Merkez",
    addressRegion: "Elazığ",
    addressCountry: "TR",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.lat, longitude: business.lng },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "17:00" }],
  aggregateRating: { "@type": "AggregateRating", ratingValue: business.rating, reviewCount: business.reviewCount },
  sameAs: [business.instagram],
};
const ldTag = document.createElement("script");
ldTag.type = "application/ld+json";
ldTag.textContent = JSON.stringify(ld);
document.head.appendChild(ldTag);

/* ---------- 3D + preloader ---------- */
import("./scene.js").then((m) => m.initHeroScene($("#hero-canvas")));

const hidePreloader = () => {
  const pre = $("#preloader");
  if (!pre || pre.classList.contains("is-done")) return;
  pre.classList.add("is-done");
  document.body.classList.remove("is-loading");
};

if (document.readyState === "complete") {
  setTimeout(hidePreloader, 350);
} else {
  window.addEventListener("load", () => setTimeout(hidePreloader, 450), { once: true });
}
setTimeout(hidePreloader, 2500);
