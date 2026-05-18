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

function setupMarqueeInteraction(marqueeEl) {
	const track = marqueeEl.querySelector('.marquee__track');
	if (!track) return;

	const isRight = marqueeEl.classList.contains('marquee--right');
	let dragging = false;
	let startX = 0;
	let startTranslateX = 0;
	let currentDragX = 0;
	let cachedSetWidth = 0;
	let rafId = null;
	const history = [];

	marqueeEl.style.touchAction = 'pan-y';
	marqueeEl.style.cursor = 'grab';

	function getSetWidth() {
		const set = track.querySelector('.marquee__set');
		return set ? set.getBoundingClientRect().width : 0;
	}

	function getDuration() {
		return parseFloat(getComputedStyle(marqueeEl).getPropertyValue('--duration')) || 60;
	}

	function normalizeX(x, setWidth) {
		let n = x % setWidth;
		if (n > 0) n -= setWidth;
		return n;
	}

	function resumeFrom(x) {
		const sw = getSetWidth();
		const dur = getDuration();
		if (!sw) return;
		const norm = normalizeX(x, sw);
		const progress = isRight ? (norm + sw) / sw : -norm / sw;
		track.style.transform = '';
		track.style.animationDelay = `${-progress * dur}s`;
		track.style.animationPlayState = '';
		track.style.animationName = '';
	}

	function applyInertia(velocity) {
		const FRICTION = 0.93;
		function step() {
			velocity *= FRICTION;
			if (Math.abs(velocity) < 0.5) { resumeFrom(currentDragX); rafId = null; return; }
			currentDragX = normalizeX(currentDragX + velocity, cachedSetWidth);
			track.style.transform = `translateX(${currentDragX}px)`;
			rafId = requestAnimationFrame(step);
		}
		rafId = requestAnimationFrame(step);
	}

	function onStart(clientX, timestamp) {
		if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
		cachedSetWidth = getSetWidth();
		const matrix = new DOMMatrix(getComputedStyle(track).transform);
		startTranslateX = normalizeX(matrix.m41, cachedSetWidth);
		currentDragX = startTranslateX;
		startX = clientX;
		history.length = 0;
		history.push({ x: clientX, t: timestamp });
		track.style.animationName = 'none';
		track.style.transform = `translateX(${startTranslateX}px)`;
		dragging = true;
	}

	function onMove(clientX, timestamp) {
		if (!dragging) return;
		currentDragX = normalizeX(startTranslateX + (clientX - startX), cachedSetWidth);
		track.style.transform = `translateX(${currentDragX}px)`;
		history.push({ x: clientX, t: timestamp });
		while (history.length > 1 && timestamp - history[0].t > 100) history.shift();
	}

	function onEnd() {
		if (!dragging) return;
		dragging = false;
		let velocity = 0;
		if (history.length >= 2) {
			const a = history[0], b = history[history.length - 1];
			const dt = b.t - a.t;
			if (dt > 0) velocity = (b.x - a.x) / dt * (1000 / 60);
		}
		Math.abs(velocity) > 0.5 ? applyInertia(velocity) : resumeFrom(currentDragX);
	}

	// Touch
	track.addEventListener('touchstart',  (e) => onStart(e.touches[0].clientX, e.timeStamp), { passive: true });
	track.addEventListener('touchmove',   (e) => onMove(e.touches[0].clientX, e.timeStamp), { passive: true });
	track.addEventListener('touchend',    onEnd);
	track.addEventListener('touchcancel', () => { dragging = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } resumeFrom(currentDragX); });

	// Mouse
	marqueeEl.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX, e.timeStamp); marqueeEl.style.cursor = 'grabbing'; });
	document.addEventListener('mousemove',  (e) => onMove(e.clientX, e.timeStamp));
	document.addEventListener('mouseup',    () => { if (dragging) { marqueeEl.style.cursor = 'grab'; onEnd(); } });
}

buildEpithetMarquee();
duplicateFirstSet('linksTrack');

for (const marquee of document.querySelectorAll('.marquee')) {
	setMarqueeDuration(marquee);
	setupMarqueeInteraction(marquee);
}

window.addEventListener('resize', () => {
	for (const marquee of document.querySelectorAll('.marquee')) {
		setMarqueeDuration(marquee);
	}
});

// Firmament — random image, right size for the screen
const bgCount = 13;
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

function setupMorph(selector) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const el = document.querySelector(selector);
	if (!el) return;

	const spans = [];
	const nodes = Array.from(el.childNodes);
	el.textContent = '';

	for (const node of nodes) {
	  if (node.nodeType === Node.TEXT_NODE) {
	    // existing letter-span logic, but over node.textContent
	    for (const ch of node.textContent) {
	      if (ch === ' ') {
	        el.appendChild(document.createTextNode(' '));
	        spans.push(null);
	      } else {
	        const s = document.createElement('span');
	        s.className = 'hl';
	        s.textContent = ch;
	        s.dataset.fvs = DERIVATIONS[spans.length % DERIVATIONS.length];
	        el.appendChild(s);
	        spans.push(s);
	      }
	    }
	  } else if (node.nodeName === 'BR') {
	    el.appendChild(document.createElement('br'));
	    spans.push(null); // null = skip in ripple, same as space
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

	el.addEventListener('pointerover', (e) => {
		const target = e.target.closest('.hl');
		if (!target) return;
		const idx = spans.indexOf(target);
		if (idx !== -1) applyRipple(idx);
	});

	el.addEventListener('pointerleave', resetAll);
}

setupMorph('.headline');
setupMorph('.ribbon__title');
document.querySelectorAll('.interlude').forEach((_, i) => {
  setupMorph(`.interlude:nth-of-type(${i + 1})`);
});

// Lazy-load videos — promote data-src → src on viewport entry
const lazyVideos = document.querySelectorAll('video[data-src]');
if (lazyVideos.length) {
	const videoObserver = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const video = entry.target;
			video.src = video.dataset.src;
			video.load();
			video.play().catch(() => {});
			obs.unobserve(video);
		});
	}, { rootMargin: '400px' });

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

// When the DOM is ready, set the year text
document.addEventListener('DOMContentLoaded', function () {
  // new Date().getFullYear() is supported basically everywhere
  document.getElementById('year').textContent = new Date().getFullYear();
});

document.querySelector('#subscribe').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
});

document.querySelector('#betaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.beta-signup__btn');
  const status = form.querySelector('.beta-signup__status');
  const email = form.email.value.trim();
  const name = form.name.value.trim();
  const apps = [...form.querySelectorAll('input[name="apps"]:checked')].map(el => el.value);

  btn.disabled = true;
  status.textContent = 'Sending…';

  try {
    const res = await fetch('/api/beta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, apps }),
    });
    if (res.ok) {
      status.textContent = '✓ Got it — you\'ll get an invite soon.';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    status.textContent = 'Something went wrong. Try emailing hello@kerry.ink directly.';
    btn.disabled = false;
  }
});
