const ARTISTS = [
{ name: 'Atelier Sel & Terre', category: 'ceramique', bio: 'Petites séries d’objets en grès chamotté.', tags: ['grès', 'utilitaire'], link: '#', img: '../assets/img/artist1.xcf' },
{ name: 'Nébuleuse Sonore', category: 'musique', bio: 'Live ambient et textures électroniques pour voyages introspectifs.', tags: ['ambient', 'electro', 'live'], link: '#', img: '../assets/img/artist2.xcf' },
{ name: 'Studio Lune Noire', category: 'illustration', bio: 'Affiches oniriques inspirées de la nuit et des néons urbains.', tags: ['affiche', 'onirique', 'néon'], link: '#', img: '../assets/img/artist3.xcf' },
{ name: 'Beat Bunker', category: 'musique', bio: 'Beats hip-hop lo-fi produits en direct sur pad.', tags: ['lofi', 'hip-hop', 'beatmaking'], link: '#', img: '../assets/img/artist4.xcf' },

{ name: 'Ciel Brodé', category: 'textile', bio: 'Broderies fines autour des constellations et des mythes.', tags: ['broderie', 'constellation', 'slow-art'], link: '#', img: '../assets/img/artist5.xcf' },
{ name: 'Lune de Vinyl', category: 'musique', bio: 'Sélection vinyle house & disco pour danser toute la soirée.', tags: ['dj-set', 'vinyle', 'house'], link: '#', img: '../assets/img/artist6.xcf' },
{ name: 'Mains d’Encre', category: 'tatouage', bio: 'Flashs graphiques inspirés de la nature et du cyberpunk.', tags: ['flash', 'noir-et-gris', 'graphique'], link: '#', img: '../assets/img/artist7.xcf' },
{ name: 'Chœur Indigo', category: 'musique', bio: 'Duo voix/guitare aux harmonies douces et mélancoliques.', tags: ['acoustique', 'indie', 'voix'], link: '#', img: '../assets/img/artist8.xcf' },

{ name: 'Atelier Brut Bois', category: 'bois', bio: 'Objets du quotidien sculptés dans des essences locales.', tags: ['bois', 'fait-main', 'utilitaire'], link: '#', img: '../assets/img/artist9.xcf' },
{ name: 'Studio Fractal', category: 'musique', bio: 'Expérimentations modulaires entre bruit, rythme et mélodie.', tags: ['modulaire', 'expérimental', 'synthé'], link: '#', img: '../assets/img/artist10.xcf' },
{ name: 'Pixel & Papier', category: 'illustration', bio: 'Illustrations colorées mêlant digital et crayon traditionnel.', tags: ['digital', 'sketch', 'couleur'], link: '#', img: '../assets/img/artist11.xcf' },
{ name: 'Nuit Chromatique', category: 'musique', bio: 'Sets drum & bass énergiques pour les noctambules.', tags: ['drum-and-bass', 'dj-set', 'énergie'], link: '#', img: '../assets/img/artist12.xcf' },

{ name: 'Météore Studio', category: 'photo', bio: 'Séries photo argentiques sur la nuit en ville.', tags: ['argentique', 'urbain', 'noir-et-blanc'], link: '#', img: '../assets/img/artist13.xcf' },
{ name: 'Café Réverb', category: 'musique', bio: 'Chill hop et downtempo pour une ambiance cosy.', tags: ['chillhop', 'downtempo', 'background'], link: '#', img: '../assets/img/artist14.xcf' },
{ name: 'Club Pixelwave', category: 'musique', bio: 'Electro-pop lumineuse inspirée des jeux vidéo et du rétro-futur.', tags: ['electro-pop', 'chiptune', 'live'], link: '#', img: '../assets/img/artist15.xcf' },
{ name: 'Orage Doux', category: 'musique', bio: 'Post-rock instrumental aux montées lentes et intenses.', tags: ['post-rock', 'instrumental', 'guitare'], link: '#', img: '../assets/img/artist16.xcf' },
];

(() => {
	const sanitize = (text) => text.replace(/[<>]/g, '');

	const emptyState = () => {
		const wrapper = document.createElement('div');
		wrapper.className = 'card';
		wrapper.innerHTML = '<p>Aucun artiste ne correspond à votre recherche pour le moment.</p>';
		return wrapper;
	};

	const renderArtists = (list) => {
		const container = document.querySelector('[data-artists]');
		if (!container) return;
		container.innerHTML = '';
		if (!list.length) {
			container.appendChild(emptyState());
			return;
		}
		list.forEach((artist) => {
			const card = document.createElement('article');
			card.className = 'card artist-card';
			card.innerHTML = `
			<img src="${sanitize(artist.img)}" alt="Portrait de ${sanitize(artist.name)}" loading="lazy">
			<h3>${sanitize(artist.name)}</h3>
			<div class="artist-meta">
			<span class="badge">${sanitize(artist.category)}</span>
			<a href="${sanitize(artist.link)}" rel="noopener">Portfolio</a>
			</div>
			<p>${sanitize(artist.bio)}</p>
			<div class="tags">${artist.tags.map((tag) => `<span class="tag">${sanitize(tag)}</span>`).join('')}</div>
			`;
			container.appendChild(card);
		});
	};

	const bindFilters = () => {
		const searchInput = document.querySelector('[data-search]');
		const categoryButtons = document.querySelectorAll('[data-filter]');
		if (!searchInput || !categoryButtons.length) return;
		let currentCategory = 'all';
		const update = () => {
			const query = searchInput.value.toLowerCase();
			const filtered = ARTISTS.filter((a) => {
				const matchesCat = currentCategory === 'all' || a.category === currentCategory;
				const content = `${a.name.toLowerCase()} ${a.bio.toLowerCase()} ${a.tags.join(' ').toLowerCase()}`;
				const matchesQuery = content.includes(query);
				return matchesCat && matchesQuery;
			});
			renderArtists(filtered);
		};
		categoryButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				currentCategory = btn.getAttribute('data-filter');
				categoryButtons.forEach((b) => b.classList.toggle('active', b === btn));
				update();
			});
		});
		searchInput.addEventListener('input', update);
		update();
	};

	document.addEventListener('DOMContentLoaded', () => {
		renderArtists(ARTISTS);
		bindFilters();
	});
})();
