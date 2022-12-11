<script>
	import '../app.css';
	import NavBar from 'src/components/NavBar.svelte';
</script>

<div class="flex h-screen flex-col">
	<NavBar />
	<slot />
</div>
