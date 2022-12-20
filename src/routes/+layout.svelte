<script lang="ts">
	// required for static build
	export const prerender = true;
	import { page } from '$app/stores';

	import '../app.css';

	import NavBar from 'src/components/NavBar.svelte';

	const routes = {
		'/': 'Home.',
		'/replay': 'Replay.',
		'/photos': 'Photos.',
		'/eulogy': 'Eulogy.',
		'/booklet': 'Booklet.'
	} as const;
</script>

<div class="flex h-screen flex-col">
	<NavBar currentRoute={$page.url.pathname} routeList={routes} />
	<div class="items flex flex-grow flex-col justify-center">
		<slot />
	</div>
</div>
