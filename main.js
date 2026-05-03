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
