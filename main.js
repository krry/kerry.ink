const epithets = [
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
	// ~80px/sec baseline
	const seconds = Math.max(18, Math.min(60, px / 80));
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
