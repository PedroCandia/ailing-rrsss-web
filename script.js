// Edita este objeto para cambiar textos, foto, enlaces y QR.
const siteConfig = {
  name: "Ailing",
  username: "C\u00d3DIGO AILING",
  bio: "Creador de contenido de Rocket League<br>Torneos, privadas, freestyle, retos y m\u00e1s.",
  photo: "assets/logo.png",
  // Cuando publiques el sitio, reemplaza window.location.href por tu URL real.
  siteUrl: window.location.href,
  socials: [
    { name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing_its" },
    { name: "YouTube", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailing21" },
    { name: "Discord", icon: "fa-brands fa-discord", url: "https://discord.gg/ezSR5JRKUJ" }
  ],
  buttons: [
    { label: "\u00daltimo video", icon: "fa-solid fa-play", url: "https://www.youtube.com/watch?v=pTwj4YFVrik" },
    { label: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing_its" },
    { label: "YouTube", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailing21" },
    { label: "Discord", icon: "fa-brands fa-discord", url: "https://discord.gg/ezSR5JRKUJ" },
    { label: "C\u00f3digo de creador: AILING", icon: "fa-regular fa-copy", copy: "AILING" }
  ]
};

const toast = document.querySelector(".toast");
const socialLinks = document.querySelector("[data-social-links]");
const linkList = document.querySelector("[data-link-list]");
const shareButton = document.querySelector(".share-button");
let toastTimer;

renderProfile();
renderSocialLinks();
renderButtons();

function renderProfile() {
  document.querySelector("[data-profile-name]").textContent = siteConfig.name;
  document.querySelector("[data-profile-user]").textContent = siteConfig.username;
  document.querySelector("[data-profile-bio]").innerHTML = siteConfig.bio;
  document.querySelector("[data-profile-photo]").src = siteConfig.photo;
  document.title = `${siteConfig.name} | Links`;
}

function renderSocialLinks() {
  socialLinks.innerHTML = siteConfig.socials
    .map((social) => `
      <a href="${social.url}" target="_blank" rel="noopener noreferrer" aria-label="${social.name} de ${siteConfig.name}">
        <i class="${social.icon}"></i>
      </a>
    `)
    .join("");
}

function renderButtons() {
  linkList.innerHTML = siteConfig.buttons
    .map((button) => {
      const icon = `<i class="${button.icon}"></i>`;

      if (button.copy) {
        return `
          <button class="link-button" type="button" data-copy-code="${button.copy}">
            <span>${button.label}</span>
            ${icon}
          </button>
        `;
      }

      return `
        <a class="link-button" href="${button.url}" target="_blank" rel="noopener noreferrer">
          <span>${button.label}</span>
          ${icon}
        </a>
      `;
    })
    .join("");

  document.querySelectorAll(".link-button").forEach((button, index) => {
    button.style.setProperty("--delay", `${180 + index * 80}ms`);
  });

  document.querySelectorAll("[data-copy-code]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copyCode, "C\u00f3digo copiado"));
  });
}

shareButton.addEventListener("click", sharePage);

async function sharePage() {
  const shareData = {
    title: `${siteConfig.name} | Links`,
    text: siteConfig.bio.replace(/<br\s*\/?>/gi, " "),
    url: siteConfig.siteUrl
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

  copyText(siteConfig.siteUrl, "Enlace copiado");
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    copyWithFallback(text);
  }

  showToast(message);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

// Respaldo para navegadores o contextos donde Clipboard API no este disponible.
function copyWithFallback(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}
