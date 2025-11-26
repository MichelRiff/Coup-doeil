(() => {
  const THEME_KEY = "coupdoeil_theme";

  const setActiveNav = () => {
    let path = window.location.pathname.split("/").pop() || "index.html";
    if (!path.includes(".")) {
      path = "index.html";
    }
    document.querySelectorAll("nav a[data-page]").forEach((link) => {
      const page = link.getAttribute("data-page") || "";
      const normalizedPage = page.split("/").pop() || page;
      const isActive =
        path === page ||
        path === normalizedPage ||
        (!path && normalizedPage === "index.html");
      link.classList.toggle("active", Boolean(isActive));
    });
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const toggleLabel = document.querySelector("[data-theme-label]");
    if (toggleLabel) {
      toggleLabel.textContent = theme === "dark" ? "Mode sombre" : "Mode clair";
    }
  };

  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", theme === "dark");
    toggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      applyTheme(next);
      toggle.setAttribute("aria-pressed", next === "dark");
    });
  };

  const initCookieBanner = () => {
    const saved = localStorage.getItem("coupdoeil_cookies");
    const banner = document.querySelector(".cookie-banner");
    if (!banner) return;
    if (saved) {
      banner.remove();
      return;
    }
    const accept = banner.querySelector('[data-action="accept"]');
    const deny = banner.querySelector('[data-action="deny"]');
    const persist = (value) => {
      localStorage.setItem("coupdoeil_cookies", value);
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 300);
    };
    accept?.addEventListener("click", () => persist("accepted"));
    deny?.addEventListener("click", () => persist("refused"));
  };

  const secureInput = (value) => value.replace(/[<>]/g, "").trim();

  const initNewsletter = () => {
    const form = document.querySelector("[data-newsletter]");
    if (!form) return;
    const status = form.querySelector("[data-status]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = secureInput(emailInput.value);
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = "Merci de saisir un email valide.";
        status.className = "error";
        emailInput.classList.add("is-invalid");
        return;
      }
      status.textContent = "Merci ! Vous êtes bien inscrit·e à la newsletter.";
      status.className = "success";
      emailInput.classList.remove("is-invalid");
      emailInput.classList.add("is-valid");
      localStorage.setItem("coupdoeil_newsletter", email);
      form.reset();
    });
  };

  const initHeroBannerFade = () => {
    const banner = document.querySelector("[data-hero-banner]");
    if (!banner) return;
    let fadeDistance = Math.max(banner.offsetHeight * 0.85, 200);
    let ticking = false;

    const updateFade = () => {
      const progress = Math.min(window.scrollY / fadeDistance, 1);
      const opacity = Math.max(1 - progress, 0);
      banner.style.setProperty("--hero-opacity", opacity.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFade);
        ticking = true;
      }
    };

    const onResize = () => {
      fadeDistance = Math.max(banner.offsetHeight * 0.85, 200);
      updateFade();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateFade();
  };

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    initTheme();
    initCookieBanner();
    initNewsletter();
    initHeroBannerFade();
  });
})();
