<script lang="ts">
	export let image: string;
	export let name: string;
	export let level: number;
</script>

<div class="flex flex-col p-4 items-center bg-base rounded-lg shadow-xl min-h-[50px]">
	<img class="w-1/3 rounded" src={image} alt={name} />
	<span class="text-clear text-lg font-bold">{name}</span>
	<span>
		{#each [1, 2, 3, 4, 5] as elem}
			{#if level >= elem}⭐{/if}
		{/each}
	</span>
</div>
