const epithets = [
	'fielding forays into welcomeness',
	'tropical honey farmer',
	'mountain pie chef',
	'concert caterer',
	'platform translator',
	'community rememberer',
	'microbiome developer',
	'hyperloop operator',
	'cosmic style coach',
	'uxperience devsigner',
	'bar(-tender/-ista)',
	'agent wrangler'
];

function buildEpithetMarquee() {
	const track = document.getElementById('epithetTrack');
	if (!track) return;

	track.innerHTML = '';

	const set = document.createElement('div');
	set.className = 'marquee__set';

	for (const e of epithets) {
		const item = document.createElement('span');
		item.className = 'epithet__item';
		item.textContent = e;
		set.appendChild(item);

		const dot = document.createElement('span');
		dot.className = 'epithet__dot';
		dot.textContent = '•';
		set.appendChild(dot);
	}

	track.appendChild(set);
	track.appendChild(set.cloneNode(true));
}

function duplicateFirstSet(trackId) {
	const track = document.getElementById(trackId);
	if (!track) return;

	// Expect: track contains a .marquee__set already.
	const set = track.querySelector(':scope > .marquee__set');
	if (!set) return;

	// If already duplicated, bail.
	const sets = track.querySelectorAll(':scope > .marquee__set');
	if (sets.length >= 2) return;

	track.appendChild(set.cloneNode(true));
}

function setMarqueeDuration(marqueeEl) {
	const set = marqueeEl.querySelector('.marquee__set');
	if (!set) return;
	const px = set.getBoundingClientRect().width;
	// ~16px/sec baseline — slow drift
	const seconds = Math.max(60, Math.min(120, px / 16));
	marqueeEl.style.setProperty('--duration', `${seconds}s`);
}

buildEpithetMarquee();
duplicateFirstSet('linksTrack');

for (const marquee of document.querySelectorAll('.marquee')) {
	setMarqueeDuration(marquee);
}

window.addEventListener('resize', () => {
	for (const marquee of document.querySelectorAll('.marquee')) {
		setMarqueeDuration(marquee);
	}
});

// Firmament — random image, right size for the screen
const bgCount = 9;
const bg = document.querySelector('.bg');
if (bg) {
	const n = Math.floor(Math.random() * bgCount) + 1;
	const physicalW = window.innerWidth * (window.devicePixelRatio || 1);
	const size = physicalW <= 1300 ? 'sm' : physicalW <= 2200 ? 'md' : 'lg';
	bg.style.backgroundImage = `url('./assets/bg/bg-${n}-${size}.webp')`;
}

function updateParallax() {
	const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	if (!bg || maxScroll <= 0) return;
	const fraction = window.scrollY / maxScroll;
	bg.style.backgroundPositionY = `${fraction * 100}%`;
}

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);
updateParallax();

// Headline letter morph — Recursive variable font derivations
const DERIVATIONS = [
	// mono linear light
	'"wght" 300, "CASL" 0, "CRSV" 0, "MONO" 1',
	// sans linear black
	'"wght" 1000, "CASL" 0, "CRSV" 0, "MONO" 0',
	// sans casual light cursive
	'"wght" 300, "CASL" 1, "CRSV" 1, "MONO" 0',
	// mono linear bold
	'"wght" 800, "CASL" 0, "CRSV" 0, "MONO" 1',
	// semi-mono casual
	'"wght" 500, "CASL" 1, "CRSV" 0, "MONO" 0.618',
	// sans casual black cursive
	'"wght" 900, "CASL" 1, "CRSV" 1, "MONO" 0',
	// mono casual medium
	'"wght" 600, "CASL" 0.618, "CRSV" 0, "MONO" 1',
];

const BASE_FVS = '"wght" 900, "CASL" 1, "CRSV" 1, "MONO" 0';

function setupHeadlineMorph() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const headline = document.querySelector('.headline');
	if (!headline) return;

	const text = headline.textContent;
	headline.textContent = '';

	const spans = [];
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch === ' ') {
			headline.appendChild(document.createTextNode(' '));
			spans.push(null);
		} else {
			const s = document.createElement('span');
			s.className = 'hl';
			s.textContent = ch;
			// each letter gets a derivation, cycling through the list
			s.dataset.fvs = DERIVATIONS[i % DERIVATIONS.length];
			headline.appendChild(s);
			spans.push(s);
		}
	}

	function applyRipple(idx) {
		spans.forEach((s, i) => {
			if (!s) return;
			const dist = Math.abs(i - idx);
			if (dist === 0) {
				s.style.fontVariationSettings = s.dataset.fvs;
			} else if (dist === 1) {
				// blend halfway toward the neighbor's own derivation
				s.style.fontVariationSettings = DERIVATIONS[(i + 1) % DERIVATIONS.length];
			} else if (dist === 2) {
				s.style.fontVariationSettings = DERIVATIONS[i % DERIVATIONS.length];
			} else {
				s.style.fontVariationSettings = '';
			}
		});
	}

	function resetAll() {
		spans.forEach(s => { if (s) s.style.fontVariationSettings = ''; });
	}

	spans.forEach((s, i) => {
		if (!s) return;
		s.addEventListener('mouseenter', () => applyRipple(i));
	});

	headline.addEventListener('mouseleave', resetAll);
}

setupHeadlineMorph();

// Lazy-load videos — promote data-src → src on viewport entry
const lazyVideos = document.querySelectorAll('video[data-src]');
if (lazyVideos.length) {
	const videoObserver = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const video = entry.target;
			video.src = video.dataset.src;
			video.load();
			obs.unobserve(video);
		});
	}, { rootMargin: '200px' });

	lazyVideos.forEach(v => videoObserver.observe(v));
}

// Lightbox — tap project shot to expand full image
const lightbox = document.getElementById('lightbox');
const lightboxMedia = lightbox?.querySelector('.lightbox__media');

function openLightbox(figure) {
	const source = figure.querySelector('img, video');
	if (!source || !lightboxMedia) return;

	let media;
	if (source.tagName === 'VIDEO') {
		media = document.createElement('video');
		media.src = source.src || source.dataset.src;
		media.autoplay = true;
		media.loop = true;
		media.muted = true;
		media.playsInline = true;
	} else {
		media = document.createElement('img');
		media.src = source.src;
		media.alt = source.alt;
	}
	lightboxMedia.replaceChildren(media);
	lightbox.showModal();
}

function closeLightbox() {
	lightbox.close();
}

document.querySelectorAll('.project__shot').forEach(figure => {
	figure.addEventListener('click', () => openLightbox(figure));
});

lightbox?.addEventListener('click', e => {
	if (e.target === lightbox) closeLightbox();
});

lightbox?.addEventListener('close', () => {
	lightboxMedia.replaceChildren();
});
