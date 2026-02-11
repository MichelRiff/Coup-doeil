const ARTIST_PLACEHOLDER_LIGHT = "../assets/img/banner/bg-joy-light.svg";
const ARTIST_PLACEHOLDER_DARK = "../assets/img/banner/bg-joy-dark.svg";
const ARTIST_PLACEHOLDER_ALT = "../assets/img/hero-banner.svg";

const ARTISTS = [
  {
    name: "Atelier Sel & Terre",
    category: "ceramique",
    bio: "Petites séries d’objets en grès chamotté.",
    tags: ["grès", "utilitaire"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },
  {
    name: "Nébuleuse Sonore",
    category: "musique",
    bio: "Live ambient et textures électroniques pour voyages introspectifs.",
    tags: ["ambient", "electro", "live"],
    link: "#",
    img: ARTIST_PLACEHOLDER_DARK,
  },
  {
    name: "Studio Lune Noire",
    category: "illustration",
    bio: "Affiches oniriques inspirées de la nuit et des néons urbains.",
    tags: ["affiche", "onirique", "néon"],
    link: "#",
    img: ARTIST_PLACEHOLDER_ALT,
  },
  {
    name: "Beat Bunker",
    category: "musique",
    bio: "Beats hip-hop lo-fi produits en direct sur pad.",
    tags: ["lofi", "hip-hop", "beatmaking"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },

  {
    name: "Ciel Brodé",
    category: "textile",
    bio: "Broderies fines autour des constellations et des mythes.",
    tags: ["broderie", "constellation", "slow-art"],
    link: "#",
    img: ARTIST_PLACEHOLDER_DARK,
  },
  {
    name: "Lune de Vinyl",
    category: "musique",
    bio: "Sélection vinyle house & disco pour danser toute la soirée.",
    tags: ["dj-set", "vinyle", "house"],
    link: "#",
    img: ARTIST_PLACEHOLDER_ALT,
  },
  {
    name: "Mains d’Encre",
    category: "tatouage",
    bio: "Flashs graphiques inspirés de la nature et du cyberpunk.",
    tags: ["flash", "noir-et-gris", "graphique"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },
  {
    name: "Chœur Indigo",
    category: "musique",
    bio: "Duo voix/guitare aux harmonies douces et mélancoliques.",
    tags: ["acoustique", "indie", "voix"],
    link: "#",
    img: ARTIST_PLACEHOLDER_DARK,
  },

  {
    name: "Atelier Brut Bois",
    category: "bois",
    bio: "Objets du quotidien sculptés dans des essences locales.",
    tags: ["bois", "fait-main", "utilitaire"],
    link: "#",
    img: ARTIST_PLACEHOLDER_ALT,
  },
  {
    name: "Studio Fractal",
    category: "musique",
    bio: "Expérimentations modulaires entre bruit, rythme et mélodie.",
    tags: ["modulaire", "expérimental", "synthé"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },
  {
    name: "Pixel & Papier",
    category: "illustration",
    bio: "Illustrations colorées mêlant digital et crayon traditionnel.",
    tags: ["digital", "sketch", "couleur"],
    link: "#",
    img: ARTIST_PLACEHOLDER_DARK,
  },
  {
    name: "Nuit Chromatique",
    category: "musique",
    bio: "Sets drum & bass énergiques pour les noctambules.",
    tags: ["drum-and-bass", "dj-set", "énergie"],
    link: "#",
    img: ARTIST_PLACEHOLDER_ALT,
  },

  {
    name: "Météore Studio",
    category: "photo",
    bio: "Séries photo argentiques sur la nuit en ville.",
    tags: ["argentique", "urbain", "noir-et-blanc"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },
  {
    name: "Café Réverb",
    category: "musique",
    bio: "Chill hop et downtempo pour une ambiance cosy.",
    tags: ["chillhop", "downtempo", "background"],
    link: "#",
    img: ARTIST_PLACEHOLDER_DARK,
  },
  {
    name: "Club Pixelwave",
    category: "musique",
    bio: "Electro-pop lumineuse inspirée des jeux vidéo et du rétro-futur.",
    tags: ["electro-pop", "chiptune", "live"],
    link: "#",
    img: ARTIST_PLACEHOLDER_ALT,
  },
  {
    name: "Orage Doux",
    category: "musique",
    bio: "Post-rock instrumental aux montées lentes et intenses.",
    tags: ["post-rock", "instrumental", "guitare"],
    link: "#",
    img: ARTIST_PLACEHOLDER_LIGHT,
  },
];

(() => {
  const sanitize = (text) => text.replace(/[<>]/g, "");

  const emptyState = () => {
    const wrapper = document.createElement("div");
    wrapper.className = "card";
    wrapper.innerHTML =
      "<p>Aucun artiste ne correspond à votre recherche pour le moment.</p>";
    return wrapper;
  };

  const renderArtists = (list) => {
    const container = document.querySelector("[data-artists]");
    if (!container) return;
    container.innerHTML = "";
    if (!list.length) {
      container.appendChild(emptyState());
      return;
    }
    list.forEach((artist) => {
      const card = document.createElement("article");
      card.className = "card artist-card";
      card.innerHTML = `
			<img src="${sanitize(artist.img)}" alt="Portrait de ${sanitize(
        artist.name
      )}" loading="lazy">
			<h3>${sanitize(artist.name)}</h3>
			<div class="artist-meta">
			<span class="badge">${sanitize(artist.category)}</span>
			<a href="${sanitize(artist.link)}" rel="noopener">Portfolio</a>
			</div>
			<p>${sanitize(artist.bio)}</p>
			<div class="tags">${artist.tags
        .map((tag) => `<span class="tag">${sanitize(tag)}</span>`)
        .join("")}</div>
			`;
      container.appendChild(card);
    });
  };

  const bindFilters = () => {
    const searchInput = document.querySelector("[data-search]");
    const categoryButtons = document.querySelectorAll("[data-filter]");
    if (!searchInput || !categoryButtons.length) return;
    let currentCategory = "all";
    const update = () => {
      const query = searchInput.value.toLowerCase();
      const filtered = ARTISTS.filter((a) => {
        const matchesCat =
          currentCategory === "all" || a.category === currentCategory;
        const content = `${a.name.toLowerCase()} ${a.bio.toLowerCase()} ${a.tags
          .join(" ")
          .toLowerCase()}`;
        const matchesQuery = content.includes(query);
        return matchesCat && matchesQuery;
      });
      renderArtists(filtered);
    };
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentCategory = btn.getAttribute("data-filter");
        categoryButtons.forEach((b) => b.classList.toggle("active", b === btn));
        update();
      });
    });
    searchInput.addEventListener("input", update);
    update();
  };

  const renderFeaturedArtists = () => {
    const container = document.querySelector("[data-featured-artists]");
    if (!container) return;

    // Take first 3 artists for featured section on homepage
    const featured = ARTISTS.slice(0, 3);
    container.innerHTML = "";

    featured.forEach((artist) => {
      const card = document.createElement("div");
      card.className = "card artist-card";
      card.innerHTML = `
        <div class="event-placeholder event-placeholder--venue" role="img" aria-label="Portrait de ${sanitize(artist.name)}">
          <span>Portrait artiste</span>
          <span class="event-placeholder__note">📸 Image à venir</span>
        </div>
        <h3>${sanitize(artist.name)}</h3>
        <div class="artist-meta">
          <span class="badge">${sanitize(artist.category)}</span>
          ${artist.tags.slice(0, 2).map(tag => `<span class="tag">${sanitize(tag)}</span>`).join('')}
        </div>
        <p>${sanitize(artist.bio)}</p>
      `;
      container.appendChild(card);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderArtists(ARTISTS);
    bindFilters();
    renderFeaturedArtists();
  });
})();
