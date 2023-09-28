<script lang="ts">
	export let image: string;
	export let line1: string;
	export let line2: string;
	export let line3: string;
	export let description: string = '';
</script>

<div class="flex flex-col items-center p-3">
	<div class="flex rounded w-full items-center p-3">
		<img class="w-20 rounded" src={image} alt="" />
		<div class="flex flex-col">
			<span class="mx-2">{line1}</span>
			<span class="mx-2 underline">{line2}</span>
			<span class="mx-2">{line3}</span>
		</div>
	</div>
	<div>
		{description}
	</div>
</div>
