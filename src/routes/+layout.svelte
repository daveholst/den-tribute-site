<script>
	import '../app.css';
	import NavBar from 'src/components/NavBar.svelte';
	// required for static build
	export const prerender = true;
</script>

<div class="flex h-screen flex-col">
	<NavBar />
	<div class="items flex flex-grow flex-col justify-center">
		<slot />
	</div>
</div>
