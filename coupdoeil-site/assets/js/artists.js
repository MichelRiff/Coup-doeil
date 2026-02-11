const ARTISTS = [
  {
    name: "Leelou",
    category: "illustration",
    bio: "Concept artiste et illustratrice, Leelou crée des univers colorés et expressifs mêlant personnages et émotions.",
    tags: ["concept art", "illustration"],
    link: "https://www.instagram.com/leeloush__/",
    img: "assets/img/artists/Leelou/Leelou.jpg",
  },
  {
    name: "Atelier Maple",
    category: "artisanat",
    bio: "Créatrice de bougies artisanales aux parfums soigneusement composés, Atelier Maple propose des pièces uniques coulées à la main.",
    tags: ["bougies", "fait main"],
    link: "https://www.instagram.com/bougies_atelier_maple/",
    img: "assets/img/artists/AtelierMaple/Atelier_maple.jpg",
  },
  {
    name: "Aela Byrinthe",
    category: "illustration",
    bio: "Illustratrice engagée, Aela Byrinthe dessine des univers sensibles et inclusifs, entre BD et illustration traditionnelle.",
    tags: ["illustration", "BD"],
    link: "https://www.instagram.com/aela.byrinthe/",
    img: "assets/img/artists/AelaByrinthe/Aela_Byrinthe.jpg",
  },
  {
    name: "Petit bout de goût",
    category: "bijoux",
    bio: "Créatrice de micro-bijoux gourmands faits main en pâte polymère : colliers, boucles d'oreilles et breloques qui croquent la vie.",
    tags: ["micro-bijoux", "fait main"],
    link: "https://www.instagram.com/petit.bout.de.gout/",
    img: "assets/img/artists/PetitBoutDeGout/Petit_bout-de-gout.jpg",
  },
  {
    name: "Luzartwork",
    category: "peinture",
    bio: "Peintre et illustratrice, Luzartwork réalise des toiles et prints aux couleurs vibrantes, entre aquarelle, acrylique et illustrations oniriques.",
    tags: ["peinture", "illustration"],
    link: "https://www.instagram.com/luzartwork/",
    img: "assets/img/artists/Luzartwork/Luzartwork.jpg",
  },
];

(() => {
  const sanitize = (text) => text.replace(/[<>]/g, "");

  /* Detect base path: pages/ needs "../", root needs "" */
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "";

  const resolveImg = (img) => basePath + img;

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
        <img src="${sanitize(resolveImg(artist.img))}" alt="Portrait de ${sanitize(artist.name)}" loading="lazy">
        <h3>${sanitize(artist.name)}</h3>
        <div class="artist-meta">
          <span class="badge">${sanitize(artist.category)}</span>
          <a href="${sanitize(artist.link)}" target="_blank" rel="noopener">Instagram</a>
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

    const featured = ARTISTS.slice(0, 3);
    container.innerHTML = "";

    featured.forEach((artist) => {
      const card = document.createElement("div");
      card.className = "card artist-card";
      card.innerHTML = `
        <img src="${sanitize(resolveImg(artist.img))}" alt="Portrait de ${sanitize(artist.name)}" loading="lazy">
        <h3>${sanitize(artist.name)}</h3>
        <div class="artist-meta">
          <span class="badge">${sanitize(artist.category)}</span>
          ${artist.tags.slice(0, 2).map((tag) => `<span class="tag">${sanitize(tag)}</span>`).join("")}
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
