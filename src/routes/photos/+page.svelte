<script lang="ts">
	const imageNumbers = Array.from({ length: 68 }, (_, i) => i + 1);
</script>

<h1 class=" m-20 text-center font-cardo text-5xl">Photos</h1>
{#each imageNumbers as image}
	<img class="md:mx-auto md:mb-4 md:max-w-3xl md:rounded-2xl" src={`/photos/${image}.jpg`} alt="" />
{/each}
