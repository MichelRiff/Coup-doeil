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

	const sendToEndpoint = async (form, payload) => {
		const endpoint = form.dataset.endpoint;
		if (!endpoint) return false;
		const submission = {
			...payload,
			formType: form.dataset.form || 'formulaire',
			page: window.location.href,
			submittedAt: new Date().toISOString(),
			_template: 'table',
			_captcha: 'false'
		};
		if (form.dataset.subject && !submission._subject) {
			submission._subject = form.dataset.subject;
		}
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(submission)
		});
		if (!response.ok) throw new Error('send-failed');
		return true;
	};

	const handleArtistForm = () => {
		const form = document.querySelector('[data-form="artist"]');
		if (!form) return;
		const preview = form.querySelector('[data-preview]');
		form.addEventListener('input', (e) => {
			if (e.target.matches('input, textarea, select')) {
				e.target.value = secure(e.target.value);
			}
		});
		form.addEventListener('submit', async (e) => {
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
				email: secure(email),
				discipline: data.get('discipline'),
				description: secure(data.get('description')),
				portfolio: secure(data.get('portfolio')),
				logistics: Array.from(form.querySelectorAll('[name="logistics"]:checked')).map((i) => i.value),
				images: preview ? Array.from(preview.querySelectorAll('img')).map((img) => img.src) : []
			};
			const payload = {
				firstname: artist.firstname,
				lastname: artist.lastname,
				email: artist.email,
				status: artist.status,
				discipline: artist.discipline,
				description: artist.description,
				portfolio: artist.portfolio || 'Non communiqué',
				logistics: artist.logistics.length ? artist.logistics.join(', ') : 'Non précisé',
				visuals: artist.images.length ? `${artist.images.length} visuel(s) ajoutés (aperçu local uniquement)` : 'Aucun visuel joint'
			};
			try {
				setStatus(form, 'Envoi en cours, merci de patienter...');
				await sendToEndpoint(form, payload);
				const stored = JSON.parse(localStorage.getItem('coupdoeil_artists') || '[]');
				stored.push(artist);
				localStorage.setItem('coupdoeil_artists', JSON.stringify(stored));
				form.reset();
				if (preview) preview.innerHTML = '';
				setStatus(form, 'Merci ! Votre candidature a été transmise et enregistrée localement.');
			} catch (error) {
				console.error('Artist form submission failed', error);
				setStatus(form, 'Impossible d\'envoyer le formulaire. Merci de réessayer dans un instant.', true);
			}
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
		form.addEventListener('submit', async (e) => {
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
			const wantsNewsletter = !!form.querySelector('[name="newsletter"]:checked');
			const payload = {
				name,
				email,
				editions: visits.length ? visits.join(', ') : 'Non précisé',
				newsletter: wantsNewsletter ? 'Oui' : 'Non',
				consent: 'Accepté'
			};
			try {
				setStatus(form, 'Envoi en cours, merci de patienter...');
				await sendToEndpoint(form, payload);
				localStorage.setItem('coupdoeil_visitors', JSON.stringify({ name, email, visits }));
				form.reset();
				setStatus(form, 'Merci ! Votre inscription visiteur est transmise et mémorisée localement.');
			} catch (error) {
				console.error('Visitor form submission failed', error);
				setStatus(form, 'Impossible d\'envoyer votre inscription pour le moment. Réessayez ou contactez l\'équipe.', true);
			}
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

	const handleRegistrationToggle = () => {
		const container = document.querySelector('[data-form-switch]');
		if (!container) return;

		const buttons = Array.from(container.querySelectorAll('[data-toggle-target]'));
		const panels = Array.from(container.querySelectorAll('[data-form-panel]'));
		if (!buttons.length || !panels.length) return;

		const normalize = (value = '') => {
			const slug = (value || '').toString().toLowerCase();
			if (['visitor', 'visiteur', 'visiteurs'].includes(slug)) return 'visitor';
			if (['artist', 'artiste', 'artistes'].includes(slug)) return 'artist';
			return null;
		};

		const showPanel = (target, updateUrl = false) => {
			const normalized = normalize(target) || 'artist';
			panels.forEach((panel) => {
				panel.hidden = panel.dataset.formPanel !== normalized;
			});
			buttons.forEach((button) => {
				const isActive = button.dataset.toggleTarget === normalized;
				button.classList.toggle('is-active', isActive);
				button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
			});

			if (updateUrl) {
				const url = new URL(window.location.href);
				url.searchParams.set('role', normalized);
				window.history.replaceState({}, '', url);
			}
		};

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				showPanel(button.dataset.toggleTarget, true);
			});
		});

		const url = new URL(window.location.href);
		const fromParam = normalize(url.searchParams.get('role'));
		const fromHash = normalize(window.location.hash.replace('#', ''));
		const fallback = normalize(container.dataset.default) || 'artist';
		showPanel(fromParam || fromHash || fallback);
	};

	document.addEventListener('DOMContentLoaded', () => {
		handleRegistrationToggle();
		handleArtistForm();
		handleVisitorForm();
		handleContactForm();
	});
})();
