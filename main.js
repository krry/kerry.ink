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

const el = document.getElementById('epithet');

if (el) {
	let i = 0;
	el.textContent = epithets[i];

	const tick = () => {
		const next = epithets[(i + 1) % epithets.length];

		el.classList.add('is-out');
		window.setTimeout(() => {
			i = (i + 1) % epithets.length;
			el.textContent = next;
			el.classList.remove('is-out');
		}, 360);
	};

	// let the first paint land
	window.setTimeout(() => {
		window.setInterval(tick, 2400);
	}, 600);
}
