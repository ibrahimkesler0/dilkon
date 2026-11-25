import "swiper/css";
import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Swiper from "swiper";
import { Navigation, Autoplay, Keyboard } from "swiper/modules";
import { business, services, processSteps, reviews, faqs } from "./data.js";
import { initBrainStage } from "./scene.js";

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmtRating = (n) => n.toFixed(1).replace(".", ",");
const pad2 = (n) => String(n).padStart(2, "0");

/* ---------- 1. Bind Verified Google Maps Data ---------- */
const waText = encodeURIComponent("Merhaba, DİLKON Elazığ için ön görüşme randevusu almak istiyorum.");
const waUrl = `https://wa.me/${business.phoneIntl.replace("+", "")}?text=${waText}`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}&destination_place_id=${business.placeId}`;

$$("[data-rating]").forEach((el) => (el.textContent = fmtRating(business.rating)));
$$("[data-review-count]").forEach((el) => (el.textContent = business.reviewCount));
$$("[data-five-count]").forEach((el) => (el.textContent = business.fiveStarCount));
$$("[data-phone-link]").forEach((el) => (el.href = `tel:${business.phoneIntl}`));
$$("[data-phone-text]").forEach((el) => (el.textContent = business.phone));
$$("[data-whatsapp-link]").forEach((el) => (el.href = waUrl));
$$("[data-maps-link]").forEach((el) => (el.href = business.mapsUrl));
$$("[data-directions-link]").forEach((el) => (el.href = directionsUrl));
$$("[data-instagram-link]").forEach((el) => (el.href = business.instagram));
$$("[data-address]").forEach((el) => (el.textContent = business.address));
$$("[data-address-short]").forEach((el) => (el.textContent = business.addressShort));
$$("[data-business-desc]").forEach((el) => (el.textContent = business.description));

$("#map-frame").src = `https://maps.google.com/maps?q=D%C4%B0LKON+Dil+Konu%C5%9Fma+ve+Rehabilitasyon+Merkezi,+Elaz%C4%B1%C4%9F&ll=${business.lat},${business.lng}&z=16&hl=tr&output=embed`;
$("#year").textContent = new Date().getFullYear();

// Live clinic open/closed indicator (Turkey time)
function updateClinicStatus() {
  const statusEl = $("#clinic-status");
  if (!statusEl) return;
  try {
    const now = new Date();
    const tr = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const dayIdx = tr.getDay();
    const hour = tr.getHours() + tr.getMinutes() / 60;
    const todayInfo = business.hours.find((h) => h.idx === dayIdx);
    if (todayInfo && todayInfo.open !== null && hour >= todayInfo.open && hour < todayInfo.close) {
      statusEl.textContent = `Şu an açık · ${pad2(todayInfo.close)}:00'ye kadar`;
    } else {
      statusEl.textContent = "Salı–Cumartesi · 09:00–17:00";
    }
  } catch {
    statusEl.textContent = "Salı–Cumartesi · 09:00–17:00";
  }
}
updateClinicStatus();

// Amenities from Google Maps "Hakkında"
$("#amenity-list").innerHTML = business.amenities.map((a) => `<li>${esc(a)}</li>`).join("");

// Weekly Hours
const todayIdx = new Date().getDay();
$("#hours-list").innerHTML = business.hours
  .map(
    (h) => `<li class="${h.idx === todayIdx ? "is-today" : ""} ${h.open === null ? "is-closed" : ""}">
      <span>${h.day}${h.idx === todayIdx ? " · Bugün" : ""}</span>
      <span>${h.label}</span>
    </li>`
  )
  .join("");

/* ---------- 2. Render Services, Process, 5-Star Reviews & FAQ ---------- */
$("#services-list").innerHTML = services
  .map(
    (s, i) => `<article class="svc-item reveal ${i === 0 ? "is-active" : ""}" data-region="${s.region}">
      <div class="svc-item__head">
        <span class="svc-item__code">${s.code}</span>
        <h3 class="svc-item__title">${esc(s.title)}</h3>
        <span class="svc-item__tag">${esc(s.regionLabel)}</span>
      </div>
      <p class="svc-item__desc">${esc(s.text)}</p>
    </article>`
  )
  .join("");

$("#process-list").innerHTML = processSteps
  .map(
    (step) => `<article class="p-step reveal">
      <div class="p-step__top">
        <span class="p-step__num">${step.num}</span>
        <span class="p-step__tag">${esc(step.tag)}</span>
      </div>
      <h3>${esc(step.title)}</h3>
      <p>${esc(step.text)}</p>
    </article>`
  )
  .join("");

const gSvg =
  '<svg class="rev-card__g" viewBox="0 0 48 48" aria-label="Google"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

const fiveStarReviews = reviews.filter((r) => r.rating === 5);
$("#rev-total").textContent = pad2(fiveStarReviews.length);

$("#reviews-wrapper").innerHTML = fiveStarReviews
  .map((r, i) => {
    const init = r.name.trim().charAt(0).toLocaleUpperCase("tr-TR");
    const isLong = r.text.length > 220;
    return `<div class="swiper-slide" role="group" aria-label="${i + 1} / ${fiveStarReviews.length}">
      <article class="rev-card">
        <div class="rev-card__head">
          <span class="rev-card__stars" aria-label="5 üzerinden 5 yıldız">★★★★★</span>
          <span class="rev-card__verified">5,0 · GOOGLE</span>
        </div>
        <blockquote class="rev-card__quote">“${esc(r.text)}”</blockquote>
        ${isLong ? '<button class="rev-card__more" type="button">Devamını oku</button>' : ""}
        <div class="rev-card__foot">
          <div class="rev-card__author">
            <span class="rev-card__init">${init}</span>
            <div>
              <strong>${esc(r.name)}</strong>
              <small>${esc(r.date)}</small>
            </div>
          </div>
          ${gSvg}
        </div>
      </article>
    </div>`;
  })
  .join("");

$$(".rev-card__more").forEach((btn) =>
  btn.addEventListener("click", () => {
    const quote = btn.previousElementSibling;
    const opened = quote.classList.toggle("is-open");
    btn.textContent = opened ? "Daha az göster" : "Devamını oku";
  })
);

$("#faq-list").innerHTML = faqs
  .map(
    (f, i) => `<div class="acc-item reveal ${i === 0 ? "is-open" : ""}">
      <button class="acc-q" type="button" aria-expanded="${i === 0}">
        ${esc(f.q)}<span aria-hidden="true">+</span>
      </button>
      <div class="acc-a"><div><p>${esc(f.a)}</p></div></div>
    </div>`
  )
  .join("");

$$(".acc-q").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const willOpen = !item.classList.contains("is-open");
    $$(".acc-item").forEach((el) => {
      el.classList.remove("is-open");
      $(".acc-q", el).setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  })
);

/* ---------- 3. Preloader & Real 3D Brain Stage ---------- */
const loaderEl = $("#loader");
const loaderFill = $("#loader-fill");
const loaderPct = $("#loader-pct");
const loaderLabel = $("#loader-label");
const hudEl = $("#hud");
const hudRegion = $("#hud-region");
const hudAngle = $("#hud-angle");
const hudOrbitBtn = $("#hud-orbit-btn");

let preloaderHidden = false;
let inspecting = false;
let savedTarget = null;
function hideLoader() {
  if (preloaderHidden) return;
  preloaderHidden = true;
  loaderFill.style.width = "100%";
  loaderPct.textContent = "100%";
  setTimeout(() => {
    loaderEl.classList.add("is-done");
    document.body.classList.remove("is-loading");
  }, 260);
}

const stage = initBrainStage({
  canvas: $("#scene-canvas"),
  onProgress(pct) {
    loaderFill.style.width = `${pct}%`;
    loaderPct.textContent = `${pad2(pct)}%`;
    if (pct > 75) loaderLabel.textContent = "Konuşma & dil ağları yapılandırılıyor";
  },
  onReady() {
    hideLoader();
  },
  onTelemetry({ deg, regionLabel, dark }) {
    hudAngle.textContent = `${deg}°`;
    if (!inspecting) {
      hudRegion.textContent = regionLabel;
    }
    hudEl.classList.toggle("is-dark", inspecting || dark);
  },
});

// Safety fallback so preloader never hangs on slow connections
setTimeout(hideLoader, 6500);

/* ---------- 4. Interactive 3D Inspect Toggle ---------- */
function setInspect(on) {
  inspecting = on;
  document.body.classList.toggle("is-inspect", on);
  hudOrbitBtn.setAttribute("aria-pressed", String(on));
  hudOrbitBtn.querySelector("span").textContent = on ? "Kapat ✕" : "3D İncele";
  stage.setInspectMode(on);

  if (lenis) {
    if (on) lenis.stop();
    else lenis.start();
  }

  if (on) {
    savedTarget = { ...stage.target };
    hudRegion.textContent = "SERBEST 3D İNCELEME · SÜRÜKLEYEREK DÖNDÜRÜN";
    gsap.to(stage.target, {
      x: 0,
      y: 0,
      scale: 1.12,
      camZ: 7.4,
      sceneOpacity: 1,
      explode: 0.08,
      shellOpacity: 0.92,
      duration: 0.65,
      ease: "power3.out",
    });
  } else if (savedTarget) {
    gsap.to(stage.target, {
      x: savedTarget.x,
      y: savedTarget.y,
      scale: savedTarget.scale,
      camZ: savedTarget.camZ,
      sceneOpacity: savedTarget.sceneOpacity,
      explode: savedTarget.explode,
      shellOpacity: savedTarget.shellOpacity,
      duration: 0.65,
      ease: "power3.out",
      onComplete: () => syncScrollChoreography(),
    });
  }
}

hudOrbitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  setInspect(!inspecting);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && inspecting) setInspect(false);
});

/* ---------- 5. Smooth Scrolling (Lenis) + Continuous Deterministic Scroll-3D Choreography ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis = null;

if (!reduceMotion) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
    syncScrollChoreography();
    syncTopbar();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Smooth anchor navigation (closes mobile drawer & restarts Lenis BEFORE scrolling!)
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const targetEl = $(id);
    if (!targetEl) return;
    e.preventDefault();
    if (inspecting) setInspect(false);
    if (drawer && drawer.classList.contains("is-open")) {
      toggleDrawer(false);
    }
    const offset = window.innerWidth < 960 ? -64 : -72;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(targetEl, { offset, duration: 1.0, force: true });
    } else {
      const top = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY + offset);
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// Exact sculptural 3D pose per chapter — continuously interpolated on EVERY scroll pixel
const CHAPTER_POSES = [
  {
    id: "giris",
    x: 1.56, y: 0.06, rotX: 0.08, rotY: -1.18, rotZ: 0.02,
    scale: 1.0, explode: 0.0, shellOpacity: 1.0, ringOpacity: 1.0,
    darkMode: 0, camZ: 8.15, sceneOpacity: 1.0, highlight: "idle",
  },
  {
    id: "hakkimizda",
    x: -1.88, y: 0.04, rotX: 0.12, rotY: -1.58, rotZ: -0.02,
    scale: 0.98, explode: 0.08, shellOpacity: 0.92, ringOpacity: 1.0,
    darkMode: 1, camZ: 7.75, sceneOpacity: 1.0, highlight: "broca",
  },
  {
    id: "hizmetler",
    x: 1.82, y: 0.02, rotX: 0.16, rotY: -0.96, rotZ: 0.02,
    scale: 0.96, explode: 0.25, shellOpacity: 0.42, ringOpacity: 0.85,
    darkMode: 0, camZ: 7.9, sceneOpacity: 1.0, highlight: "wernicke",
  },
  {
    id: "surec",
    x: 0.0, y: 0.04, rotX: 0.14, rotY: -0.35, rotZ: 0.0,
    scale: 1.0, explode: 0.14, shellOpacity: 0.82, ringOpacity: 1.0,
    darkMode: 1, camZ: 8.1, sceneOpacity: 0.96, highlight: "all",
  },
  {
    id: "yorumlar",
    x: 2.02, y: 0.72, rotX: 0.1, rotY: -0.35 + Math.PI * 2, rotZ: 0.02,
    scale: 0.66, explode: 0.0, shellOpacity: 0.96, ringOpacity: 0.55,
    darkMode: 0, camZ: 9.2, sceneOpacity: 0.64, highlight: "wernicke",
  },
  {
    id: "sss",
    x: -1.86, y: 0.04, rotX: 0.1, rotY: -0.35 + Math.PI * 2 + 0.9, rotZ: -0.02,
    scale: 0.92, explode: 0.06, shellOpacity: 0.92, ringOpacity: 0.82,
    darkMode: 0, camZ: 8.2, sceneOpacity: 0.96, highlight: "broca",
  },
  {
    id: "iletisim",
    x: 1.72, y: 0.82, rotX: 0.06, rotY: -0.35 + Math.PI * 2 + 2.05, rotZ: 0.0,
    scale: 0.7, explode: 0.04, shellOpacity: 0.88, ringOpacity: 0.68,
    darkMode: 1, camZ: 8.9, sceneOpacity: 0.56, highlight: "all",
  },
];

const POSE_KEYS = [
  "x", "y", "rotX", "rotY", "rotZ", "scale",
  "explode", "shellOpacity", "ringOpacity", "darkMode", "camZ", "sceneOpacity",
];

const chapterEls = CHAPTER_POSES.map((p) => $(`#${p.id}`));
const svcItems = $$(".svc-item");
let hoveredServiceRegion = null;

function selectService(el, fromHover = false) {
  svcItems.forEach((item) => item.classList.toggle("is-active", item === el));
  if (fromHover) hoveredServiceRegion = el.dataset.region;
  stage.setRegionFocus(el.dataset.region);
}

svcItems.forEach((el) => {
  el.addEventListener("pointerenter", () => selectService(el, true));
  el.addEventListener("click", () => selectService(el, true));
});
$("#services-list")?.addEventListener("pointerleave", () => {
  hoveredServiceRegion = null;
});

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function syncScrollChoreography() {
  if (inspecting) return;

  const y = window.scrollY;
  const vh = window.innerHeight || 800;
  const probeY = y + vh * 0.45;
  const st = stage.target;

  // Compute anchor Y for each chapter (start of chapter content)
  const anchors = chapterEls.map((el, i) => {
    if (!el) return i * vh;
    return i === 0 ? 0 : el.offsetTop;
  });

  // Find active segment [i, i+1]
  let idx = 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (probeY >= anchors[i]) idx = i;
  }

  const a = CHAPTER_POSES[idx];
  const b = CHAPTER_POSES[Math.min(idx + 1, CHAPTER_POSES.length - 1)];

  // Transition window sits smoothly in the bottom ~45% of chapter i -> top ~25% of chapter i+1
  const elA = chapterEls[idx];
  const segStart = idx === 0 ? vh * 0.15 : (elA?.offsetTop ?? 0) + (elA?.offsetHeight ?? vh) * 0.55;
  const segEnd = anchors[Math.min(idx + 1, anchors.length - 1)] + vh * 0.15;

  let t = 0;
  if (idx < CHAPTER_POSES.length - 1 && segEnd > segStart) {
    t = smoothstep((probeY - segStart) / (segEnd - segStart));
  }

  for (const k of POSE_KEYS) {
    st[k] = a[k] + (b[k] - a[k]) * t;
  }

  // Extra continuous 360° sculptural spin while traversing inside #surec (Process Timeline)
  const surecEl = chapterEls[3];
  if (surecEl) {
    const sTop = surecEl.offsetTop;
    const sH = Math.max(1, surecEl.offsetHeight);
    const sProg = Math.max(0, Math.min(1, (probeY - sTop) / sH));
    if (idx === 3) {
      // Override rotY linearly across the 4 steps so the brain orbits a full 360° smoothly
      st.rotY = CHAPTER_POSES[3].rotY + sProg * Math.PI * 2;
      st.rotX = 0.18 - sProg * 0.28;
      st.explode = 0.08 + Math.sin(sProg * Math.PI) * 0.18;
    }
  }

  // Determine active chapter & service region highlighting
  const currentChapterId = t > 0.5 ? b.id : a.id;
  st.highlight = t > 0.5 ? b.highlight : a.highlight;

  if (currentChapterId === "hizmetler") {
    if (hoveredServiceRegion) {
      stage.setRegionFocus(hoveredServiceRegion);
    } else {
      // Auto-select the service row nearest the vertical center of viewport
      let closest = svcItems[0];
      let bestDist = Infinity;
      const midY = vh * 0.5;
      for (const item of svcItems) {
        const rect = item.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height * 0.5 - midY);
        if (dist < bestDist) {
          bestDist = dist;
          closest = item;
        }
      }
      if (closest) selectService(closest, false);
    }
  } else {
    hoveredServiceRegion = null;
    stage.setRegionFocus(null);
  }
}

window.addEventListener("scroll", syncScrollChoreography, { passive: true });
window.addEventListener("resize", syncScrollChoreography);
syncScrollChoreography();

/* ---------- 6. 5-Star Reviews Carousel ---------- */
const revCurrent = $("#rev-current");
const revProgress = $("#rev-progress");

function syncReviewCounter(sw) {
  const idx = (sw.realIndex ?? 0) + 1;
  revCurrent.textContent = pad2(idx);
  revProgress.style.width = `${(idx / fiveStarReviews.length) * 100}%`;
}

const reviewSwiper = new Swiper("#reviews-swiper", {
  modules: [Navigation, Autoplay, Keyboard],
  slidesPerView: 1,
  spaceBetween: 14,
  loop: true,
  speed: 650,
  grabCursor: true,
  keyboard: { enabled: true },
  autoplay: { delay: 6500, disableOnInteraction: true, pauseOnMouseEnter: true },
  navigation: { prevEl: "#rev-prev", nextEl: "#rev-next" },
  breakpoints: {
    640: { slidesPerView: 1.55, spaceBetween: 20 },
    960: { slidesPerView: 2.35, spaceBetween: 24 },
    1280: { slidesPerView: 3.1, spaceBetween: 26 },
  },
  on: {
    init(sw) {
      syncReviewCounter(sw);
    },
    slideChange(sw) {
      syncReviewCounter(sw);
    },
    realIndexChange(sw) {
      syncReviewCounter(sw);
      stage.nudgeReview(1);
    },
  },
});

revProgress.style.width = `${(1 / fiveStarReviews.length) * 100}%`;

/* ---------- 7. Topbar Theme, Active Section, Drawer & Reveal Counters ---------- */
const topbar = $("#topbar");
const navLinks = $$("#nav a");
const chapters = $$("section[data-chapter]");

function syncTopbar() {
  const y = window.scrollY;
  topbar.classList.toggle("is-scrolled", y > 28);

  // Probe at exact vertical midpoint of the sticky topbar (44px) for zero lag at section boundaries
  const probeY = 44;
  let activeId = chapters[0]?.id || "giris";
  let dark = chapters[0]?.dataset.theme === "dark";

  for (const ch of chapters) {
    const r = ch.getBoundingClientRect();
    if (r.top <= probeY && r.bottom > probeY) {
      activeId = ch.id;
      dark = ch.dataset.theme === "dark";
      break;
    }
    if (r.top <= probeY) {
      activeId = ch.id;
      dark = ch.dataset.theme === "dark";
    }
  }
  const showActive = y >= 140 && activeId && activeId !== "giris";
  navLinks.forEach((a) => {
    a.classList.toggle("is-active", Boolean(showActive && a.getAttribute("href") === `#${activeId}`));
  });
  topbar.classList.toggle("is-dark", dark);
}

window.addEventListener("scroll", syncTopbar, { passive: true });
window.addEventListener("resize", syncTopbar);
syncTopbar();

// Mobile Drawer
const menuBtn = $("#menu-btn");
const drawer = $("#drawer");

function toggleDrawer(force) {
  const open = force ?? !drawer.classList.contains("is-open");
  drawer.classList.toggle("is-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-drawer-open", open);
  topbar.classList.toggle("is-drawer-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  if (lenis) {
    if (open) lenis.stop();
    else lenis.start();
  }
  document.body.style.overflow = open ? "hidden" : "";
  if (!open) syncTopbar();
}

menuBtn.addEventListener("click", () => toggleDrawer());
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer.classList.contains("is-open")) toggleDrawer(false);
});

// Reveal + Number Counters
function animateCounter(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.decimals || "0", 10);
  const dur = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * eased).toFixed(dec).replace(".", ",");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$(".counter", e.target).forEach(animateCounter);
      revealObs.unobserve(e.target);
    });
  },
  { threshold: 0.01, rootMargin: "0px 0px 45px 0px" }
);
$$(".reveal").forEach((el) => revealObs.observe(el));

/* ---------- 8. Structured Data (SEO) ---------- */
const ld = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: business.name,
  description: business.description,
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: business.rating,
    reviewCount: business.reviewCount,
  },
  sameAs: [business.instagram],
};
const ldScript = document.createElement("script");
ldScript.type = "application/ld+json";
ldScript.textContent = JSON.stringify(ld);
document.head.appendChild(ldScript);

// Keep reviewSwiper referenced so tree-shaking never strips it
window.__dilkon = { stage, reviewSwiper };
