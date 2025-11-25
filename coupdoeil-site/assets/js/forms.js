(() => {
	const secure = (value) => value.replace(/[<>]/g, '').trim();

	const setStatus = (form, message, isError = false) => {
		const status = form.querySelector('[data-status]');
		if (!status) return;
		status.textContent = message;
		status.setAttribute('role', 'status');
		status.style.color = isError ? '#b02b2b' : 'inherit';
	};

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleArtistForm = () => {
		const form = document.querySelector('[data-form="artist"]');
		if (!form) return;
		const preview = form.querySelector('[data-preview]');
		form.addEventListener('input', (e) => {
			if (e.target.matches('input, textarea, select')) {
				e.target.value = secure(e.target.value);
			}
		});
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const data = new FormData(form);
			const honeypot = data.get('website');
			if (honeypot) return;
			const errors = [];
			const email = data.get('email');
			if (!validateEmail(email)) errors.push('Email invalide.');
			['firstname', 'lastname', 'discipline'].forEach((field) => {
				if (!secure(data.get(field))) errors.push(`Champ ${field} obligatoire.`);
			});
			if (!form.querySelector('[name="consent"]:checked')) errors.push('Le consentement est requis.');
			if (errors.length) {
				setStatus(form, errors.join(' '), true);
				return;
			}
			const artist = {
				firstname: secure(data.get('firstname')),
				lastname: secure(data.get('lastname')),
				status: data.get('status'),
				discipline: data.get('discipline'),
				description: secure(data.get('description')),
				portfolio: secure(data.get('portfolio')),
				logistics: Array.from(form.querySelectorAll('[name="logistics"]:checked')).map((i) => i.value),
				images: preview ? Array.from(preview.querySelectorAll('img')).map((img) => img.src) : []
			};
			const stored = JSON.parse(localStorage.getItem('coupdoeil_artists') || '[]');
			stored.push(artist);
			localStorage.setItem('coupdoeil_artists', JSON.stringify(stored));
			form.reset();
			if (preview) preview.innerHTML = '';
			setStatus(form, 'Merci ! Votre candidature a bien été enregistrée dans votre navigateur.');
		});

		const fileInput = form.querySelector('input[type="file"]');
		if (fileInput && preview) {
			fileInput.addEventListener('change', () => {
				preview.innerHTML = '';
				Array.from(fileInput.files || []).slice(0, 4).forEach((file) => {
					const reader = new FileReader();
					reader.onload = () => {
						const img = document.createElement('img');
						img.src = reader.result;
						img.alt = 'Aperçu visuel';
						img.loading = 'lazy';
						preview.appendChild(img);
					};
					reader.readAsDataURL(file);
				});
			});
		}
	};

	const handleVisitorForm = () => {
		const form = document.querySelector('[data-form="visitor"]');
		if (!form) return;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const data = new FormData(form);
			const name = secure(data.get('name'));
			const email = secure(data.get('email'));
			if (!name || !validateEmail(email)) {
				setStatus(form, 'Merci de renseigner un nom et un email valide.', true);
				return;
			}
			if (!form.querySelector('[name="consent"]:checked')) {
				setStatus(form, 'Le consentement est requis.', true);
				return;
			}
			const visits = Array.from(form.querySelectorAll('[name="editions"]:checked')).map((i) => i.value);
			localStorage.setItem('coupdoeil_visitors', JSON.stringify({ name, email, visits }));
			form.reset();
			setStatus(form, 'Merci ! Votre inscription visiteur est mémorisée localement.');
		});
	};

	const handleContactForm = () => {
		const form = document.querySelector('[data-form="contact"]');
		if (!form) return;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const data = new FormData(form);
			const subject = secure(data.get('subject'));
			const email = secure(data.get('email'));
			if (!subject || !validateEmail(email)) {
				setStatus(form, 'Sujet et email requis pour répondre.', true);
				return;
			}
			setStatus(form, 'Message reçu ! Nous revenons vers vous rapidement.');
			form.reset();
		});
	};

	document.addEventListener('DOMContentLoaded', () => {
		handleArtistForm();
		handleVisitorForm();
		handleContactForm();
	});
})();
