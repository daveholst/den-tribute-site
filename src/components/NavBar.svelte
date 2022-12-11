<script lang="ts">
	import { page } from '$app/stores';

	const routes = [
		{ route: '/', title: 'Home.' },
		{ route: '/replay', title: 'Replay.' },
		{ route: '/photos', title: 'Photos.' },
		{ route: '/eulogy', title: 'Eulogy.' },
		{ route: '/booklet', title: 'Booklet.' }
	];

	function getStyle(route: string) {
		const linkStyle =
			'border-b-transparent border-b-2 px-2 font-cardo text-xl border-blue-900 hover:border-b-2 hover:text-blue-900';
		const selectedStyle = 'border-solid' + linkStyle;
		const isCurrentRoute = route === $page.url.pathname;

		if (isCurrentRoute) return selectedStyle;
		return linkStyle;
	}
</script>

<nav class=" sticky top-2 z-30 mb-3 flex justify-end md:mb-5 md:mr-3">
	{#each routes as route}
		<a href={route.route} class={getStyle(route.route)}>{route.title}</a>
	{/each}
</nav>
