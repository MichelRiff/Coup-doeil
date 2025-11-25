const ARTISTS = [
{ name: 'Lina Moreau', category: 'illustration', bio: 'Illustrations poétiques inspirées des cafés parisiens.', tags: ['encre', 'affiches'], link: '#', img: '../assets/img/artist1.jpg' },
{ name: 'Atelier Sel & Terre', category: 'ceramique', bio: 'Petites séries d’objets en grès chamotté.', tags: ['grès', 'utilitaire'], link: '#', img: '../assets/img/artist2.jpg' },
{ name: 'Noé Vidal', category: 'photo', bio: 'Photographie argentique autour de la ville sensible.', tags: ['argentique', 'urbain'], link: '#', img: '../assets/img/artist3.jpg' },
{ name: 'Studio Louve', category: 'textile', bio: 'Accessoires textiles upcyclés aux couleurs chaudes.', tags: ['upcycling', 'teinture'], link: '#', img: '../assets/img/artist4.jpg' },
{ name: 'Isis Laurent', category: 'bijoux', bio: 'Bijoux modulables en laiton et verre.', tags: ['laiton', 'modulaire'], link: '#', img: '../assets/img/artist5.jpg' },
{ name: 'Canopée', category: 'illustration', bio: 'Posters botaniques peints à la gouache.', tags: ['botanique', 'gouache'], link: '#', img: '../assets/img/artist6.jpg' },
{ name: 'Atelier Sillon', category: 'sculpture', bio: 'Sculptures bois minimalistes, hommage aux rivages.', tags: ['bois', 'minimal'], link: '#', img: '../assets/img/artist7.jpg' },
{ name: 'Lueur Nord', category: 'photo', bio: 'Séries photo autour de la lumière boréale.', tags: ['lumière', 'voyage'], link: '#', img: '../assets/img/artist8.jpg' },
{ name: 'Édith Cuir', category: 'artisanat', bio: 'Petite maroquinerie façonnée à la main.', tags: ['cuir', 'durable'], link: '#', img: '../assets/img/artist9.jpg' },
{ name: 'Margo Pixel', category: 'digital', bio: 'Illustrations numériques oniriques.', tags: ['digital', 'surreal'], link: '#', img: '../assets/img/artist10.jpg' },
{ name: 'Atelier Brume', category: 'textile', bio: 'Tissages muraux aux fibres naturelles.', tags: ['tissage', 'naturel'], link: '#', img: '../assets/img/artist11.jpg' },
{ name: 'Noctis Verre', category: 'bijoux', bio: 'Pièces en verre soufflé aux reflets changeants.', tags: ['verre', 'soufflé'], link: '#', img: '../assets/img/artist12.jpg' }
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
