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

	// One "set" of epithets
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

	// add two copies for seamless looping
	track.appendChild(set);
	track.appendChild(set.cloneNode(true));
}

function duplicateTrack(selector) {
	const track = document.querySelector(selector);
	if (!track) return;

	// if already duplicated, skip
	if (track.querySelector(':scope > .marquee__set')) return;

	// Wrap existing children into a set, then clone.
	const set = document.createElement('div');
	set.className = 'marquee__set';
	while (track.firstChild) set.appendChild(track.firstChild);
	track.appendChild(set);
	track.appendChild(set.cloneNode(true));
}

function setMarqueeDuration(el) {
	// Duration scales with content width so it doesn't feel too fast on desktop.
	const set = el.querySelector('.marquee__set');
	if (!set) return;
	const px = set.getBoundingClientRect().width;
	// ~80px/sec baseline
	const seconds = Math.max(18, Math.min(60, px / 80));
	el.style.setProperty('--duration', `${seconds}s`);
}

buildEpithetMarquee();
duplicateTrack('#linksTrack');

for (const marquee of document.querySelectorAll('.marquee')) {
	setMarqueeDuration(marquee);
}

window.addEventListener('resize', () => {
	for (const marquee of document.querySelectorAll('.marquee')) {
		setMarqueeDuration(marquee);
	}
});
