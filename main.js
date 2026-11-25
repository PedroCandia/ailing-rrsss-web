const page = document.body;
const boostSection = document.querySelector("#boost");
const sceneLinks = document.querySelectorAll("[data-scene-link]");
const toast = document.querySelector(".toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let toastTimer;
let scrollFrame = 0;

page.classList.add("js-enabled");

function updateScene() {
  const scene = boostSection.getBoundingClientRect().top <= window.innerHeight * .55 ? "boost" : "kickoff";
  if (page.dataset.scene === scene) return;
  page.dataset.scene = scene;
  sceneLinks.forEach((link) => {
    if (link.dataset.sceneLink === scene) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function scheduleSceneUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScene();
    scrollFrame = 0;
  });
}

sceneLinks[0].setAttribute("aria-current", "location");
updateScene();
window.addEventListener("scroll", scheduleSceneUpdate, { passive: true });
window.addEventListener("resize", scheduleSceneUpdate, { passive: true });

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
  let pointerFrame = 0;
  window.addEventListener("pointermove", (event) => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - .5) * -16;
      const y = (event.clientY / window.innerHeight - .5) * -12;
      page.style.setProperty("--drift-x", `${x.toFixed(1)}px`);
      page.style.setProperty("--drift-y", `${y.toFixed(1)}px`);
      pointerFrame = 0;
    });
  }, { passive: true });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function copyFallback(value) {
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("No se pudo copiar");
}

async function copyText(value, successMessage) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    else copyFallback(value);
    showToast(successMessage);
  } catch {
    try {
      copyFallback(value);
      showToast(successMessage);
    } catch {
      showToast("No se pudo copiar. Inténtalo de nuevo.");
    }
  }
}

document.querySelector("[data-copy-code]").addEventListener("click", () => copyText("AILING", "Código AILING copiado"));
document.querySelector(".share-button").addEventListener("click", async () => {
  const shareData = {
    title: "Ailing | Rocket League",
    text: "Torneos, privadas, freestyle y retos en Ailing.",
    url: window.location.href
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("Enlace compartido");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  copyText(shareData.url, "Enlace copiado");
});
