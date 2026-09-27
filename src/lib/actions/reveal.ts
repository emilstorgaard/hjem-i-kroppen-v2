type RevealOptions = { delay?: number };

/** Fades/slides an element in once it scrolls into view; no-ops entirely under reduced-motion. */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	if (
		typeof window === 'undefined' ||
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		return {};
	}

	node.classList.add('reveal');
	node.style.transitionDelay = `${options.delay ?? 0}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('reveal-visible');
				observer.unobserve(node);
			}
		},
		{ threshold: 0.15 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
