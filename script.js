// Los enlaces compartidos se definen una sola vez para ambos perfiles.
const sharedLinks = {
  kick: "https://kick.com/ailing21",
  discord: "https://discord.gg/ezSR5JRKUJ",
  creatorCode: "AILING"
};

const profiles = {
  main: {
    name: "Ailing",
    username: "CÓDIGO AILING",
    bio: "Creador de contenido de Rocket League<br>Torneos, privadas, freestyle, retos y más.",
    photo: "assets/logo.png",
    socials: [
      { name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing_its" },
      { name: "YouTube", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailing21" },
      { name: "Discord", icon: "fa-brands fa-discord", url: sharedLinks.discord }
    ],
    buttons: [
      { label: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing_its" },
      { label: "YouTube", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailing21" },
      { label: "Kick", icon: "kick", url: sharedLinks.kick },
      { label: "Discord", icon: "fa-brands fa-discord", url: sharedLinks.discord },
      { label: "Ailing Byte · juegos variados", icon: "fa-solid fa-gamepad", url: "/ailingbyte", internal: true, featured: true },
      { label: `Código de creador: ${sharedLinks.creatorCode}`, icon: "fa-regular fa-copy", copy: sharedLinks.creatorCode }
    ]
  },
  byte: {
    name: "Ailing Byte",
    username: "JUEGOS VARIADOS",
    bio: "Canal secundario de juegos variados:<br>GTA, Fortnite y más.",
    photo: "../assets/logo.png",
    socials: [
      { name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing.byte" },
      { name: "YouTube", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailingbyte" },
      { name: "Discord", icon: "fa-brands fa-discord", url: sharedLinks.discord }
    ],
    buttons: [
      { label: "TikTok · Ailing Byte", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@ailing.byte" },
      { label: "YouTube · Ailing Byte", icon: "fa-brands fa-youtube", url: "https://www.youtube.com/@ailingbyte" },
      { label: "Kick", icon: "kick", url: sharedLinks.kick },
      { label: "Discord", icon: "fa-brands fa-discord", url: sharedLinks.discord },
      { label: `Código de creador: ${sharedLinks.creatorCode}`, icon: "fa-regular fa-copy", copy: sharedLinks.creatorCode }
    ]
  }
};

const siteConfig = profiles[document.body.dataset.profile] || profiles.main;
siteConfig.siteUrl = window.location.href;

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
      const icon = button.icon === "kick"
        ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z"/></svg>`
        : `<i class="${button.icon}"></i>`;

      if (button.copy) {
        return `
          <button class="link-button" type="button" data-copy-code="${button.copy}">
            <span>${button.label}</span>
            ${icon}
          </button>
        `;
      }

      return `
        <a class="link-button${button.featured ? " link-button--featured" : ""}" href="${button.url}"${button.internal ? "" : ' target="_blank" rel="noopener noreferrer"'}>
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
