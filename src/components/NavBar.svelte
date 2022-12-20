<script lang="ts">
	export let routeList: {
		[key: string]: string;
	};
	export let currentRoute: string;
	console.log({ currentRoute });

	type Entries<T> = {
		[K in keyof T]: [K, T[K]];
	}[keyof T][];

	type RoutesArray = Entries<typeof routeList>;

	//TODO this is funky typescript, need to have a look at why I can't transform it without casting...
	const routesArray = Object.entries(routeList) as RoutesArray;

	function getStyle(linkPath: string, currentPath: string) {
		const linkStyle =
			'border-b-transparent border-b-2 px-1 md:px-2 font-cardo text-xl border-blue-900 hover:border-b-2 hover:text-blue-900';
		const selectedStyle = 'border-solid' + linkStyle;
		const isCurrentRoute = linkPath === currentPath;

		if (isCurrentRoute) return selectedStyle;
		return linkStyle;
	}
</script>

<nav class="fixed z-30 mb-3 flex w-full justify-end bg-white py-2 md:right-4 md:mb-5">
	{#each routesArray as [path, title]}
		<a href={path} class={getStyle(path, currentRoute)}>{title}</a>
	{/each}
</nav>
